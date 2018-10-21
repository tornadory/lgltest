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

            // document.querySelector('#openCamera').style.display = 'none';
            // document.querySelector('#start').style.display = 'inline-block';
            document.querySelector('#stop').style.display = 'inline-block';
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

document.querySelector('#stop').addEventListener('click', () => {
    webAR.stopRecognize();
}, false);

initFunc();

webAR.startRecognize((msg) => {
    console.log("message is ", msg);
    // alert('识别成功');
    document.getElementById('targetVideo' ).style.display = 'block';

    // 识别成功后，从meta中取出model地址
    // const meta = JSON.parse(window.atob(msg.meta));
    // threeHelper.loadObject(meta.model);

    // 加载本地模型
    // threeHelper.loadObject('asset/model/trex_v3.fbx');
    // threeHelper.movieGeometry.visible = true;

    // webAR.trace('加载模型');
});


if (window.DeviceMotionEvent) {
    window.ondeviceorientation = function (event) {
        alpha = event.alpha;
        beta = event.beta;
        gamma = event.gamma;
        setTimeout(function () {
            normalizeData(gamma, beta, alpha)
        }, 50)
    }
}

function normalizeData(_g, _b, _a) {

    b = Math.round(_b);
    g = Math.round(_g);
    a = Math.round(_a);

    rotY += (g - rotY) / 5;
    rotX += (b - rotX) / 5;
    rotZ += (a - rotZ) / 5;

    console.log('gamma: ' + g + ' / beta: ' + b + ' / alpha: ' + a);
    if(window.innerHeight > window.innerWidth){
        console.log("vertical mode");
        threeHelper.movieScreen.rotation.y = rotY / 150;
        threeHelper.movieScreen.rotation.x = rotX / 150;
        threeHelper.movieScreen.rotation.z = rotZ / 150;
    }else{
        console.log("horizontal mode");
        threeHelper.movieScreen.rotation.x = rotY / 150; //rotY
        threeHelper.movieScreen.rotation.y = rotZ / 150;
        threeHelper.movieScreen.rotation.z = rotX / 150;
    }
    
}