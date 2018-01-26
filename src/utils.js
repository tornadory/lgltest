
global.DEG2RAD = 0.0174532925;
global.RAD2DEG = 57.295779578552306;
global.EPSILON = 0.000001;

/**
* Tells if one number is power of two (used for textures)
* @method isPowerOfTwo
* @param {v} number
* @return {boolean}
*/
global.isPowerOfTwo = GL.isPowerOfTwo = function isPowerOfTwo(v)
{
	return ((Math.log(v) / Math.log(2)) % 1) == 0;
}

//Global Scope
//better array conversion to string for serializing
var typed_arrays = [ Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array ];
function typedToArray(){ 
	return Array.prototype.slice.call(this);
}
typed_arrays.forEach( function(v) { 
	if(!v.prototype.toJSON)
		Object.defineProperty( v.prototype, "toJSON", {
			value: typedToArray,
			enumerable: false
		});
});



/**
* Get current time in milliseconds
* @method getTime
* @return {number}
*/
if(typeof(performance) != "undefined")
  global.getTime = performance.now.bind(performance);
else
  global.getTime = Date.now.bind( Date );
GL.getTime = global.getTime;


global.isFunction = function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

global.isArray = function isArray(obj) {
  return (obj && obj.constructor === Array );
  //var str = Object.prototype.toString.call(obj);
  //return str == '[object Array]' || str == '[object Float32Array]';
}

global.isNumber = function isNumber(obj) {
  return (obj != null && obj.constructor === Number );
}

global.getClassName = function getClassName(obj)
{
	if (!obj)
		return;

	//from function info, but not standard
	if(obj.name)
		return obj.name;

	//from sourcecode
	if(obj.toString) {
		var arr = obj.toString().match(
			/function\s*(\w+)/);
		if (arr && arr.length == 2) {
			return arr[1];
		}
	}
}

/**
* clone one object recursively, only allows objects containing number,strings,typed-arrays or other objects
* @method cloneObject
* @param {Object} object 
* @param {Object} target if omited an empty object is created
* @return {Object}
*/
global.cloneObject = GL.cloneObject = function(o, t)
{
	if(o.constructor !== Object)
		throw("cloneObject only can clone pure javascript objects, not classes");

	t = t || {};

	for(var i in o)
	{
		var v = o[i];
		if(v === null)
		{
			t[i] = null;
			continue;
		}

		switch(v.constructor)
		{
			case Int8Array:
			case Uint8Array:
			case Int16Array:
			case Uint16Array:
			case Int32Array:
			case Uint32Array:
			case Float32Array:
			case Float64Array:
				t[i] = new v.constructor(v);
				break;
			case Boolean:
			case Number:
			case String:
				t[i] = v;
				break;
			case Array:
				t[i] = v.concat(); //content is not cloned
				break;
			case Object:
				t[i] = GL.cloneObject(v);
				break;
		}
	}

	return t;
}


/* SLOW because accepts booleans
function isNumber(obj) {
  var str = Object.prototype.toString.call(obj);
  return str == '[object Number]' || str == '[object Boolean]';
}
*/

//given a regular expression, a text and a callback, it calls the function every time it finds it
global.regexMap = function regexMap(regex, text, callback) {
  var result;
  while ((result = regex.exec(text)) != null) {
    callback(result);
  }
}

global.createCanvas = GL.createCanvas = function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

global.cloneCanvas = GL.cloneCanvas = function cloneCanvas(c) {
    var canvas = document.createElement('canvas');
    canvas.width = c.width;
    canvas.height = c.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(c,0,0);
    return canvas;
}

if(typeof(Image) != "undefined") //not existing inside workers
{
	Image.prototype.getPixels = function()
	{
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(this,0,0);
		return ctx.getImageData(0, 0, this.width, this.height).data;
	}
}

if(!String.prototype.hasOwnProperty("replaceAll")) 
	Object.defineProperty(String.prototype, "replaceAll", {
		value: function(words){
			var str = this;
			for(var i in words)
				str = str.split(i).join(words[i]);
			return str;
		},
		enumerable: false
	});	

/*
String.prototype.replaceAll = function(words){
	var str = this;
	for(var i in words)
		str = str.split(i).join(words[i]);
    return str;
};
*/

//used for hashing keys
if(!String.prototype.hasOwnProperty("hashCode")) 
	Object.defineProperty(String.prototype, "hashCode", {
		value: function(){
			var hash = 0, i, c, l;
			if (this.length == 0) return hash;
			for (i = 0, l = this.length; i < l; ++i) {
				c  = this.charCodeAt(i);
				hash  = ((hash<<5)-hash)+c;
				hash |= 0; // Convert to 32bit integer
			}
			return hash;
		},
		enumerable: false
	});	

