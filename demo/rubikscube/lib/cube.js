/*
 * @(#)cube.js  1.0  2011-06-22
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

/**
 * Base class for classes which implement a Rubik's Cube like puzzle.
 * <p>
 * This class provides support for event listeners, and it defines the variables 
 * which hold the location and orientation of the cube parts.
 * <p>
 * <b>Faces and Axes</b>
 * <p>
 * This class defines the location of the six faces of the cube, as shown below:
 * <pre>
 *             +---+---+---+
 *             |           |
 *             |           |
 *             |    1 u    |
 *             |           |
 *             |           |
 * +---+---+---+---+---+---+---+---+---+---+---+---+
 * |           |           |           |           |
 * |           |           |           |           |
 * |    3 l    |    2 f    |    0 r    |    5 b    |
 * |           |           |           |           |
 * |           |           |           |           |
 * +---+---+---+---+---+---+---+---+---+---+---+---+
 *             |           |
 *             |           |
 *             |    4 d    |
 *             |           |
 *             |           |
 *             +---+---+---+
 * </pre>
 * The numbers represent the ID's of the faces: 0=right, 1=up, 2=front, 3=left, 
 * 4=down, 5=back.
 * <p>
 * The face ID's are symmetric along the axis from the right-up-front corner 
 * through the left-down-back corner of the cube.
 * <p>
 * <ul>
 * <li>The x-axis passes from the center of face 3 through the center of face 0.
 * </li>
 * <li>The y-axis passes from the center of face 4 through the center of face 1.
 * </li>
 * <li>The z-axis passes from the center of face 5 through the center of face 2.
 * </li>
 * </ul>
 * <p>
 * <b>Corner parts</b>
 * <p>
 * This class defines the initial locations and orientations of the corner parts
 * as shown below:
 * <pre>
 *             +---+---+---+
 *          ulb|4.0|   |2.0|ubr
 *             +---     ---+
 *             |     u     |
 *             +---     ---+
 *          ufl|6.0|   |0.0|urf
 * +---+---+---+---+---+---+---+---+---+---+---+---+
 * |4.1|   |6.2|6.1|   |0.2|0.1|   |2.2|2.1|   |4.2|
 * +---     ---+---     ---+---     ---+---     ---+
 * |     l     |     f     |     r     |     b     |
 * +---     ---+---     ---+---     ---+---     ---+
 * |5.2|   |7.1|7.2|   |1.1|1.2|   |3.1|3.2|   |5.1|
 * +---+---+---+---+---+---+---+---+---+---+---+---+
 *          dlf|7.0|   |1.0|dfr
 *             +---     ---+
 *             |     d     |
 *             +---     ---+
 *          dbl|5.0|   |3.0|drb
 *             +---+---+---+
 * </pre>
 * <p>
 * The numbers before the dots represents the ID's of the corner parts. There are
 * 12 corner parts with ID's ranging from 0 through 11.  Since a corner part is
 * visible on three faces of the cube, the ID of each part is shown 3 times.
 * <p>
 * The numbers after the dots indicate the orientations of the corner parts.
 * Each corner part can have three different orientations: 0=initial, 
 * 1=tilted counterclockwise and 2=titled clockwise.
 * <p>
 * The orientations of the corner parts are symmetric along the axis from the 
 * right-up-front corner through the left-down-back corner of the cube.
 * <pre>
 *       +-----------+              +-----------+
 *      /4.0/   /2.0/|             /1.0/   /3.0/|
 *     +---     ---+.2            +---     ---+.2
 *    /     u     /|/|           /     d     /|/| 
 *   +---     ---+   +          +---     ---+   +
 *  /6.0/   /0.0/|  /|         /7.0/   /5.0/|  /|
 * +---+---+---*.1  .1        +---+---+---*.1  .1 
 * | .1|   | .2|/ r|/         | .1|   | .2|/ b|/
 * +---     ---+   +          +---     ---+   +
 * |     f     |/|/           |     l     |/|/
 * +---     ---+.2            +---     ---+.2
 * | .2|   | .1|/             |.2 |   | .1|/ 
 * +---+---+---+              +---+---+---+
 * </pre>
 * <p>
 * Here is an alternative representation of the initial locations and 
 * orientations of the corner parts as a list:
 * <ul>
 * <li>0: urf</li><li>1: dfr</li><li>2: ubr</li><li>3: drb</li>
 * <li>4: ulb</li><li>5: dbl</li><li>6: ufl</li><li>7: dlf</li>
 * </ul>
 * <p>
 * <b>Edge parts</b>
 * <p>
 * This class defines the orientations of the edge parts and the location
 * of the first 12 edges.
 * (The locations of additional edge parts are defined by subclasses):
 * <pre>
 *               +----+---+----+
 *               |    |3.1|    |
 *               |    +---+    |
 *               +---+     +---+
 *             ul|6.0|  u  |0.0|ur
 *               +---+     +---+
 *               |    +---+    |
 *               |    |9.1|    |
 * +----+---+----+----+---+----+----+---+----+----+---+----+
 * |    |6.1|    |    |9.0|fu  |    |0.1|    |    |3.0|bu  |
 * |    +---+    |    +---+    |    +---+    |    +---+    |
 * +---+     +---+---+     +---+---+     +---+---+     +---+
 * |7.0|  l  10.0|10.1  f  |1.1|1.0|  r  |4.0|4.1|  b  |7.1|
 * +---+     +---+---+     +---+---+     +---+---+     +---+
 * |lb  +---+  lf|    +---+    |rf  +---+  rb|    +---+    |
 * |    |8.1|    |    11.0|fd  |    |2.1|    |    |5.0|bd  |
 * +----+---+----+----+---+----+----+---+----+----+---+----+
 *               |    11.1|    |
 *               |    +---+    |
 *               +---+     +---+
 *             dl|8.0|  d  |2.0|dr
 *               +---+     +---+
 *               |    +---+    |
 *               |    |5.1|    |
 *               +----+---+----+
 * </pre>
 * The numbers after the dots indicate the orientations of the edge parts.
 * Each edge part can have two different orientations: 0=initial, 1=flipped.
 * <pre>
 *               +----+---+----+
 *               |    |3.1|    |
 *               |    +---+    |
 *               +---+     +---+
 *             ul|6.0|  u  |0.0|ur
 *               +---+     +---+
 *               |    +---+    |
 *               |    |9.1|    |
 * +----+---+----+----+---+----+----+---+----+----+---+----+
 * |    |6.1|    |    |9.0|fu  |    |0.1|    |    |3.0|bu  |
 * |    +---+    |    +---+    |    +---+    |    +---+    |
 * +---+     +---+---+     +---+---+     +---+---+     +---+
 * |7.0|  l  10.0|10.1  f  |1.1|1.0|  r  |4.0|4.1|  b  |7.1|
 * +---+     +---+---+     +---+---+     +---+---+     +---+
 * |lb  +---+  lf|    +---+    |rf  +---+  rb|    +---+    |
 * |    |8.1|    |    11.0|fd  |    |2.1|    |    |5.0|bd  |
 * +----+---+----+----+---+----+----+---+----+----+---+----+
 *               |    11.1|    |
 *               |    +---+    |
 *               +---+     +---+
 *             dl|8.0|  d  |2.0|dr
 *               +---+     +---+
 *               |    +---+    |
 *               |    |5.1|    |
 *               +----+---+----+
 * </pre>
 * <p>
 * The orientations of the edge parts are symmetric along the axis from the 
 * front-up edge through the back-down edge of the cube.
 * <pre>
 *       +-----------+      +-----------+
 *      /   / 3 /   /|      |\   \11 \   \
 *     +--- --- ---+ +      + +--- --- ---+
 *    /6.0/ u /0.0/|/|      |\|\8.0\ d \2.0\
 *   +--- --- ---+  4.0   10.0  +--- --- ---+
 *  /   / 9 /   /| |/|      |\ \|\   \ 5 \   \
 * +---+-*-+---+  r  +      +  l  +---+-*-+---+
 * |   |9.0|   |/| |/        \|\ \|   |5.0|   |
 * +--- --- ---+  2.1        6.1  +--- --- ---+
 * |10 | f | 1 |/|/            \|\| 7 | b | 4 |
 * +--- --- ---+ +              + +--- --- ---+
 * |   11.0|   |/                \|   |3.0|   |
 * +---+---+---+                  +---+---+---+
 * </pre>
 * <p>
 * Here is an alternative representation of the initial locations and 
 * orientations of the edge parts as a list:
 * <ul>
 * <li> 0: ur</li><li> 1: rf</li><li> 2: dr</li> 
 * <li> 3: bu</li><li> 4: rb</li><li> 5: bd</li> 
 * <li> 6: ul</li><li> 7: lb</li><li> 8: dl</li> 
 * <li> 9: fu</li><li>10: lf</li><li>11: fd</li>
 * </ul>
 * <p>
 * <b>Side parts</b>
 * <p>
 * This class defines the orientations of the side parts as shown below
 * (The locations of the side parts are defined by subclasses):
 * <pre>
 *             +-----------+
 *             |     .1    |
 *             |   +---+ u |
 *             | .0| 1 |.2 |
 *             |   +---+   |
 *             |     .3    |
 * +-----------+-----------+-----------+-----------+
 * |     .0    |     .2    |     .3    |    .1     |
 * |   +---+ l |   +---+ f |   +---+ r |   +---+ b |
 * | .3| 3 |.1 | .1| 2 |.3 | .2| 0 |.0 | .0| 5 |.2 |
 * |   +---+   |   +---+   |   +---+   |   +---+   |
 * |     .2    |    .0     |     .1    |     .3    |
 * +-----------+-----------+-----------+-----------+
 *             |     .0    |
 *             |   +---+ d |
 *             | .3| 4 |.1 |
 *             |   +---+   |
 *             |     .2    |
 *             +-----------+
 * </pre>
 * The numbers after the dots indicate the orientations of the side parts.
 * Each side part can have four different orientations: 0=initial, 
 * 1=tilted clockwise, 2=flipped, 3=tilted counterclockwise.
 * <p>
 * The orientations of the side parts are symmetric along the axis from the 
 * right-up-front corner through the left-down-back corner of the cube.
 * <pre>
 *       +-----------+              +-----------+
 *      /     .1    /|             /     .1    /|
 *     +    ---    +r+            +    ---    +b+
 *    / .0/ 1 /.2 /  |           / .0/ 4 /.2 /  | 
 *   +    ---    +.3 +          +    ---    +.3 +
 *  / u   .3    / /|.0         / d   .3    / /|.0
 * +---+---+---*  0  +        +---+---+---*  5  + 
 * | f   .2    .2|/ /         | l   .2    .2|/ /
 * +    ---    + .1+          +    ---    + .1+
 * | .1| 2 |.3 |  /           | .1| 3 |.3 |  /
 * +    ---    + +            +    ---    + +
 * |     .0    |/             |     .0    |/ 
 * +---+---+---+              +---+---+---+
 * </pre>
 * <p>
 * Here is an alternative representation of the initial locations and 
 * orientations of the side parts as a list:
 * <ul>
 * <li>0: r</li> <li>1: u</li> <li>2: f</li> 
 * <li>3: l</li> <li>4: d</li> <li>5: b</li> 
 * </ul>
 */

