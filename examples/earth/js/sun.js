if (!Detector.webgl) Detector.addGetWebGLMessage();

let container;

let camera, scene, renderer, composer, clock;
let uniforms, mesh;

init();
animate();


function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 5;

    scene = new THREE.Scene();
    clock = new THREE.Clock();
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

    mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 40), material);
    // mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,30,30,30), material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;

    let renderModel = new THREE.RenderPass(scene, camera); //渲染场景的通道，不会将结果输出到屏幕
    let effectBloom = new THREE.BloomPass(7); //增加场景的渲染亮度
    let effectFilm = new THREE.FilmPass(0.10, 0.95, 5000, false); //将渲染结果输出到屏幕上
    effectFilm.renderToScreen = true;
    composer = new THREE.EffectComposer(renderer); //渲染效果组合器
    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(effectFilm);
    //
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}
//控制窗口尺寸变化
function onWindowResize(event) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.reset();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    let delta = 5 * clock.getDelta();
    uniforms.time.value += 0.2 * delta;
    mesh.rotation.y += 0.01 * delta;
    renderer.clear();
    composer.render(0.005);
}