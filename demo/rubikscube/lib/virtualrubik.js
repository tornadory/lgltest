/*
 * @(#)virtualrubik.js  1.0.2  2011-08-09
 *
 * Copyright (c) 2011 Werner Randelshofer, Immensee, Switzerland.
 * All rights reserved.
 *
 * You are free
 *    to Share – to copy, distribute and transmit the work
 *    to Remix – to adapt the work
 * Under the following conditions:
 *    Attribution - you must attribute the work to the author
 *    Non-Commercial - you may not use this work for commercial purposes
 * For detailed license terms see Creative Commons Attribution Non-Commercial 3.0.
 * http://creativecommons.org/licenses/by-nc/3.0/
 */

/* Usage:
 * Here is a minimal example of an HTML page which uses this script. 

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8" />
<title>Virtual Rubik's Cube with WebGL</title>
<script type="text/javascript" src="lib/virtualrubik.js"></script>
<script type="text/javascript">includeVirtualRubik("lib");</script>
</head>
<body onload="attachVirtualRubik();">
<p>Virtual Rubik's Cube with WebGL</p>
<canvas class="virtualrubik" width="400" height="400"></canvas>
<p>© 2011 Werner Randelshofer. All Rights Reserved</p>
</body>
</html> 

*/

/** Includes additional scripts. 
 * This function must be executed in the <head> element of a page.
 * 
 * @param baseURL Optional parameter giving the base URL of the script files.
 *               If baseURL is null, "." is used.
 */
function includeVirtualRubik(baseURL) {
  if (baseURL==null) { baseURL="."; }
  
  document.write('<script type="text/javascript" src="'+baseURL+'/webgl-utils.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/easywebgl.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/J3DIMath.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/splineinterpolator.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/node3d.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cube.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cube3d.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/cubeattributes.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/rubikscube.js"></script>');
  document.write('<script type="text/javascript" src="'+baseURL+'/rubikscube3d.js"></script>');
  document.write('<script id="vshader" type="x-shader/x-vertex" src="'+baseURL+'/phong.vshader"></script>');
  document.write('<script id="fshader" type="x-shader/x-fragment" src="'+baseURL+'/phong.fshader"></script>');
  document.write('<script id="rubik_center" type="application/x-wavefront" src="'+baseURL+'/rubik_center.obj"></script>');
  document.write('<script id="rubik_side" type="application/x-wavefront" src="'+baseURL+'/rubik_side.obj"></script>');
  document.write('<script id="rubik_edge" type="application/x-wavefront" src="'+baseURL+'/rubik_edge.obj"></script>');
  document.write('<script id="rubik_corner" type="application/x-wavefront" src="'+baseURL+'/rubik_corner.obj"></script>');
  document.write('<script id="rubik_sticker" type="application/x-wavefront" src="'+baseURL+'/rubik_sticker.obj"></script>');
}
 
 /** 
  * Attaches a virtual rubik's cube to the specified canvas element.
  * The attachment occurs only after the body of the document has been fully
  * loaded.
  *
  * @param divOrCanvas Optional <div> or <canvas> object.
  *               If canvas is null, a rubik's cube is attached to all <canvas> 
  *               elements in the document with class "virtualrubik".
  */
