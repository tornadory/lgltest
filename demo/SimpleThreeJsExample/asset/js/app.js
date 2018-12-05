const webAR = new WebAR(1000, 'recognize.php');

const threeHelper = new ThreeHelper();
var rotX = 0;
var rotY = 0;
var rotZ = 0;
var recognized = false;

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

window.addEventListener('load', function () {
    function checkLoad() {
        if (audioObj.readyState === 4) {
            musicControllerObj.style.opacity = 1;
            muted = true;
            // audioObj.play();
            audioObj.pause();
            audioObj.currentTime = 0;
        } else {
            setTimeout(checkLoad, 100);
        }
    }
    checkLoad();
}, false);

document.addEventListener('touchstart', function () {
    console.log("touch start");
    if (recognized) {
        console.log("recgonized");
        threeHelper.action.play();
        audioObj.play();
        recognized = false;
    }
});

audioObj.addEventListener('play', function () {
    musicControllerObj.src = "asset/images/music.png";
    muted = false;
});

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

restartObj.addEventListener('click', () => {
    threeHelper.reset();
    audioObj.pause();
    audioObj.currentTime = 0;
    audioObj.play();
    //try to restart scanning
    // threeHelper.scene.background = null;
    // threeHelper.scene.visible = false;

    // audioObj.pause();
    // audioObj.currentTime = 0;

    // document.querySelector('#videoDevice').style.display = 'block';
    // restartObj.style.opacity = 0;
    // musicControllerObj.style.opacity = 0;
    // webAR.startRecognize((msg) => {
    //     document.querySelector('#videoDevice').style.display = 'none';

    //     threeHelper.scene.background = threeHelper.refractionCube;
    //     threeHelper.scene.visible = true;
    //     restartObj.style.opacity = 1;
    //     musicControllerObj.style.opacity = 1;

    //     webAR.stopRecognize();
    // });
}, false);

threeHelper.scene.visible = false;

// threeHelper.loadFBX('asset/model/xiaoxiongmao.fbx', () => {
//     var loadingUI = document.querySelector('#loadingUI');
//     loadingUI.style.display = 'none';

//     initFunc();

//     threeHelper.scene.background = threeHelper.refractionCube;
//     threeHelper.scene.visible = true;

//     webAR.startRecognize((msg) => {
//         restartObj.style.opacity = 1;
//         musicControllerObj.style.opacity = 1;
//         document.querySelector('#videoDevice').style.display = 'none';

//         threeHelper.scene.background = threeHelper.refractionCube;
//         threeHelper.scene.visible = true;

//         webAR.stopRecognize();
//     });
// });

threeHelper.loadGLTF('asset/model/gltf/scene.gltf', () => {
    var loadingUI = document.querySelector('#loadingUI');
    loadingUI.style.display = 'none';

    initFunc();

    // threeHelper.scene.background = threeHelper.refractionCube;
    // threeHelper.scene.visible = true;
    // audioObj.play();

    webAR.startRecognize((msg) => {
        recognized = true;
        restartObj.style.opacity = 1;
        musicControllerObj.style.opacity = 1;
        document.querySelector('#videoDevice').style.display = 'none';

        threeHelper.scene.background = threeHelper.refractionCube;
        threeHelper.scene.visible = true;

        // audioObj.play();

        webAR.stopRecognize();
    });
});