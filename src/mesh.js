/**
* @namespace GL
*/

/**
* Indexer used to reuse vertices among a mesh
* @class Indexer
* @constructor
*/
GL.Indexer = function Indexer() {
  this.unique = [];
  this.indices = [];
  this.map = {};
}
GL.Indexer.prototype = {
	add: function(obj) {
    var key = JSON.stringify(obj);
    if (!(key in this.map)) {
      this.map[key] = this.unique.length;
      this.unique.push(obj);
    }
    return this.map[key];
  }
};

/**
* A data buffer to be stored in the GPU
* @class Buffer
* @constructor
* @param {Number} target gl.ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER
* @param {ArrayBufferView} data the data in typed-array format
* @param {number} spacing number of numbers per component (3 per vertex, 2 per uvs...), default 3
* @param {enum} stream_type default gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW 
*/
GL.Buffer = function Buffer( target, data, spacing, stream_type, gl ) {
	if(GL.debug)
		console.log("GL.Buffer created");

	if(gl !== null)
		gl = gl || global.gl;
	this.gl = gl;

	this.buffer = null; //webgl buffer
	this.target = target; //GL.ARRAY_BUFFER, GL.ELEMENT_ARRAY_BUFFER
	this.attribute = null; //name of the attribute in the shader ("a_vertex","a_normal","a_coord",...)

	//optional
	this.data = data;
	this.spacing = spacing || 3;

	if(this.data && this.gl)
		this.upload(stream_type);
}

/**
* Applies an action to every vertex in this buffer
* @method forEach
* @param {function} callback to be called for every vertex (or whatever is contained in the buffer)
*/
GL.Buffer.prototype.forEach = function(callback)
{
	var d = this.data;
	for (var i = 0, s = this.spacing, l = d.length; i < l; i += s)
	{
		callback(d.subarray(i,i+s),i);
	}
	return this; //to concatenate
}

/**
* Applies a mat4 transform to every triplets in the buffer (assuming they are points)
* No upload is performed (to ensure efficiency in case there are several operations performed)
* @method applyTransform
* @param {mat4} mat
*/
GL.Buffer.prototype.applyTransform = function(mat)
{
	var d = this.data;
	for (var i = 0, s = this.spacing, l = d.length; i < l; i += s)
	{
		var v = d.subarray(i,i+s);
		vec3.transformMat4(v,v,mat);
	}
	return this; //to concatenate
}

/**
* Uploads the buffer data (stored in this.data) to the GPU
* @method upload
* @param {number} stream_type default gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW 
*/
GL.Buffer.prototype.upload = function( stream_type ) { //default gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW )
	var spacing = this.spacing || 3; //default spacing	
	var gl = this.gl;
	if(!gl)
		return;

	if(!this.data)
		throw("No data supplied");

	var data = this.data;
	if(!data.buffer)
		throw("Buffers must be typed arrays");

	//I store some stuff inside the WebGL buffer instance, it is supported
	this.buffer = this.buffer || gl.createBuffer();
	if(!this.buffer)
		return; //if the context is lost...

	this.buffer.length = data.length;
	this.buffer.spacing = spacing;

	//store the data format
	switch( data.constructor )
	{
		case Int8Array: this.buffer.gl_type = gl.BYTE; break;
		case Uint8ClampedArray: 
		case Uint8Array: this.buffer.gl_type = gl.UNSIGNED_BYTE; break;
		case Int16Array: this.buffer.gl_type = gl.SHORT; break;
		case Uint16Array: this.buffer.gl_type = gl.UNSIGNED_SHORT; break;
		case Int32Array: this.buffer.gl_type = gl.INT; break;
		case Uint32Array: this.buffer.gl_type = gl.UNSIGNED_INT; break;
		case Float32Array: this.buffer.gl_type = gl.FLOAT; break;
		default: throw("unsupported buffer type");
	}

	gl.bindBuffer(this.target, this.buffer);
	gl.bufferData(this.target, data , stream_type || this.stream_type || gl.STATIC_DRAW);
};
//legacy
GL.Buffer.prototype.compile = GL.Buffer.prototype.upload;


/**
* Assign data to buffer and uploads it (it allows range)
* @method setData
* @param {ArrayBufferView} data in Float32Array format usually
* @param {number} offset offset in bytes
*/
GL.Buffer.prototype.setData = function( data, offset )
{
	if(!data.buffer)
		throw("Data must be typed array");
	offset = offset || 0;

	if(!this.data)
	{
		this.data = data;
		this.upload();
		return;
	}
	else if( this.data.length < data.length )
		throw("buffer is not big enough, you cannot set data to a smaller buffer");

	if(this.data != data)
	{
		if(this.data.length == data.length)
		{
			this.data.set( data );
			this.upload();
			return;
		}

		//upload just part of it
		var new_data_view = new Uint8Array( data.buffer, data.buffer.byteOffset, data.buffer.byteLength );
		var data_view = new Uint8Array( this.data.buffer );
		data_view.set( new_data_view, offset );
		this.uploadRange( offset, new_data_view.length );
	}

};


/**
* Uploads part of the buffer data (stored in this.data) to the GPU
* @method uploadRange
* @param {number} start offset in bytes
* @param {number} size sizes in bytes
*/
GL.Buffer.prototype.uploadRange = function(start, size)
{
	if(!this.data)
		throw("No data stored in this buffer");

	var data = this.data;
	if(!data.buffer)
		throw("Buffers must be typed arrays");

	var view = new Uint8Array( this.data.buffer, start, size );

	var gl = this.gl;
	gl.bindBuffer(this.target, this.buffer);
	gl.bufferSubData(this.target, start, view );
};

/**
* Clones one buffer (it allows to share the same data between both buffers)
* @method clone
* @param {boolean} share if you want that both buffers share the same data (default false)
* return {GL.Buffer} buffer cloned
*/
GL.Buffer.prototype.clone = function(share)
{
	var buffer = new GL.Buffer();
	if(share)
	{
		for(var i in this)
			buffer[i] = this[i];
	}
	else
	{
		if(this.target)
			buffer.target = this.target;
		if(this.gl)
			buffer.gl = this.gl;
		if(this.spacing)
			buffer.spacing = this.spacing;
		if(this.data) //clone data
		{
			buffer.data = new global[ this.data.constructor ]( this.data );
			buffer.upload();
		}
	}
	return buffer;
}


GL.Buffer.prototype.toJSON = function()
{
	if(!this.data)
	{
		console.error("cannot serialize a mesh without data");
		return null;
	}

	return {
		data_type: getClassName(this.data),
		data: this.data.toJSON(),
		target: this.target,
		attribute: this.attribute,
		spacing: this.spacing
	};
}

GL.Buffer.prototype.fromJSON = function(o)
{
	var data_type = global[ o.data_type ] || Float32Array;
	this.data = new data_type( o.data ); //cloned
	this.target = o.target;
	this.spacing = o.spacing || 3;
	this.attribute = o.attribute;
	this.upload( GL.STATIC_DRAW );
}

/**
* Deletes the content from the GPU and destroys the handler
* @method delete
*/
GL.Buffer.prototype.delete = function()
{
	var gl = this.gl;
	gl.deleteBuffer( this.buffer );
	this.buffer = null;
}