function attachVirtualRubik(divOrCanvas, initCallback) {
  // if we have been called before the document was loaded, we install a
  // listener and retry.
  if (document.body == null) {
    var f=function() {
      window.removeEventListener('load',f,false);
      attachVirtualRubik(divOrCanvas);
    }
    window.addEventListener('load',f,false);
    return;
  }

  
  // get the console
   var console = ("console" in window) ? window.console : { log: function() { } };  
   
   if (divOrCanvas==null) {
     // => no element was provided, attach to all elements with class "virtualrubik"
     var htmlCollection=document.getElementsByClassName("virtualrubik");
     if (htmlCollection.length == 0) {
       console.log('Error: virtualrubik.js no canvas or div element with class name "virtualrubik" found.');
       return;
     }
     for (i=0;i<htmlCollection.length;  i++) {
       var elem=htmlCollection[i];
       attachVirtualRubik(elem);
     }
   } else {
     // => an element was provided, attach VirtualRubik to it
     var canvasElem = null;
     if (divOrCanvas.tagName=="CANVAS") {
        // => A <canvas> element was provided, attach to it
         canvasElem = divOrCanvas;
     } else if (divOrCanvas.tagName=="DIV") {
        // => A <div> element was provided, insert a canvas element
        canvasElem = document.createElement("canvas");
        canvasElem.setAttribute('width','400px');
        canvasElem.setAttribute('height','400px');
        divOrCanvas.appendChild(canvasElem);
     } else {
         console.log('Error: virtualrubik.js element '+divOrCanvas+' is not a canvas or a div.');
         return;
     }
     var vr=new VirtualRubik(canvasElem);
     vr.initCallback=initCallback;
     vr.init();
     canvasElem.virtualrubik=vr;
   }
 }
 
 /** Constructor.
  * 
  * Creates a virtual rubik's cube and attaches it to the specified canvas
  * object. 
  */
 VirtualRubik = function(canvas) {
   this.canvas=canvas;
   this.additional
 }
 
 /** Initializes WebGL and the this. */
 VirtualRubik.prototype.init = function() {
   var self=this;
   this.checkForErrors=true;
	 var container = this.canvas.parentNode;
   
    this.gl=initWebGL(
		this.canvas, // id of the canvas element
		"vshader", // id of the vertex shader
		"fshader", // id of the fragment shader
		["vPos","vNormal","vColor","vTexture"], // vertex attribute names, order corresponds to index
		[0, 0, 0, 0], // clear color rgba
		10000, // clear depth
		{antialias:true},
		
		function(gl) { // success callback function
		  self.checkGLError("intWebGLCallback");
		  
     // Enable all of the vertex attribute arrays.
      self.vPosAttribute = 0;
      self.vNormalAttribute = 1;
      self.vColorAttribute = 2;
      self.vTextureAttribute = 3;
      self.gl=gl;
      gl.enableVertexAttribArray(self.vNormalAttribute);
      gl.enableVertexAttribArray(self.vColorAttribute);
      gl.enableVertexAttribArray(self.vPosAttribute);
      gl.enableVertexAttribArray(self.vTextureAttribute);		  
      
      self.initScene();
      
      self.canvas.addEventListener('mousedown',function(event) {return self.onMouseDown(event);},false);
      self.canvas.onselectstart=function(event) {return false;};
      document.addEventListener('mouseup',function(event) {return self.onMouseUp(event);},false);
      document.addEventListener('mousemove',function(event) {return self.onMouseMove(event);},false);
     
      self.checkForErrors=false;
      
      if (self.initCallback != null) {
        self.initCallback(self);
      }
      
      
		  self.draw();
		},
		
		function() { // failure callback function
		  self.gl=null;
			if (container) {
				container.innerHTML += '<img src="images/webgl-rubikscube.png" width="462" height="462" alt="WebGL Rubik\'s Cube">';
			}
		}
		);	
 }

 /** Initializes the this.
  * This function is called from init().
  */
 VirtualRubik.prototype.initScene = function() {
  var gl=this.gl;
  
  this.world=new Node3D();
  this.cube3d=new RubiksCube3D();
  this.world.add(this.cube3d);
  this.cube=this.cube3d.cube;
  this.cube3d.addChangeListener(this);
  var attr=this.cube3d.attributes;
  
  this.currentAngle=0;
  this.xRot=attr.xRot;
  this.yRot=attr.yRot;
  this.camPos=new J3DIVector3(0,0,-7);
  this.camPosLoc = gl.getUniformLocation(gl.program, "camPos");
  this.lookAtPos=new J3DIVector3(0,0,0);
  this.up=new J3DIVector3(0,1,0);
  this.lightPos=new J3DIVector3(4,4,-8);
  this.lightPosLoc = gl.getUniformLocation(gl.program, "lightPos");
  this.phongLoc = gl.getUniformLocation(gl.program, "mPhong");
  this.center=loadObj(gl,"rubik_center");
  this.center.proxy=null;
  this.corner=loadObj(gl,"rubik_corner");
  this.corner.proxy=null;
  this.edge=loadObj(gl,"rubik_edge");
  this.edge.proxy=null;
  this.side=loadObj(gl,"rubik_side");
  this.side.proxy=null;
  this.sticker=loadObj(gl,"rubik_sticker");
  this.stickers=new Array(this.cube3d.stickerCount);
  for (var i=0;i<this.cube3d.stickerCount;i++) {
    this.stickers[i]={proxy:this.sticker};
  }
  this.mvMatrix = new J3DIMatrix4();
  this.mvMatrixLoc = gl.getUniformLocation(gl.program, "mvMatrix");
  this.perspectiveMatrix = new J3DIMatrix4();
  this.mvpMatrix = new J3DIMatrix4();
  this.mvpMatrixLoc = gl.getUniformLocation(gl.program, "mvpMatrix");
  this.mvNormalMatrix = new J3DIMatrix4();
  this.mvNormalMatrixLoc = gl.getUniformLocation(gl.program, "mvNormalMatrix");
  this.spherePos=new J3DIVector3(0,0,5);
  this.cubeSize=1.8*3; // size of a cube side in centimeters
  this.invCameraMatrix=new J3DIMatrix4();  
  this.cameraMatrix=new J3DIMatrix4();  
  this.sphere=makeSphere(gl,0.1,16,16);
  this.sphereHit=false;
  this.rotationMatrix = new J3DIMatrix4();
  
  gl.clearColor(attr.backgroundColor[0], attr.backgroundColor[1], attr.backgroundColor[2], attr.backgroundColor[3]);
  
  this.willRepaint=false;
  this.forceColorUpdate=false;
  this.repaintCallbacks=[];
}