//avoid errors when Typed array is expected and regular array is found
//Array.prototype.subarray = Array.prototype.slice;
if(!Array.prototype.hasOwnProperty("subarray"))
	Object.defineProperty(Array.prototype, "subarray", { value: Array.prototype.slice, enumerable: false });

if(!Array.prototype.hasOwnProperty("clone"))
	Object.defineProperty(Array.prototype, "clone", { value: Array.prototype.concat, enumerable: false });
if(!Float32Array.prototype.hasOwnProperty("clone"))
	Object.defineProperty(Float32Array.prototype, "clone", { value: function() { return new Float32Array(this); }, enumerable: false });


// remove all properties on obj, effectively reverting it to a new object (to reduce garbage)
global.wipeObject = function wipeObject(obj)
{
  for (var p in obj)
  {
    if (obj.hasOwnProperty(p))
      delete obj[p];
  }
};

//copy methods from origin to target
global.extendClass = GL.extendClass = function extendClass( target, origin ) {
	for(var i in origin) //copy class properties
	{
		if(target.hasOwnProperty(i))
			continue;
		target[i] = origin[i];
	}

	if(origin.prototype) //copy prototype properties
	{
		var prop_names = Object.getOwnPropertyNames( origin.prototype );
		for(var i = 0; i < prop_names.length; ++i) //only enumerables
		{
			var name = prop_names[i];
			//if(!origin.prototype.hasOwnProperty(name)) 
			//	continue;

			if(target.prototype.hasOwnProperty(name)) //avoid overwritting existing ones
				continue;

			//copy getters 
			if(origin.prototype.__lookupGetter__(name))
				target.prototype.__defineGetter__(name, origin.prototype.__lookupGetter__(name));
			else 
				target.prototype[name] = origin.prototype[name];

			//and setters
			if(origin.prototype.__lookupSetter__(name))
				target.prototype.__defineSetter__(name, origin.prototype.__lookupSetter__(name));
		}
	}

	if(!target.hasOwnProperty("superclass")) 
		Object.defineProperty(target, "superclass", {
			get: function() { return origin },
			enumerable: false
		});	
}



//simple http request
global.HttpRequest = GL.request = function HttpRequest( url, params, callback, error, options )
{
	var async = true;
	if(options && options.async !== undefined)
		async = options.async;

	if(params)
	{
		var params_str = null;
		var params_arr = [];
		for(var i in params)
			params_arr.push(i + "=" + params[i]);
		params_str = params_arr.join("&");
		url = url + "?" + params_str;
	}

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, async);
	xhr.onload = function(e)
	{
		var response = this.response;
		var type = this.getResponseHeader("Content-Type");
		if(this.status != 200)
		{
			LEvent.trigger(xhr,"fail",this.status);
			if(error)
				error(this.status);
			return;
		}

		LEvent.trigger(xhr,"done",this.response);
		if(callback)
			callback(this.response);
		return;
	}

	xhr.onerror = function(err)
	{
		LEvent.trigger(xhr,"fail",err);
	}
	
	if(options)
	{
		for(var i in options)
			xhr[i] = options[i];
		if(options.binary)
			xhr.responseType = "arraybuffer";
	}

	xhr.send();

	return xhr;
}

//cheap simple promises
if( global.XMLHttpRequest )
{
	if( !XMLHttpRequest.prototype.hasOwnProperty("done") )
		Object.defineProperty( XMLHttpRequest.prototype, "done", { enumerable: false, value: function(callback)
		{
		  LEvent.bind(this,"done", function(e,err) { callback(err); } );
		  return this;
		}});

	if( !XMLHttpRequest.prototype.hasOwnProperty("fail") )
		Object.defineProperty( XMLHttpRequest.prototype, "fail", { enumerable: false, value: function(callback)
		{
		  LEvent.bind(this,"fail", function(e,err) { callback(err); } );
		  return this;
		}});
}

global.getFileExtension = function getFileExtension(url)
{
	var question = url.indexOf("?");
	if(question != -1)
		url = url.substr(0,question);
	var point = url.lastIndexOf(".");
	if(point == -1) 
		return "";
	return url.substr(point+1).toLowerCase();
} 


//allows to pack several (text)files inside one single file (useful for shaders)
//every file must start with \filename.ext  or /filename.ext
global.loadFileAtlas = GL.loadFileAtlas = function loadFileAtlas(url, callback, sync)
{
	var deferred_callback = null;

	HttpRequest(url, null, function(data) {
		var files = GL.processFileAtlas(data); 
		if(callback)
			callback(files);
		if(deferred_callback)
			deferred_callback(files);
	}, alert, sync);

	return { done: function(callback) { deferred_callback = callback; } };
}

