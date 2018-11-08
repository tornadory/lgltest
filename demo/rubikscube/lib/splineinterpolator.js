/*
 * @(#)splineinterpolator.js  1.0  2011-06-24
 *
 * Copyright (c) 2011 Werner Randelshofer, Immensee, Switzerland.
 * All rights reserved.
 *
 * You are free
 *    to Share - to copy, distribute and transmit the work
 *    to Remix - to adapt the work
 * Under the following conditions:
 *    Attribution - you must attribute the work to the author
 * For detailed license terms see Creative Commons Attribution 3.0.
 * http://creativecommons.org/licenses/by/3.0/deed.en
 */

 
/** Constructor.
 *
 * @param x1 The x coordinate for the first bezier control point.
 * @param y1 The y coordinate for the first bezier control point.
 * @param x2 The x coordinate for the second bezier control point.
 * @param y2 The x coordinate for the second bezier control point.
 */
SplineInterpolator=function(x1,y1,x2,y2) {
  this.x1=x1;
  this.y1=y1;
  this.x2=x2;
  this.y2=y2;
}

    /**
     * Evaluates the spline function, and clamps the result value between 0
     * and 1.
     *
     * @param t A time value between 0 and 1.
     */
SplineInterpolator.prototype.getFraction=function(t) {
    var invT = (1 - t);
    var b1 = 3 * t * (invT * invT);
    var b2 = 3 * (t * t) * invT;
    var b3 = t * t * t;
    var result = (b1 * this.y1) + (b2 * this.y2) + b3;
    return Math.min(1, Math.max(0, result));
}