/**
 * Requests a repaint. 
 *
 * Calls the provided callback-function before drawing the cube. 
 * The cube is only drawn once if multiple repaints are pending.
 * All pending callbacks are executed in fifo order.
 *
 * @param callback an optional callback function.
 */
VirtualRubik.prototype.repaint = function(callback) {
  if (callback != null) {
    this.repaintCallbacks[this.repaintCallbacks.length]=callback;
  }
  
  if (this.willRepaint == false) {
    this.willRepaint=true;
    var self=this;
    var f=function() {
      self.willRepaint=false;
      
      // invoke all callbacks
      var callbacks=self.repaintCallbacks;
      self.repaintCallbacks=[];
      for (var i=0;i<callbacks.length;i++) {
        callbacks[i]();
      }
      
      // draw the cube
      self.draw();
    };
    window.requestAnimFrame(f, this.gl.canvas);
  }
}
/**
 * This function is called before we draw.
 * It adjusts the perspective matrix to the dimensions of the canvas.
 */
VirtualRubik.prototype.reshape = function() {
   var gl=this.gl;
    var canvas = this.canvas;
    if (canvas.clientWidth == this.width && canvas.clientHeight == this.height)
        return;
 
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
 
    // Update the perspective matrix
    gl.viewport(0, 0, this.width, this.height);
    this.perspectiveMatrix = new J3DIMatrix4();
    this.perspectiveMatrix.perspective(30, this.width/this.height, 1, 10000);
    this.cameraMatrix.makeIdentity();
    this.cameraMatrix.lookat(
          this.camPos[0], this.camPos[1], this.camPos[2], 
          this.lookAtPos[0], this.lookAtPos[1], this.lookAtPos[2], 
          this.up[0], this.up[1], this.up[2]
          );
    this.perspectiveMatrix.multiply(this.cameraMatrix);
    this.invCameraMatrix.load(this.cameraMatrix);
    this.invCameraMatrix.invert();
    var attr=this.cube3d.attributes;
    this.perspectiveMatrix.scale(-1,1,1);
    
    this.rasterToCameraMatrix = new J3DIMatrix4(this.perspectiveMatrix);
    this.rasterToCameraMatrix.invert();
    
}
/** Draws an individual object of the scene. */
VirtualRubik.prototype.drawObject = function(obj, mvMatrix, color, phong, forceColorUpdate) {
  if (obj.proxy) {
    if (obj.proxy.loaded) {
      obj.colorObject=obj.proxy.colorObject;
      obj.vertexObject=obj.proxy.vertexObject;
      obj.texCoordObject=obj.proxy.texCoordObject;
      obj.indexObject=obj.proxy.indexObject;
      obj.normalObject=obj.proxy.normalObject;
      obj.numIndices=obj.proxy.numIndices;
      obj.proxy=null;
      obj.loaded=true;
    } else {
      return;
    }
  }
  
  if (! obj.loaded) return;
  
  var gl=this.gl;
  
  // generate vertex colors.
  if (obj.colorObject == null || forceColorUpdate) {  
  //if (obj.colorObject == null) {  
    var randomColors=Array(obj.numIndices*4);
    for (i=0;i<obj.numIndices;i++) {
      if (color == null) {
        randomColors[i*4]=Math.random()*255;
        randomColors[i*4+1]=Math.random()*255;
        randomColors[i*4+2]=Math.random()*255;
        randomColors[i*4+3]=255; // alpha
      } else {
        randomColors[i*4]=color[0];
        randomColors[i*4+1]=color[1];
        randomColors[i*4+2]=color[2];
        randomColors[i*4+3]=color[3]; // alpha
      }
    }
    colors = new Uint8Array(randomColors);
    // Set up the vertex buffer for the colors
    if (obj.colorObject==null) {
      obj.colorObject = gl.createBuffer();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorObject);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);	
  }

  // Pass the phong material attributes position
  gl.uniform4f(this.phongLoc, phong[0], phong[1], phong[2], phong[3]);
  this.checkGLError();
  
  gl.uniformMatrix4fv(this.mvMatrixLoc, false, mvMatrix.getAsFloat32Array());
  this.checkGLError();
  
  this.mvpMatrix.load(this.perspectiveMatrix);
  this.mvpMatrix.multiply(mvMatrix);
  gl.uniformMatrix4fv(this.mvpMatrixLoc, false, this.mvpMatrix.getAsFloat32Array());
  this.checkGLError();
  
  this.mvNormalMatrix.load(mvMatrix);
  this.mvNormalMatrix.invert();
  this.mvNormalMatrix.transpose();
  gl.uniformMatrix4fv(this.mvNormalMatrixLoc, false, this.mvNormalMatrix.getAsFloat32Array());
	this.checkGLError();
	
	// Draw the object
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexObject);
  gl.vertexAttribPointer(this.vPosAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalObject);
  gl.vertexAttribPointer(this.vNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorObject);
  gl.vertexAttribPointer(this.vColorAttribute, 4, gl.UNSIGNED_BYTE, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoordObject);
  gl.vertexAttribPointer(this.vTextureAttribute, 2, gl.FLOAT, false, 0, 0);
  
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexObject);
  gl.drawElements(gl.TRIANGLES, obj.numIndices, gl.UNSIGNED_SHORT, 0);
  
  this.checkGLError();
}