/** Cube event. */
CubeEvent = function(source, axis, layerMask, angle) {
  this.source=source;
  this.axis=axis;
  this.angle=angle;
  this.layerMask=layerMask;
}

    /**
     * Returns a list of part ID's, for each part location which is affected
     * if a cube is transformed using the axis, layerMaska and angle
     * parameters of this event. 
     */
CubeEvent.prototype.getAffectedLocations=function() {
    var c1 = this.source.clone();
    c1.reset();
    c1.transform(this.axis, this.layerMask, this.angle);
    return c1.getUnsolvedParts();
}
 
/**
 * Creates a new instance. init() must be called immediately afterwards!!
 * @param this.layerCount number of layers on the x, y and z axis.
 *
 * @throws IllegalArgumentException if the layour count is smaller than 2.
 */
Cube = function()  {
  this.init();
}

Cube.prototype.init = function(layerCount)  {
        if (layerCount < 2) {
            throw new IllegalArgumentException("this.layerCount: " + this.layerCount + " < 2");
        }
        this.layerCount = layerCount;

        this.cornerLoc = new Array(8);
        this.cornerOrient = new Array(8);
        this.listenerList=[];

        if (this.layerCount > 2) {
            this.edgeLoc = new Array((this.layerCount - 2) * 12);
            this.edgeOrient = new Array(this.edgeLoc.length);
            this.sideLoc = new Array((this.layerCount - 2) * (this.layerCount - 2) * 6);
            this.sideOrient = new Array(this.sideLoc.length);
        } else {
            this.edgeLoc = this.edgeOrient = this.sideLoc = this.sideOrient = new Array(0);
        }

        this.reset();
    }


    /** Identifier for the corner part type. */
Cube.prototype.CORNER_PART = 0;
    /** Identifier for the edge part type. */
Cube.prototype.EDGE_PART = 1;
    /** Identifier for the side part type. */
Cube.prototype.SIDE_PART = 2;
    /** Identifier for the center part type. */
Cube.prototype.CENTER_PART = 3;
    /**
     * Holds the number of corner parts, which is 8.
     */
Cube.prototype.NUMBER_OF_CORNER_PARTS = 8;
    /**
     * Listener support.
     */
Cube.prototype.listenerList = [];
    /**
     * Set this to true if listeners shall not be notified
     * about state changes.
     */
Cube.prototype.quiet=false;
    /**
     * Number of layers on the x, y and z axis.
     */