/**
* Base class for meshes, it wraps several buffers and some global info like the bounding box
* @class Mesh
* @param {Object} vertexBuffers object with all the vertex streams
* @param {Object} indexBuffers object with all the indices streams
* @param {Object} options
* @param {WebGLContext} gl [Optional] gl context where to create the mesh
* @constructor
*/
global.Mesh = GL.Mesh = function Mesh( vertexbuffers, indexbuffers, options, gl )
{
	if(GL.debug)
		console.log("GL.Mesh created");

	if( gl !== null )
	{
		gl = gl || global.gl;
		this.gl = gl;
	}

	//used to avoid problems with resources moving between different webgl context
	this._context_id = gl.context_id; 

	this.vertexBuffers = {};
	this.indexBuffers = {};

	//here you can store extra info, like groups, which is an array of { name, start, length, material }
	this.info = {
		groups: []
	}; 
	this._bounding = BBox.create(); //here you can store a AABB in BBox format

	if(vertexbuffers || indexbuffers)
		this.addBuffers( vertexbuffers, indexbuffers, options ? options.stream_type : null );

	if(options)
		for(var i in options)
			this[i] = options[i];
};

Mesh.common_buffers = {
	"vertices": { spacing:3, attribute: "a_vertex"},
	"vertices2D": { spacing:2, attribute: "a_vertex2D"},
	"normals": { spacing:3, attribute: "a_normal"},
	"coords": { spacing:2, attribute: "a_coord"},
	"coords1": { spacing:2, attribute: "a_coord1"},
	"coords2": { spacing:2, attribute: "a_coord2"},
	"colors": { spacing:4, attribute: "a_color"}, 
	"tangents": { spacing:3, attribute: "a_tangent"},
	"bone_indices": { spacing:4, attribute: "a_bone_indices", type: Uint8Array },
	"weights": { spacing:4, attribute: "a_weights"},
	"extra": { spacing:1, attribute: "a_extra"},
	"extra2": { spacing:2, attribute: "a_extra2"},
	"extra3": { spacing:3, attribute: "a_extra3"},
	"extra4": { spacing:4, attribute: "a_extra4"}
};

Mesh.default_datatype = Float32Array;

Object.defineProperty( Mesh.prototype, "bounding", {
	set: function(v)
	{
		if(!v)
			return;
		if(v.length < 13)
			throw("Bounding must use the BBox bounding format of 13 floats: center, halfsize, min, max, radius");
		this._bounding.set(v);
	},
	get: function()
	{
		return this._bounding;
	}
});

/**
* Adds buffer to mesh
* @method addBuffer
* @param {string} name
* @param {Buffer} buffer 
*/

Mesh.prototype.addBuffer = function(name, buffer)
{
	if(buffer.target == gl.ARRAY_BUFFER)
		this.vertexBuffers[name] = buffer;
	else
		this.indexBuffers[name] = buffer;

	if(!buffer.attribute)
		buffer.attribute = GL.Mesh.common_buffers[name].attribute;
}


/**
* Adds vertex and indices buffers to a mesh
* @method addBuffers
* @param {Object} vertexBuffers object with all the vertex streams
* @param {Object} indexBuffers object with all the indices streams
* @param {enum} stream_type default gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW )
*/
Mesh.prototype.addBuffers = function( vertexbuffers, indexbuffers, stream_type )
{
	var num_vertices = 0;

	if(this.vertexBuffers["vertices"])
		num_vertices = this.vertexBuffers["vertices"].data.length / 3;

	for(var i in vertexbuffers)
	{
		var data = vertexbuffers[i];
		if(!data) 
			continue;
		
		if( data.constructor == GL.Buffer )
		{
			data = data.data;
		}
		else if( typeof(data[0]) != "number") //linearize: (transform Arrays in typed arrays)
		{
			var newdata = [];
			for (var j = 0, chunk = 10000; j < data.length; j += chunk) {
			  newdata = Array.prototype.concat.apply(newdata, data.slice(j, j + chunk));
			}
			data = newdata;
		}

		var stream_info = GL.Mesh.common_buffers[i];

		//cast to typed float32 if no type is specified
		if(data.constructor === Array)
		{
			var datatype = GL.Mesh.default_datatype;
			if(stream_info && stream_info.type)
				datatype = stream_info.type;
			data = new datatype( data );
		}

		//compute spacing
		if(i == "vertices")
			num_vertices = data.length / 3;
		var spacing = data.length / num_vertices;
		if(stream_info && stream_info.spacing)
			spacing = stream_info.spacing;

		//add and upload
		var attribute = "a_" + i;
		if(stream_info && stream_info.attribute)
			attribute = stream_info.attribute;
	
		if( this.vertexBuffers[i] )
			this.updateVertexBuffer( i, attribute, spacing, data, stream_type );
		else
			this.createVertexBuffer( i, attribute, spacing, data, stream_type );
	}

	if(indexbuffers)
		for(var i in indexbuffers)
		{
			var data = indexbuffers[i];
			if(!data) continue;

			if( data.constructor == GL.Buffer )
			{
				data = data.data;
			}
			if( typeof(data[0]) != "number") //linearize
			{
				newdata = [];
				for (var i = 0, chunk = 10000; i < data.length; i += chunk) {
				  newdata = Array.prototype.concat.apply(newdata, data.slice(i, i + chunk));
				}
				data = newdata;
			}

			//cast to typed
			if(data.constructor === Array)
			{
				var datatype = Uint16Array;
				if(num_vertices > 256*256)
					datatype = Uint32Array;
				data = new datatype( data );
			}

			this.createIndexBuffer( i, data );
		}
}

/**
* Creates a new empty buffer and attachs it to this mesh
* @method createVertexBuffer
* @param {String} name "vertices","normals"...
* @param {String} attribute name of the stream in the shader "a_vertex","a_normal",... [optional, if omitted is used the common_buffers]
* @param {number} spacing components per vertex [optional, if ommited is used the common_buffers, if not found then uses 3 ]
* @param {ArrayBufferView} buffer_data the data in typed array format [optional, if ommited it created an empty array of getNumVertices() * spacing]
* @param {enum} stream_type [optional, default = gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW ) ]
*/

Mesh.prototype.createVertexBuffer = function( name, attribute, buffer_spacing, buffer_data, stream_type ) {

	var common = GL.Mesh.common_buffers[name]; //generic info about a buffer with the same name

	if (!attribute && common)
		attribute = common.attribute;

	if (!attribute)
		throw("Buffer added to mesh without attribute name");

	if (!buffer_spacing && common)
	{
		if(common && common.spacing)
			buffer_spacing = common.spacing;
		else
			buffer_spacing = 3;
	}

	if(!buffer_data)
	{
		var num = this.getNumVertices();
		if(!num)
			throw("Cannot create an empty buffer in a mesh without vertices (vertices are needed to know the size)");
		buffer_data = new (GL.Mesh.default_datatype)(num * buffer_spacing);
	}

	if(!buffer_data.buffer)
		throw("Buffer data MUST be typed array");

	//used to ensure the buffers are held in the same gl context as the mesh
	var buffer = this.vertexBuffers[name] = new GL.Buffer( gl.ARRAY_BUFFER, buffer_data, buffer_spacing, stream_type, this.gl );
	buffer.name = name;
	buffer.attribute = attribute;

	return buffer;
}

