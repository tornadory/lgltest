const webAR = new WebAR(1000, 'recognize.php');

const threeHelper = new ThreeHelper();
var rotX = 0;
var rotY = 0;
var rotZ = 0;

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
                // alert(err);
                // alert('打开视频设备失败');
                console.error(err);
            });
    };

    // 列出视频设备
    webAR.listCamera(videoDevice)
        .then(() => {
            // console.log(videoDevice.value);
            openCamera(video, videoDevice.value, videoSetting);
            videoDevice.onchange = () => {
                openCamera(video, videoDevice.value, videoSetting);
            };


            // document.querySelector('#start').style.display = 'inline-block';
            // document.querySelector('#stop').style.display = 'inline-block';
        })
        .catch((err) => {
            console.info(err);
            // alert('没有可使用的视频设备');
        });
};

// document.querySelector('#openCamera').addEventListener('click', initFunc, false);

// document.querySelector('#start').addEventListener('click', () => {
//     webAR.startRecognize((msg) => {
//         alert('识别成功');
//         document.getElementById('targetVideo' ).style.display = 'block';

//         // 识别成功后，从meta中取出model地址
//         // const meta = JSON.parse(window.atob(msg.meta));
//         // threeHelper.loadObject(meta.model);

//         // 加载本地模型
//         threeHelper.loadObject('asset/model/trex_v3.fbx');
//         // threeHelper.movieGeometry.visible = true;

//         webAR.trace('加载模型');
//     });
// }, false);

var audioObj = document.getElementById('bg_audio');
var muted = true;
var musicControllerObj = document.querySelector("#musicController");
var restartObj = document.querySelector("#restartScan");

window.addEventListener('load', function () {

    function checkLoad() {
        if (audioObj.readyState === 4) {
            console.log("check load, ready state", audioObj.readyState);
            musicControllerObj.style.opacity = 1;
            muted = true;
            audioObj.play();
            // var loadingUI = document.querySelector('#loadingUI');
            // loadingUI.style.display = 'none';
        } else {
            setTimeout(checkLoad, 100);
        }
    }
    checkLoad();
}, false);

audioObj.addEventListener('play', function () {
    console.log("audio playing");
    musicControllerObj.src = "asset/images/music.png";
    muted = false;
});

audioObj.addEventListener('pause', function () {
    console.log("audio paused");
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
    //try to restart scanning
    threeHelper.scene.background = null;
    threeHelper.scene.visible = false;

    document.querySelector('#videoDevice').style.display = 'block';
    restartObj.style.opacity = 0;
    webAR.startRecognize((msg) => {
        console.log("message is ", msg);
        document.querySelector('#videoDevice').style.display = 'none';

        threeHelper.scene.background = threeHelper.refractionCube;
        threeHelper.scene.visible = true;
        restartObj.style.opacity = 1;

        webAR.stopRecognize();
    });
}, false);

threeHelper.scene.visible = false;
threeHelper.loadGLTF('asset/model/gltf/scene.gltf', () => {

    var loadingUI = document.querySelector('#loadingUI');
    loadingUI.style.display = 'none';

    initFunc();

    console.log("finished initFunc");
    threeHelper.scene.background = threeHelper.refractionCube;
    threeHelper.scene.visible = true;

    webAR.startRecognize((msg) => {
        console.log("message is ", msg);
        restartObj.style.opacity = 1;
        document.querySelector('#videoDevice').style.display = 'none';

        threeHelper.scene.background = threeHelper.refractionCube;
        threeHelper.scene.visible = true;

        webAR.stopRecognize();
    });
});