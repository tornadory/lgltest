/**
 * ThreeJS帮助类
 * @constructor
 */
const ThreeHelper = function(){
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 25);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.setAttribute('class', 'mainCanvas');
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    const control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    control.update();

    this.clock = new THREE.Clock();
    this.mixers = [];

    window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (window.innerWidth < window.innerHeight){
            this.movieScreen.scale.set(10,5,2);
        }else{
            this.movieScreen.scale.set(25,15,7);
        }
    }, false);

    this.render = function() {
        this.renderer.render(this.scene, this.camera);

        for (const mixer of this.mixers) {
            mixer.update(this.clock.getDelta());
        }

        window.requestAnimationFrame(() => {
            this.render();
        });
    };

    this.loadObject = function(modelUrl) {
        const loader = new THREE.FBXLoader();
        loader.load(modelUrl, (object) => {
            object.scale.setScalar(0.02);
            object.position.set(0, 0, 0);
            this.scene.add(object);

            if (object.animations.length > 0) {
                object.mixer = new THREE.AnimationMixer(object);
                this.mixers.push(object.mixer);
                object.mixer.clipAction(object.animations[0]).play();
            }
        })
    };

    this.targetVideo = document.getElementById( 'targetVideo' );
    this.targetVideo.onplay = ()=>{
        console.log("start to playing ");
        this.targetVideo.style.display = 'none';
        this.movieScreen.visible = true;
        
        this.movieScreen.material.map.needsUpdate = true;
    }

    
    this.videoTexture = new THREE.VideoTexture(this.targetVideo);
    this.videoTexture.wrapS = this.videoTexture.wrapT = THREE.ClampToEdgeWrapping; 
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    this.movieMaterial = new THREE.MeshBasicMaterial({
        map: this.videoTexture,
        side: THREE.DoubleSide,
    });

    this.movieGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.movieScreen = new THREE.Mesh(this.movieGeometry, this.movieMaterial);
    this.movieScreen.position.set(0, 0, 0);
    this.movieScreen.visible = false;
    if (window.innerWidth < window.innerHeight){
        this.movieScreen.scale.set(10,5,2);
    }else{
        this.movieScreen.scale.set(25,15,7);
    }
    this.scene.add(this.movieScreen);

    this.render();
};

