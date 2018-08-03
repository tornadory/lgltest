var Demo = Demo || {};

/**
 * @namespace  General untility functions.
 */
Demo.Util = {

  /**
   * Not sure what I'm doing with this yet.   Maybe an online multi-player version?
   * @return {[type]} [description]
   */
  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = 'demo-xxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? 1 : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  },

  /**
   * Returns a random cube value.
   * @param  {Integer} nDimension 1 dimension of the scene.  e.g. 3, 4, 5, etc.
   * @return {[type]}            [description]
   */
  randomTTTCube: function (nDimension) {
    return Math.floor((Math.random()*nDimension*nDimension*nDimension));
  },

  /**
   *  Create a random color
   */
  randomHex: function () {
    return ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
  },

  toggleWireframes: function (meshes) {
    for(var i = 0; i< meshes.length; i++){
      meshes[i].material.wireframe = !meshes[i].material.wireframe;
    }
  },

  toggleArrows: function (arrows) {
    var i,
        vis;

    for(i = 0; i < arrows.length; i++){
      arrows[i].cone.visible = (arrows[i].cone.visible) ? false : true;
      arrows[i].line.visible = (arrows[i].line.visible) ? false : true;
    }
  },

  /**
   * Sets the mesh material color.  Sets the ttt value to the user name.
   * @param  {THREE.Mesh} mesh   Selected mesh.
   * @param  {Object} params {color: hexValue, name: String}
   * @return {[type]}        [description]
   */
  selectCube: function(mesh, params) {
    var newMat = new THREE.MeshBasicMaterial({color: params.color});

    mesh.material = newMat;

    // mesh.material.color.setStyle(params.color);
    mesh.ttt = params.name;
  },


  /**
   *   Change a group of meshes to random colors.
   *   @param {THREE.Mesh} mesh Cube mesh.
   */
  changeColor: function (mesh) {

    var rand = parseInt('0x' + this.randomHex(), 16);
    mesh.object.material.color.setHex(rand);

  },

  removeDupes: function (meshes){

    var cubeNums = [];

    var uniqIntersections = [];

    for(var i = 0; i < meshes.length; i++){
      if(cubeNums.indexOf(meshes[i].object.cubeNum) === -1){
        cubeNums.push(meshes[i].object.cubeNum);
        uniqIntersections.push(meshes[i].object);
      }
    }
    
    return uniqIntersections;
  }

};

// No one (including myself) should be doing this.
Array.prototype.sortOn = function(key){
    this.sort(function(a, b){
        if(a[key] < b[key]){
            return -1;
        }else if(a[key] > b[key]){
            return 1;
        }
        return 0;
    });
}