/**
* Updates a vertex buffer 
* @method updateVertexBuffer
* @param {String} name the name of the buffer
* @param {String} attribute the name of the attribute in the shader
* @param {number} spacing number of numbers per component (3 per vertex, 2 per uvs...), default 3
* @param {*} data the array with all the data
* @param {enum} stream_type default gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW 
*/
Mesh.prototype.updateVertexBuffer = function( name, attribute, buffer_spacing, buffer_data, stream_type ) {
	var buffer = this.vertexBuffers[name];
	if(!buffer)
	{
		console.log("buffer not found: ",name);
		return;
	}

	if(!buffer_data.length)
		return;

	buffer.attribute = attribute;
	buffer.spacing = buffer_spacing;
	buffer.data = buffer_data;
	buffer.upload( stream_type );
}


/**
* Removes a vertex buffer from the mesh
* @method removeVertexBuffer
* @param {String} name "vertices","normals"...
* @param {Boolean} free if you want to remove the data from the GPU
*/
Mesh.prototype.removeVertexBuffer = function(name, free) {
	var buffer = this.vertexBuffers[name];
	if(!buffer)
		return;
	if(free)
		buffer.delete();
	delete this.vertexBuffers[name];
}

/**
* Returns a vertex buffer
* @method getVertexBuffer
* @param {String} name of vertex buffer
* @return {Buffer} the buffer
*/
Mesh.prototype.getVertexBuffer = function(name)
{
	return this.vertexBuffers[name];
}


/**
* Creates a new empty index buffer and attachs it to this mesh
* @method createIndexBuffer
* @param {String} name 
* @param {Typed array} data 
* @param {enum} stream_type gl.STATIC_DRAW, gl.DYNAMIC_DRAW, gl.STREAM_DRAW
*/
Mesh.prototype.createIndexBuffer = function(name, buffer_data, stream_type) {
	//(target, data, spacing, stream_type, gl)

	//cast to typed
	if(buffer_data.constructor === Array)
	{
		var datatype = Uint16Array;
		var vertices = this.vertexBuffers["vertices"];
		if(vertices)
		{
			var num_vertices = vertices.data.length / 3;
			if(num_vertices > 256*256)
				datatype = Uint32Array;
			buffer_data = new datatype( buffer_data );
		}
	}

	var buffer = this.indexBuffers[name] = new GL.Buffer(gl.ELEMENT_ARRAY_BUFFER, buffer_data, 0, stream_type, this.gl );
	return buffer;
}

/**
* Returns a vertex buffer
* @method getBuffer
* @param {String} name of vertex buffer
* @return {Buffer} the buffer
*/
Mesh.prototype.getBuffer = function(name)
{
	return this.vertexBuffers[name];
}

/**
* Returns a index buffer
* @method getIndexBuffer
* @param {String} name of index buffer
* @return {Buffer} the buffer
*/
Mesh.prototype.getIndexBuffer = function(name)
{
	return this.indexBuffers[name];
}

/**
* Removes an index buffer from the mesh
* @method removeIndexBuffer
* @param {String} name "vertices","normals"...
* @param {Boolean} free if you want to remove the data from the GPU
*/
Mesh.prototype.removeIndexBuffer = function(name, free) {
	var buffer = this.indexBuffers[name];
	if(!buffer)
		return;
	if(free)
		buffer.delete();
	delete this.indexBuffers[name];
}


/**
* Uploads data inside buffers to VRAM.
* @method upload
* @param {number} buffer_type gl.STATIC_DRAW, gl.DYNAMIC_DRAW, gl.STREAM_DRAW
*/
Mesh.prototype.upload = function(buffer_type) {
	for (var attribute in this.vertexBuffers) {
		var buffer = this.vertexBuffers[attribute];
		//buffer.data = this[buffer.name];
		buffer.upload(buffer_type);
	}

	for (var name in this.indexBuffers) {
		var buffer = this.indexBuffers[name];
		//buffer.data = this[name];
		buffer.upload();
	}
}

//LEGACY, plz remove
Mesh.prototype.compile = Mesh.prototype.upload;


Mesh.prototype.deleteBuffers = function()
{
	for(var i in this.vertexBuffers)
	{
		var buffer = this.vertexBuffers[i];
		buffer.delete();
	}
	this.vertexBuffers = {};

	for(var i in this.indexBuffers)
	{
		var buffer = this.indexBuffers[i];
		buffer.delete();
	}
	this.indexBuffers = {};
}

Mesh.prototype.delete = Mesh.prototype.deleteBuffers;

Mesh.prototype.bindBuffers = function( shader )
{
	// enable attributes as necessary.
	for (var name in this.vertexBuffers)
	{
		var buffer = this.vertexBuffers[ name ];
		var attribute = buffer.attribute || name;
		var location = shader.attributes[ attribute ];
		if (location == null || !buffer.buffer) 
			continue; 
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
		gl.enableVertexAttribArray(location);
		gl.vertexAttribPointer(location, buffer.buffer.spacing, buffer.buffer.gl_type, false, 0, 0);
	}
}

Mesh.prototype.unbindBuffers = function( shader )
{
	// disable attributes
	for (var name in this.vertexBuffers)
	{
		var buffer = this.vertexBuffers[ name ];
		var attribute = buffer.attribute || name;
		var location = shader.attributes[ attribute ];
		if (location == null || !buffer.buffer)
			continue; //ignore this buffer
		gl.disableVertexAttribArray( shader.attributes[attribute] );
	}
}

/**
* Creates a clone of the mesh, the datarrays are cloned too
* @method clone
*/
Mesh.prototype.clone = function( gl )
{
	var gl = gl || global.gl;
	var vbs = {};
	var ibs = {};

	for(var i in this.vertexBuffers)
	{
		var b = this.vertexBuffers[i];
		vbs[i] = new b.data.constructor( b.data ); //clone
	}
	for(var i in this.indexBuffers)
	{
		var b = this.indexBuffers[i];
		ibs[i] = new b.data.constructor( b.data ); //clone
	}

	return new GL.Mesh( vbs, ibs, undefined, gl );
}

/**
* Creates a clone of the mesh, but the data-arrays are shared between both meshes (useful for sharing a mesh between contexts)
* @method clone
*/
Mesh.prototype.cloneShared = function( gl )
{
	var gl = gl || global.gl;
	return new GL.Mesh( this.vertexBuffers, this.indexBuffers, undefined, gl );
}


/**
* Creates an object with the info of the mesh (useful to transfer to workers)
* @method toObject
*/
Mesh.prototype.toObject = function()
{
	var vbs = {};
	var ibs = {};

	for(var i in this.vertexBuffers)
	{
		var b = this.vertexBuffers[i];
		vbs[i] = { 
			spacing: b.spacing,
			data: new b.data.constructor( b.data ) //clone
		}; 
	}
	for(var i in this.indexBuffers)
	{
		var b = this.indexBuffers[i];
		ibs[i] = { 
			data: new b.data.constructor( b.data ) //clone
		}
	}

	return { 
		vertexBuffers: vbs, 
		indexBuffers: ibs,
		info: this.info ? cloneObject( this.info ) : null,
		bounding: this._bounding.toJSON()
	};
}


Mesh.prototype.toJSON = function()
{
	var r = {
		vertexBuffers: {},
		indexBuffers: {},
		info: this.info ? cloneObject( this.info ) : null,
		bounding: this._bounding.toJSON() 
	};

	for(var i in this.vertexBuffers)
		r.vertexBuffers[i] = this.vertexBuffers[i].toJSON();

	for(var i in this.indexBuffers)
		r.indexBuffers[i] = this.indexBuffers[i].toJSON();

	return r;
}

