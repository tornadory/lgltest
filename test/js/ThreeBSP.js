THREE.Vector3.prototype.lerp = function ( a, t ) {
	return this.clone().addSelf( a.clone().subSelf( this ).multiplyScalar( t ) );
};

THREE.Vertex.prototype.interpolate = function( other, t ) {
	var v = new THREE.Vertex( this.position.lerp( other.position, t ) );
	v.normal = this.normal.clone();
	return v;
};

THREE.Vertex.prototype.clone = function() {
	var vertex = new THREE.Vertex( this.position.clone() );
	if ( this.normal ) {
		vertex.normal = this.normal.clone();
	}
	return vertex;
};

THREE.Face3.prototype.clone = function() {
	return new THREE.Face3( this.a, this.b, this.c, this.normal.clone(), this.color.clone(), this.materialIndex );
};

THREE.Face3.prototype.flip = function() {
	this.normal.negate();
	
	var t = this.a;
	this.a = this.c;
	this.c = t;
	this.a.normal.negate();
	this.b.normal.negate();
	this.c.normal.negate();
};



THREE.BSPTree = {};
THREE.BSPTree.EPSILON = 1e-5;

THREE.BSPTree.Plane = function( normal, w ) {
	this.normal = normal;
	this.w = w;
};

THREE.BSPTree.Plane.prototype.clone = function() {
	return new THREE.BSPTree.Plane(this.normal.clone(), this.w);
};

THREE.BSPTree.Plane.prototype.flip = function() {
	this.normal = this.normal.clone().negate();
	this.w = -this.w;
};

THREE.BSPTree.Plane.prototype.splitPolygon = function( polygon, coplanarFront, coplanarBack, front, back ) {
	var COPLANAR = 0,
	FRONT = 1,
	BACK = 2,
	SPANNING = 3;
	
	// Classify each point as well as the entire polygon into one of the above
	// four classes.
	var polygonType = 0,
		types = [],
		vertices = [polygon.a, polygon.b, polygon.c],
		t, type, face;
	
	for (var i = 0; i < vertices.length; i++) {
		t = this.normal.dot( vertices[i].position ) - this.w;
		type = ( t < -THREE.BSPTree.EPSILON ) ? BACK : (t > THREE.BSPTree.EPSILON) ? FRONT : COPLANAR;
		polygonType |= type;
		types.push( type );
	}
	
	// Put the polygon in the correct list, splitting it when necessary.
	switch ( polygonType ) {
		case COPLANAR:
			( this.normal.dot( polygon.normal ) > 0 ? coplanarFront : coplanarBack ).push( polygon );
			break;
		case FRONT:
			front.push( polygon );
			break;
		case BACK:
			back.push( polygon );
			break;
		case SPANNING:
			var f = [], b = [];
			for (var i = 0; i < vertices.length; i++) {
				var j = (i + 1) % vertices.length;
				var ti = types[i], tj = types[j];
				var vi = vertices[i], vj = vertices[j];
				if (ti != BACK) f.push( vi );
				if (ti != FRONT) b.push( ti != BACK ? vi.clone() : vi );
				if ((ti | tj) == SPANNING) {
					var t = ( this.w - this.normal.dot( vi.position ) ) / this.normal.dot( vj.position.clone().subSelf( vi.position ) );
					var v = vi.interpolate( vj, t );
					f.push( v.clone() );
					b.push( v.clone() );
				}
			}
			
			if (f.length >= 3) {
				for ( i = 2; i < f.length; i++ ) {
					face = new THREE.Face3(
						f[0], f[i-1], f[i],
						f[0].normal
					);
					front.push( face );
				}
			}
			
			if (b.length >= 3) {
				for ( i = 2; i < b.length; i++ ) {
					face = new THREE.Face3(
						b[0], b[i-1], b[i],
						b[0].normal
					);
					back.push( face );
				}
			}
			
			break;
	}
};

THREE.BSPTree.Node = function ( source, options ) {
	this.plane = null;
	this.front = null;
	this.back = null;
	this.polygons = [];
	
	if ( source ) {
		this.build( source, options );
	}
};

THREE.BSPTree.Node.prototype.clone = function( ) {
	var node = new THREE.BSPTree.Node();
	node.plane = this.plane && this.plane.clone();
	node.front = this.front && this.front.clone();
	node.back = this.back && this.back.clone();
	node.polygons = this.polygons.map( function(p) { return p.clone(); } );
	return node;
};


THREE.BSPTree.Node.prototype.invert = function( ) {
	for (var i = 0; i < this.polygons.length; i++) {
	  this.polygons[i].flip();
	}
	this.plane.flip();
	if (this.front) this.front.invert();
	if (this.back) this.back.invert();
	var temp = this.front;
	this.front = this.back;
	this.back = temp;
};

THREE.BSPTree.Node.prototype.clipPolygons = function( polygons ) {
	var front = [], back = [];
	for (var i = 0; i < polygons.length; i++) {
	  this.plane.splitPolygon( polygons[i], front, back, front, back );
	}
	if (this.front) {
		front = this.front.clipPolygons( front );
	}
	if (this.back) {
		back = this.back.clipPolygons( back );
	} else {
		back = [];
	}
	return front.concat( back );
};