//This parses a text file that contains several text files (they are separated by "\filename"), and returns an object with every file separatly
global.processFileAtlas = GL.processFileAtlas = function(data, skip_trim)
{
	var lines = data.split("\n");
	var files = {};

	var current_file_lines = [];
	var current_file_name = "";
	for(var i = 0, l = lines.length; i < l; i++)
	{
		var line = skip_trim ? lines[i] : lines[i].trim();
		if(!line.length)
			continue;
		if( line[0] != "\\")
		{
			current_file_lines.push(line);
			continue;
		}

		if( current_file_lines.length )
			files[ current_file_name ] = current_file_lines.join("\n");
		current_file_lines.length = 0;
		current_file_name = line.substr(1);
	}

	if( current_file_lines.length )
		files[ current_file_name ] = current_file_lines.join("\n");

	return files;
}

global.typedArrayToArray = function(array)
{
	var r = [];
	r.length = array.length;
	for(var i = 0; i < array.length; i++)
		r[i] = array[i];
	return r;
}

global.RGBToHex = function(r, g, b) { 
	r = Math.min(255, r*255)|0;
	g = Math.min(255, g*255)|0;
	b = Math.min(255, b*255)|0;
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

global.hexColorToRGBA = (function() {
	//to change the color: from http://www.w3schools.com/cssref/css_colorsfull.asp
	var string_colors = {
		white: [1,1,1],
		black: [0,0,0],
		gray: [0.501960813999176, 0.501960813999176, 0.501960813999176],
		red: [1,0,0],
		orange: [1, 0.6470588445663452, 0],
		pink: [1, 0.7529411911964417, 0.7960784435272217],
		green: [0, 0.501960813999176, 0],
		lime: [0,1,0],
		blue: [0,0,1],
		violet: [0.9333333373069763, 0.5098039507865906, 0.9333333373069763],
		magenta: [1,0,1],
		cyan: [0,1,1],
		yellow: [1,1,0],
		brown: [0.6470588445663452, 0.16470588743686676, 0.16470588743686676],
		silver: [0.7529411911964417, 0.7529411911964417, 0.7529411911964417],
		gold: [1, 0.843137264251709, 0],
		transparent: [0,0,0,0]
	};

	function hue2rgb( p, q, t ){
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	}

	function hslToRgb( h, s, l, out ){
		var r, g, b;
		out = out || vec3.create();
		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		out[0] = r;
		out[1] = g;
		out[2] = b;
		return out;
	}

	return function( hex, color, alpha )
	{
	alpha = (alpha === undefined ? 1 : alpha);
	color = color || new Float32Array(4);
	color[3] = alpha;

	if(typeof(hex) != "string")
		return color;


	//for those hardcoded colors
	var col = string_colors[hex];
	if( col !== undefined )
	{
		color.set( col );
		if(color.length == 3)
			color[3] = alpha;
		else
			color[3] *= alpha;
		return color;
	}

	//rgba colors
	var pos = hex.indexOf("rgba(");
	if(pos != -1)
	{
		var str = hex.substr(5);
		str = str.split(",");
		color[0] = parseInt( str[0] ) / 255;
		color[1] = parseInt( str[1] ) / 255;
		color[2] = parseInt( str[2] ) / 255;
		color[3] = parseFloat( str[3] ) * alpha;
		return color;
	}

	var pos = hex.indexOf("hsla(");
	if(pos != -1)
	{
		var str = hex.substr(5);
		str = str.split(",");
		hslToRgb( parseInt( str[0] ) / 360, parseInt( str[1] ) / 100, parseInt( str[2] ) / 100, color );
		color[3] = parseFloat( str[3] ) * alpha;
		return color;
	}

	color[3] = alpha;

	//rgb colors
	var pos = hex.indexOf("rgb(");
	if(pos != -1)
	{
		var str = hex.substr(3);
		str = str.split(",");
		color[0] = parseInt( str[0] ) / 255;
		color[1] = parseInt( str[1] ) / 255;
		color[2] = parseInt( str[2] ) / 255;
		return color;
	}

	var pos = hex.indexOf("hsl(");
	if(pos != -1)
	{
		var str = hex.substr(5);
		str = str.split(",");
		hslToRgb( parseInt( str[0] ) / 360, parseInt( str[1] ) / 100, parseInt( str[2] ) / 100, color );
		return color;
	}


	//the rest
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if(!result)
		return color;

	color[0] = parseInt(result[1], 16) / 255;
	color[1] = parseInt(result[2], 16) / 255;
	color[2] = parseInt(result[3], 16) / 255;
	return color;
	}
})();