Cube.prototype.layerCount;
    /**
     * This array holds the locations of the corner parts.
     * <p>
     * The value of an array element represents the ID of a corner part. The 
     * value must be element of {0..7}. 
     * <p>
     * Each array element has a unique value.
     * <p>
     * Initially each corner part with ID i is located at this.cornerLoc[i].
     */
Cube.prototype.cornerLoc=[];
    /**
     * This array holds the orientations of the corner parts.
     * <p>
     * The value of an array element represents the orientation of a corner part.
     * The value must be element of {0, 1, 2}.
     * <ul>
     * <li>0 = initial orientation</li>
     * <li>1 = tilted counterclockwise</li>
     * <li>2 = tilted clockwise</li>
     * </ul>
     * <p>
     * Multiple array elements can have the same value.
     * <p>
     * Initially each corner part is oriented at orientation 0.
     */
Cube.prototype.cornerOrient=[];
    /**
     * This array holds the locations of the edge parts.
     * <p>
     * The value of an array element represents the ID of an edge part. The 
     * value must be element of {0..(n-1)}. Whereas n is the number of edge
     * parts.
     * <p>
     * Each array element has a unique value.
     * <p>
     * Initially each edge part with ID i is located at this.edgeLoc[i].
     */
Cube.prototype.edgeLoc=[];
    /**
     * This array holds the orientations of the edge parts.
     * <p>
     * The value of an array element represents the orientation of an edge part.
     * The value must be element of {0, 1}.
     * <ul>
     * <li>0 = initial orientation</li>
     * <li>1 = flipped</li>
     * </ul>
     * <p>
     * Multiple array elements can have the same value.
     * <p>
     * Initially each edge part is oriented at orientation 0.
     */
Cube.prototype.edgeOrient=[];
    /**
     * This array holds the locations of the side parts.
     * <p>
     * The value of an array element represents the ID of a side part. The 
     * value must be element of {0..(n-1)}. Whereas n is the number of side
     * parts.
     * <p>
     * Each array element has a unique value.
     * <p>
     * Initially each side part with ID i is located at this.sideLoc[i].
     */
Cube.prototype.sideLoc=[];
    /**
     * This array holds the orientations of the side parts.
     * <p>
     * The value of an array element represents the orientation of a side part.
     * The value must be element of {0, 1, 2, 4}.
     * <ul>
     * <li>0 = initial orientation</li>
     * <li>1 = tilted counterclockwise</li>
     * <li>2 = flipped</li>
     * <li>3 = tilted clockwise</li>
     * </ul>
     * <p>
     * Multiple array elements can have the same value.
     * <p>
     * Initially each side part is oriented at orientation 0.
     */
Cube.prototype.sideOrient=[];

    /** Transformation types of the cube. */
Cube.prototype.IDENTITY_TRANSFORM=0;
Cube.prototype.SINGLE_AXIS_TRANSFORM=1;
Cube.prototype.GENERAL_TRANSFORM=2;
Cube.prototype.UNKNOWN_TRANSFORM=3;
    /**
     * This field caches the current transformation type of the cube.
     */
Cube.prototype.transformType = 0;//=this.IDENTITY_TRANSFORM;
    /** If this.transformType is SINGLE_AXIS_TRANSFORM, this field holds the
     * transformation axis. Otherwise, the value of this field is undefined.
     */
Cube.prototype.transformAxis=0;
    /** If this.transformType is SINGLE_AXIS_TRANSFORM, this field holds the
     * transformation angle. Otherwise, the value of this field is undefined.
     */
Cube.prototype.transformAngle=0;
    /** If this.transformType is SINGLE_AXIS_TRANSFORM, this field holds the
     * transformation mask. Otherwise, the value of this field is undefined.
     */
Cube.prototype.transformMask=0;
    /**
     * This array maps corner parts to the six faces of the cube.
     * <p>
     * The first dimension of the array represents the locations, the
     * second dimension the orientations. The values represent the 6 faces:
     * 0=right, 1=up, 2=front, 3=left, 4=down, 5=back.
     */
Cube.prototype.CORNER_TO_FACE_MAP = [
        [1, 0, 2], // urf
        [4, 2, 0], // dfr
        [1, 5, 0], // ubr
        [4, 0, 5], // drb
        [1, 3, 5], // ulb
        [4, 5, 3], // dbl
        [1, 2, 3], // ufl
        [4, 3, 2], // dlf
    ];
    /**
     * This array maps edge parts to the three axes of the cube.
     * <p>
     * The index represents the ID of an edge.
     * The values represent the 3 axes 0=x, 1=y and 2=z.
     */
Cube.prototype.EDGE_TO_AXIS_MAP = [
        2, // edge 0
        1, //      1
        2, //      2
        0, //      3
        1,
        0,
        2,
        1,
        2,
        0,
        1,
        0
];
    /**
     * This array maps edge parts to rotation angles over the three axes of the
     * cube.
     * <p>
     * The index for the first dimension represents the location,
     * the index for the second dimension the orientation.
     * The value 1 represents clockwise angle, -1 represents 
     * counterclockwise angle.
     */
Cube.prototype.EDGE_TO_ANGLE_MAP = [
        [1, -1], // edge 0 ur
        [1, -1], //      1 rf
        [-1, 1], //      2 dr
        [-1, 1], //      3 bu
        [-1, 1], //      4 rb
        [1, -1], //      5 bd
        [-1, 1], //      6 ul
        [1, -1], //      7 lb
        [1, -1], //      8 dl
        [1, -1], //      9 fu
        [-1, 1], //     10 lf
        [-1, 1] //     11 fd
    ];
    /**
     * This array maps edge parts to the 6 faces of the cube.
     * <p>
     * The index for the first dimension represents the location,
     * the index for the second dimension the orientation.
     * The values represent the 6 faces:
     * 0=right, 1=up, 2=front, 3=left, 4=down, 5=back.
     */
Cube.prototype.EDGE_TO_FACE_MAP = [
        [1, 0], // edge 0 ur
        [0, 2], //      1 rf
        [4, 0], //      2 dr
        [5, 1], //      3 bu
        [0, 5], //      4 rb
        [5, 0], //      5 bd
        [1, 3], //      6 ul
        [3, 5], //      7 lb
        [4, 3], //      8 dl
        [2, 1], //      9 fu
        [3, 2], //     10 lf
        [2, 4] //     11 fd
    ];
    /**
     * This is used for mapping center part orientations
     * to the 6 sides of the cube.
     * <p>
     * The index for the first dimension represents the location,
     * the index for the second dimension the orientation.
     * The values represent the 6 sides.
     */