/** Draws the scene. */
VirtualRubik.prototype.draw = function() {
  if (!this.camPos) return;
  
	this.reshape();
	var self=this;
	
	var gl=this.gl;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.checkGLError();
  
	// enable back face culling
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
  this.checkGLError();
	
  // request redraw if not all objects are loaded
  if (!this.center.loaded
    ||!this.edge.loaded 
    ||!this.corner.loaded
    ||!this.sticker.loaded) {
    window.requestAnimFrame(function() {self.draw();}, gl.canvas);
  }
  
  
  // Pass the camera and light positions
  gl.uniform3f(this.camPosLoc, this.camPos[0], this.camPos[1], this.camPos[2]);
  gl.uniform3f(this.lightPosLoc, this.lightPos[0], this.lightPos[1], this.lightPos[2]);

  var cube3d=this.cube3d;
  cube3d.repainter=this;
  var attr=this.cube3d.attributes;

  // part colors
  var ccenter=attr.partsFillColor[cube3d.centerOffset];
  var cparts=attr.partsFillColor[cube3d.cornerOffset];
  //var phongparts=[0.5,0.6,0.4,16.0];//ambient, diffuse, specular, shininess
  //var phongstickers=[0.8,0.2,0.1,8.0];//ambient, diffuse, specular, shininess
  
  // world-view transformation
  var wvMatrix = this.world.matrix;
  wvMatrix.makeIdentity();
  wvMatrix.multiply(this.rotationMatrix);
  wvMatrix.rotate(this.cube3d.attributes.xRot,1,0,0);
  wvMatrix.rotate(this.cube3d.attributes.yRot,0,-1,0);
  wvMatrix.rotate(this.currentAngle, 1,1,1);
  var scaleFactor =0.4*attr.scaleFactor;  
	wvMatrix.scale(scaleFactor,scaleFactor,scaleFactor);

  //  this.log('  center w==c3d.p          ?:'+(this.world===this.cube3d.parent));
  //  this.log('  center c3d==c3d.parts[0].p?:'+(this.cube3d===this.cube3d.parts[0].parent));
//	this.world.add(this.cube3d); 
	
  // model view transformation
  var mvMatrix=this.mvMatrix;
  
  // draw the sphere  
  /*
  if (this.sphereHit) {
    var phongparts=[0.5,0.6,0.4,16.0];//ambient, diffuse, specular, shininess
    mvMatrix.load(wvMatrix);
    mvMatrix.translate(this.spherePos[0],this.spherePos[1],this.spherePos[2]);
    this.drawObject(this.sphere, mvMatrix, this.sphereHit?chit:cmiss,phongparts,true);  
  } */
  
  // draw center parts
  for (var i=0;i<this.cube3d.centerCount;i++) {
    mvMatrix.makeIdentity();
    this.cube3d.parts[this.cube3d.centerOffset+i].transform(mvMatrix);
    this.drawObject(this.center, mvMatrix, ccenter,attr.partsPhong[this.cube3d.centerOffset+i]);  
  }
  // draw side parts
  for (var i=0;i<cube3d.sideCount;i++) {
      mvMatrix.makeIdentity();
      cube3d.parts[cube3d.sideOffset+i].transform(mvMatrix);
      this.drawObject(this.side, mvMatrix, cparts, attr.partsPhong[this.cube3d.sideOffset+i]);  
      var si=cube3d.getStickerIndexForPartIndex(cube3d.sideOffset+i,0);
      this.drawObject(this.stickers[si], mvMatrix, 
        attr.stickersFillColor[si], 
        attr.stickersPhong[si]);
  }
  // draw edge parts
  for (var i=0;i<this.cube3d.edgeCount;i++) {
      mvMatrix.makeIdentity();
      this.cube3d.parts[this.cube3d.edgeOffset+i].transform(mvMatrix);
      this.drawObject(this.edge, mvMatrix, cparts, attr.partsPhong[this.cube3d.edgeOffset+i]);  
      var si=cube3d.getStickerIndexForPartIndex(cube3d.edgeOffset+i,0);
      this.drawObject(this.stickers[si], mvMatrix, 
        attr.stickersFillColor[si], 
        attr.stickersPhong[si]);
      mvMatrix.rotate(90,-1,0,0); // this should be in rubikscube3d!
      si=cube3d.getStickerIndexForPartIndex(cube3d.edgeOffset+i,1);
      this.drawObject(this.stickers[si], mvMatrix, 
        attr.stickersFillColor[si], 
        attr.stickersPhong[si]);
  }
  // draw corner parts
  for (var i=0;i<this.cube3d.cornerCount;i++) {
      mvMatrix.makeIdentity();
      this.cube3d.parts[this.cube3d.cornerOffset+i].transform(mvMatrix);
      this.drawObject(this.corner, mvMatrix, cparts, attr.partsPhong[this.cube3d.cornerOffset+i],this.forceColorUpdate);  
      var si=cube3d.getStickerIndexForPartIndex(cube3d.cornerOffset+i,1);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si],this.forceColorUpdate);
      mvMatrix.rotate(90,-1,0,0); // this should be in rubikscube3d!
      si=cube3d.getStickerIndexForPartIndex(cube3d.cornerOffset+i,0);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si],this.forceColorUpdate);
      mvMatrix.rotate(90,0,1,0); // this should be in rubikscube3d!
      si=cube3d.getStickerIndexForPartIndex(cube3d.cornerOffset+i,2);
      this.drawObject(this.stickers[si], mvMatrix, attr.stickersFillColor[si], attr.stickersPhong[si],this.forceColorUpdate);
  }
	gl.flush();
	this.forceColorUpdate=false;
}
VirtualRubik.prototype.checkGLError = function(msg) {
  if (this.checkForErrors) {
    var gl=this.gl;
    var error = gl.getError();
    
    if (error != gl.NO_ERROR) {
      var str = "GL Error: " + error+(msg==null?"":" "+msg);
        gl.console.log(str);
        gl.hasError=true;
        //throw str;  => Don't throw error, maybe we can still render something
    }
  }
}
/**
 * Enables/disables autoration.
 *
 * @param newValue A boolean.
 */
