const webAR = new WebAR(1000, 'recognize.php');

const threeHelper = new ThreeHelper();
var rotX = 0;
var rotY = 0;
var rotZ = 0;
var screenOrientation = 0; //

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

        var alpha = event.alpha ? THREE.Math.degToRad(event.alpha) : 0;
		var beta = event.beta ? THREE.Math.degToRad(event.beta) : 0;
		var gamma = event.gamma ? THREE.Math.degToRad(event.gamma) : 0;
		var orient = screenOrientation ? THREE.Math.degToRad(screenOrientation) : 0;

		//console.log("alpha ", alpha, " beta ", beta, " gamma ", gamma, " orient ", orient);

        var currentQ = new THREE.Quaternion().copy(threeHelper.movieScreen.quaternion);
        
        // if(window.innerHeight > window.innerWidth){
        //     setObjectQuaternion(currentQ, alpha, beta, gamma, 0);
        // }else{
        //     setObjectQuaternion(currentQ, alpha, beta, gamma, 1);
        // }

		setObjectQuaternion(currentQ, alpha, beta, gamma, orient);
        console.log("quat ", currentQ.x, currentQ.y, currentQ.z, currentQ.w);
        // threeHelper.movieScreen.useQuaternion = true;
        // threeHelper.movieScreen.setRotationFromQuaternion(currentQ);
        var currentAngle = Quat2Angle(currentQ.x, currentQ.y, currentQ.z, currentQ.w);
        console.log("screen oritation ", currentAngle.x, currentAngle.y, currentAngle.z);
        if(window.innerHeight > window.innerWidth){
            threeHelper.movieScreen.rotation.x = currentAngle.y;
            threeHelper.movieScreen.rotation.y = currentAngle.x;
            threeHelper.movieScreen.rotation.z = currentAngle.z;

        }else{
            threeHelper.movieScreen.rotation.x = currentAngle.x;
            threeHelper.movieScreen.rotation.z = currentAngle.y;
            threeHelper.movieScreen.rotation.y = currentAngle.z;
        }
    }
}

function Quat2Angle(x, y, z, w) {

    var pitch, roll, yaw;

    var test = x * y + z * w;

    if (test > 0.499) {
        yaw = 2 * Math.atan2(x, w);
        pitch = Math.PI / 2;
        roll = 0;

        var euler = new THREE.Vector3(pitch, roll, yaw);
        return euler;
    }

    if (test < -0.499) {
        yaw = -2 * Math.atan2(x, w);
        pitch = -Math.PI / 2;
        roll = 0;
        var euler = new THREE.Vector3(pitch, roll, yaw);
        return euler;
    }

    var sqx = x * x;
    var sqy = y * y;
    var sqz = z * z;
    yaw = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
    pitch = Math.asin(2 * test);
    roll = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);

    var euler = new THREE.Vector3(pitch, roll, yaw);

    return euler;
}

var setObjectQuaternion = function () {
    var zee = new THREE.Vector3(0, 0, 1);
    var euler = new THREE.Euler();
    var q0 = new THREE.Quaternion();
    // var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    // var q1 = new THREE.Quaternion(0, 0, 0, Math.sqrt(0.5));
    var q1 = new THREE.Quaternion();

    return function (quaternion, alpha, beta, gamma, orient) {

        euler.set(beta, alpha, -gamma, 'YXZ');

        quaternion.setFromEuler(euler);

        quaternion.multiply(q1);

        quaternion.multiply(q0.setFromAxisAngle(zee, -orient));

    }

}();
