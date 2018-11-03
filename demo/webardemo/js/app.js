// 创建easyar的webar实例，主要负责ar相关的
const webAR = new WebAR(1000, 'recognize.php');
// 使用three.js 创建三维场景，主要负责三维内容展示
const threeHelper = new ThreeHelper();

var initFunc = function () {
    const videoSetting = {
        width: 480,
        height: 360
    };

    const video = document.querySelector('#video');
    const videoDevice = document.querySelector('#videoDevice');

    const openCamera = (video, deviceId, videoSetting) => {
        webAR.openCamera(video, deviceId, videoSetting)
            .then((msg) => {
                // 打开摄像头成功
                // 将视频铺满全屏(简单处理)
                let videoWidth = video.offsetWidth;
                let videoHeight = video.offsetHeight;

                if (window.innerWidth < window.innerHeight) {
                    // 竖屏
                    if (videoHeight < window.innerHeight) {
                        video.setAttribute('height', window.innerHeight.toString() + 'px');
                    }
                } else {
                    // 横屏
                    if (videoWidth < window.innerWidth) {
                        video.setAttribute('width', window.innerWidth.toString() + 'px');
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // 列出视频设备
    webAR.listCamera(videoDevice)
        .then(() => {
            openCamera(video, videoDevice.value, videoSetting);
            videoDevice.onchange = () => {
                openCamera(video, videoDevice.value, videoSetting);
            };
        })
        .catch((err) => {
            console.info(err);
        });
};

var audioObj = document.getElementById('bg_audio');
var muted = true;
var musicControllerObj = document.querySelector("#musicController");
var restartObj = document.querySelector("#restartScan");

// 判断音频内容加载成功后显示左上角图标
window.addEventListener('load', function () {
    function checkLoad() {
        if (audioObj.readyState === 4) {
            musicControllerObj.style.opacity = 1;
            muted = true;
            audioObj.play();
        } else {
            setTimeout(checkLoad, 100);
        }
    }
    checkLoad();
}, false);

// 响应事件，切换左上角图标
audioObj.addEventListener('play', function () {
    musicControllerObj.src = "asset/images/music.png";
    muted = false;
});
// 响应事件，切换左上角图标
audioObj.addEventListener('pause', function () {
    musicControllerObj.src = "asset/images/muted.png";
    muted = true;
});

musicControllerObj.addEventListener('click', () => {
    //try to play music
    if (muted) {
        audioObj.play();
    } else {
        audioObj.pause();
    }
}, false);

// 点击右上角图标，重新启动AR扫描模式
restartObj.addEventListener('click', () => {
    //try to restart scanning
    threeHelper.scene.background = null;
    threeHelper.scene.visible = false;

    document.querySelector('#videoDevice').style.display = 'block';
    restartObj.style.opacity = 0;
    webAR.startRecognize((msg) => {
        document.querySelector('#videoDevice').style.display = 'none';

        threeHelper.scene.background = threeHelper.refractionCube;
        threeHelper.scene.visible = true;
        restartObj.style.opacity = 1;

        webAR.stopRecognize();
    });
}, false);

threeHelper.scene.visible = false;
// 加载需要显示在场景中的模型，回调函数用于待加载完毕后隐藏场景并开始执行扫描模式
threeHelper.loadGLTF('asset/model/gltf/scene.gltf', () => {

    var loadingUI = document.querySelector('#loadingUI');
    loadingUI.style.display = 'none';

    //打开相机
    initFunc();

    //开始扫描识别
    webAR.startRecognize((msg) => {
        restartObj.style.opacity = 1;
        document.querySelector('#videoDevice').style.display = 'none';

        threeHelper.scene.background = threeHelper.refractionCube;
        threeHelper.scene.visible = true;

        //关闭识别模式
        webAR.stopRecognize();
    });
});