Cube.prototype.CENTER_TO_SIDE_MAP = [
        //[f, r, d, b, l, u ]
        [0, 1, 2, 3, 4, 5] // 0: Front at front, Right at right
        , [5, 1, 0, 2, 4, 3]// 1: Bottom, Right, CR
        , [3, 1, 5, 0, 4, 2]// 2: Back, Right, CR2
        , [2, 1, 3, 5, 4, 0]// 3: Top, Right, CR'
        , [4, 0, 2, 1, 3, 5]// 4: Right, Back, CU
        , [3, 4, 2, 0, 1, 5]// 5: Back, Left, CU2
        , [1, 3, 2, 4, 0, 5] // 6: // Left, Front, CU'
        , [0, 2, 4, 3, 5, 1] // 7: // Front, Top, CF
        , [0, 4, 5, 3, 1, 2] // 8: // Front, Left, CF2
        , [0, 5, 1, 3, 2, 4] // 9: // Front, Bottom, CF'
        , [5, 0, 4, 2, 3, 1] // 10: // Right, Top, CR CU
        , [5, 4, 3, 2, 1, 0] // 11: // Top, Left, CR CU2
        , [5, 3, 1, 2, 0, 4] // 12: // Left, Down, CR CU'
        , [1, 0, 5, 4, 3, 2] // 13: // Right, Front, CR2 CU
        , [4, 3, 5, 1, 0, 2] // 14: // Left, Back, CR2 CU'
        , [2, 0, 1, 5, 3, 4] // 15: // Right, Down, CR' CU
        , [2, 4, 0, 5, 1, 3] // 16: // Down, Left, CR' CU2
        , [2, 3, 4, 5, 0, 1] // 17: // Left, Up, CR' CU'
        , [1, 2, 0, 4, 5, 3] // 18: // Down, Up, CR CF
        , [4, 5, 0, 1, 2, 3] // 19: // Down, Back, CR CF'
        , [3, 2, 1, 0, 5, 4] // 20: // Back, Down, CR2 CF
        , [3, 5, 4, 0, 2, 1] // 21: // Back, Up, CR2 CF'
        , [4, 2, 3, 1, 5, 0] // 22: // Up, Back, CR' CF
        , [1, 5, 3, 4, 2, 0] // 23: // Up, Front, CR' CF'
    //[f, r, d, b, l, u ]
    ];
    /* Corner swipe table.
     * First dimension: side part index.
     * Second dimension: orientation.
     * Third dimension: swipe direction
     * Fourth dimension: axis,layermask,angle
     * <pre>
     *             +---+---+---+
     *             |4.0|   |2.0|
     *             +---     ---+
     *             |     1     |
     *             +---     ---+
     *             |6.0|   |0.0|
     * +---+---+---+---+---+---+---+---+---+---+---+---+
     * |4.1|   |6.2|6.1|   |0.2|0.1|   |2.2|2.1|   |4.2|
     * +---     ---+---     ---+---    +---+---     ---+
     * |     3     |     2     |     0     |     5     |
     * +---     ---+---     ---+---    +---+---     ---+
     * |5.2|   |7.1|7.2|   |1.1|1.2|   |3.1|3.2|   |5.1|
     * +---+---+---+---+---+---+---+---+---+---+---+---+
     *             |7.0|   |1.0|
     *             +---     ---+
     *             |     4     |
     *             +---     ---+
     *             |5.0|   |3.0|
     *             +---+---+---+
     * </pre>*/
Cube.prototype.CORNER_SWIPE_TABLE = [
        [// 0 urf
            [//u
                [2, 4, 1], // axis, layerMask, angle
                [0, 4, -1],
                [2, 4, -1],
                [0, 4, 1]
            ],
            [//r
                [1, 4, 1],
                [2, 4, -1],
                [1, 4, -1],
                [2, 4, 1]
            ],
            [//f
                [0, 4, -1],
                [1, 4, 1],
                [0, 4, 1],
                [1, 4, -1]
            ]
        ], [// 1 dfr
            [//d
                [0, 4, 1], // axis, layerMask, angle
                [2, 4, -1],
                [0, 4, -1],
                [2, 4, 1]
            ],
            [//f
                [1, 1, -1], // axis, layerMask, angle
                [0, 4, -1],
                [1, 1, 1],
                [0, 4, 1]
            ],
            [//r
                [2, 4, -1], // axis, layerMask, angle
                [1, 1, -1],
                [2, 4, 1],
                [1, 1, 1]
            ]
        ], [// 2 ubr
            [//u
                [0, 4, 1], // axis, layerMask, angle
                [2, 1, 1],
                [0, 4, -1],
                [2, 1, -1]
            ],
            [//b
                [1, 4, 1], // axis, layerMask, angle
                [0, 4, -1],
                [1, 4, -1],
                [0, 4, 1]
            ],
            [//r
                [2, 1, 1], // axis, layerMask, angle
                [1, 4, 1],
                [2, 1, -1],
                [1, 4, -1]
            ]
        ], [// 3 drb
            [//d
                [2, 1, -1], // axis, layerMask, angle
                [0, 4, -1],
                [2, 1, 1],
                [0, 4, 1]
            ],
            [//r
                [1, 1, -1], // axis, layerMask, angle
                [2, 1, 1],
                [1, 1, 1],
                [2, 1, -1]
            ],
            [//b
                [0, 4, -1], // axis, layerMask, angle
                [1, 1, -1],
                [0, 4, 1],
                [1, 1, 1]
            ]
        ], [// 4 ulb
            [//u
                [2, 1, -1], // axis, layerMask, angle
                [0, 1, 1],
                [2, 1, 1],
                [0, 1, -1]
            ],
            [//l
                [1, 4, 1], // axis, layerMask, angle
                [2, 1, 1],
                [1, 4, -1],
                [2, 1, -1]
            ],
            [//b
                [0, 1, 1], // axis, layerMask, angle
                [1, 4, 1],
                [0, 1, -1],
                [1, 4, -1]
            ]
        ], [// 5 dbl
            [//d
                [0, 1, -1], // axis, layerMask, angle
                [2, 1, 1],
                [0, 1, 1],
                [2, 1, -1]
            ],
            [//b
                [1, 1, -1], // axis, layerMask, angle
                [0, 1, 1],
                [1, 1, 1],
                [0, 1, -1]
            ],
            [//l
                [2, 1, 1], // axis, layerMask, angle
                [1, 1, -1],
                [2, 1, -1],
                [1, 1, 1]
            ]
        ], [// 6 ufl
            [//u
                [0, 1, -1], // axis, layerMask, angle
                [2, 4, -1],
                [0, 1, 1],
                [2, 4, 1]
            ],
            [//f
                [1, 4, 1], // axis, layerMask, angle
                [0, 1, 1],
                [1, 4, -1],
                [0, 1, -1]
            ],
            [//l
                [2, 4, -1], // axis, layerMask, angle
                [1, 4, 1],
                [2, 4, 1],
                [1, 4, -1]
            ]
        ], [// 7 dlf
            [//d
                [2, 4, 1], // axis, layerMask, angle
                [0, 1, 1],
                [2, 4, -1],
                [0, 1, -1]
            ],
            [//l
                [1, 1, -1], // axis, layerMask, angle
                [2, 4, -1],
                [1, 1, 1],
                [2, 4, 1]
            ],
            [//f
                [0, 1, 1], // axis, layerMask, angle
                [1, 1, -1],
                [0, 1, -1],
                [1, 1, 1]
            ]
        ]
    ];


    /**
     * Compares two cubes for equality.
     */

