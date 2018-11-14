/*
 * @(#)cube3d.js  1.0  2011-06-22
 *
 * Copyright (c) 2011 Werner Randelshofer, Immensee, Switzerland.
 * All rights reserved.
 *
 * You are free
 *    to Share - to copy, distribute and transmit the work
 *    to Remix - to adapt the work
 * Under the following conditions:
 *    Attribution - you must attribute the work to the author
 *    Non-Commercial - you may not use this work for commercial purposes
 * For detailed license terms see Creative Commons Attribution Non-Commercial 3.0.
 * http://creativecommons.org/licenses/by-nc/3.0/
 */

 
/** Change event. */
ChangeEvent = function(source) {
  this.source=source;
}
 
/** Constructor
 * Base class for classes which implement the geometry of a 
 * Rubik's Cube like puzzle.
 */
Cube3D=function() {
  this.Cube3DInit();
}
Cube3D.prototype=new Node3D();

Cube3D.prototype.cube=null;
Cube3D.prototype.parts=null;
Cube3D.prototype.explosionTransforms=null;
Cube3D.prototype.rotationTransforms=null;
Cube3D.prototype.identityVertexMatrix=null;
Cube3D.prototype.cornerCount=0;
Cube3D.prototype.edgeCount=0;
Cube3D.prototype.sideCount=0;
Cube3D.prototype.centerCount=0;
Cube3D.prototype.partCount=0;
Cube3D.prototype.cornerOffset=0;
Cube3D.prototype.edgeOffset=0;
Cube3D.prototype.sideOffset=0;
Cube3D.prototype.centerOffset=0;
Cube3D.prototype.repainter=null;
Cube3D.prototype.isTwisting=false;

Cube3D.prototype.Cube3DInit=function() {
  this.Node3DInit();
  this.parts=[];
  this.explosionTransforms=[];
  this.rotationTransforms=[];
  this.locationTransforms=[];
  this.identityVertexMatrix=[];
  this.listenerList=[];
  this.isCubeValid=false;
  this.updateTwistRotation=new J3DIMatrix4();
  this.updateTwistOrientation=new J3DIMatrix4();
}


Cube3D.prototype.cubeChanged=function(evt) {
    this.updateCube();
}
Cube3D.prototype.cubeTwisted=function(evt) {
    this.updateCube();
}

Cube3D.prototype.updateCube=function() {
    //this.stopAnimation();
    this.isCubeValid = false;
    this.validateCube();
    this.fireStateChanged();
}

Cube3D.prototype.validateCube=function() {
    if (!this.isCubeValid) {
        this.isCubeValid = true;
        var model = this.cube;
        var partIndices = new Array(this.partCount);
        var locations = new Array(this.partCount);
        var orientations = new Array(this.partCount);
         {
            for (var i = 0; i < this.partCount; i++) {
                locations[i] = i;
                partIndices[i] = model.getPartAt(locations[i]);
                orientations[i] = model.getPartOrientation(partIndices[i]);
            }
        }
        this.validateTwist(partIndices, locations, orientations, this.partCount, 0, 0, 1);
    }
}

   // protected abstract void validateTwist(int[] partIndices, int[] locations, int[] orientations, int length, int axis, int angle, float alpha);

/**
 * Adds a listener for ChangeEvent's.
 *
 * A listener must have a stateChanged() function.
 */
Cube3D.prototype.addChangeListener=function(l) {
  this.listenerList[this.listenerList.length]=l;
}

/**
 * Removes a listener for CubeEvent's.
 */
Cube3D.prototype.removeChangeListener=function(l) {
  for (var i=0;i<this.listenerList.length;i++) {
    if (this.listenerList[i]==l) {
      this.listenerList=this.listenerList.slice(0,i)+this.listenerList.slice(i+1);
      break;
    }
  }
}

/**
 * Notify all listeners that have registered varerest for
 * notification on this event type.
 */
Cube3D.prototype.fireStateChanged=function() {
  var event=new ChangeEvent(this);
    // Guaranteed to return a non-null array
    var listeners = this.listenerList;
    // Process the listeners last to first, notifying
    // those that are varerested in this event
    for (var i = listeners.length - 1; i >= 0; i -= 1) {
            listeners[i].stateChanged(event);
    }
}


