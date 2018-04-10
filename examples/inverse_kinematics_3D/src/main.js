"use strict";
/*global Bone */
/*global Sylvester */
/*global $M */
/*global $V */
/*global $THREE */

var IK = IK || {}; //inverse kinematics

IK.world = new CANNON.World();

IK.boxBaseRed = {
    position: function() {return new THREE.Vector3(20,20,0)}
};
IK.boxBaseGreen = {
    position: function() {return new THREE.Vector3(-20,20,0)}
};
IK.boxBaseBlue = {
    position: function() {return new THREE.Vector3(0,20,20)}
};
IK.startingPos = {
    pos: new THREE.Vector3(-3,16,-20),
    position: function() {return IK.startingPos.pos}
};

IK.scene = new THREE.Scene();
IK.renderer = new THREE.WebGLRenderer( { antialias: true } );
IK.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
IK.mouse = new THREE.Vector2();
IK.raycaster = new THREE.Raycaster();
IK.impulsePosition = null;
IK.selectedBox = null;
IK.impulseForce = 200;
IK.main = function (){

    var loader = new THREE.JSONLoader(),
        numBones = 10,
        numBoxes = 20,
        boneChain = [],
        boxes = [],
        movableBoxes = [],
        jacobian,
        inverseJacobian,
        endEffector,
        secondaryTaskValues = Sylvester.Vector.Zero(numBones), // when boneChain is constrained somewhere
        secondaryTask,
        lastBone, // will be set as boneChain[numBones-1]
        target,
        movingBoxIndex,
        angleToTarget,
        meshUrlArray = ["json/bottomBone.js", "json/bone1.js", "json/magnet.js"], //put in order you want them to load
        meshes = [], // array with the actual meshes;
        e_delta = new THREE.Vector3(), //vector from end effector to target position
        theta_delta = new THREE.Euler(), //angle from lastbone to target vector
        newState; //new state of the boneChain (only delta angles)

    IK.world.gravity = new CANNON.Vec3(0, -40, 0); // m/s²
    IK.world.broadphase = new CANNON.NaiveBroadphase();
    IK.world.solver.iterations = 5;

    //initializing renderer
    IK.renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("container").appendChild( IK.renderer.domElement );
    IK.renderer.shadowMapEnabled = true;

    //add listeners
    document.addEventListener('wheel', IK.event.wheelListener);
    document.addEventListener('mouseup', IK.event.mouseClickListener);
    document.addEventListener('mousemove', IK.event.mouseMoveListener);
    window.addEventListener( 'resize', IK.event.onWindowResize, false );


    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x222222);
    IK.scene.add(ambientLight);

    // directional lighting
    var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 100, 100, 100 );

        spotLight.castShadow = true;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;

        spotLight.shadowCameraNear = 50;
        spotLight.shadowCameraFar = 300;
        spotLight.shadowCameraFov = 30;
        IK.scene.add(spotLight);

    //create ground
    var planeGeometry = new THREE.PlaneGeometry( 120, 120, 50, 50),
        planeMaterial = new THREE.MeshPhongMaterial( {
            ambient: 0x030303,
            color: 0xffff88,
            specular: 0x009900,
            shininess: 30,
            shading: THREE.FlatShading} ),
        plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.rotation.x -= Math.PI / 2;
    plane.receiveShadow = true;
    IK.scene.add( plane );

    //ground physics
    var planeBody = new CANNON.Body({
        mass: 0 // mass == 0 makes the body static
    });
    var planeBodyShape = new CANNON.Plane();
    planeBody.addShape(planeBodyShape);
    planeBody.position.copy(plane.position);
    planeBody.quaternion.copy(plane.quaternion);
    IK.world.add(planeBody);

    //create boxes
    while(numBoxes--){
        var randomType = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        var box = new Box(randomType, 0,5 + numBoxes*2,-15);
        boxes.push(box);
        IK.scene.add(box.boxMesh);
        IK.world.add(box.boxBody);
    }

    //needs to be called after meshes are loaded
    function createBoneChain(){
        boneChain.push(new Bone(1, new THREE.Vector3(0, 1, 0), IK.scene, meshes[0].clone()));
        for(var i = 1; i<numBones-1; i++){
            boneChain.push(new Bone(5, new THREE.Vector3(1, 0, 0), boneChain[i-1], meshes[1].clone()));
        }
        boneChain.push(new Bone(2, new THREE.Vector3(0, 1, 0), boneChain[numBones-2], meshes[2].clone()));
        lastBone = boneChain[numBones-1];
        //when bones are done, ready to render.
        render();
    }

    //load meshes and then calls callback function. BEAUTIFUL :)
    function loadMeshes(URLs, callback){
        loader.load( URLs.shift(), function (geometry, material){

            meshes.push(new THREE.Mesh(geometry, material[0]));

            if (URLs.length){
                loadMeshes(URLs, callback);
            } else {
                callback();
            }
        });
    }

    loadMeshes(meshUrlArray, createBoneChain);

    function updatePosition(bone, i){

        if(Math.abs(angleToTarget)>(1/2*Math.PI)){
            var speed = (1/2*Math.PI)/Math.abs(angleToTarget);
            if(i===0){
                var temp = 1.5/speed - 1.5;
                //var temp = 2.0*Math.sin(speed*Math.PI);
                secondaryTaskValues.elements[i] = (angleToTarget>0) ? temp : -temp;

                bone.update(newState[i]);
            }
            bone.update(newState[i]*speed);

        } else {
            if(i===0){
                secondaryTaskValues.elements[i] = newState[i] * 40;
            }
            bone.update(newState[i]);
        }

    }

    function updateSecondaryTaskValues(bone, i){

        if(i!==0){
            secondaryTaskValues.elements[i] = bone.constraint;
        }

    }

    function updatePhysics(){
        // Step the physics world
        IK.world.step(0.016);

        boxes.forEach(function (box, i){
            if(box.physicsEnabled){
                box.moveMeshToBody();
            }
        });
    }

    function getClosestBox(){

        var closest = 100,
            length;
        movableBoxes.forEach(function (box, i){
            length = box.boxMesh.position.length();
            if(length < closest){
                 closest = length;
                 movingBoxIndex = i;
            }
        });

        return movableBoxes[movingBoxIndex];
    }

    //setup camera
    IK.camera.position.z = 50;
    IK.camera.position.y = 50;
    IK.camera.position.x = 50;
    IK.camera.lookAt(new THREE.Vector3(0,0,0));

    //set first target
    movableBoxes = IK.getMovableBoxes(boxes);
    target = getClosestBox();

    var render = function () {
        requestAnimationFrame( render );

        // repaint all boxes
        boxes.forEach(function (box){
            box.repaint();
        });

        //try to select a box under the mouse pointer
        IK.selectBox(boxes);

        updatePhysics();

        //variables needed for theta_delta
        var vectorFrom = lastBone.getGlobalAxis(new THREE.Vector3(0,1,0)),
            vectorTo = new THREE.Vector3(),
            q = new THREE.Quaternion();

        //angle delta
        vectorTo.subVectors(target.position(), lastBone.getGlobalStartPos());
        q.setFromUnitVectors(vectorFrom.normalize(), vectorTo.normalize());
        theta_delta.setFromQuaternion(q);

        //positional delta
        endEffector = lastBone.getGlobalEndPos();
        e_delta.subVectors(target.position(), endEffector);

        //if angle to target is to big, rotate bonebase a bit extra to not get stuck
        angleToTarget = IK.getAngleToTarget(target.position(), boneChain[0]);

        //Reached target?
        if(e_delta.length() < 0.8){
            if (target instanceof Box){
                //pick up cube and change target to position (Vector3) above circle
                IK.world.remove(target.boxBody);
                target.physicsEnabled = false;
                THREE.SceneUtils.attach(target.boxMesh, IK.scene, lastBone.boneMesh);
                target = target.target;
            } else if(target === IK.startingPos){
                movableBoxes = IK.getMovableBoxes(boxes);
                if(movableBoxes.length){
                    target = getClosestBox();
                } else {
                    target.pos.y = (target.pos.y<16.5) ? 20 : 13;
                }
            } else {
                //drop cube and find next target.
                IK.world.add(movableBoxes[movingBoxIndex].boxBody);
                movableBoxes[movingBoxIndex].physicsEnabled = true;
                movableBoxes[movingBoxIndex].boxMesh = lastBone.boneMesh.children[0];
                THREE.SceneUtils.detach(lastBone.boneMesh.children[0], lastBone.boneMesh, IK.scene);
                movableBoxes[movingBoxIndex].moveBodyToMesh();
                //Rebuild box array
                movableBoxes = IK.getMovableBoxes(boxes);
                if(movableBoxes.length){
                target = getClosestBox();
                } else {
                    target = IK.startingPos;
                }
            }
        }

        //creating a jacobian and inversing it
        jacobian = IK.createJacobian(boneChain);
        inverseJacobian = IK.createInverseJacobian(jacobian, 10);

        //update secondary task values
        boneChain.forEach(updateSecondaryTaskValues);

        secondaryTask = (Sylvester.Matrix.I(numBones).subtract(inverseJacobian.x(jacobian))).x(secondaryTaskValues);
        // new delta angles = J^-1 * delta_X * dt
        newState = (inverseJacobian.x(
            $V([e_delta.x, e_delta.y, e_delta.z, theta_delta.x, theta_delta.y, theta_delta.z])
            ).add(secondaryTask)
            ).x(0.024).elements;
        boneChain.forEach(updatePosition);
        IK.renderer.render(IK.scene, IK.camera);
    };
};

