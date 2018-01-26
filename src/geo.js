/* geometric utilities */
global.CLIP_INSIDE = GL.CLIP_INSIDE = 0;
global.CLIP_OUTSIDE = GL.CLIP_OUTSIDE = 1;
global.CLIP_OVERLAP = GL.CLIP_OVERLAP = 2;

/**
* @namespace
*/


/**
* Computational geometry algorithms, is a static class
* @class geo
*/

global.geo = {

	/**
	* Returns a float4 containing the info about a plane with normal N and that passes through point P
	* @method createPlane
	* @param {vec3} P
	* @param {vec3} N
	* @return {vec4} plane values
	*/
	createPlane: function(P,N)
	{
		return new Float32Array([N[0],N[1],N[2],-vec3.dot(P,N)]);
	},

	/**
	* Computes the distance between the point and the plane
	* @method distancePointToPlane
	* @param {vec3} point
	* @param {vec4} plane
	* @return {Number} distance
	*/
	distancePointToPlane: function(point, plane)
	{
		return (vec3.dot(point,plane) + plane[3])/Math.sqrt(plane[0]*plane[0] + plane[1]*plane[1] + plane[2]*plane[2]);
	},

	/**
	* Computes the square distance between the point and the plane
	* @method distance2PointToPlane
	* @param {vec3} point
	* @param {vec4} plane
	* @return {Number} distance*distance
	*/
	distance2PointToPlane: function(point, plane)
	{
		return (vec3.dot(point,plane) + plane[3])/(plane[0]*plane[0] + plane[1]*plane[1] + plane[2]*plane[2]);
	},

	/**
	* Projects a 3D point on a 3D line
	* @method projectPointOnLine
	* @param {vec3} P
	* @param {vec3} A line start
	* @param {vec3} B line end
	* @param {vec3} result to store result (optional)
	* @return {vec3} projectec point
	*/
	projectPointOnLine: function( P, A, B, result )
	{
		result = result || vec3.create();
		//A + dot(AP,AB) / dot(AB,AB) * AB
		var AP = vec3.fromValues( P[0] - A[0], P[1] - A[1], P[2] - A[2]);
		var AB = vec3.fromValues( B[0] - A[0], B[1] - A[1], B[2] - A[2]);
		var div = vec3.dot(AP,AB) / vec3.dot(AB,AB);
		result[0] = A[0] + div[0] * AB[0];
		result[1] = A[1] + div[1] * AB[1];
		result[2] = A[2] + div[2] * AB[2];
		return result;
	},

	/**
	* Projects a 2D point on a 2D line
	* @method project2DPointOnLine
	* @param {vec2} P
	* @param {vec2} A line start
	* @param {vec2} B line end
	* @param {vec2} result to store result (optional)
	* @return {vec2} projectec point
	*/
	project2DPointOnLine: function( P, A, B, result )
	{
		result = result || vec2.create();
		//A + dot(AP,AB) / dot(AB,AB) * AB
		var AP = vec2.fromValues(P[0] - A[0], P[1] - A[1]);
		var AB = vec2.fromValues(B[0] - A[0], B[1] - A[1]);
		var div = vec2.dot(AP,AB) / vec2.dot(AB,AB);
		result[0] = A[0] + div[0] * AB[0];
		result[1] = A[1] + div[1] * AB[1];
		return result;
	},

	/**
	* Projects point on plane
	* @method projectPointOnPlane
	* @param {vec3} point
	* @param {vec3} P plane point
	* @param {vec3} N plane normal
	* @param {vec3} result to store result (optional)
	* @return {vec3} projectec point
	*/
	projectPointOnPlane: function(point, P, N, result)
	{
		result = result || vec3.create();
		var v = vec3.subtract( vec3.create(), point, P );
		var dist = vec3.dot(v,N);
		return vec3.subtract( result, point , vec3.scale( vec3.create(), N, dist ) );
	},

	/**
	* Finds the reflected point over a plane (useful for reflecting camera position when rendering reflections)
	* @method reflectPointInPlane
	* @param {vec3} point point to reflect
	* @param {vec3} P point where the plane passes
	* @param {vec3} N normal of the plane
	* @return {vec3} reflected point
	*/
	reflectPointInPlane: function(point, P, N)
	{
		var d = -1 * (P[0] * N[0] + P[1] * N[1] + P[2] * N[2]);
		var t = -(d + N[0]*point[0] + N[1]*point[1] + N[2]*point[2]) / (N[0]*N[0] + N[1]*N[1] + N[2]*N[2]);
		//trace("T:" + t);
		//var closest = [ point[0]+t*N[0], point[1]+t*N[1], point[2]+t*N[2] ];
		//trace("Closest:" + closest);
		return vec3.fromValues( point[0]+t*N[0]*2, point[1]+t*N[1]*2, point[2]+t*N[2]*2 );
	},

	/**
	* test a ray plane collision and retrieves the collision point
	* @method testRayPlane
	* @param {vec3} start ray start
	* @param {vec3} direction ray direction
	* @param {vec3} P point where the plane passes	
	* @param {vec3} N normal of the plane
	* @param {vec3} result collision position
	* @return {boolean} returns if the ray collides the plane or the ray is parallel to the plane
	*/
	testRayPlane: function(start, direction, P, N, result)
	{
		var D = vec3.dot( P, N );
		var numer = D - vec3.dot(N, start);
		var denom = vec3.dot(N, direction);
		if( Math.abs(denom) < EPSILON) return false;
		var t = (numer / denom);
		if(t < 0.0) return false; //behind the ray
		if(result)
			vec3.add( result,  start, vec3.scale( result, direction, t) );

		return true;
	},

	/**
	* test collision between segment and plane and retrieves the collision point
	* @method testSegmentPlane
	* @param {vec3} start segment start
	* @param {vec3} end segment end
	* @param {vec3} P point where the plane passes	
	* @param {vec3} N normal of the plane
	* @param {vec3} result collision position
	* @return {boolean} returns if the segment collides the plane or it is parallel to the plane
	*/
	testSegmentPlane: (function() { 
		var temp = vec3.create();
		return function(start, end, P, N, result)
		{
			var D = vec3.dot( P, N );
			var numer = D - vec3.dot(N, start);
			var direction = vec3.sub( temp, end, start );
			var denom = vec3.dot(N, direction);
			if( Math.abs(denom) < EPSILON)
				return false; //parallel 
			var t = (numer / denom);
			if(t < 0.0)
				return false; //behind the start
			if(t > 1.0)
				return false; //after the end
			if(result)
				vec3.add( result,  start, vec3.scale( result, direction, t) );
			return true;
		};
	})(),

	/**
	* test a ray sphere collision and retrieves the collision point
	* @method testRaySphere
	* @param {vec3} start ray start
	* @param {vec3} direction ray direction (normalized)
	* @param {vec3} center center of the sphere
	* @param {number} radius radius of the sphere
	* @param {vec3} result collision position
	* @param {number} max_dist not fully tested
	* @return {boolean} returns if the ray collides the sphere
	*/
	testRaySphere: (function() { 
		var temp = vec3.create();
		return function(start, direction, center, radius, result, max_dist)
		{
			// sphere equation (centered at origin) x2+y2+z2=r2
			// ray equation x(t) = p0 + t*dir
			// substitute x(t) into sphere equation
			// solution below:

			// transform ray origin into sphere local coordinates
			var orig = vec3.subtract( temp , start, center);

			var a = direction[0]*direction[0] + direction[1]*direction[1] + direction[2]*direction[2];
			var b = 2*orig[0]*direction[0] + 2*orig[1]*direction[1] + 2*orig[2]*direction[2];
			var c = orig[0]*orig[0] + orig[1]*orig[1] + orig[2]*orig[2] - radius*radius;
			//return quadraticFormula(a,b,c,t0,t1) ? 2 : 0;

			var q = b*b - 4*a*c; 
			if( q < 0.0 )
				return false;

			if(result)
			{
				var sq = Math.sqrt(q);
				var d = 1 / (2*a);
				var r1 = ( -b + sq ) * d;
				var r2 = ( -b - sq ) * d;
				var t = r1 < r2 ? r1 : r2;
				if(t > max_dist)
					return false;
				vec3.add(result, start, vec3.scale( result, direction, t ) );
			}
			return true;//real roots
		};
	})(),

	/**
	* test a ray cylinder collision and retrieves the collision point
	* @method testRaySphere
	* @param {vec3} start ray start
	* @param {vec3} direction ray direction
	* @param {vec3} p center of the cylinder
	* @param {number} q height of the cylinder
	* @param {number} r radius of the cylinder
	* @param {vec3} result collision position
	* @return {boolean} returns if the ray collides the cylinder
	*/
	testRayCylinder: function(start, direction, p, q, r, result)
	{
		var sa = vec3.clone(start);
		var sb = vec3.add(vec3.create(), start, vec3.scale( vec3.create(), direction, 100000) );
		var t = 0;
		var d = vec3.subtract(vec3.create(),q,p);
		var m = vec3.subtract(vec3.create(),sa,p);
		var n = vec3.subtract(vec3.create(),sb,sa);
		//var n = vec3.create(direction);

		var md = vec3.dot(m, d);
		var nd = vec3.dot(n, d);
		var dd = vec3.dot(d, d);

		// Test if segment fully outside either endcap of cylinder
		if (md < 0.0 && md + nd < 0.0) return false; // Segment outside �p� side of cylinder
		if (md > dd && md + nd > dd) return false; // Segment outside �q� side of cylinder

		var nn = vec3.dot(n, n);
		var mn = vec3.dot(m, n);
		var a = dd * nn - nd * nd; 
		var k = vec3.dot(m,m) - r*r;
		var c = dd * k - md * md;

		if (Math.abs(a) < EPSILON) 
		{
			// Segment runs parallel to cylinder axis
			if (c > 0.0) return false;
			// �a� and thus the segment lie outside cylinder
			// Now known that segment intersects cylinder; figure out how it intersects
			if (md < 0.0) t = -mn/nn;
			// Intersect segment against �p� endcap
			else if (md > dd)
				t=(nd-mn)/nn;
			// Intersect segment against �q� endcap
			else t = 0.0;
			// �a� lies inside cylinder
			if(result) vec3.add(result, sa, vec3.scale(vec3.create(), n,t) );
			return true;
		}
		var b = dd * mn - nd * md;
		var discr = b*b - a*c;
		if (discr < 0.0) 
			return false;
		// No real roots; no intersection
		t = (-b - Math.sqrt(discr)) / a;
		if (t < 0.0 || t > 1.0) 
			return false;
		// Intersection lies outside segment
		if(md+t*nd < 0.0)
		{
			// Intersection outside cylinder on �p� side
			if (nd <= 0.0) 
				return false;
			// Segment pointing away from endcap
			t = -md / nd;
			// Keep intersection if Dot(S(t) - p, S(t) - p) <= r^2
			if(result) vec3.add(result, sa, vec3.scale(vec3.create(), n,t) );

			return k+2*t*(mn+t*nn) <= 0.0;
		} else if (md+t*nd>dd)
		{
			// Intersection outside cylinder on �q� side
			if (nd >= 0.0) return false; //Segment pointing away from endcap
			t = (dd - md) / nd;
			// Keep intersection if Dot(S(t) - q, S(t) - q) <= r^2
			if(result) vec3.add(result, sa, vec3.scale(vec3.create(), n,t) );
			return k+dd - 2*md+t*(2*(mn - nd)+t*nn) <= 0.0;
		}
		// Segment intersects cylinder between the endcaps; t is correct
		if(result) vec3.add(result, sa, vec3.scale(vec3.create(), n,t) );
		return true;
	},


	/**
	* test a ray bounding-box collision and retrieves the collision point, the BB must be Axis Aligned
	* @method testRayBox
	* @param {vec3} start ray start
	* @param {vec3} direction ray direction
	* @param {vec3} minB minimum position of the bounding box
	* @param {vec3} maxB maximim position of the bounding box
	* @param {vec3} result collision position
	* @return {boolean} returns if the ray collides the box
	*/
	testRayBox: (function() { 
	
		var quadrant = new Float32Array(3);
		var candidatePlane = new Float32Array(3);
		var maxT = new Float32Array(3);
	
	return function(start, direction, minB, maxB, result, max_dist)
	{
		//#define NUMDIM	3
		//#define RIGHT		0
		//#define LEFT		1
		//#define MIDDLE	2

		max_dist = max_dist || Number.MAX_VALUE;

		var inside = true;
		var i = 0|0;
		var whichPlane;
		
		quadrant.fill(0);
		maxT.fill(0);
		candidatePlane.fill(0);

		/* Find candidate planes; this loop can be avoided if
		rays cast all from the eye(assume perpsective view) */
		for (i=0; i < 3; ++i)
			if(start[i] < minB[i]) {
				quadrant[i] = 1;
				candidatePlane[i] = minB[i];
				inside = false;
			}else if (start[i] > maxB[i]) {
				quadrant[i] = 0;
				candidatePlane[i] = maxB[i];
				inside = false;
			}else	{
				quadrant[i] = 2;
			}

		/* Ray origin inside bounding box */
		if(inside)	{
			if(result)
				vec3.copy(result, start);
			return true;
		}


		/* Calculate T distances to candidate planes */
		for (i = 0; i < 3; ++i)
			if (quadrant[i] != 2 && direction[i] != 0.)
				maxT[i] = (candidatePlane[i] - start[i]) / direction[i];
			else
				maxT[i] = -1.;

		/* Get largest of the maxT's for final choice of intersection */
		whichPlane = 0;
		for (i = 1; i < 3; i++)
			if (maxT[whichPlane] < maxT[i])
				whichPlane = i;

		/* Check final candidate actually inside box */
		if (maxT[whichPlane] < 0.) return false;
		if (maxT[whichPlane] > max_dist) return false; //NOT TESTED

		for (i = 0; i < 3; ++i)
			if (whichPlane != i) {
				var res = start[i] + maxT[whichPlane] * direction[i];
				if (res < minB[i] || res > maxB[i])
					return false;
				if(result)
					result[i] = res;
			} else {
				if(result)
					result[i] = candidatePlane[i];
			}
		return true;				/* ray hits box */
	}
	})(),	

	/**
	* test a ray bounding-box collision, it uses the  BBox class and allows to use non-axis aligned bbox
	* @method testRayBBox
	* @param {vec3} origin ray origin
	* @param {vec3} direction ray direction
	* @param {BBox} box in BBox format
	* @param {mat4} model transformation of the BBox [optional]
	* @param {vec3} result collision position in world space unless in_local is true
	* @return {boolean} returns if the ray collides the box
	*/
	testRayBBox: (function(){ 
	var inv = mat4.create();	
	var end = vec3.create();
	var origin2 = vec3.create();
	return function( origin, direction, box, model, result, max_dist, in_local )
	{
		if(!origin || !direction || !box)
			throw("parameters missing");
		if(model)
		{
			mat4.invert( inv, model );
			vec3.add( end, origin, direction );
			origin = vec3.transformMat4( origin2, origin, inv);
			vec3.transformMat4( end, end, inv );
			vec3.sub( end, end, origin );
			direction = vec3.normalize( end, end );
		}
		var r = this.testRayBox( origin, direction, box.subarray(6,9), box.subarray(9,12), result, max_dist );
		if(!in_local && model && result)
			vec3.transformMat4(result, result, model);
		return r;
	}
	})(),

	/**
	* test if a 3d point is inside a BBox
	* @method testPointBBox
	* @param {vec3} point
	* @param {BBox} bbox
	* @return {boolean} true if it is inside
	*/
	testPointBBox: function(point, bbox) {
		if(point[0] < bbox[6] || point[0] > bbox[9] ||
			point[1] < bbox[7] || point[0] > bbox[10] ||
			point[2] < bbox[8] || point[0] > bbox[11])
			return false;
		return true;
	},

	/**
	* test if a BBox overlaps another BBox
	* @method testBBoxBBox
	* @param {BBox} a
	* @param {BBox} b
	* @return {boolean} true if it overlaps
	*/
	testBBoxBBox: function(a, b) 
	{
		var tx =  Math.abs( b[0] - a[0]);
		if (tx > (a[3] + b[3]))
			return false; //outside
		var ty =  Math.abs(b[1] - a[1]);
		if (ty > (a[4] + b[4]))
			return false; //outside
		var tz =  Math.abs( b[2] - a[2]);
		if (tz > (a[5] + b[5]) )
			return false; //outside

		var vmin = BBox.getMin(b);
		if ( geo.testPointBBox(vmin, a) )
		{
			var vmax = BBox.getMax(b);
			if (geo.testPointBBox(vmax, a))
			{
				return true;// INSIDE;// this instance contains b
			}
		}

		return true; //OVERLAP; // this instance  overlaps with b
	},

	/**
	* test if a sphere overlaps a BBox
	* @method testSphereBBox
	* @param {vec3} point
	* @param {float} radius
	* @param {BBox} bounding_box
	* @return {boolean} true if it overlaps
	*/
	testSphereBBox: function(center, radius, bbox) 
	{
		// arvo's algorithm from gamasutra
		// http://www.gamasutra.com/features/19991018/Gomez_4.htm

		var s, d = 0.0;
		//find the square of the distance
		//from the sphere to the box
		var vmin = BBox.getMin( bbox );
		var vmax = BBox.getMax( bbox );
		for(var i = 0; i < 3; ++i) 
		{ 
			if( center[i] < vmin[i] )
			{
				s = center[i] - vmin[i];
				d += s*s; 
			}
			else if( center[i] > vmax[i] )
			{ 
				s = center[i] - vmax[i];
				d += s*s; 
			}
		}
		//return d <= r*r

		var radiusSquared = radius * radius;
		if (d <= radiusSquared)
		{
			return true;
			/*
			// this is used just to know if it overlaps or is just inside, but I dont care
			// make an aabb aabb test with the sphere aabb to test inside state
			var halfsize = vec3.fromValues( radius, radius, radius );
			var sphere_bbox = BBox.fromCenterHalfsize( center, halfsize );
			if ( geo.testBBoxBBox(bbox, sphere_bbox) )
				return INSIDE;
			return OVERLAP;	
			*/
		}

		return false; //OUTSIDE;
	},

	closestPointBetweenLines: function(a0,a1, b0,b1, p_a, p_b)
	{
		var u = vec3.subtract( vec3.create(), a1, a0 );
		var v = vec3.subtract( vec3.create(), b1, b0 );
		var w = vec3.subtract( vec3.create(), a0, b0 );

		var a = vec3.dot(u,u);         // always >= 0
		var b = vec3.dot(u,v);
		var c = vec3.dot(v,v);         // always >= 0
		var d = vec3.dot(u,w);
		var e = vec3.dot(v,w);
		var D = a*c - b*b;        // always >= 0
		var sc, tc;

		// compute the line parameters of the two closest points
		if (D < EPSILON) {          // the lines are almost parallel
			sc = 0.0;
			tc = (b>c ? d/b : e/c);    // use the largest denominator
		}
		else {
			sc = (b*e - c*d) / D;
			tc = (a*e - b*d) / D;
		}

		// get the difference of the two closest points
		if(p_a)	vec3.add(p_a, a0, vec3.scale(vec3.create(),u,sc));
		if(p_b)	vec3.add(p_b, b0, vec3.scale(vec3.create(),v,tc));

		var dP = vec3.add( vec3.create(), w, vec3.subtract( vec3.create(), vec3.scale(vec3.create(),u,sc) , vec3.scale(vec3.create(),v,tc)) );  // =  L1(sc) - L2(tc)
		return vec3.length(dP);   // return the closest distance
	},

	/**
	* extract frustum planes given a view-projection matrix
	* @method extractPlanes
	* @param {mat4} viewprojection matrix
	* @return {Float32Array} returns all 6 planes in a float32array[24]
	*/
	extractPlanes: function(vp, planes)
	{
		var planes = planes || new Float32Array(4*6);

		//right
		planes.set( [vp[3] - vp[0], vp[7] - vp[4], vp[11] - vp[8], vp[15] - vp[12] ], 0); 
		normalize(0);

		//left
		planes.set( [vp[3] + vp[0], vp[ 7] + vp[ 4], vp[11] + vp[ 8], vp[15] + vp[12] ], 4);
		normalize(4);

		//bottom
		planes.set( [ vp[ 3] + vp[ 1], vp[ 7] + vp[ 5], vp[11] + vp[ 9], vp[15] + vp[13] ], 8);
		normalize(8);

		//top
		planes.set( [ vp[ 3] - vp[ 1], vp[ 7] - vp[ 5], vp[11] - vp[ 9], vp[15] - vp[13] ],12);
		normalize(12);

		//back
		planes.set( [ vp[ 3] - vp[ 2], vp[ 7] - vp[ 6], vp[11] - vp[10], vp[15] - vp[14] ],16);
		normalize(16);

		//front
		planes.set( [ vp[ 3] + vp[ 2], vp[ 7] + vp[ 6], vp[11] + vp[10], vp[15] + vp[14] ],20);
		normalize(20);

		return planes;

		function normalize(pos)
		{
			var N = planes.subarray(pos,pos+3);
			var l = vec3.length(N);
			if(l === 0) return;
			l = 1.0 / l;
			planes[pos] *= l;
			planes[pos+1] *= l;
			planes[pos+2] *= l;
			planes[pos+3] *= l;
		}
	},

	/**
	* test a BBox against the frustum
	* @method frustumTestBox
	* @param {Float32Array} planes frustum planes
	* @param {BBox} boundindbox in BBox format
	* @return {enum} CLIP_INSIDE, CLIP_OVERLAP, CLIP_OUTSIDE
	*/
	frustumTestBox: function(planes, box)
	{
		var flag = 0, o = 0;

		flag = planeBoxOverlap(planes.subarray(0,4),box);
		if (flag == CLIP_OUTSIDE) return CLIP_OUTSIDE; o+= flag;
		flag =  planeBoxOverlap(planes.subarray(4,8),box);
		if (flag == CLIP_OUTSIDE) return CLIP_OUTSIDE; o+= flag;
		flag =  planeBoxOverlap(planes.subarray(8,12),box);
		if (flag == CLIP_OUTSIDE) return CLIP_OUTSIDE; o+= flag;
		flag =  planeBoxOverlap(planes.subarray(12,16),box);
		if (flag == CLIP_OUTSIDE) return CLIP_OUTSIDE; o+= flag;
		flag =  planeBoxOverlap(planes.subarray(16,20),box);
		if (flag == CLIP_OUTSIDE) return CLIP_OUTSIDE; o+= flag;
		flag =  planeBoxOverlap(planes.subarray(20,24),box);
		if (flag == CLIP_OUTSIDE) return CLIP_OUTSIDE; o+= flag;

		return o == 0 ? CLIP_INSIDE : CLIP_OVERLAP;
	},

	/**
	* test a Sphere against the frustum
	* @method frustumTestSphere
	* @param {vec3} center sphere center
	* @param {number} radius sphere radius
	* @return {enum} CLIP_INSIDE, CLIP_OVERLAP, CLIP_OUTSIDE
	*/

	frustumTestSphere: function(planes, center, radius)
	{
		var dist;
		var overlap = false;

		dist = distanceToPlane( planes.subarray(0,4), center );
		if( dist < -radius ) return CLIP_OUTSIDE;
		else if(dist >= -radius && dist <= radius)	overlap = true;
		dist = distanceToPlane( planes.subarray(4,8), center );
		if( dist < -radius ) return CLIP_OUTSIDE;
		else if(dist >= -radius && dist <= radius)	overlap = true;
		dist = distanceToPlane( planes.subarray(8,12), center );
		if( dist < -radius ) return CLIP_OUTSIDE;
		else if(dist >= -radius && dist <= radius)	overlap = true;
		dist = distanceToPlane( planes.subarray(12,16), center );
		if( dist < -radius ) return CLIP_OUTSIDE;
		else if(dist >= -radius && dist <= radius)	overlap = true;
		dist = distanceToPlane( planes.subarray(16,20), center );
		if( dist < -radius ) return CLIP_OUTSIDE;
		else if(dist >= -radius && dist <= radius)	overlap = true;
		dist = distanceToPlane( planes.subarray(20,24), center );
		if( dist < -radius ) return CLIP_OUTSIDE;
		else if(dist >= -radius && dist <= radius)	overlap = true;
		return overlap ? CLIP_OVERLAP : CLIP_INSIDE;
	},


	/**
	* test if a 2d point is inside a 2d polygon
	* @method testPoint2DInPolygon
	* @param {Array} poly array of 2d points
	* @param {vec2} point
	* @return {boolean} true if it is inside
	*/
	testPoint2DInPolygon: function(poly, pt) {
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1]))
        && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
        && (c = !c);
    return c;
	}
};