Cube.prototype.equals=function(that) {
            return that.getLayerCount() == this.layerCount && Arrays.equals(that.getCornerLocations(), this.cornerLoc) && Arrays.equals(that.getCornerOrientations(), this.cornerOrient) && Arrays.equals(that.getEdgeLocations(), this.edgeLoc) && Arrays.equals(that.getEdgeOrientations(), this.edgeOrient) && Arrays.equals(that.getSideLocations(), this.sideLoc) && Arrays.equals(that.getSideOrientations(), this.sideOrient);
    }

    /**
     * Returns the hash code for the cube.
     * /

Cube.prototype.hashCode=function() {
        var hash = 0;
        var sub = 0;
        for (var i = 0; i < this.cornerLoc.length; i++) {
            sub = sub << 1 + this.cornerLoc[i];
        }
        hash |= sub;
        sub = 0;
        for (var i = 0; i < this.edgeLoc.length; i++) {
            sub = sub << 1 + this.edgeLoc[i];
        }
        hash |= sub;
        sub = 0;
        for (var i = 0; i < this.sideLoc.length; i++) {
            sub = sub << 1 + this.sideLoc[i];
        }
        return hash;
    }*/

    /**
     * Resets the cube to its initial (ordered) state.
     */
Cube.prototype.reset=function() {
    this.transformType = this.IDENTITY_TRANSFORM;

    var i;
    for (i = 0; i < this.cornerLoc.length; i++) {
        this.cornerLoc[i] = i;
        this.cornerOrient[i] = 0;
    }

    for (i = 0; i < this.edgeLoc.length; i++) {
        this.edgeLoc[i] = i;
        this.edgeOrient[i] = 0;
    }

    for (i = 0; i < this.sideLoc.length; i++) {
        this.sideLoc[i] = i;
        this.sideOrient[i] = 0;
    }

    this.fireCubeChanged(new CubeEvent(this, 0, 0, 0));
}

    /**
     * Returns true if the cube is in its ordered (solved) state.
     */
Cube.prototype.isSolved=function() {
        var i;
        for (i = 0; i < this.cornerLoc.length; i++) {
            if (this.cornerLoc[i] != i) {
                return false;
            }
            if (this.cornerOrient[i] != 0) {
                return false;
            }
        }

        for (i = 0; i < this.edgeLoc.length; i++) {
            if (this.edgeLoc[i] != i) {
                return false;
            }
            if (this.edgeOrient[i] != 0) {
                return false;
            }
        }

        for (i = 0; i < this.sideLoc.length; i++) {
            if (this.sideLoc[i] != i) {
                return false;
            }
            if (this.sideOrient[i] != 0) {
                return false;
            }
        }

        return true;
    }

/**
 * Adds a listener for CubeEvent's.
 *
 * A listener must have a cubeTwisted() and a cubeChanged() function.
 */
Cube.prototype.addCubeListener=function(l) {
  this.listenerList[this.listenerList.length]=l;
}

/**
 * Removes a listener for CubeEvent's.
 */