/**
* returns a jacobian matrix with 'numBones' columns where each column has 6 rows.
* first three are x, y and z values of the vector = rotationAxis X BoneJoint-To-EndEffector-Vector
* and the other three are x, y and z values of the rotationAxis alone.
*/
IK.createJacobian = function (boneChain) {

    var jacobianRows = [],
        jacobian,
        numBones = boneChain.length,
        endEffector,
        row = new THREE.Vector3(),
        r = new THREE.Vector3();

    for(var i = 0; i<numBones;i++){
        // one row (later column after transpose): ( rotationAxis X (endEffector - joint[i]) ) rotationAxis
        endEffector = boneChain[numBones-1].getGlobalEndPos();

        row.crossVectors(boneChain[i].getGlobalRotationAxis(), r.subVectors(endEffector,boneChain[i].getGlobalStartPos()));
        jacobianRows.push(row.toArray().concat(boneChain[i].getGlobalRotationAxis().toArray()));
    }

    jacobian = $M(jacobianRows);
    jacobian = jacobian.transpose();

    return jacobian;
};

/**
* Tries to inverse the jacobian, if unsuccessful, takes the
* pseudo inverse with damping constant lambda instead
*/
IK.createInverseJacobian =  function (jacobian, lambda){

    var inverseJacobian;
    if(jacobian.isSquare() && !jacobian.isSingular()){
        inverseJacobian = jacobian.inverse();
    } else {
        //pseudo inverse with damping
        //(A'*A + lambda*I)^-1*A'
        var square = jacobian.transpose().x(jacobian),
            dampedSquare = square.add(Sylvester.Matrix.I(square.rows()).x(Math.pow(lambda,2))),
            inverseDampedSquare = dampedSquare.inverse();

        inverseJacobian = inverseDampedSquare.x(jacobian.transpose());
    }

    return inverseJacobian;
};