THREE.BSPTree.Node.prototype.clipTo = function( bsp ) {
	this.polygons = bsp.clipPolygons( this.polygons );
	if ( this.front ) this.front.clipTo( bsp );
	if ( this.back ) this.back.clipTo( bsp );
};

THREE.BSPTree.Node.prototype.allPolygons = function( ) {
	var polygons = this.polygons.slice();
	if ( this.front ) polygons = polygons.concat( this.front.allPolygons() );
	if ( this.back ) polygons = polygons.concat( this.back.allPolygons() );
	return polygons;
};

THREE.BSPTree.Node.prototype.build = function( source, options ) {
	var i, faces,
		face1, face2;
	
	options = options || {};
	options.offset = options.offset || {x: 0, y: 0, z:0};
	options.rotation = options.rotation || {x: 0, y: 0, z:0};
	
	if ( source instanceof THREE.Geometry ) {
		faces = source.faces;
		for ( i = 0; i < faces.length; i++ ) {
			
			// Convert any Face4 objects to Face3 so we don't go insane later
			if ( faces[i] instanceof THREE.Face4 ) {
				face1 = new THREE.Face3( source.vertices[faces[i].a].clone(), source.vertices[faces[i].b].clone(), source.vertices[faces[i].d].clone(), faces[i].normal );
				face1.vertexNormals.push(
					faces[i].vertexNormals[0],
					faces[i].vertexNormals[1],
					faces[i].vertexNormals[3]
				);
				
				face2 = new THREE.Face3( source.vertices[faces[i].b].clone(), source.vertices[faces[i].c].clone(), source.vertices[faces[i].d].clone(), faces[i].normal );
				face2.vertexNormals.push(
					faces[i].vertexNormals[1],
					faces[i].vertexNormals[2],
					faces[i].vertexNormals[3]
				);
				faces.splice( i, 1, face1, face2 );
			} else if ( !(faces[i].a instanceof THREE.Vertex) ) {
				faces[i].a = source.vertices[faces[i].a].clone();
				faces[i].b = source.vertices[faces[i].b].clone();
				faces[i].c = source.vertices[faces[i].c].clone();
			}
			
			faces[i].a.normal = faces[i].vertexNormals[0];
			faces[i].b.normal = faces[i].vertexNormals[1];
			faces[i].c.normal = faces[i].vertexNormals[2];
			
			// Apply offset
			faces[i].a.position.addSelf( options.offset );
			faces[i].b.position.addSelf( options.offset );
			faces[i].c.position.addSelf( options.offset );
		}
	} else if ( source instanceof Array ) {
		// Assume it's the correct kind of data
		faces = source;
	} else {
		// No idea what to do with this data
		return;
	}
	
	if (!this.plane) {
		var n = faces[0].b.position.clone().subSelf(
			faces[0].a.position
		).crossSelf(
			faces[0].c.position.clone().subSelf( faces[0].a.position )
		).normalize();
		this.plane = new THREE.BSPTree.Plane(
			n,
			n.clone().dot( faces[0].a.position )
		);
	}
	
	var front = [], back = [];
	for (var i = 0; i < faces.length; i++) {
		this.plane.splitPolygon( faces[i], this.polygons, this.polygons, front, back);
	}
	
	if (front.length) {
		if (!this.front) this.front = new THREE.BSPTree.Node();
		this.front.build( front, options );
	}
	if (back.length) {
		if (!this.back) this.back = new THREE.BSPTree.Node();
		this.back.build( back, options );
	}
};

THREE.BSPTree.Node.prototype.toGeometry = function( ) {
	var i, face,
		geometry = new THREE.Geometry(),
		polygons = this.allPolygons();
	
	for ( i = 0; i < polygons.length; i++ ) {
		// @todo, avoid overlapping vertices
		
		geometry.vertices.push( polygons[i].a, polygons[i].b, polygons[i].c );
		face = polygons[i];
		face.a = geometry.vertices.length - 3;
		face.b = geometry.vertices.length - 2;
		face.c = geometry.vertices.length - 1;
		geometry.faces.push( face );
		
		geometry.faceVertexUvs[0].push( new THREE.UV( ), new THREE.UV( ), new THREE.UV( ) );
	}
	
	geometry.computeBoundingBox();
	
	return geometry;
};

THREE.BSPTree.Node.prototype.union = function( bsp ) {
	var a = this.clone(), b = bsp.clone();
	a.clipTo(b);
	b.clipTo(a);
	b.invert();
	b.clipTo(a);
	b.invert();
	a.build(b.allPolygons());
	return a;
};

THREE.BSPTree.Node.prototype.subtract = function( bsp ) {
	var a = this.clone(), b = bsp.clone();
	a.invert();
	a.clipTo(b);
	b.clipTo(a);
	b.invert();
	b.clipTo(a);
	b.invert();
	a.build(b.allPolygons());
	a.invert();
	return a;	
};

THREE.BSPTree.Node.prototype.intersect = function( bsp ) {
	var a = this.clone(), b = bsp.clone();
	a.invert();
	b.clipTo(a);
	b.invert();
	a.clipTo(b);
	b.clipTo(a);
	a.build(b.allPolygons());
	a.invert();
	return a;
};