VirtualRubik.prototype.setAutorotate = function(newValue) {
  if (newValue != this.autorotate) {
    this.autorotate=newValue;
    if (newValue) {
      var self=this;
      var start=new Date().getTime();
      var anglePerSecond=20;
      var prev=start;
      var startAngle=this.currentAngle;
      var f=function() {
          if (self.autorotate) self.repaint(f);
          var now=new Date().getTime();
          var elapsed=now-start;
          self.currentAngle=(startAngle+elapsed*anglePerSecond/1000)%360;
      };
      this.repaint(f);
    }
  }
}
/**
 * Wobbles the cube.
 *
 * @param newValue A boolean.
 */
VirtualRubik.prototype.wobble = function() {
      var self=this;
      var start=new Date().getTime();
      var duration=500;
      var f=function() {
          var now=new Date().getTime();
          var elapsed=now-start;
          var x=elapsed/duration;
          if (x<1) {
            self.repaint(f);
        //    self.cube3d.attributes.scaleFactor=1+0.3*Math.sin(Math.PI*x);
            self.cube3d.attributes.scaleFactor=1+0.3*Math.pow(1-Math.pow(x*2-1,2),4);
          } else {
            self.cube3d.attributes.scaleFactor=1;
          }
      };
      this.repaint(f);
}
/**
 * Explodes the cube.
 *
 * @param newValue A boolean.
 */
