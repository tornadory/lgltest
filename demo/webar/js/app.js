var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

var onError = function(error){
    alert('Webcam Error\nName: '+error.name + '\nMessage: '+error.message);
}

var onSuccess = function(stream){
    var video = document.querySelector('#video');
    let videoWidth = video.offsetWidth;
    let videoHeight = video.offsetHeight;

    if (window.innerWidth < window.innerHeight) {
        if (videoHeight < window.innerHeight) {
            video.setAttribute('height', window.innerHeight.toString() + 'px');
        }
    } else {
        if (videoWidth < window.innerWidth) {
            video.setAttribute('width', window.innerWidth.toString() + 'px');
        }
    }

    video.srcObject = stream;
    video.style.display = 'block';
    video.play();
}

// get available devices
// navigator.mediaDevices.enumerateDevices().then(function(devices){
//     if(isiOS){
//         navigator.mediaDevices.getUserMedia({
//             audio: false,
//             video: {
//                 facingMode: 'environment'
//             }
//         }).then(onSuccess).catch(onError);
//     }
//     else{
//         var videoSourceId;
//         var exArray = [];
//         for(var i = 0; i < devices.length; i++){
//             var deviceInfo = devices[i];
//             if(deviceInfo.kind == "videoinput"){
//                 exArray.push(deviceInfo.deviceId);
//                 if(deviceInfo.label.split(', ')[1] == "facing back") {
//                     videoSourceId = deviceInfo.deviceId;
//                 }
//             }
//         }
//         if (!videoSourceId) {
//             switch (exArray.length) {
//                 case 1:
//                     videoSourceId = exArray[0];
//                     break;
//                 case 2:
//                     videoSourceId = exArray[1];
//                     break;
//                 default:
//                     break;
//             }
//         }
//         navigator.mediaDevices.getUserMedia({
//             audio: false,
//             video: {
//                 optional: [{sourceId: videoSourceId}]
//             }
//         }).then(onSuccess).catch(onError);
//     }
// }).catch(onError);

const threeHelper = new ThreeHelper();
var rotX = 0;
var rotY = 0;
var rotZ = 0;
var screenOrientation = 0;

window.addEventListener('load', function() {
    var video = document.querySelector('#targetVideo');

    function checkLoad() {
        if (video.readyState === 4) {
            document.getElementById('targetVideo').style.display = 'block';
            document.getElementById('targetVideo').play();
            // var loadingUI = document.querySelector('#loadingUI');
            // loadingUI.style.display = 'none';
        } else {
            setTimeout(checkLoad, 100);
        }
    }

    checkLoad();
}, false);

document.body.addEventListener('click', function() {
    var video = document.querySelector('#targetVideo');
    if(video.paused){
        video.play();
    }
}, false);

document.addEventListener("WeixinJSBridgeReady", function(){
    var videoEl = document.getElementById("targetVideo");
    videoEl.play();
}, false);


if (window.DeviceMotionEvent) {
    window.ondeviceorientation = function (event) {

        var alpha = event.alpha ? THREE.Math.degToRad(event.alpha) : 0;
		var beta = event.beta ? THREE.Math.degToRad(event.beta) : 0;
		var gamma = event.gamma ? THREE.Math.degToRad(event.gamma) : 0;
        var orient = screenOrientation ? THREE.Math.degToRad(screenOrientation) : 0;
        
        if(threeHelper.movieScreen){
            var currentQ = new THREE.Quaternion().copy(threeHelper.movieScreen.quaternion);

            setObjectQuaternion(currentQ, alpha, beta, gamma, orient);
            var currentAngle = Quat2Angle(currentQ.x, currentQ.y, currentQ.z, currentQ.w);
            if(window.innerHeight > window.innerWidth){
                threeHelper.movieScreen.rotation.x = currentAngle.y;
                threeHelper.movieScreen.rotation.y = currentAngle.x;
                // threeHelper.movieScreen.rotation.z = currentAngle.z - Math.PI/2;
                threeHelper.movieScreen.rotation.z = 0;
            }else{
                threeHelper.movieScreen.rotation.x = currentAngle.x;
                threeHelper.movieScreen.rotation.y = currentAngle.y;
                // threeHelper.movieScreen.rotation.z = currentAngle.z;
                threeHelper.movieScreen.rotation.z = 0;
            }
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
    var q1 = new THREE.Quaternion();

    return function (quaternion, alpha, beta, gamma, orient) {
        euler.set(beta, alpha, -gamma, 'YXZ');
        quaternion.setFromEuler(euler);
        quaternion.multiply(q1);
        quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
    }

}();