/**
* BBox is a class to create BoundingBoxes but it works as glMatrix, creating Float32Array with the info inside instead of objects
* The bounding box is stored as center,halfsize,min,max,radius (total of 13 floats)
* @class BBox
*/
global.BBox = GL.BBox = {
	center:0,
	halfsize:3,
	min:6,
	max:9,
	radius:12,
	data_length: 13,
	
	corners: new Float32Array([1,1,1,  1,1,-1,  1,-1,1,  1,-1,-1,  -1,1,1,  -1,1,-1,  -1,-1,1,  -1,-1,-1 ]),
	tmp_corners: new Float32Array(24), //to avoid GC

	/**
	* create an empty bbox
	* @method create
	* @return {BBox} returns a float32array with the bbox
	*/
	create: function()
	{
		return new Float32Array(13);
	},

	/**
	* create an bbox copy from another one
	* @method clone
	* @return {BBox} returns a float32array with the bbox
	*/
	clone: function(bb)
	{
		return new Float32Array(bb);
	},

	/**
	* copy one bbox into another
	* @method copy
	* @param {BBox} out where to store the result
	* @param {BBox} where to read the bbox
	* @return {BBox} returns out
	*/
	copy: function(out,bb)
	{
		out.set(bb);
		return out;
	},	

	/**
	* create a bbox from one point
	* @method fromPoint
	* @param {vec3} point
	* @return {BBox} returns a float32array with the bbox
	*/
	fromPoint: function(point)
	{
		var bb = this.create();
		bb.set(point, 0); //center
		bb.set(point, 6); //min
		bb.set(point, 9); //max
		return bb;
	},

	/**
	* create a bbox from min and max points
	* @method fromMinMax
	* @param {vec3} min
	* @param {vec3} max
	* @return {BBox} returns a float32array with the bbox
	*/
	fromMinMax: function(min,max)
	{
		var bb = this.create();
		this.setMinMax(bb, min, max);
		return bb;
	},

	/**
	* create a bbox from center and halfsize
	* @method fromCenterHalfsize
	* @param {vec3} center
	* @param {vec3} halfsize
	* @return {BBox} returns a float32array with the bbox
	*/
	fromCenterHalfsize: function(center, halfsize)
	{
		var bb = this.create();
		this.setCenterHalfsize(bb, center, halfsize);
		return bb;
	},

	/**
	* create a bbox from a typed-array containing points
	* @method fromPoints
	* @param {Float32Array} points
	* @return {BBox} returns a float32array with the bbox
	*/
	fromPoints: function(points)
	{
		var bb = this.create();
		this.setFromPoints(bb, points);
		return bb;	
	},

	/**
	* set the values to a BB from a set of points
	* @method setFromPoints
	* @param {BBox} out where to store the result
	* @param {Float32Array} points
	* @return {BBox} returns a float32array with the bbox
	*/
	setFromPoints: function(bb, points)
	{
		var min = bb.subarray(6,9);
		var max = bb.subarray(9,12);

		min.set( points.subarray(0,3) );
		max.set( min );

		var v = 0;
		for(var i = 3, l = points.length; i < l; i+=3)
		{
			v = points.subarray(i,i+3);
			vec3.min( min, v, min);
			vec3.max( max, v, max);
		}

		var center = vec3.add( bb.subarray(0,3), min, max );
		vec3.scale( center, center, 0.5);
		vec3.subtract( bb.subarray(3,6), max, center );
		bb[12] = vec3.length(bb.subarray(3,6)); //radius		
		return bb;
	},

	/**
	* set the values to a BB from min and max
	* @method setMinMax
	* @param {BBox} out where to store the result
	* @param {vec3} min
	* @param {vec3} max
	* @return {BBox} returns out
	*/
	setMinMax: function(bb, min, max)
	{
		bb[6] = min[0];
		bb[7] = min[1];
		bb[8] = min[2];
		bb[9] = max[0];
		bb[10] = max[1];
		bb[11] = max[2];

		//halfsize
		var halfsize = bb.subarray(3,6); 
		vec3.sub( halfsize, max, min ); //range
		vec3.scale( halfsize, halfsize, 0.5 );

		//center
		bb[0] = max[0] - halfsize[0];
		bb[1] = max[1] - halfsize[1];
		bb[2] = max[2] - halfsize[2];

		bb[12] = vec3.length(bb.subarray(3,6)); //radius
		return bb;
	},

	/**
	* set the values to a BB from center and halfsize
	* @method setCenterHalfsize
	* @param {BBox} out where to store the result
	* @param {vec3} min
	* @param {vec3} max
	* @param {number} radius [optional] (the minimum distance from the center to the further point)
	* @return {BBox} returns out
	*/
	setCenterHalfsize: function(bb, center, halfsize, radius)
	{
		bb[0] = center[0];
		bb[1] = center[1];
		bb[2] = center[2];
		bb[3] = halfsize[0];
		bb[4] = halfsize[1];
		bb[5] = halfsize[2];

		vec3.sub(bb.subarray(6,9), bb.subarray(0,3), bb.subarray(3,6) );
		vec3.add(bb.subarray(9,12), bb.subarray(0,3), bb.subarray(3,6) );
		if(radius)
			bb[12] = radius;
		else
			bb[12] = vec3.length(halfsize);
		return bb;
	},

	/**
	* Apply a matrix transformation to the BBox (applies to every corner and recomputes the BB)
	* @method transformMat4
	* @param {BBox} out where to store the result
	* @param {BBox} bb bbox you want to transform
	* @param {mat4} mat transformation
	* @return {BBox} returns out
	*/
	transformMat4: function( out, bb, mat )
	{
		var center = bb; //.subarray(0,3); hack to avoid garbage
		var halfsize = bb.subarray(3,6);
		var corners = this.tmp_corners;
		corners.set( this.corners );

		for(var i = 0; i < 8; ++i)		
		{
			var corner = corners.subarray(i*3, i*3+3);
			vec3.multiply( corner, halfsize, corner );
			vec3.add( corner, corner, center );
			mat4.multiplyVec3(corner, mat, corner);
		}

		return this.setFromPoints( out, corners );
	},


	/**
	* Computes the eight corners of the BBox and returns it
	* @method getCorners
	* @param {BBox} bb the bounding box
	* @param {Float32Array} result optional, should be 8 * 3
	* @return {Float32Array} returns the 8 corners
	*/
	getCorners: function(bb, result)
	{
		var center = bb; //.subarray(0,3); AVOID GC
		var halfsize = bb.subarray(3,6);

		var corners = null;
		if(result)
		{
			result.set(this.corners);
			corners = result;
		}
		else
			corners = new Float32Array( this.corners );

		for(var i = 0; i < 8; ++i)		
		{
			var corner = corners.subarray(i*3, i*3+3);
			vec3.multiply( corner, halfsize, corner );
			vec3.add( corner, corner, center );
		}

		return corners;
	},	

	merge: function( out, a, b )
	{
		var min = out.subarray(6,9);
		var max = out.subarray(9,12);
		vec3.min( min, a.subarray(6,9), b.subarray(6,9) );
		vec3.max( max, a.subarray(9,12), b.subarray(9,12) );
		return BBox.setMinMax( out, min, max );
	},

	extendToPoint: function( out, p )
	{
		if( p[0] < out[6] )	out[6] = p[0];
		else if( p[0] > out[9] ) out[9] = p[0];

		if( p[1] < out[7] )	out[7] = p[1];
		else if( p[1] > out[10] ) out[10] = p[1];


		if( p[2] < out[8] )	out[8] = p[2];
		else if( p[2] > out[11] ) out[11] = p[2];

		//recompute 
		var min = out.subarray(6,9);
		var max = out.subarray(9,12);
		var center = vec3.add( out.subarray(0,3), min, max );
		vec3.scale( center, center, 0.5);
		vec3.subtract( out.subarray(3,6), max, center );
		out[12] = vec3.length( out.subarray(3,6) ); //radius		
		return out;
	},

	getCenter: function(bb) { return bb.subarray(0,3); },
	getHalfsize: function(bb) { return bb.subarray(3,6); },
	getMin: function(bb) { return bb.subarray(6,9); },
	getMax: function(bb) { return bb.subarray(9,12); },
	getRadius: function(bb) { return bb[12]; }	
}

global.distanceToPlane = GL.distanceToPlane = function distanceToPlane(plane, point)
{
	return vec3.dot(plane,point) + plane[3];
}

global.planeBoxOverlap = GL.planeBoxOverlap = function planeBoxOverlap(plane, box)
{
	var n = plane; //.subarray(0,3); 
	var d = plane[3];
	//hack, to avoif GC I use indices directly
	var center = box; //.subarray(0,3);
	var halfsize = box; //.subarray(3,6);

	var tmp = vec3.fromValues(
		Math.abs( halfsize[3] * n[0] ),
		Math.abs( halfsize[4] * n[1] ),
		Math.abs( halfsize[5] * n[2] )
	);

	var radius = tmp[0]+tmp[1]+tmp[2];
	var distance = vec3.dot(n,center) + d;

	if (distance <= - radius) return CLIP_OUTSIDE;
	else if (distance <= radius) return CLIP_OVERLAP;
	else return CLIP_INSIDE;
}