VirtualRubik.prototype.explode = function() {
      var self=this;
      var start=new Date().getTime();
      var duration=2000;
      var f=function() {
          var now=new Date().getTime();
          var elapsed=now-start;
          var x=elapsed/duration;
          if (x<1) {
            self.repaint(f);
            self.cube3d.attributes.explosionFactor=2*Math.pow(1-Math.pow(x*2-1,2),4);
            self.cube3d.updateExplosionFactor();
          } else {
            self.cube3d.attributes.explosionFactor=0;
            self.cube3d.updateExplosionFactor();
          }
      };
      this.repaint(f);
}
/** Prints a log message. */
VirtualRubik.prototype.log = function(msg) {
  this.gl.console.log(msg);
}
/**
 * MouseDown handler for the canvas object.
 *
 * @param newValue A boolean.
 */
VirtualRubik.prototype.onMouseDown = function(event) {
  this.mouseDownX=event.clientX;
  this.mouseDownY=event.clientY;
  this.mousePrevX=event.clientX;
  this.mousePrevY=event.clientY;
  this.isMouseDrag=true;
  var isect=this.mouseIntersectionTest(event);
  this.mouseDownIsect=isect;
  this.isCubeSwipe=isect!=null;
}
/**
 * MouseMove handler for the canvas object.
 *
 * @param newValue A boolean.
 */
VirtualRubik.prototype.onMouseMove = function(event) {
  if (this.isMouseDrag) {
    var x = event.clientX;
    var y = event.clientY;
  
    var dx = (this.mousePrevY - y) * (360 / this.width);
    var dy = (this.mousePrevX - x) * (360 / this.height);

    if (this.isCubeSwipe) {
      var sqrDist=dx*dx+dy*dy;
      if (!this.cube3d.isTwisting && sqrDist>9) { // min swipe-distance: 3 pixels
        var cube3d=this.cube3d;
        var isect=this.mouseIntersectionTest(event);
        if (isect != null && isect.face==this.mouseDownIsect.face) {
          
          var u=Math.floor(isect.uv[0]*3);
          var v=Math.floor(isect.uv[1]*3);
  
          var du=isect.uv[0]-this.mouseDownIsect.uv[0];
          var dv=isect.uv[1]-this.mouseDownIsect.uv[1];
          
          
          var swipeAngle=Math.atan2(dv,du)*180/Math.PI+180;
          var swipeDirection=Math.round((swipeAngle)/90)%4;
  
          var face=isect.face;
          var axis=cube3d.boxSwipeToAxisMap[face][swipeDirection];
          var layerMask=cube3d.boxSwipeToLayerMap[face][u][v][swipeDirection];
          var angle=cube3d.boxSwipeToAngleMap[face][swipeDirection];
          //this.log('virtualrubik face,u,v,s:'+face+' '+u+' '+v+' '+swipeDirection);
          //this.log('virtualrubik ax,l,an   :'+axis+' '+layerMask+' '+angle);
          if (event.shiftKey || event.metaKey) angle=2*angle;
          this.cube.transform(axis,layerMask,angle);
          
          this.isCubeSwipe=false;
          this.isMouseDrag=false;
        }
      }
    } else {
      var rm=new J3DIMatrix4();
      rm.rotate(dy, 0, 1, 0);
      rm.rotate(dx, 1, 0, 0);
      rm.multiply(this.rotationMatrix);
      this.rotationMatrix.load(rm);
      this.repaint();
    }
  
    this.mousePrevX=event.clientX;
    this.mousePrevY=event.clientY;
  }
}
/**
 * MouseOut handler for the canvas object.
 *
 * @param newValue A boolean.
 */
VirtualRubik.prototype.onMouseOut = function(event) {
  this.isMouseDrag=false;
}


