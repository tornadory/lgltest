/**
 * ThreeJS帮助类
 * @constructor
 */
const ThreeHelper = function () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 25);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.setAttribute('class', 'mainCanvas');
    document.body.appendChild(this.renderer.domElement);

    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
        let percent = loaded / total;
        percent = percent.toFixed(2) * 100;
        let loadingText = document.getElementById("loadingTxt");
        loadingText.innerText = percent + "%";
    };


    //cubemap
    var path = "asset/images/skybox0/";
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];

    this.refractionCube = new THREE.CubeTextureLoader(this.loadingManager).load(urls);
    this.refractionCube.mapping = THREE.CubeRefractionMapping;
    this.refractionCube.format = THREE.RGBFormat;



    this.scene = new THREE.Scene();
    this.scene.background = this.refractionCube;
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    var light = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 3);
    light.position.set(0, 0, 5);
    this.scene.add(light);

    // light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    // light.position.set(0, 0, -5);
    // this.scene.add(light);

    const control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    control.screenSpacePanning = false;

    control.minDistance = 10;
    control.maxDistance = 100;

    control.minPolarAngle = Math.PI / 4;
    control.maxPolarAngle = Math.PI / 2;
    control.update();

    this.clock = new THREE.Clock();
    this.mixers = [];

    window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    this.render = function () {
        this.renderer.render(this.scene, this.camera);

        for (const mixer of this.mixers) {
            mixer.update(this.clock.getDelta());
        }

        window.requestAnimationFrame(() => {
            this.render();
        });
    };

    this.loadGLTF = function (modelUrl, callback) {
        const loader = new THREE.GLTFLoader(this.loadingManager);
        loader.load(modelUrl, (gltf) => {
            let object = gltf.scene;
            object.scale.setScalar(0.15);
            object.position.set(0, -20, 0);
            this.scene.add(object);

            var animations = gltf.animations;
            if (animations && animations.length) {
                object.mixer = new THREE.AnimationMixer(object);
                this.mixers.push(object.mixer);
                for (var i = 0; i < animations.length; i++) {
                    var animation = animations[i];
                    var action = object.mixer.clipAction(animation);
                    action.play();
                }
            }
            if (callback)
                callback();
        })
    };

    this.loadObject = function (modelUrl) {
        const loader = new THREE.FBXLoader();
        loader.load(modelUrl, (object) => {
            object.scale.setScalar(0.02);
            object.position.set(0, 0, 0);
            this.scene.add(object);
            console.log("model loaded");

            if (object.animations.length > 0) {
                object.mixer = new THREE.AnimationMixer(object);
                this.mixers.push(object.mixer);
                object.mixer.clipAction(object.animations[0]).play();
            }
        })
    };

    this.render();
};