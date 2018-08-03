var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
Demo.Scene.Setup = function (params) {

  this.context = params.context;

  this.gameDimensions = params.cubes;

  this.width = this.context.jqContainer.width();
  this.height = this.context.jqContainer.height();

  // size of a cube
  this.cubeDim = 10;

  // distance between cube centroids  [5c5]555[5c5]555[5c5] etc.
  this.cubeSeparation = 25;

  this.displacement = (this.cubeSeparation * (this.gameDimensions - 1))/2;

  this.mesh = null;

  this.cubeColor1 = new THREE.Color(0x6ACEEB);
  this.cubeColor2 = new THREE.Color(0xFFFFFF);
  this.cubeColor3 = new THREE.Color(0xCCCCCC);

  this.init();
};

Demo.Scene.Setup.prototype = {

  /**
   * Initialize all of the THREE.JS framework and additional code.
   */
  init: function () {
    this.setupRenderer();
    this.lights();
    this.createGeometry();
  },

  /**
   * Setup the render inforamtion.
   */
  setupRenderer: function () {
    this.context.renderer.setSize(this.width, this.height);
    this.context.container.appendChild(this.context.renderer.domElement);
  },

  /**
   * Add supporting geometry to the scene.  Axis helpers, stats, grid etc.
   */
  createGeometry: function () {
    this.context.scene.add(new THREE.AxisHelper(10));
    this.createCubes();
    this.createRays();
  },

  /**
   * Add light(s) to the scene
   */
  lights: function () {

    var dl,
        rotatePos = 30 * Math.PI / 180,
        rotateNeg = -90 * Math.PI / 180;

    // this.context.scene.add(new THREE.AmbientLight(0xFFFFFF));

    dlPos = new THREE.DirectionalLight(0xFFFFFF, 1);
    dlPos.position.set(rotatePos,rotatePos,rotatePos);

    dlNeg = new THREE.DirectionalLight(0xFFFFFF, 1);
    dlNeg.position.set(rotateNeg,rotateNeg,rotateNeg);

    this.context.scene.add(dlPos);
    this.context.scene.add(dlNeg);

  },

  createCubes: function () {

    var i,j,k,
      num = 0,
      geo = new THREE.CubeGeometry(this.cubeDim, this.cubeDim, this.cubeDim),
      materialVerts = new THREE.MeshLambertMaterial({color: this.cubeColor1}),
      materialOutside = new THREE.MeshLambertMaterial({color: this.cubeColor2}),
      materialInside = new THREE.MeshLambertMaterial({color: this.cubeColor3}),
      cubeGroup = new THREE.Object3D();

    // this approach should work for any dimension tic-tac-toe setup.  e.g. 4x4x4
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){
        for(k = 0; k < this.gameDimensions; k++){

          var mesh = new THREE.Mesh(geo.clone(), materialOutside.clone());
          mesh.cubeNum = num;
          mesh.position = new THREE.Vector3((i)*this.cubeSeparation - this.displacement, (j)*this.cubeSeparation - this.displacement, (k)*this.cubeSeparation - this.displacement);

          // this is the signifier for the Tic-Tac-Toe choice.
          mesh.ttt = null;
          num++;

          // instead of using scene.children, I create an array for ray collisions.
          this.context.collisions.push(mesh);
          this.context.scene.add(mesh);
        }
      }
    }
  },

  /**
   * Creates rays for ray-casting.
   */
  createRays: function () {

    var setup = {
        xDirection: xDirection = new THREE.Vector3(-1,0,0),
        yDirection: yDirection = new THREE.Vector3(0,-1,0),
        zDirection: zDirection = new THREE.Vector3(0,0,-1),
        xy1Direction: xy1Direction = new THREE.Vector3(-1,-1,0).normalize(),
        xy2Direction: xy2Direction = new THREE.Vector3(-1,1,0).normalize(),
        xz1Direction: xz1Direction = new THREE.Vector3(-1,0,-1).normalize(),
        xz2Direction: xz2Direction = new THREE.Vector3(-1,0,1).normalize(),
        yz1Direction: yz1Direction = new THREE.Vector3(0,-1,-1).normalize(),
        yz2Direction: yz2Direction = new THREE.Vector3(0,1,-1).normalize(),
        xyz1Direction: xyz1Direction = new THREE.Vector3(-1,-1,-1).normalize(),
        xyz2Direction: xyz2Direction = new THREE.Vector3(1,-1,-1).normalize(),
        xyz3Direction: xyz3Direction = new THREE.Vector3(-1,-1,1).normalize(),
        xyz4Direction: xyz4Direction = new THREE.Vector3(1,-1,1).normalize(),
        length: 20
    };

    // should be this.gameDimensions^3 of these guys.
    this.create2DVectors(setup);

    // should be 18 of these guys  (for a 3x3x3)
    this.create2DDiagonals(setup);

    // should be 4 of these guys
    this.create3DDiagonals(setup);
  },

  /**
   * Create all 2D vectors
   * @param  {Object} setup Setup object containing all normalized vector directions.
   */
  create2DVectors: function (setup) {
    var i,j,
        x,y,z,
        arrow,
        origin,
        ray;

    // create rays looking down X
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){

        x = (this.gameDimensions) * this.cubeSeparation;
        y = i * this.cubeSeparation - this.displacement;
        z = j * this.cubeSeparation - this.displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.xDirection, origin, setup.length, 0xFF0000);

        this.context.scene.add(arrow);
        this.context.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.xDirection);
        this.context.rays.push(ray);
      }
    }

    // create rays looking down Y
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){

        y = (this.gameDimensions + 1) * this.cubeSeparation;
        x = (i * this.cubeSeparation) - this.displacement;
        z = (j * this.cubeSeparation) - this.displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.yDirection, origin, setup.length, 0x00FF00);

        this.context.scene.add(arrow);
        this.context.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.yDirection);
        this.context.rays.push(ray);

      }
    }

    // create rays looking down Z
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){

        z = (this.gameDimensions + 1) * this.cubeSeparation;
        y = (i * this.cubeSeparation) - this.displacement;
        x = (j * this.cubeSeparation) - this.displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.zDirection, origin, setup.length, 0x0000FF);

        this.context.scene.add(arrow);
        this.context.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.zDirection);
        this.context.rays.push(ray);
      }
    }
  },

  create2DDiagonals: function (setup) {
    var i,j,
        x,y,z,
        arrow1,
        arrow2,
        origin1,
        origin2,
        ray1,
        ray2;

    // create rays for XY diagonals
    for(i = 0; i < this.gameDimensions; i++){

        x = (this.gameDimensions + 1) * this.cubeSeparation;
        y = (this.gameDimensions + 1) * this.cubeSeparation;
        z = (i * this.cubeSeparation) - this.displacement;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,-y,z);

        arrow1 = new THREE.ArrowHelper(setup.xy1Direction, origin1, setup.length, 0xCC0000);
        arrow2 = new THREE.ArrowHelper(setup.xy2Direction, origin2, setup.length, 0xCC0000);

        this.context.scene.add(arrow1);
        this.context.scene.add(arrow2);

        this.context.arrows.push(arrow1);
        this.context.arrows.push(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.xy1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.xy2Direction);

        this.context.rays.push(ray1);
        this.context.rays.push(ray2);
    }

    // create rays for XZ diagonals
    for(i = 0; i < this.gameDimensions; i++){

        x = (this.gameDimensions + 1) * this.cubeSeparation;
        y = (i * this.cubeSeparation) - this.displacement;
        z = (this.gameDimensions + 1) * this.cubeSeparation;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,y,-z);

        arrow1 = new THREE.ArrowHelper(setup.xz1Direction, origin1, setup.length, 0x00CC00);
        arrow2 = new THREE.ArrowHelper(setup.xz2Direction, origin2, setup.length, 0x00CC00);

        this.context.scene.add(arrow1);
        this.context.scene.add(arrow2);

        this.context.arrows.push(arrow1);
        this.context.arrows.push(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.xz1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.xz2Direction);

        this.context.rays.push(ray1);
        this.context.rays.push(ray2);
    }

    // create rays for YZ diagonals
    for(i = 0; i < this.gameDimensions; i++){

        x = (i * this.cubeSeparation) - this.displacement;
        y = (this.gameDimensions - 1) * this.cubeSeparation;
        z = (this.gameDimensions - 1) * this.cubeSeparation;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,-y,z);

        arrow1 = new THREE.ArrowHelper(setup.yz1Direction, origin1, setup.length, 0x0000CC);
        arrow2 = new THREE.ArrowHelper(setup.yz2Direction, origin2, setup.length, 0x0000CC);

        this.context.arrows.push(arrow1);
        this.context.arrows.push(arrow2);

        this.context.scene.add(arrow1);
        this.context.scene.add(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.yz1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.yz2Direction);

        this.context.rays.push(ray1);
        this.context.rays.push(ray2);

    }
  },

  create3DDiagonals: function (setup) {
    var i,j,
        x,y,z,
        arrow1, arrow2, arrow3, arrow4,
        origin1, origin2, origin3, origin4,
        ray1, ray2, ray3, ray4,
        distance = (this.gameDimensions + 1) * this.cubeSeparation;

    x = distance;
    y = distance;
    z = distance;

    origin1 = new THREE.Vector3(x,y,z);
    origin2 = new THREE.Vector3(-x,y,z);
    origin3 = new THREE.Vector3(x,y,-z);
    origin4 = new THREE.Vector3(-x,y,-z);

    arrow1 = new THREE.ArrowHelper(setup.xyz1Direction, origin1, setup.length, 0x333333);
    arrow2 = new THREE.ArrowHelper(setup.xyz2Direction, origin2, setup.length, 0x333333);
    arrow3 = new THREE.ArrowHelper(setup.xyz3Direction, origin3, setup.length, 0x333333);
    arrow4 = new THREE.ArrowHelper(setup.xyz4Direction, origin4, setup.length, 0x333333);

    this.context.arrows.push(arrow1);
    this.context.arrows.push(arrow2);
    this.context.arrows.push(arrow3);
    this.context.arrows.push(arrow4);

    this.context.scene.add(arrow1);
    this.context.scene.add(arrow2);
    this.context.scene.add(arrow3);
    this.context.scene.add(arrow4);

    ray1 = new THREE.Raycaster(origin1, setup.xyz1Direction);
    ray2 = new THREE.Raycaster(origin2, setup.xyz2Direction);
    ray3 = new THREE.Raycaster(origin3, setup.xyz3Direction);
    ray4 = new THREE.Raycaster(origin4, setup.xyz4Direction);

    this.context.rays.push(ray1);
    this.context.rays.push(ray2);
    this.context.rays.push(ray3);
    this.context.rays.push(ray4);
  },


};