/**
 * MouseUp handler for the canvas object.
 *
 * @param newValue A boolean.
 */
VirtualRubik.prototype.onMouseUp = function(event) {
  this.isMouseDrag=false;
  
    
  if (this.mouseDownX!=event.clientX || this.mouseDownY!=event.clientY) {
    // the mouse has been moved between mouse down and mouse up
    return;
  }
  
  var cube3d=this.cube3d;
  if (cube3d.isTwisting) {
    return;
  }
  
  var isect=this.mouseIntersectionTest(event);
  
  if (isect==null) {
    this.sphereHit=false;
  } else {
    this.spherePos.load(isect.point);
    this.sphereHit=true;
    //this.log('spherePos '+this.spherePos);
    var face=isect.face;
    var u=Math.floor(isect.uv[0]*3);
    var v=Math.floor(isect.uv[1]*3);
    //this.log('face,u,v:'+face+','+u+','+v+',');
    var axis=cube3d.boxClickToAxisMap[face][u][v];
    var layerMask=cube3d.boxClickToLayerMap[face][u][v];
    var angle=cube3d.boxClickToAngleMap[face][u][v];
    if (event.altKey || event.ctrlKey) angle=-angle;
    if (event.shiftKey || event.metaKey) angle=2*angle;
    
    this.cube.transform(axis,layerMask,angle);
  }
  
  this.draw();
}

/**
 * Hit test for mouse events.
 */
VirtualRubik.prototype.mouseIntersectionTest = function(event) {
  // point in raster coordinates
  var rect = this.canvas.getBoundingClientRect();  
  var pRaster=new J3DIVector3(event.clientX - rect.left, event.clientY - rect.top, 0);
  
  // point in camera coordinates
  var pCamera=new J3DIVector3((pRaster[0] - this.width/2)/this.width*2, (pRaster[1] - this.height/2)/-this.height*2, 0);
  
  // point in world coordinates
  var pWorld = new J3DIVector3(pCamera);
  pWorld.multVecMatrix(this.rasterToCameraMatrix);

  // Inverse model-world matrix
  var wmMatrix = new J3DIMatrix4(this.world.matrix);
  wmMatrix.invert();
  
  // point in model coordinates
  var pModel =  new J3DIVector3(pWorld);  
  pModel.multVecMatrix(wmMatrix);
  
  // camera ray in model coordinates
  var ray={point:new J3DIVector3(), dir:new J3DIVector3()};
  ray.point.load(this.camPos);
  ray.point.multVecMatrix(wmMatrix);
  ray.dir.load(pModel);
  ray.dir.subtract(ray.point);
  ray.dir.normalize();
  
  var box={pMin:new J3DIVector3(-this.cubeSize/2,-this.cubeSize/2,-this.cubeSize/2),pMax:new J3DIVector3(this.cubeSize/2,this.cubeSize/2,this.cubeSize/2)};
  return this.intersectBox(ray, box);
}
/** Intersection test for a ray and a plane. 
 * The ray must be given as an object with {point:J3DIVector3, dir:J3DIVector3}.
 * The plane must be given as an object with {point:J3DIVector3, normal:J3DIVector3}.
 * -> dir and normal must be normalized vectors.
 *
 * Returns the intersection data: hit-point 3d coordinates and in u,v coordinates as
 *                                         {point:J3DIVector3, uv:J3DIVector3, t:float}
 */