Mesh.prototype.fromJSON = function(o)
{
	this.vertexBuffers = {};
	this.indexBuffers = {};

	for(var i in o.vertexBuffers)
	{
		if(!o.vertexBuffers[i])
			continue;
		var buffer = new GL.Buffer();
		buffer.fromJSON( o.vertexBuffers[i] );
		if(!buffer.attribute && GL.Mesh.common_buffers[i])
			buffer.attribute = GL.Mesh.common_buffers[i].attribute;
		this.vertexBuffers[i] = buffer;
	}

	for(var i in o.indexBuffers)
	{
		if(!o.indexBuffers[i])
			continue;
		var buffer = new GL.Buffer();
		buffer.fromJSON( o.indexBuffers[i] );
		this.indexBuffers[i] = buffer;
	}

	if(o.info)
		this.info = cloneObject( o.info );
	if(o.bounding)
		this.bounding = o.bounding; //setter does the job
}


/**
* Computes some data about the mesh
* @method generateMetadata
*/
Mesh.prototype.generateMetadata = function()
{
	var metadata = {};

	var vertices = this.vertexBuffers["vertices"].data;
	var triangles = this.indexBuffers["triangles"].data;

	metadata.vertices = vertices.length / 3;
	if(triangles)
		metadata.faces = triangles.length / 3;
	else
		metadata.faces = vertices.length / 9;

	metadata.indexed = !!this.metadata.faces;
	this.metadata = metadata;
}

//never tested
/*
Mesh.prototype.draw = function(shader, mode, range_start, range_length)
{
	if(range_length == 0) return;

	// Create and enable attribute pointers as necessary.
	var length = 0;
	for (var attribute in this.vertexBuffers) {
	  var buffer = this.vertexBuffers[attribute];
	  var location = shader.attributes[attribute] ||
		gl.getAttribLocation(shader.program, attribute);
	  if (location == -1 || !buffer.buffer) continue;
	  shader.attributes[attribute] = location;
	  gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
	  gl.enableVertexAttribArray(location);
	  gl.vertexAttribPointer(location, buffer.buffer.spacing, gl.FLOAT, false, 0, 0);
	  length = buffer.buffer.length / buffer.buffer.spacing;
	}

	//range rendering
	var offset = 0;
	if(arguments.length > 3) //render a polygon range
		offset = range_start * (this.indexBuffer ? this.indexBuffer.constructor.BYTES_PER_ELEMENT : 1); //in bytes (Uint16 == 2 bytes)

	if(arguments.length > 4)
		length = range_length;
	else if (this.indexBuffer)
		length = this.indexBuffer.buffer.length - offset;

	// Disable unused attribute pointers.
	for (var attribute in shader.attributes) {
	  if (!(attribute in this.vertexBuffers)) {
		gl.disableVertexAttribArray(shader.attributes[attribute]);
	  }
	}

	// Draw the geometry.
	if (length && (!this.indexBuffer || indexBuffer.buffer)) {
	  if (this.indexBuffer) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.buffer);
		gl.drawElements(mode, length, gl.UNSIGNED_SHORT, offset);
	  } else {
		gl.drawArrays(mode, offset, length);
	  }
	}

	return this;
}
*/

/**
* Creates a new index stream with wireframe 
* @method computeWireframe
*/
Mesh.prototype.computeWireframe = function() {
	var index_buffer = this.indexBuffers["triangles"];

	var vertices = this.vertexBuffers["vertices"].data;
	var num_vertices = (vertices.length/3);

	if(!index_buffer) //unindexed
	{
		var num_triangles = num_vertices / 3;
		var buffer = num_vertices > 256*256 ? new Uint32Array( num_triangles * 6 ) : new Uint16Array( num_triangles * 6 );
		for(var i = 0; i < num_vertices; i += 3)
		{
			buffer[i*2] = i;
			buffer[i*2+1] = i+1;
			buffer[i*2+2] = i+1;
			buffer[i*2+3] = i+2;
			buffer[i*2+4] = i+2;
			buffer[i*2+5] = i;
		}

	}
	else //indexed
	{
		var data = index_buffer.data;

		var indexer = new GL.Indexer();
		for (var i = 0; i < data.length; i+=3) {
		  var t = data.subarray(i,i+3);
		  for (var j = 0; j < t.length; j++) {
			var a = t[j], b = t[(j + 1) % t.length];
			indexer.add([Math.min(a, b), Math.max(a, b)]);
		  }
		}

		//linearize
		var unique = indexer.unique;
		var buffer = num_vertices > 256*256 ? new Uint32Array( unique.length * 2 ) : new Uint16Array( unique.length * 2 );
		for(var i = 0, l = unique.length; i < l; ++i)
			buffer.set(unique[i],i*2);
	}

	//create stream
	this.createIndexBuffer('wireframe', buffer);
	return this;
}


/**
* Multiplies every normal by -1 and uploads it
* @method flipNormals
* @param {enum} stream_type default gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW)
*/
Mesh.prototype.flipNormals = function( stream_type  ) {
	var normals_buffer = this.vertexBuffers["normals"];
	if(!normals_buffer)
		return;
	var data = normals_buffer.data;
	var l = data.length;
	for(var i = 0; i < l; ++i)
		data[i] *= -1;
	normals_buffer.upload( stream_type );

	//reverse indices too
	if( !this.indexBuffers["triangles"] )
		this.computeIndices(); //create indices

	var triangles_buffer = this.indexBuffers["triangles"];
	var data = triangles_buffer.data;
	var l = data.length;
	for(var i = 0; i < l; i += 3)
	{
		var tmp = data[i];
		data[i] = data[i+1];
		data[i+1] = tmp;
		//the [i+2] stays the same
	}
	triangles_buffer.upload( stream_type );
}


/**
* Compute indices for a mesh where vertices are shared
* @method computeIndices
*/
Mesh.prototype.computeIndices = function() {

	//cluster by distance
	var new_vertices = [];
	var new_normals = [];
	var new_coords = [];

	var indices = [];

	var old_vertices_buffer = this.vertexBuffers["vertices"];
	var old_normals_buffer = this.vertexBuffers["normals"];
	var old_coords_buffer = this.vertexBuffers["coords"];

	var old_vertices_data = old_vertices_buffer.data;

	var old_normals_data = null;
	if( old_normals_buffer )
		old_normals_data = old_normals_buffer.data;

	var old_coords_data = null;
	if( old_coords_buffer )
		old_coords_data = old_coords_buffer.data;


	var indexer = {};

	var l = old_vertices_data.length / 3;
	for(var i = 0; i < l; ++i)
	{
		var v = old_vertices_data.subarray( i*3,(i+1)*3 );
		var key = (v[0] * 1000)|0;

		//search in new_vertices
		var j = 0;
		var candidates = indexer[key];
		if(candidates)
		{
			var l2 = candidates.length;
			for(; j < l2; j++)
			{
				var v2 = new_vertices[ candidates[j] ];
				//same vertex
				if( vec3.sqrDist( v, v2 ) < 0.01 )
				{
					indices.push(j);
					break;
				}
			}
		}

		/*
		var l2 = new_vertices.length;
		for(var j = 0; j < l2; j++)
		{
			//same vertex
			if( vec3.sqrDist( v, new_vertices[j] ) < 0.001 )
			{
				indices.push(j);
				break;
			}
		}
		*/

		if(candidates && j != l2)
			continue;

		var index = j;
		new_vertices.push(v);
		if( indexer[ key ] )
			indexer[ key ].push( index );
		else
			indexer[ key ] = [ index ];

		if(old_normals_data)
			new_normals.push( old_normals_data.subarray(i*3, (i+1)*3) );
		if(old_coords_data)
			new_coords.push( old_coords_data.subarray(i*2, (i+1)*2) );
		indices.push(index);
	}

	this.vertexBuffers = {}; //erase all

	//new buffers
	this.createVertexBuffer( 'vertices', GL.Mesh.common_buffers["vertices"].attribute, 3, linearizeArray( new_vertices ) );	
	if(old_normals_data)
		this.createVertexBuffer( 'normals', GL.Mesh.common_buffers["normals"].attribute, 3, linearizeArray( new_normals ) );	
	if(old_coords_data)
		this.createVertexBuffer( 'coords', GL.Mesh.common_buffers["coords"].attribute, 2, linearizeArray( new_coords ) );	

	this.createIndexBuffer( "triangles", indices );
}

