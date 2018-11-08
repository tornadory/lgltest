/*
 * @(#)cubeattributes.js  1.0  2011-06-23
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

/** Constructor
 * Holds the attributes of a Rubik's Cube like puzzle.
 */
CubeAttributes=function(partCount, stickerCount, stickerCountPerFace) {
    this.partsVisible = new Array(partCount);//boolean
    this.partsFillColor = new Array(partCount);//[r,g,b,a]
    this.partsPhong = new Array(partCount);//[ambient, diffuse, specular, shininess]
    this.stickersVisible = new Array(stickerCount);//boolean
    this.stickersFillColor = new Array(stickerCount);//[r,g,b,a]
    this.stickersPhong = new Array(stickerCount);//[ambient, diffuse, specular, shininess]
    this.stickerCountPerFace = stickerCountPerFace;//integer
    this.partExplosion = new Array(partCount);//float
    this.stickerExplosion = new Array(stickerCount);//float
    this.xRot=-30;
    this.yRot=-40;
    this.scaleFactor=1;
    this.explosionFactor=0;
    this.twistDuration=500;
    this.backgroundColor=[0, 0, 0, 0]; //[r,g,b,a]
    
    for (var i=0;i<partCount;i++) {
      this.partsVisible[i]=true;
      this.stickersVisible[i]=true;
      this.partExplosion[i]=0;
    }
}

