var Demo = Demo || {};
Demo = Demo || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Cameras = function (context) {

    this.context = context;

    this.liveCam = null;
    this.FOV = 70;
    this.WIDTH = context.jqContainer.width();
    this.HEIGHT = context.jqContainer.height();
    this.ASPECT_RATIO = this.WIDTH / this.HEIGHT;
    this.NEAR_PLANE = 1;
    this.FAR_PLANE = 10000;

    this.controls = null;

    this.init();
};

Demo.Cameras.prototype = {

    /**
     * Initialize the camera object and create default cameras.
     */
    init: function () {
        this.initPerspective();
        this.initControls();
    },

    initControls: function () {
        this.controls = new THREE.OrbitControls( this.liveCam, document.getElementById('snowman') );
    },

    /**
     * Initialize the perspective camera.
     */
    initPerspective: function () {
        this.liveCam = new THREE.PerspectiveCamera(this.FOV, this.ASPECT_RATIO, this.NEAR_PLANE, this.FAR_PLANE);
        this.liveCam.position.x = 0;
        this.liveCam.position.y = 150;
        this.liveCam.position.z = -300;
        this.liveCam.lookAt(this.context.scene);
    }

};