/**
* Breaks the indices
* @method explodeIndices
*/
Mesh.prototype.explodeIndices = function( buffer_name ) {

	buffer_name = buffer_name || "triangles";

	var indices_buffer = this.getIndexBuffer( buffer_name );
	if(!indices_buffer)
		return;

	var indices = indices_buffer.data;

	//cluster by distance
	var new_vertices = new Float32Array(indices.length * 3);
	var new_normals = null;
	var new_coords = null;

	var old_vertices_buffer = this.vertexBuffers["vertices"];
	var old_vertices = old_vertices_buffer.data;

	var old_normals_buffer = this.vertexBuffers["normals"];
	var old_normals = null;
	if(old_normals_buffer)
	{
		old_normals = old_normals_buffer.data;
		new_normals = new Float32Array(indices.length * 3);
	}

	var old_coords_buffer = this.vertexBuffers["coords"];
	var old_coords = null;
	if( old_coords_buffer )
	{
		old_coords = old_coords_buffer.data;
		new_coords = new Float32Array(indices.length * 2);
	}

	for(var i = 0, l = indices.length; i < l; ++i)
	{
		var index = indices[i];
		new_vertices.set( old_vertices.subarray( index*3, index*3 + 3 ), i*3 );
		if(old_normals)
			new_normals.set( old_normals.subarray( index*3, index*3 + 3 ), i*3 );
		if(old_coords)
			new_coords.set( old_coords.subarray( index*2, index*2 + 2 ), i*2 );
	}

	//erase all
	this.vertexBuffers = {}; 

	//new buffers
	this.createVertexBuffer( 'vertices', GL.Mesh.common_buffers["vertices"].attribute, 3, new_vertices );	
	if(new_normals)
		this.createVertexBuffer( 'normals', GL.Mesh.common_buffers["normals"].attribute, 3, new_normals );	
	if(new_coords)
		this.createVertexBuffer( 'coords', GL.Mesh.common_buffers["coords"].attribute, 2, new_coords );	

	delete this.indexBuffers[ buffer_name ];
}



/**
* Creates a stream with the normals
* @method computeNormals
* @param {enum} stream_type default gl.STATIC_DRAW (other: gl.DYNAMIC_DRAW, gl.STREAM_DRAW)
*/
Mesh.prototype.computeNormals = function( stream_type  ) {
	var vertices_buffer = this.vertexBuffers["vertices"];
	if(!vertices_buffer)
		return console.error("Cannot compute normals of a mesh without vertices");

	var vertices = this.vertexBuffers["vertices"].data;
	var num_vertices = vertices.length / 3;

	//create because it is faster than filling it with zeros
	var normals = new Float32Array( vertices.length );

	var triangles = null;
	if(this.indexBuffers["triangles"])
		triangles = this.indexBuffers["triangles"].data;

	var temp = GL.temp_vec3;
	var temp2 = GL.temp2_vec3;

	var i1,i2,i3,v1,v2,v3,n1,n2,n3;

	//compute the plane normal
	var l = triangles ? triangles.length : vertices.length;
	for (var a = 0; a < l; a+=3)
	{
		if(triangles)
		{
			i1 = triangles[a];
			i2 = triangles[a+1];
			i3 = triangles[a+2];

			v1 = vertices.subarray(i1*3,i1*3+3);
			v2 = vertices.subarray(i2*3,i2*3+3);
			v3 = vertices.subarray(i3*3,i3*3+3);

			n1 = normals.subarray(i1*3,i1*3+3);
			n2 = normals.subarray(i2*3,i2*3+3);
			n3 = normals.subarray(i3*3,i3*3+3);
		}
		else
		{
			v1 = vertices.subarray(a*3,a*3+3);
			v2 = vertices.subarray(a*3+3,a*3+6);
			v3 = vertices.subarray(a*3+6,a*3+9);

			n1 = normals.subarray(a*3,a*3+3);
			n2 = normals.subarray(a*3+3,a*3+6);
			n3 = normals.subarray(a*3+6,a*3+9);
		}

		vec3.sub( temp, v2, v1 );
		vec3.sub( temp2, v3, v1 );
		vec3.cross( temp, temp, temp2 );
		vec3.normalize(temp,temp);

		//save
		vec3.add( n1, n1, temp );
		vec3.add( n2, n2, temp );
		vec3.add( n3, n3, temp );
	}

	//normalize if vertices are shared
	if(triangles)
	for (var a = 0, l = normals.length; a < l; a+=3)
	{
		var n = normals.subarray(a,a+3);
		vec3.normalize(n,n);
	}

	var normals_buffer = this.vertexBuffers["normals"];

	if(normals_buffer)
	{
		normals_buffer.data = normals;
		normals_buffer.upload( stream_type );
	}
	else
		return this.createVertexBuffer('normals', GL.Mesh.common_buffers["normals"].attribute, 3, normals );
	return normals_buffer;
}


