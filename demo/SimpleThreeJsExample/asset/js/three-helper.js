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
    this.renderer.physicallyCorrectLights = true;
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.setAttribute('class', 'mainCanvas');
    document.body.appendChild(this.renderer.domElement);

    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onProgress = function (item, loaded, total) {
        let percent = loaded / total;
        percent = Math.round(percent * 100);
        let loadingText = document.getElementById("loadingTxt");
        loadingText.innerText = percent + "%";
    };

    var genCubeUrls = function (prefix, postfix) {
        return [
            prefix + 'px' + postfix, prefix + 'nx' + postfix,
            prefix + 'py' + postfix, prefix + 'ny' + postfix,
            prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];
    };


    //cubemap
    var path = "asset/images/skybox0/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    this.refractionCube = new THREE.CubeTextureLoader(this.loadingManager).load(urls);
    this.refractionCube.mapping = THREE.CubeRefractionMapping;
    this.refractionCube.format = THREE.RGBFormat;

    this.scene = new THREE.Scene();
    // this.scene.background = this.refractionCube;
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(50, 5, 50);
    this.scene.add(this.light);

    // var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 1)
    // hemiLight.position.set(0, 0, 0);
    // this.scene.add(hemiLight);

    this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.control.screenSpacePanning = false;

    this.control.minDistance = 10;
    this.control.maxDistance = 100;

    this.control.minPolarAngle = Math.PI / 4;
    this.control.maxPolarAngle = Math.PI / 2;
    this.control.update();

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

    this.reset = () => {
        this.control.reset();
    }

    this.loadGLTF = function (modelUrl, callback) {
        const loader = new THREE.GLTFLoader(this.loadingManager);
        loader.load(modelUrl, (gltf) => {
            let object = gltf.scene;
            object.scale.setScalar(0.15);
            object.position.set(0, -20, 0);
            this.scene.add(object);
            this.light.target = object;

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

    this.loadFBX = function (modelUrl, callback) {
        const loader = new THREE.FBXLoader();
        loader.load(modelUrl, (object) => {
            object.scale.setScalar(0.02);
            object.position.set(0, 0, 0);
            this.scene.add(object);
            this.light.target = object;
            console.log("model loaded");

            if (object.animations.length > 0) {
                object.mixer = new THREE.AnimationMixer(object);
                this.mixers.push(object.mixer);
                object.mixer.clipAction(object.animations[0]).play();
            }
        });

        if (callback)
            callback();
    };

    this.render();
};