IK.getAngleToTarget = function (target, boneBase){

    var vectorFrom = boneBase.getGlobalAxis(new THREE.Vector3(0, 0, -1)).projectOnPlane(new THREE.Vector3(0, 1, 0)),
        vectorTo = new THREE.Vector3(),
        angle;

    vectorTo.subVectors(target, boneBase.boneMesh.position).projectOnPlane(new THREE.Vector3(0, 1, 0));
    angle = vectorFrom.angleTo(vectorTo);

    if((vectorTo.x*vectorFrom.z - vectorFrom.x*vectorTo.z)<0){
        angle = -angle;
    }

    return angle;

}

IK.getMovableBoxes = function (boxes){

    var movableBoxes = [];
    boxes.forEach(function(box, i){
        var distanceFromBase = new THREE.Vector3().subVectors(box.position(), box.target.position()).length();
        var distanceFromBoneChain = new THREE.Vector3().subVectors(box.position(), new THREE.Vector3(0, 0, 0)).length();
        if(distanceFromBase>20 && distanceFromBoneChain<45){
            movableBoxes.push(box);
        }
    });
    return movableBoxes;
}

IK.selectBox = function (boxes){

    // update the picking ray with the camera and mouse position
    IK.raycaster.setFromCamera( IK.mouse, IK.camera );

    // calculate objects intersecting the picking ray
    var intersects = IK.raycaster.intersectObjects( IK.scene.children );
    if(intersects[0] && intersects[0].object.geometry instanceof THREE.BoxGeometry){
        boxes.forEach(function (box, i){
            if(box.boxMesh.id === intersects[0].object.id){
                box.highlight();
                IK.impulsePosition = intersects[0].point;
                IK.selectedBox = box;
            }
        });
    } else {
        IK.impulsePosition = null;
        IK.selectedBox = null;
    }
}