/**
* Creates a new stream with the tangents
* @method computeTangents
*/
Mesh.prototype.computeTangents = function()
{
	var vertices_buffer = this.vertexBuffers["vertices"];
	if(!vertices_buffer)
		return console.error("Cannot compute tangents of a mesh without vertices");

	var normals_buffer = this.vertexBuffers["normals"];
	if(!normals_buffer)
		return console.error("Cannot compute tangents of a mesh without normals");

	var uvs_buffer = this.vertexBuffers["coords"];
	if(!uvs_buffer)
		return console.error("Cannot compute tangents of a mesh without uvs");

	var triangles_buffer = this.indexBuffers["triangles"];
	if(!triangles_buffer)
		return console.error("Cannot compute tangents of a mesh without indices");

	var vertices = vertices_buffer.data;
	var normals = normals_buffer.data;
	var uvs = uvs_buffer.data;
	var triangles = triangles_buffer.data;

	if(!vertices || !normals || !uvs) return;

	var num_vertices = vertices.length / 3;

	var tangents = new Float32Array(num_vertices * 4);
	
	//temporary (shared)
	var tan1 = new Float32Array(num_vertices*3*2);
	var tan2 = tan1.subarray(num_vertices*3);

	var a,l;
	var sdir = vec3.create();
	var tdir = vec3.create();
	var temp = vec3.create();
	var temp2 = vec3.create();

	for (a = 0, l = triangles.length; a < l; a+=3)
	{
		var i1 = triangles[a];
		var i2 = triangles[a+1];
		var i3 = triangles[a+2];

		var v1 = vertices.subarray(i1*3,i1*3+3);
		var v2 = vertices.subarray(i2*3,i2*3+3);
		var v3 = vertices.subarray(i3*3,i3*3+3);

		var w1 = uvs.subarray(i1*2,i1*2+2);
		var w2 = uvs.subarray(i2*2,i2*2+2);
		var w3 = uvs.subarray(i3*2,i3*2+2);

		var x1 = v2[0] - v1[0];
		var x2 = v3[0] - v1[0];
		var y1 = v2[1] - v1[1];
		var y2 = v3[1] - v1[1];
		var z1 = v2[2] - v1[2];
		var z2 = v3[2] - v1[2];

		var s1 = w2[0] - w1[0];
		var s2 = w3[0] - w1[0];
		var t1 = w2[1] - w1[1];
		var t2 = w3[1] - w1[1];

		var r;
		var den = (s1 * t2 - s2 * t1);
		if ( Math.abs(den) < 0.000000001 )
		  r = 0.0;
		else
		  r = 1.0 / den;

		vec3.copy(sdir, [(t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r] );
		vec3.copy(tdir, [(s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r] );

		vec3.add( tan1.subarray( i1*3, i1*3+3), tan1.subarray( i1*3, i1*3+3), sdir);
		vec3.add( tan1.subarray( i2*3, i2*3+3), tan1.subarray( i2*3, i2*3+3), sdir);
		vec3.add( tan1.subarray( i3*3, i3*3+3), tan1.subarray( i3*3, i3*3+3), sdir);

		vec3.add( tan2.subarray( i1*3, i1*3+3), tan2.subarray( i1*3, i1*3+3), tdir);
		vec3.add( tan2.subarray( i2*3, i2*3+3), tan2.subarray( i2*3, i2*3+3), tdir);
		vec3.add( tan2.subarray( i3*3, i3*3+3), tan2.subarray( i3*3, i3*3+3), tdir);
	}

	for (a = 0, l = vertices.length; a < l; a+=3)
	{
		var n = normals.subarray(a,a+3);
		var t = tan1.subarray(a,a+3);

		// Gram-Schmidt orthogonalize
		vec3.subtract(temp, t, vec3.scale(temp, n, vec3.dot(n, t) ) );
		vec3.normalize(temp,temp);

		// Calculate handedness
		var w = ( vec3.dot( vec3.cross(temp2, n, t), tan2.subarray(a,a+3) ) < 0.0) ? -1.0 : 1.0;
		tangents.set([temp[0], temp[1], temp[2], w],(a/3)*4);
	}

	this.createVertexBuffer('tangents', Mesh.common_buffers["tangents"].attribute, 4, tangents );
}

/**
* Creates texture coordinates using a triplanar aproximation
* @method computeTextureCoordinates
*/
Mesh.prototype.computeTextureCoordinates = function( stream_type )
{
	var vertices_buffer = this.vertexBuffers["vertices"];
	if(!vertices_buffer)
		return console.error("Cannot compute uvs of a mesh without vertices");

	this.explodeIndices( "triangles" );

	var vertices = vertices_buffer.data;
	var num_vertices = vertices.length / 3;

	var uvs_buffer = this.vertexBuffers["coords"];
	var uvs = new Float32Array( num_vertices * 2 );

	var triangles_buffer = this.indexBuffers["triangles"];
	var triangles = null;
	if( triangles_buffer )
		triangles = triangles_buffer.data;

	var plane_normal = vec3.create();
	var side1 = vec3.create();
	var side2 = vec3.create();

	var bbox = this.getBoundingBox();
	var bboxcenter = BBox.getCenter( bbox );
	var bboxhs = vec3.create();
	bboxhs.set( BBox.getHalfsize( bbox ) ); //careful, this is a reference
	vec3.scale( bboxhs, bboxhs, 2 );

	var num = triangles ? triangles.length : vertices.length/3;

	for (var a = 0; a < num; a+=3)
	{
		if(triangles)
		{
			var i1 = triangles[a];
			var i2 = triangles[a+1];
			var i3 = triangles[a+2];

			var v1 = vertices.subarray(i1*3,i1*3+3);
			var v2 = vertices.subarray(i2*3,i2*3+3);
			var v3 = vertices.subarray(i3*3,i3*3+3);

			var uv1 = uvs.subarray(i1*2,i1*2+2);
			var uv2 = uvs.subarray(i2*2,i2*2+2);
			var uv3 = uvs.subarray(i3*2,i3*2+2);
		}
		else
		{
			var v1 = vertices.subarray((a)*3,(a)*3+3);
			var v2 = vertices.subarray((a+1)*3,(a+1)*3+3);
			var v3 = vertices.subarray((a+2)*3,(a+2)*3+3);

			var uv1 = uvs.subarray((a)*2,(a)*2+2);
			var uv2 = uvs.subarray((a+1)*2,(a+1)*2+2);
			var uv3 = uvs.subarray((a+2)*2,(a+2)*2+2);
		}

		vec3.sub(side1, v1, v2 );
		vec3.sub(side2, v1, v3 );
		vec3.cross( plane_normal, side1, side2 );
		//vec3.normalize( plane_normal, plane_normal ); //not necessary

		plane_normal[0] = Math.abs( plane_normal[0] );
		plane_normal[1] = Math.abs( plane_normal[1] );
		plane_normal[2] = Math.abs( plane_normal[2] );

		if( plane_normal[0] > plane_normal[1] && plane_normal[0] > plane_normal[2])
		{
			//X
			uv1[0] = (v1[2] - bboxcenter[2]) / bboxhs[2];
			uv1[1] = (v1[1] - bboxcenter[1]) / bboxhs[1];
			uv2[0] = (v2[2] - bboxcenter[2]) / bboxhs[2];
			uv2[1] = (v2[1] - bboxcenter[1]) / bboxhs[1];
			uv3[0] = (v3[2] - bboxcenter[2]) / bboxhs[2];
			uv3[1] = (v3[1] - bboxcenter[1]) / bboxhs[1];
		}
		else if ( plane_normal[1] > plane_normal[2])
		{
			//Y
			uv1[0] = (v1[0] - bboxcenter[0]) / bboxhs[0];
			uv1[1] = (v1[2] - bboxcenter[2]) / bboxhs[2];
			uv2[0] = (v2[0] - bboxcenter[0]) / bboxhs[0];
			uv2[1] = (v2[2] - bboxcenter[2]) / bboxhs[2];
			uv3[0] = (v3[0] - bboxcenter[0]) / bboxhs[0];
			uv3[1] = (v3[2] - bboxcenter[2]) / bboxhs[2];
		}
		else
		{
			//Z
			uv1[0] = (v1[0] - bboxcenter[0]) / bboxhs[0];
			uv1[1] = (v1[1] - bboxcenter[1]) / bboxhs[1];
			uv2[0] = (v2[0] - bboxcenter[0]) / bboxhs[0];
			uv2[1] = (v2[1] - bboxcenter[1]) / bboxhs[1];
			uv3[0] = (v3[0] - bboxcenter[0]) / bboxhs[0];
			uv3[1] = (v3[1] - bboxcenter[1]) / bboxhs[1];
		}
	}

	if(uvs_buffer)
	{
		uvs_buffer.data = uvs;
		uvs_buffer.upload( stream_type );
	}
	else
		this.createVertexBuffer('coords', Mesh.common_buffers["coords"].attribute, 2, uvs );
}


/**
* Computes the number of vertices
* @method getVertexNumber
* @param {typed Array} vertices array containing all the vertices
*/
Mesh.prototype.getNumVertices = function() {
	var b = this.vertexBuffers["vertices"];
	if(!b) return 0;
	return b.data.length / b.spacing;
}


/**
* Computes bounding information
* @method Mesh.computeBoundingBox
* @param {typed Array} vertices array containing all the vertices
*/
Mesh.computeBoundingBox = function( vertices, bb ) {

	if(!vertices)
		return;

	var min = vec3.clone( vertices.subarray(0,3) );
	var max = vec3.clone( vertices.subarray(0,3) );
	var v;
	for(var i = 3; i < vertices.length; i+=3)
	{
		v = vertices.subarray(i,i+3);
		vec3.min( min,v, min);
		vec3.max( max,v, max);
	}

	if( isNaN(min[0]) || isNaN(min[1]) || isNaN(min[2]) ||
		isNaN(max[0]) || isNaN(max[1]) || isNaN(max[2]) )
	{
		min[0] = min[1] = min[2] = 0;
		max[0] = max[1] = max[2] = 0;
		console.warn("Warning: GL.Mesh has NaN values in vertices");
	}

	var center = vec3.add( vec3.create(), min,max );
	vec3.scale( center, center, 0.5);
	var half_size = vec3.subtract( vec3.create(), max, center );

	return BBox.setCenterHalfsize( bb || BBox.create(), center, half_size );
}

/**
* returns the bounding box, if it is not computed, then computes it
* @method getBoundingBox
* @return {BBox} bounding box
*/
Mesh.prototype.getBoundingBox = function()
{
	this.updateBoundingBox();
	return this._bounding;
}

/**
* Update bounding information of this mesh
* @method updateBoundingBox
*/
Mesh.prototype.updateBoundingBox = function() {
	var vertices = this.vertexBuffers["vertices"];
	if(!vertices)
		return;
	GL.Mesh.computeBoundingBox( vertices.data, this._bounding );
}


/**
* forces a bounding box to be set
* @method setBoundingBox
* @param {vec3} center center of the bounding box
* @param {vec3} half_size vector from the center to positive corner
*/
Mesh.prototype.setBoundingBox = function( center, half_size ) {
	BBox.setCenterHalfsize( this._bounding, center, half_size );	
}


/**
* Remove all local memory from the streams (leaving it only in the VRAM) to save RAM
* @method freeData
*/
Mesh.prototype.freeData = function()
{
	for (var attribute in this.vertexBuffers)
	{
		this.vertexBuffers[attribute].data = null;
		delete this[ this.vertexBuffers[attribute].name ]; //delete from the mesh itself
	}
	for (var name in this.indexBuffers)
	{
		this.indexBuffers[name].data = null;
		delete this[ this.indexBuffers[name].name ]; //delete from the mesh itself
	}
}

Mesh.prototype.configure = function( o, options )
{
	var vertex_buffers = {};
	var index_buffers = {};
	options = options || {};

	for(var j in o)
	{
		if(!o[j])
			continue;

		if(j == "vertexBuffers" || j == "vertex_buffers") //HACK: legacy code
		{
			for(i in o[j])
				vertex_buffers[i] = o[j][i];
			continue;
		}
		
		if(j == "indexBuffers" || j == "index_buffers")
		{
			for(i in o[j])
				index_buffers[i] = o[j][i];
			continue;
		}

		if(j == "indices" || j == "lines" ||  j == "wireframe" || j == "triangles")
			index_buffers[j] = o[j];
		else if( GL.Mesh.common_buffers[j])
			vertex_buffers[j] = o[j];
		else //global data like bounding, info of groups, etc
		{
			options[j] = o[j];
		}
	}

	this.addBuffers( vertex_buffers, index_buffers, options.stream_type );

	for(var i in options)
		this[i] = options[i];		

	if(!options.bounding)
		this.updateBoundingBox();
}

/**
* Returns the amount of memory used by this mesh in bytes (sum of all buffers)
* @method getMemory
* @return {number} bytes
*/
Mesh.prototype.totalMemory = function()
{
	var num = 0|0;

	for (var name in this.vertexBuffers)
		num += this.vertexBuffers[name].data.buffer.byteLength;
	for (var name in this.indexBuffers)
		num += this.indexBuffers[name].data.buffer.byteLength;

	return num;
}

/**
* returns a low poly version of the mesh that takes much less memory (but breaks tiling of uvs and smoothing groups)
* @method simplify
* @return {Mesh} simplified mesh
*/
Mesh.prototype.simplify = function()
{
	//compute bounding box
	var bb = this.getBoundingBox();
	var min = BBox.getMin( bb );
	var halfsize = BBox.getHalfsize( bb );
	var range = vec3.scale( vec3.create(), halfsize, 2 );

	var newmesh = new GL.Mesh();
	var temp = vec3.create();

	for(var i in this.vertexBuffers)
	{
		//take every vertex and normalize it to the bounding box
		var buffer = this.vertexBuffers[i];
		var data = buffer.data;

		var new_data = new Float32Array( data.length );

		if(i == "vertices")
		{
			for(var j = 0, l = data.length; j < l; j+=3 )
			{
				var v = data.subarray(j,j+3);
				vec3.sub( temp, v, min );
				vec3.div( temp, temp, range );
				temp[0] = Math.round(temp[0] * 256) / 256;
				temp[1] = Math.round(temp[1] * 256) / 256;
				temp[2] = Math.round(temp[2] * 256) / 256;
				vec3.mul( temp, temp, range );
				vec3.add( temp, temp, min );
				new_data.set( temp, j );
			}
		}
		else
		{
		}

		newmesh.addBuffer();
	}

	//search for repeated vertices
		//compute the average normal and coord
	//reindex the triangles
	//return simplified mesh	
}

/**
* Static method for the class Mesh to create a mesh from a list of common streams
* @method Mesh.load
* @param {Object} buffers object will all the buffers
* @param {Object} options [optional]
* @param {Mesh} output_mesh [optional] mesh to store the mesh, otherwise is created
* @param {WebGLContext} gl [optional] if omitted, the global.gl is used
*/
Mesh.load = function( buffers, options, output_mesh, gl ) {
	options = options || {};
	if(options.no_gl)
		gl = null;
	var mesh = output_mesh || new GL.Mesh(null,null,null,gl);
	mesh.configure( buffers, options );
	return mesh;
}

/**
* Returns a mesh with all the meshes merged (you can apply transforms individually to every buffer)
* @method Mesh.mergeMeshes
* @param {Array} meshes array containing object like { mesh:, matrix:, texture_matrix: }
* @param {Object} options { only_data: to get the mesh data without uploading it }
* @return {GL.Mesh|Object} the mesh in GL.Mesh format or Object format (if options.only_data is true)
*/
Mesh.mergeMeshes = function( meshes, options )
{
	options = options || {};

	var vertex_buffers = {};
	var index_buffers = {};
	var offsets = {}; //tells how many positions indices must be offseted
	var vertex_offsets = [];
	var current_vertex_offset = 0;
	var groups = [];

	//vertex buffers
	//compute size
	for(var i = 0; i < meshes.length; ++i)
	{
		var mesh_info = meshes[i];
		var mesh = mesh_info.mesh;
		var offset = current_vertex_offset;
		vertex_offsets.push( offset );
		var length = mesh.vertexBuffers["vertices"].data.length / 3;
		current_vertex_offset += length;

		for(var j in mesh.vertexBuffers)
		{
			if(!vertex_buffers[j])
				vertex_buffers[j] = mesh.vertexBuffers[j].data.length;
			else
				vertex_buffers[j] += mesh.vertexBuffers[j].data.length;
		}

		for(var j in mesh.indexBuffers)
		{
			if(!index_buffers[j])
				index_buffers[j] = mesh.indexBuffers[j].data.length;
			else
				index_buffers[j] += mesh.indexBuffers[j].data.length;
		}

		//groups
		var group = {
			name: "mesh_" + i,
			start: offset,
			length: length,
			material: ""
		};

		groups.push( group );
	}

	//allocate
	for(var j in vertex_buffers)
	{
		var datatype = options[j];
		if(datatype === null)
		{
			delete vertex_buffers[j];
			continue;
		}

		if(!datatype)
			datatype = Float32Array;

		vertex_buffers[j] = new datatype( vertex_buffers[j] );
		offsets[j] = 0;
	}

	for(var j in index_buffers)
	{
		index_buffers[j] = new Uint32Array( index_buffers[j] );
		offsets[j] = 0;
	}

	//store
	for(var i = 0; i < meshes.length; ++i)
	{
		var mesh_info = meshes[i];
		var mesh = mesh_info.mesh;
		var offset = 0;
		var length = 0;

		for(var j in mesh.vertexBuffers)
		{
			if(!vertex_buffers[j])
				continue;

			if(j == "vertices")
				length = mesh.vertexBuffers[j].data.length / 3;

			vertex_buffers[j].set( mesh.vertexBuffers[j].data, offsets[j] );

			//apply transform
			if(mesh_info[ j + "_matrix"] )
			{
				var matrix = mesh_info[ j + "_matrix" ];
				if(matrix.length == 16)
					apply_transform( vertex_buffers[j], offsets[j], mesh.vertexBuffers[j].data.length, matrix )
				else if(matrix.length == 9)
					apply_transform2D( vertex_buffers[j], offsets[j], mesh.vertexBuffers[j].data.length, matrix )
			}

			offsets[j] += mesh.vertexBuffers[j].data.length;
		}

		for(var j in mesh.indexBuffers)
		{
			index_buffers[j].set( mesh.indexBuffers[j].data, offsets[j] );
			apply_offset( index_buffers[j], offsets[j], mesh.indexBuffers[j].data.length, vertex_offsets[i] );
			offsets[j] += mesh.indexBuffers[j].data.length;
		}
	}

	//useful functions
	function apply_transform( array, start, length, matrix )
	{
		var l = start + length;
		for(var i = start; i < l; i+=3)
		{
			var v = array.subarray(i,i+3);
			vec3.transformMat4( v, v, matrix );
		}
	}

	function apply_transform2D( array, start, length, matrix )
	{
		var l = start + length;
		for(var i = start; i < l; i+=2)
		{
			var v = array.subarray(i,i+2);
			vec2.transformMat3( v, v, matrix );
		}
	}

	function apply_offset( array, start, length, offset )
	{
		var l = start + length;
		for(var i = start; i < l; ++i)
			array[i] += offset;
	}

	var extra = { info: { groups: groups } };

	//return
	if( typeof(gl) != "undefined" || options.only_data )
		return new GL.Mesh( vertex_buffers,index_buffers, extra );
	return { 
		vertexBuffers: vertex_buffers, 
		indexBuffers: index_buffers, 
		info: { groups: groups } 
	};
}



//Here we store all basic mesh parsers (OBJ, STL) and encoders
Mesh.parsers = {};
Mesh.encoders = {};
Mesh.binary_file_formats = {}; //extensions that must be downloaded in binary
Mesh.compressors = {}; //used to compress binary meshes
Mesh.decompressors = {}; //used to decompress binary meshes

/**
* Returns am empty mesh and loads a mesh and parses it using the Mesh.parsers, by default only OBJ is supported
* @method Mesh.fromOBJ
* @param {Array} meshes array containing all the meshes
*/
Mesh.fromURL = function(url, on_complete, gl, options)
{
	options = options || {};
	gl = gl || global.gl;
	
	var mesh = new GL.Mesh(undefined,undefined,undefined,gl);
	mesh.ready = false;

	var pos = url.lastIndexOf(".");
	var extension = url.substr(pos+1).toLowerCase();
	options.binary = Mesh.binary_file_formats[ extension ];

	HttpRequest( url, null, function(data) {
		mesh.parse( data, extension );
		delete mesh["ready"];
		if(on_complete)
			on_complete.call(mesh,mesh, url);
	}, function(err){
		if(on_complete)
			on_complete(null);
	}, options );
	return mesh;
}

/**
* given some data an information about the format, it search for a parser in Mesh.parsers and tries to extract the mesh information
* Only obj supported now
* @method parse
* @param {*} data could be string or ArrayBuffer
* @param {String} format parser file format name (p.e. "obj")
* @return {?} depending on the parser
*/
Mesh.prototype.parse = function( data, format )
{
	format = format.toLowerCase();
	var parser = GL.Mesh.parsers[ format ];
	if(parser)
		return parser.call(null, data, {mesh: this});
	throw("GL.Mesh.parse: no parser found for format " + format );
}

/**
* It returns the mesh data encoded in the format specified
* Only obj supported now
* @method encode
* @param {String} format to encode the data to (p.e. "obj")
* @return {?} String with the info
*/
Mesh.prototype.encode = function( format, options )
{
	format = format.toLowerCase();
	var encoder = GL.Mesh.encoders[ format ];
	if(encoder)
		return encoder.call(null, this, options );
	throw("GL.Mesh.encode: no encoder found for format " + format );
}

/**
* Returns a shared mesh containing a quad to be used when rendering to the screen
* Reusing the same quad helps not filling the memory
* @method getScreenQuad
* @return {GL.Mesh} the screen quad
*/
Mesh.getScreenQuad = function(gl)
{
	gl = gl || global.gl;
	var mesh = gl.meshes[":screen_quad"];
	if(mesh)
		return mesh;

	var vertices = new Float32Array([0,0,0, 1,1,0, 0,1,0,  0,0,0, 1,0,0, 1,1,0 ]);
	var coords = new Float32Array([0,0, 1,1, 0,1,  0,0, 1,0, 1,1 ]);
	mesh = new GL.Mesh({ vertices: vertices, coords: coords}, undefined, undefined, gl);
	return gl.meshes[":screen_quad"] = mesh;
}

function linearizeArray( array, typed_array_class )
{
	if(array.constructor === typed_array_class)
		return array;
	if(array.constructor !== Array)
	{
		typed_array_class = typed_array_class || Float32Array;
		return new typed_array_class(array);
	}

	typed_array_class = typed_array_class || Float32Array;
	var components = array[0].length;
	var size = array.length * components;
	var buffer = new typed_array_class(size);

	for (var i=0; i < array.length;++i)
		for(var j=0; j < components; ++j)
			buffer[i*components + j] = array[i][j];
	return buffer;
}

/* BINARY MESHES */
//Add some functions to the classes in LiteGL to allow store in binary
GL.Mesh.EXTENSION = "wbin";
GL.Mesh.enable_wbin_compression = true;

