let log = console.log.bind(console);

let globeObj = (function () {
    'use strict';

    // 判断浏览器是否支持webgl
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    let container;

    let camera, scene, renderer, controls, light, composer, clock, gui;
    let uniforms;

    let groupEarth, groupMoon, groupPoint, groupSun, groupMu;
    let globeMesh, moonMesh, muMesh, mesh;

    let winWth = window.innerWidth,
        winHgt = window.innerHeight;

    let speed = 0;

    init();
    initControls();
    animate();

    function initControls() {

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        // 如果使用animate方法时，将此函数删除 
        //controls.addEventListener( 'change', render ); 
        // 使动画循环使用时阻尼或自转 意思是否有惯性 
        controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度 
        //controls.dampingFactor = 0.25; 
        //是否可以缩放 
        controls.enableZoom = true;
        //是否自动旋转 
        controls.autoRotate = true;
        //设置相机距离原点的最远距离 
        controls.minDistance = 5;
        //设置相机距离原点的最远距离 
        controls.maxDistance = 2000;
        //是否开启右键拖拽 
        controls.enablePan = true;
    }

    // 太阳
    function sun() {
        let sunGgeometry = new THREE.SphereGeometry(230, 100, 100);
        let sunMaterial = new THREE.MeshLambertMaterial({
            color: 0xffff00,
            emissive: 0xff0000
        });
        let sunMesh = new THREE.Mesh(sunGgeometry, sunMaterial);
        groupSun.add(sunMesh);
    }

    // 木星
    function mu() {
        let globeTextureLoader = new THREE.TextureLoader();
        globeTextureLoader.load('images/textures/mu.jpg', function (texture) {
            let globeGgeometry = new THREE.SphereGeometry(120, 100, 100);
            let globeMaterial = new THREE.MeshStandardMaterial({
                map: texture
            });
            muMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            muMesh.position.x = -500;
            muMesh.position.z = 500;
            groupMu.add(muMesh);
        });
    }

    // 地球
    function globe() {
        let globeTextureLoader = new THREE.TextureLoader();
        globeTextureLoader.load('images/textures/earth.jpg', function (texture) {
            let globeGgeometry = new THREE.SphereGeometry(90, 100, 100);
            let globeMaterial = new THREE.MeshStandardMaterial({
                map: texture
            });
            globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            globeMesh.position.x = 800;
            globeMesh.position.z = 800;
            groupEarth.add(globeMesh);
        });
    }

    // 月球
    function moon() {
        let moonTextureLoader = new THREE.TextureLoader();
        moonTextureLoader.load('images/textures/moon.jpg', function (texture) {
            let moonGgeometry = new THREE.SphereGeometry(30, 100, 100);
            let moonMaterial = new THREE.MeshStandardMaterial({
                map: texture
            });
            moonMesh = new THREE.Mesh(moonGgeometry, moonMaterial);
            moonMesh.position.x = 800;
            moonMesh.position.z = 800;
            groupEarth.add(moonMesh);
        });
    }

    // 光
    function lights() {
        // let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
        // hemisphereLight.position.x = 0;
        // hemisphereLight.position.y = 0;
        // hemisphereLight.position.z = 0;
        // scene.add(hemisphereLight);

        light = new THREE.PointLight(0xffffff, 3, 10000);
        light.position.set(0, 0, 0);
        scene.add(light);
    }

    function cameras() {
        camera = new THREE.PerspectiveCamera(50, winWth / winHgt, 1, 4000);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 5;
        // camera.position.y = 100;
        // camera.position.z = 2000;
        camera.lookAt(0, 0, 0);
    }

    // 初始化
    function init() {
        container = document.getElementById('zh_globe_container');

        scene = new THREE.Scene();
        clock = new THREE.Clock();

        let bgTexture = new THREE.TextureLoader().load("images/textures/star.jpg");
        scene.background = bgTexture;

        cameras();

        // groupSun = new THREE.Group();
        groupEarth = new THREE.Group();
        groupMu = new THREE.Group();
        groupMoon = new THREE.Group();
        groupPoint = new THREE.Group();

        // scene.add(groupSun);
        scene.add(groupMu);
        scene.add(groupEarth);
        scene.add(groupMoon);
        scene.add(groupPoint);

        let textureLoader = new THREE.TextureLoader();
        //定义着色器与外部联系的变量
        uniforms = {
            fogDensity: {
                value: 0.45
            },
            fogColor: {
                value: new THREE.Vector3(0, 0, 0)
            },
            time: {
                value: 1.0
            },
            uvScale: {
                value: new THREE.Vector2(3.0, 2.0)
            },
            texture1: {
                value: textureLoader.load('images/lava/cloud.png')
            },
            texture2: {
                value: textureLoader.load('images/lava/lavatile.jpg')
            }
        };
        uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

        let material = new THREE.ShaderMaterial({ //通过ShaderMaterial将一些外部参数传入到着色器
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

        // mesh = new THREE.Mesh(new THREE.SphereGeometry(230, 100, 100), material);
        mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 40, 40), material);

        scene.add(mesh);

        //木星
        mu();

        // 地球    
        globe();

        //月球
        moon();

        // 半球光
        lights();

        // 渲染器
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(winWth, winHgt);
        container.appendChild(renderer.domElement);
        renderer.autoClear = false;

        let renderModel = new THREE.RenderPass(scene, camera); //渲染场景的通道，不会将结果输出到屏幕
        let effectBloom = new THREE.BloomPass(1); //增加场景的渲染亮度
        let effectFilm = new THREE.FilmPass(0.1, 1, 2048, false); //将渲染结果输出到屏幕上
        effectFilm.renderToScreen = true;
        // composer = new THREE.EffectComposer(renderer); //渲染效果组合器
        // composer.addPass(renderModel);
        // composer.addPass(effectBloom);
        // composer.addPass(effectFilm);

        //菜单栏元素
        let guiFields = {
            "扫描线数量": 256,
            "灰度图像": false,
            "扫描线强度": 0.3,
            "粗糙程度": 0.8,
            "updateEffectFilm": function () {
                effectFilm.uniforms.grayscale.value = guiFields.灰度图像;
                effectFilm.uniforms.nIntensity.value = guiFields.粗糙程度;
                effectFilm.uniforms.sIntensity.value = guiFields.扫描线强度;
                effectFilm.uniforms.sCount.value = guiFields.扫描线数量;
            }
        };

        //新建一个菜单栏
        let gui = new dat.GUI();
        gui.add(guiFields, "扫描线数量", 0, 5000).onChange(guiFields.updateEffectFilm);
        gui.add(guiFields, "扫描线强度", 0, 10).onChange(guiFields.updateEffectFilm);
        gui.add(guiFields, "粗糙程度", 0, 3).onChange(guiFields.updateEffectFilm);
        gui.add(guiFields, "灰度图像").onChange(guiFields.updateEffectFilm);

        // resize事件
        window.addEventListener('resize', onWindowResize, false);

    }

    // 窗口大小改变
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // composer.reset();
    }

    // 渲染
    function render() {
        let delta = 5 * clock.getDelta();
        uniforms.time.value += 0.2 * delta;

        // groupEarth.rotation.y -= 0.004;
        // globeMesh.rotation.y += 0.01;

        // mesh.rotation.y += 0.01;

        // groupMu.rotation.y -= 0.01;
        // muMesh.rotation.y += 0.04;

        // moonMesh.position.x = 800 + 200*(Math.cos(speed));
        // moonMesh.position.z = 800 + 200*(Math.sin(speed));
        // moonMesh.rotation.y += 0.05;
        // speed -= 0.04;
        renderer.clear();
        renderer.render(scene, camera);
        // composer.render(0.005);
    }

    // 动画
    function animate() {
        controls.update();
        requestAnimationFrame(animate);
        render();
    }

})();