VirtualRubik.prototype.intersectPlane = function(ray, plane) {
  // solve for t:
  // t = (ray.p - plane.p) * plane.n / ray.d * plane.n
  var divisor = ray.dir.dot(plane.normal);
  if (Math.abs(divisor) < 1e-20) {
    return null;
  }
  this.log("planeNormal:"+plane.normal);
  this.log(divisor+" divi:"+ new J3DIVector3(plane.normal).divide(divisor));
  var thit = -( 
    (new J3DIVector3(ray.point).subtract(plane.point)).dot( new J3DIVector3(plane.normal).divide(divisor) )
    );
  
  var phit = new J3DIVector3(ray.point).add(new J3DIVector3(ray.dir).multiply(t));
  
  var uv3d = new J3DIVector3(plane.point).subtract(phit);
  
  // find parametric representation of plane hit
  if (Math.abs(plane.normal[0])>Math.abs(plane.normal[1]) && Math.abs(plane.normal[0])>Math.abs(plane.normal[2])) {
     // Y-Z plane
     var uv=new J3DIVector3(uv3d[1],uv3d[2],0);   
  } else if (Math.abs(plane.normal[1])>Math.abs(plane.normal[0]) &&Math.abs(plane.normal[1])>Math.abs(plane.normal[2])) {
     // X-Z plane
     var uv=new J3DIVector3(uv3d[0],uv3d[2],0);   
  } else {
     // X-Y plane
     var uv=new J3DIVector3(uv3d[0],uv3d[1],0);   
  }

  return {point:phit,uv:uv,t:t}  
}
/** Intersection test for a ray and an axis-oriented box. 
 * The ray must be given as an object with {point:J3DIVector3, dir:J3DIVector3}.
 * The box must be given as an object with {pMin:J3DIVector3, pMax:J3DIVector3}.
 * -> dir must be a normalized vector.
 * -> All coordinates in pMin must be smaller than in pMax
 *
 * Returns the intersection data: hit-point 3d coordinates and in u,v coordinates as
 *                                         {point:J3DIVector3, uv:J3DIVector3, t:float, face:int}
 */
VirtualRubik.prototype.intersectBox = function(ray, box) {
  var pMin=box.pMin; var pMax=box.pMax;
  var t0=0; var t1=Number.MAX_VALUE;
  var face0 = -1;  var face1 = -1;
  for (var i=0;i<3;i++) {
    // update interval for i-th bounding box slab
    var invRayDir = 1.0/ray.dir[i];
    var tNear = (pMin[i] - ray.point[i]) * invRayDir;
    var tFar = (pMax[i] - ray.point[i]) * invRayDir;
    
    // update parametric interval from slab intersection
    var faceSwap=0;
    if (tNear > tFar) { var swap=tNear; tNear=tFar; tFar = swap; faceSwap=3; }
    if (tNear > t0) { t0=tNear; face0=i+faceSwap; }
    if (tFar < t1) { t1=tFar; face1=i+3-faceSwap; }
    if (t0>t1) return null;
  }
  var thit;
  var facehit;
  if (t0<t1 && face0!=-1 || face1==-1) {
    thit=t0;
    facehit=face0;
  } else {
    thit=t1;
    facehit=face1;
  }

  var phit = new J3DIVector3(ray.point).add(new J3DIVector3(ray.dir).multiply(thit));
  // find parametric representation of box hit
  var u,v;
  switch (facehit) {
    case 0: {// left
        var dpdu = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]) );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[2]-pMin[2])*dpdu[2];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    case 3: {// right
        var dpdu = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]) );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[2]-pMin[2])*dpdu[2];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    case 1: {// down
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0);
        var dpdv = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]));
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[2]-pMin[2])*dpdv[2];
        break;
    }
    case 4: {// up
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0);
        var dpdv = new J3DIVector3(0, 0, 1/(pMax[2] - pMin[2]));
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[2]-pMin[2])*dpdv[2];
        break;
    }
    case 2: {// front
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0 );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    case 5: {// back
        var dpdu = new J3DIVector3(1/(pMax[0] - pMin[0]), 0, 0 );
        var dpdv = new J3DIVector3(0, 1/(pMax[1] - pMin[1]), 0);
        u = (phit[0]-pMin[0])*dpdu[0];
        v = (phit[1]-pMin[1])*dpdv[1];
        break;
    }
    default:
      alert("ERROR, illegal face number:"+facehit);
  }
  
  return {point:phit, uv:new J3DIVector3(u,v,0), t:thit, face:facehit}
}

VirtualRubik.prototype.reset = function() {
  this.currentAngle=0;
  this.xRot=this.cube3d.attributes.xRot;
  this.yRot=this.cube3d.attributes.yRot;
  
  this.rotationMatrix.makeIdentity();
  this.cube.reset();
}
VirtualRubik.prototype.scramble = function() {
  this.cube.scramble();
}
VirtualRubik.prototype.stateChanged = function(event) {
  this.repaint();
}
VirtualRubik.prototype.getCubeAttributes = function() {
  return this.cube3d.attributes;
}
VirtualRubik.prototype.setCubeAttributes = function(attr) {
  this.cube3d.attributes=attr;
  this.forceColorUpdate=true;
  
  var gl=this.gl;  
  gl.clearColor(attr.backgroundColor[0]/255.0, attr.backgroundColor[1]/255.0, 
                attr.backgroundColor[2]/255.0, attr.backgroundColor[3]/255.0);
}