Cube.prototype.removeCubeListener=function(l) {
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
Cube.prototype.fireCubeTwisted=function(event) {
    if (!this.quiet) {
        // Guaranteed to return a non-null array
        var listeners = this.listenerList;
        // Process the listeners last to first, notifying
        // those that are varerested in this event
        for (var i = listeners.length - 1; i >= 0; i -= 1) {
                listeners[i].cubeTwisted(event);
        }
    }
}

/**
 * Notify all listeners that have registered varerest for
 * notification on this event type.
 */
Cube.prototype.fireCubeChanged=function(event) {
    if (!this.quiet) {
        // Guaranteed to return a non-null array
        var listeners = this.listenerList;
        // Process the listeners last to first, notifying
        // those that are varerested in this event
        for (var i = listeners.length - 1; i >= 0; i -= 1) {
                listeners[i].cubeChanged(event);
        }
    }
}

    /**
     * Set this to false to prevent notification of listeners.
     * Setting this to true will fire a cubeChanged event.
     */
Cube.prototype.setQuiet=function(b) {
        if (b != this.quiet) {
            this.quiet = b;
            if (!this.quiet) {
              this.fireCubeChanged(new CubeEvent(this, 0,0,0));
            }
        }
    }

Cube.prototype.isQuiet=function() {
        return this.quiet;
    }

    /**
     * Returns the locations of all corner parts.
     */

Cube.prototype.getCornerLocations=function() {
        return this.cornerLoc;
    }

    /**
     * Returns the orientations of all corner parts.
     */

Cube.prototype.getCornerOrientations=function() {
        return this.cornerOrient;
    }

    /**
     * Sets the locations and orientations of all corner parts.
     */

Cube.prototype.setCorners=function(locations,orientations) {
        {
            this.transformType = this.UNKNOWN_TRANSFORM;

            this.cornerLoc=locations.slice(0,this.cornerLoc.length);
            this.cornerOrient=orientations.slice(0,this.cornerOrient.length);
        }
        this.fireCubeChanged(new CubeEvent(this, 0,0,0));
    }

    /**
     * Gets the corner part at the specified location.
     */

Cube.prototype.getCornerAt=function(location) {
        return this.cornerLoc[location];
    }

    /**
     * Gets the location of the specified corner part.
     */

Cube.prototype.getCornerLocation=function(corner) {
        var i;
        if (this.cornerLoc[corner] == corner) {
            return corner;
        }
        for (i = this.cornerLoc.length - 1; i >= 0; i--) {
            if (this.cornerLoc[i] == corner) {
                break;
            }
        }
        return i;
    }

    /**
     * Returns the number of corner parts.
     */

Cube.prototype.getCornerCount=function() {
        return this.cornerLoc.length;
    }

    /**
     * Returns the number of edge parts.
     */

Cube.prototype.getEdgeCount=function() {
        return this.edgeLoc.length;
    }

    /**
     * Returns the number of side parts.
     */

Cube.prototype.getSideCount=function() {
        return this.sideLoc.length;
    }

    /**
     * Gets the orientation of the specified corner part.
     */

Cube.prototype.getCornerOrientation=function(corner) {
    return this.cornerOrient[this.getCornerLocation(corner)];
}

    /**
     * Returns the locations of all edge parts.
     */

Cube.prototype.getEdgeLocations=function() {
        return this.edgeLoc;
    }

    /**
     * Returns the orientations of all edge parts.
     */

Cube.prototype.getEdgeOrientations=function() {
        return this.edgeOrient;
    }

    /**
     * Sets the locations and orientations of all edge parts.
     */

Cube.prototype.setEdges=function(locations, orientations) {
         {
            this.transformType = this.UNKNOWN_TRANSFORM;
            this.edgeLoc=locations.slice(0,this.edgeLoc.length);
            this.edgeOrientations=this.edgeOrient.slice(0,this.edgeOrient.length);
        }
        this.fireCubeChanged(new CubeEvent(this, 0,0,0));
    }

    /**
     * Gets the edge part at the specified location.
     */

Cube.prototype.getEdgeAt=function(location) {
        return this.edgeLoc[location];
    }

    /**
     * Gets the location of the specified edge part.
     */

Cube.prototype.getEdgeLocation=function(edge) {
    var i;
    if (this.edgeLoc[edge] == edge) {
        return edge;
    }
    for (i = this.edgeLoc.length - 1; i >= 0; i--) {
        if (this.edgeLoc[i] == edge) {
            break;
        }
    }
    return i;
}

/**
 * Gets the orientation of the specified edge part.
 */

Cube.prototype.getEdgeOrientation=function(edge) {
    return this.edgeOrient[this.getEdgeLocation(edge)];
}

/**
 * Returns the locations of all side parts.
 */

Cube.prototype.getSideLocations=function() {
    return this.sideLoc;
}

/**
 * Returns the orientations of all side parts.
 */

Cube.prototype.getSideOrientations=function() {
    return this.sideOrient;
}

/**
 * Sets the locations and orientations of all side parts.
 */

Cube.prototype.setSides=function(locations, orientations) {
    {
        this.transformType = this.UNKNOWN_TRANSFORM;
        this.sideLoc=locations.slice(0,this.sideLoc.length);
        this.sideOrient=orientations.slice(0,this.sideOrient.length);
    }
    this.fireCubeChanged(new CubeEvent(this, 0, 0, 0));
}

/**
 * Gets the side part at the specified location.
 */

Cube.prototype.getSideAt=function(location) {
    return this.sideLoc[location];
}

/**
 * Gets the face on which the sticker of the specified side part can
 * be seen.
 */
Cube.prototype.getSideFace=function(sidePart) {
    return this.getSideLocation(sidePart) % 6;
}

/**
 * Gets the location of the specified side part.
 */
Cube.prototype.getSideLocation=function(side) {
    var i;
    if (this.sideLoc[side] == side) {
        return side;
    }
    for (i = this.sideLoc.length - 1; i >= 0; i--) {
        if (this.sideLoc[i] == side) {
            break;
        }
    }
    return i;
}

/**
 * Gets the orientation of the specified side part.
 */
Cube.prototype.getSideOrientation=function(side) {
    return this.sideOrient[this.getSideLocation(side)];
}

/**
 * Copies the permutation of the specified cube to this cube.
 *
 * @param tx The cube to be applied to this cube object.
 */
Cube.prototype.setTo=function(that) {
    if (that.getLayerCount() != this.getLayerCount()) {
        throw ("that.layers=" + that.getLayerCount() + " must match this.layers=" + this.getLayerCount());
    }

    this.transformType = that.transformType;
    this.transformAxis = that.transformAxis;
    this.transformAngle = that.transformAngle;
    this.transformMask = that.transformMask;

    this.sideLoc=that.getSideLocations().slice(0,this.sideLoc.length);
    this.sideOrient=that.getSideOrientations().slice(0,this.sideOrient.length);
    this.edgeLoc=that.getEdgeLocations().slice(0,this.edgeLoc.length);
    this.edgeOrient=that.getEdgeOrientations().slice(0,this.edgeOrient.length);
    this.cornerLoc=that.getCornerLocations().slice(0,this.cornerLoc.length);
    this.cornerOrient=that.getCornerOrientations().slice(0,this.cornerOrient.length);
    this.fireCubeChanged(new CubeEvent(this, 0, 0, 0));
}

/**
 * Returns the number of layers on the x, y and z axis.
 */
Cube.prototype.getLayerCount=function() {
    return this.layerCount;
}

/**
 * Transforms the cube and fires a cubeTwisted event. The actual work
 * is done in method transform0.
 *
 * @param  axis  0=x, 1=y, 2=z axis.
 * @param  layerMask A bitmask specifying the layers to be transformed.
 *           The size of the layer mask depends on the value returned by
 *           <code>getLayerCount(axis)</code>. For a 3x3x3 cube, the layer mask has the
 *           following meaning:
 *           7=rotate the whole cube;<br>
 *           1=twist slice near the axis (left, bottom, behind)<br>
 *           2=twist slice in the middle of the axis<br>
 *           4=twist slice far away from the axis (right, top, front)
 * @param  angle  positive values=clockwise rotation<br>
 *                negative values=counterclockwise rotation<br>
 *               1=90 degrees<br>
 *               2=180 degrees
 *
 * @see #getLayerCount()
 */
Cube.prototype.transform=function(axis, layerMask, angle) {
    // Update transform type
    {
        switch (this.transformType) {
            case this.IDENTITY_TRANSFORM:
                this.transformAxis = axis;
                this.transformMask = layerMask;
                this.transformAngle = angle;
                this.transformType = this.SINGLE_AXIS_TRANSFORM;
                break;
            case this.SINGLE_AXIS_TRANSFORM:
                if (this.transformAxis == axis) {
                    if (this.transformAngle == angle) {
                        if (this.transformMask == layerMask) {
                            this.transformAngle = (this.transformAngle + angle) % 3;
                        } else if ((this.transformMask & layerMask) == 0) {
                            this.transformMask |= layerMask;
                        } else {
                            this.transformType = this.GENERAL_TRANSFORM;
                        }
                    } else {
                        if (this.transformMask == layerMask) {
                            this.transformAngle = (this.transformAngle + angle) % 3;
                        } else {
                            this.transformType = this.GENERAL_TRANSFORM;
                        }
                    }
                } else {
                    this.transformType = this.GENERAL_TRANSFORM;
                }
                break;
        }

        // Perform the transform
        this.transform0(axis, layerMask, angle);
    }

    // Inform listeners.
    if (!this.isQuiet()) {
        this.fireCubeTwisted(new CubeEvent(this, axis, layerMask, angle));
    }
}

/**
 * Transforms the cube and fires a cubeTwisted event.
 *
 * @param  axis  0=x, 1=y, 2=z axis.
 * @param  layerMask A bitmask specifying the layers to be transformed.
 *           The size of the layer mask depends on the value returned by
 *           <code>getLayerCount(axis)</code>. For a 3x3x3 cube, the layer mask has the
 *           following meaning:
 *           7=rotate the whole cube;<br>
 *           1=twist slice near the axis (left, bottom, behind)<br>
 *           2=twist slice in the middle of the axis<br>
 *           4=twist slice far away from the axis (right, top, front)
 * @param  angle  positive values=clockwise rotation<br>
 *                negative values=counterclockwise rotation<br>
 *               1=90 degrees<br>
 *               2=180 degrees
 *
 * @see #getLayerCount()
 */
// protected abstract void transform0(var axis, var layerMask, var angle);

/**
 * Applies the permutation of the specified cube to this cube and fires a
 * cubeChanged event.
 *
 * @param tx The cube to be used to transform this cube object.
 * @exception InvalidArgumentException, if one or more of the values returned
 * by <code>tx.getLayourCount(axis)</code> are different from this cube.
 *
 * @see #getLayerCount()
 */

Cube.prototype.transformFromCube=function(tx) {
    if (tx.getLayerCount() != this.getLayerCount()) {
        throw ("tx.layers=" + tx.getLayerCount() + " must match this.layers=" + this.getLayerCount());
    }

    

    var taxis = 0, tangle = 0, tmask = 0;
     {
         {
            {
                var atx = tx;
                switch (atx.transformType) {
                    case this.IDENTITY_TRANSFORM:
                        return; // nothing to do
                    case SINGLE_AXIS_TRANSFORM:
                        taxis = atx.transformAxis;
                        tangle = atx.transformAngle;
                        tmask = atx.transformMask;
                        break;
                }
            }

            if (tmask == 0) {
                this.transformType = this.UNKNOWN_TRANSFORM;
                var tempLoc;
                var tempOrient;

                tempLoc = this.cornerLoc.slice(0);
                tempOrient = this.cornerOrient.slice(0);
                var txLoc = tx.getCornerLocations();
                var txOrient = tx.getCornerOrientations();
                for (var i = 0; i < txLoc.length; i++) {
                    this.cornerLoc[i] = tempLoc[txLoc[i]];
                    this.cornerOrient[i] = (tempOrient[txLoc[i]] + txOrient[i]) % 3;
                }

                tempLoc = this.edgeLoc.slice(0);
                tempOrient = this.edgeOrient.slice(0);
                txLoc = tx.getEdgeLocations();
                txOrient = tx.getEdgeOrientations();
                for (var i = 0; i < txLoc.length; i++) {
                    this.edgeLoc[i] = tempLoc[txLoc[i]];
                    this.edgeOrient[i] = (tempOrient[txLoc[i]] + txOrient[i]) % 2;
                }

                tempLoc = this.sideLoc.slice(0);
                tempOrient = this.sideOrient.slice(0);
                txLoc = tx.getSideLocations();
                txOrient = tx.getSideOrientations();
                for (var i = 0; i < txLoc.length; i++) {
                    this.sideLoc[i] = tempLoc[txLoc[i]];
                    this.sideOrient[i] = (tempOrient[txLoc[i]] + txOrient[i]) % 4;
                }
            }
        }
    }
    if (tmask == 0) {
        this.fireCubeChanged(new CubeEvent(this, 0, 0, 0));
    } else {
        this.transform(taxis, tmask, tangle);
    }
}

/**
 * Performs a two cycle permutation and orientation change.
 */
Cube.prototype.twoCycle=function(
        loc, l1, l2,
        orient, o1, o2,
        modulo) {
    var swap;

    swap = loc[l1];
    loc[l1] = loc[l2];
    loc[l2] = swap;

    swap = orient[l1];
    orient[l1] = (orient[l2] + o1) % modulo;
    orient[l2] = (swap + o2) % modulo;
}

/**
 * Performs a four cycle permutation and orientation change.
 */
Cube.prototype.fourCycle=function(
         loc,  l1,  l2,  l3,  l4,
         orient,  o1,  o2,  o3,  o4,
         modulo) {
    var swap;

    swap = loc[l1];
    loc[l1] = loc[l2];
    loc[l2] = loc[l3];
    loc[l3] = loc[l4];
    loc[l4] = swap;

    swap = orient[l1];
    orient[l1] = (orient[l2] + o1) % modulo;
    orient[l2] = (orient[l3] + o2) % modulo;
    orient[l3] = (orient[l4] + o3) % modulo;
    orient[l4] = (swap + o4) % modulo;
}

/**
 * Returns the face at which the indicated orientation
 * of the part is located.
 */
Cube.prototype.getPartFace=function( part,  orient) {
    {
        if (part < this.cornerLoc.length) {
            return getCornerFace(part, orient);
        } else if (part < this.cornerLoc.length + this.edgeLoc.length) {
            return getEdgeFace(part - this.cornerLoc.length, orient);
        } else if (part < this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length) {
            return getSideFace(part - this.cornerLoc.length - this.edgeLoc.length);
        } else {
            return getCenterSide(orient);
        }
    }
}

/**
 * Returns the orientation of the specified part.
 */
Cube.prototype.getPartOrientation=function( part) {
    if (part < this.cornerLoc.length) {
        return this.getCornerOrientation(part);
    } else if (part < this.cornerLoc.length + this.edgeLoc.length) {
        return this.getEdgeOrientation(part - this.cornerLoc.length);
    } else if (part < this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length) {
        return this.getSideOrientation(part - this.cornerLoc.length - this.edgeLoc.length);
    } else {
        return this.getCubeOrientation();
    }
}

/**
 * Returns the location of the specified part.
 */
Cube.prototype.getPartLocation=function( part) {
    if (part < this.cornerLoc.length) {
        return this.getCornerLocation(part);
    } else if (part < this.cornerLoc.length + this.edgeLoc.length) {
        return this.cornerLoc.length + this.getEdgeLocation(part - this.cornerLoc.length);
    } else if (part < this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length) {
        return this.cornerLoc.length + this.edgeLoc.length + this.getSideLocation(part - this.cornerLoc.length - this.edgeLoc.length);
    } else {
        return 0;
    }
}

/**
 * Returns the current axis on which the orientation of the part lies.
 * Returns -1 if the part lies on none or multiple axis (the center part).
 */
Cube.prototype.getPartAxis=function( part,  orientation) {
    if (part < this.cornerLoc.length) {
        // Corner parts
        var face = getPartFace(part, orientation);
        return (face) % 3;
    } else if (part < this.cornerLoc.length + this.edgeLoc.length) {
        // Edge parts
        return EDGE_TO_AXIS_MAP[getEdgeLocation(part - this.cornerLoc.length) % 12];
    } else if (part < this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length) {
        // Side parts
        var face = getPartFace(part, orientation);
        return (face) % 3;
    } else {
        return -1;
    }
}

/**
 * Returns the angle which is clockwise for the specified part orientation.
 * Returns 1 or -1.
 * Returns 0 if the direction can not be determined (the center part).
 */

Cube.prototype.getPartAngle=function( part,  orientation) {
    if (part >= this.cornerLoc.length && part < this.cornerLoc.length + this.edgeLoc.length) {
        // Edge parts
        return EDGE_TO_ANGLE_MAP[getEdgeLocation(part - this.cornerLoc.length) % 12][(getEdgeOrientation(part - this.cornerLoc.length) + orientation) % 2];
    } else {
        // Corner parts and Side parts
        var side = getPartFace(part, orientation);
        switch (side) {
            case 0:
            case 1:
            case 2:
                return 1;
            case 3:
            case 4:
            case 5:
            default:
                return -1;
        }
    }
}

/**
 * Returns the current layer mask on which the orientation of the part lies.
 * Returns 0 if no mask can be determined (the center part).
 */

// public abstract var getPartLayerMask(var part, var orientation);

/**
 * Returns the type of the specified part.
 */

Cube.prototype.getPartType=function(part) {
    if (part < this.cornerLoc.length) {
        return CORNER_PART;
    } else if (part < this.cornerLoc.length + this.edgeLoc.length) {
        return EDGE_PART;
    } else if (part < this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length) {
        return SIDE_PART;
    } else {
        return CENTER_PART;
    }
}

/**
 * Returns the location of the specified part.
 */
Cube.prototype.getPartAt=function(location) {
    if (location < this.cornerLoc.length) {
        return this.getCornerAt(location);
    } else if (location < this.cornerLoc.length + this.edgeLoc.length) {
        return this.cornerLoc.length + this.getEdgeAt(location - this.cornerLoc.length);
    } else if (location < this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length) {
        return this.cornerLoc.length + this.edgeLoc.length + this.getSideAt(location - this.cornerLoc.length - this.edgeLoc.length);
    } else {
        return this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length;
    }
}

/**
 * Returns the side at which the indicated orientation
 * of the center part is located.
 *
 * @return The side. A value ranging from 0 to 5.
 * <code><pre>
 *     +---+
 *     | 5 |
 * +---+---+---+---+
 * | 4 | 0 | 1 | 3 |
 * +---+---+---+---+
 *     | 2 |
 *     +---+
 * </pre></code>
 */
Cube.prototype.getCenterSide=function(orient) {
    return CENTER_TO_SIDE_MAP[getCubeOrientation()][orient];
}

    /**
     * Returns the face an which the sticker at the specified orientation
     * of the edge can be seen.
     */
    Cube.prototype.getEdgeFace=function(edge, orient) {
        var loc = getEdgeLocation(edge) % 12;
        var ori = (this.edgeOrient[loc] + orient) % 2;

        return EDGE_TO_FACE_MAP[loc][ori];
    }

    /**
     * Returns the face on which the sticker at the specified orientation
     * of the corner can be seen.
     */
    Cube.prototype.getCornerFace=function(corner, orient) {
        var loc = getCornerLocation(corner);
        var ori = (3 + orient - this.cornerOrient[loc]) % 3;
        return CORNER_TO_FACE_MAP[loc][ori];
    }

    /**
     * Returns the orientation of the whole cube.
     * @return The orientation of the cube, or -1 if
     * the orientation can not be determined.
     */

Cube.prototype.getCubeOrientation=function() {
        // The cube has no orientation, if it has no side parts.
        if (this.sideLoc.length == 0) {
            return -1;
        }

        // The location of the front side and the right
        // side are used to determine the orientation
        // of the cube.
        switch (this.sideLoc[2] * 6 + this.sideLoc[0]) {
            case 2 * 6 + 0:
                return 0; // Front at front, Right at right
            case 4 * 6 + 0:
                return 1; // Front at Bottom, Right at right, CR
            case 5 * 6 + 0:
                return 2; // Back, Right, CR2
            case 1 * 6 + 0:
                return 3; // Top, Right, CR'
            case 0 * 6 + 5:
                return 4; // Right, Back, CU
            case 5 * 6 + 3:
                return 5; // Back, Left, CU2
            case 3 * 6 + 2:
                return 6; // Left, Front, CU'
            case 2 * 6 + 1:
                return 7; // Front, Top, CF
            case 2 * 6 + 3:
                return 8; // Front, Left, CF2
            case 2 * 6 + 4:
                return 9; // Front, Bottom, CF'
            case 0 * 6 + 1:
                return 10; // Right, Top, CR CU
            case 1 * 6 + 3:
                return 11; // Top, Left, CR CU2
            case 3 * 6 + 4:
                return 12; // Left, Down, CR CU'
            case 0 * 6 + 2:
                return 13; // Right, Front, CR2 CU
            case 3 * 6 + 5:
                return 14; // Left, Back, CR2 CU'
            case 0 * 6 + 4:
                return 15; // Right, Down, CR' CU
            case 4 * 6 + 3:
                return 16; // Down, Left, CR' CU2
            case 3 * 6 + 1:
                return 17; // Left, Up, CR' CU'
            case 4 * 6 + 1:
                return 18; // Down, Up, CR CF
            case 4 * 6 + 5:
                return 19; // Down, Back, CR CF'
            case 5 * 6 + 4:
                return 20; // Back, Down, CR2 CF
            case 5 * 6 + 1:
                return 21; // Back, Up, CR2 CF'
            case 1 * 6 + 5:
                return 22; // Up, Back, CR' CF
            case 1 * 6 + 2:
                return 23; // Up, Front, CR' CF'
            default:
                return -1;
        }
    }



Cube.prototype.getPartCount=function() {
    return getCornerCount() + getEdgeCount() + getSideCount() + 1;
}

    /**
     * Returns an array of part ID's, for each part in this cube,
     * which is not at its initial location or has not its initial
     * orientation.
     */

Cube.prototype.getUnsolvedParts=function() {
    var a = new Array(this.cornerLoc.length + this.edgeLoc.length + this.sideLoc.length);
    var count = 0;
    for (var i = 0; i < this.cornerLoc.length; i++) {
        if (this.cornerLoc[i] != i || this.cornerOrient[i] != 0) {
            a[count++] = i;
        }
    }
    for (var i = 0; i < this.edgeLoc.length; i++) {
        if (this.edgeLoc[i] != i || this.edgeOrient[i] != 0) {
            a[count++] = i + this.cornerLoc.length;
        }
    }
    for (var i = 0; i < this.sideLoc.length; i++) {
        if (this.sideLoc[i] != i || this.sideOrient[i] != 0) {
            a[count++] = i + this.cornerLoc.length + this.edgeLoc.length;
        }
    }
    var result = new Array(count);
    result=a.slice(0,count);
    return result;
}

/** Scrambles the cube. */
Cube.prototype.scramble=function(scrambleCount) {
  if (scrambleCount==null) scrambleCount=21;
  
  this.setQuiet(true);
  
  // Keep track of previous axis, to avoid two subsequent moves on
  // the same axis.
  var prevAxis = -1;
  var axis, layerMask, angle;
  for (var i = 0; i < scrambleCount; i++) {
    while ((axis = Math.floor(Math.random()*3)) == prevAxis) {}
    prevAxis = axis;
    while ((layerMask = Math.floor(Math.random()*(1 << this.layerCount))) == 0) {}
    while ((angle = Math.floor(Math.random()*5) - 2) == 0) {}
    this.transform(axis, layerMask, angle);
  }

  this.setQuiet(false);
}

