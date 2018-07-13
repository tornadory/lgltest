var container, stats, controls;
var camera, scene, renderer, light;

var clock = new THREE.Clock();
var action;
var mixers = [];

var modelPath = "models/anim.fbx";

init();
function init() {
    container = document.getElementById('container');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(60, 1, 1, 5000);//FOV SETTING
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(400, 400);
    renderer.setClearColor(0xAAAAAA);
    container.appendChild(renderer.domElement);


    controls, camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    camera.position.set(2, 8, 8);
    controls.update();


    window.addEventListener('resize', onWindowResize, false);


    light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(1, 2, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(-1, -2, -1);
    scene.add(light);

    LoadModel(modelPath);

    //天空盒
    var imagePrefix = "images/skybox/skybox-";
    var directions = ["px", "nx", "py", "ny", "pz", "nz"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//主循环
function animate() {
    requestAnimationFrame(animate); //循环

    //播放动画
    var delta = clock.getDelta();
    if (mixers.length > 0) {
        for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(delta);
        }
    }

    //控制器更新
    controls.update();
    //渲染
    render();
}

//加载模型，参数为路径，注意模型所需贴图必须也在对应目录下才可以
function LoadModel(mPath) {
    var loader = new THREE.FBXLoader();
    loader.load(mPath, function (object) {
        if (object.animations.length > 0) { //如果有动画，则自动播放
            object.traverse(function (child) {
                if (child instanceof THREE.SkinnedMesh) {
                    child.animations = object.animations;
                }
            });
            object.mixer = new THREE.AnimationMixer(object);
            mixers.push(object.mixer);
            action = object.mixer.clipAction(object.animations[0]);
            action.timeScale = 1;
            action.play();
        }
        scene.add(object);
    });
}

//主渲染方法
function render() {
    renderer.render(scene, camera);
}