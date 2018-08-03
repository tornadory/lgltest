var Demo = Demo || {};

Demo.Scene = function (containerId) {

  this.scene = new THREE.Scene();
  this.projector = new THREE.Projector();
  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.renderer.setClearColor(0xCCCCCC, 1);

  this.jqContainer = $('#' + containerId);
  this.container = document.getElementById(containerId);

  // an array of scene elements we're interested with regards to collisions
  this.collisions = [];

  this.cameras = new Demo.Cameras(this);

  this.utils = new Demo.Scene.Utils(this);

  this.setup = new Demo.Scene.Setup({ context: this});
  this.stats = null;

  this.rotateCamera = false;

  this.theta = 0;
  this.radius = 100;

  this.init();

};

Demo.Scene.prototype = {

  init: function () {
    this.listeners();
    this.statsSetup();
    this.setupScene();
  },

  listeners: function () {
    var me = this;
    window.addEventListener('resize', me.onWindowResize, false);
  },

  onWindowResize: function (e) {
    this.liveCam.aspect = this.jqContainer.width() / this.jqContainer.height();
    this.liveCam.updateProjectionMatrix();
    this.renderer.setSize(this.jqContainer.width(), this.jqContainer.height());
  },

  /**
   *
   */
  statsSetup: function () {
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild( this.stats.domElement );
  },

  setupScene: function () {
    // creates an axes for us in the scene
    var helper = new THREE.AxisHelper(50);
    helper.position.set (0, 10, 0);
    this.scene.add(helper);
  },

  /**
   * Animates the scene
   */
  animate: function () {
    // NOTE: using the global variable "demo" instead of "this".
      requestAnimationFrame(demo.animate);
      demo.render();
      demo.stats.update();
      demo.cameras.controls.update();
  },

  /**
   * Renders the WebGL scene
   */
  render: function () {

    if(this.rotateCamera){
      this.theta += 0.1;

      this.cameras.liveCam.position.x = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.y = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.z = this.radius * Math.cos(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.lookAt(this.scene.position);
    }

    // NOTE: using the global variable "demo" instead of "this".
    this.renderer.render(this.scene, demo.cameras.liveCam);
  }
};
