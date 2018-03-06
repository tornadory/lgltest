
var parserFBX = {
	extension: "fbx",
	type: "scene",
	resource: "SceneNode",
	format: "binary",
	dataType:'arraybuffer',

	parse: async function( data, options, filename )
	{
		var scene = await this.fakeParser(data, options, filename);
		console.log("got scene is ", scene);
		return scene;
	},

	fakeParser: async function (data, options, filename){
		var thiz = this;

		return new Promise(async function(resolve, reject){
			var fbxobject;
	    var object;
			if(!data)
			{
				console.error("FBX parser requires data");
				reject(null);
			}

			var clean_filename = RS.RM.getBasename( filename );

			//Create a scene tree
			var scene = {
				object_class:"SceneTree",
				light: null,
				images: [],
				materials: {},
				meshes: {},
				resources: {}, //used to store animation tracks
				root:{ children:[] },
				external_files: {}, //store info about external files mentioned in this
				file_name: clean_filename,
				texture_uploaded: []
			};

			scene.root.name = clean_filename;

			var manager = new THREE.LoadingManager( async function() {
				var node = await thiz.parseToNode(fbxobject, scene);

				scene.root = node;
				scene.root.name = clean_filename;

				if(fbxobject.animations.length > 0)
				{
					var animations = thiz.parseAnimation(fbxobject.animations, scene);
					if(animations)
					{
						var animations_name = "animations_" + clean_filename + ".wbin";
						animations.filename = animations_name;
						scene.resources[ animations_name ] = animations;
						scene.root.animation = animations_name;
					}
				}

				//apply 90 degrees rotation to match the Y UP AXIS of the system
				if( scene.metadata && scene.metadata.up_axis == "Z_UP" )
					scene.root.model = mat4.rotateX( mat4.create(), mat4.create(), -90 * 0.0174532925 );

				//rename meshes, nodes, etc
				var renamed = {};
				var basename = clean_filename.substr(0, clean_filename.indexOf("."));

				// clear memory, maybe can do something here

	      resolve(scene);
			});

			var loader = new THREE.FBXLoader(manager);
			var path = window.location.origin + resource_base_path;
			var fbxobject = loader.parse(data, path);

			// the hasTexture is not right, before manager's callback we can not determine if there are textures inside model
			// so put it to TBD, wihout it, model without textures can not be loaded normally, just because this function doese not return anything

			// if(!thiz.hasTexture(fbxobject)){ //if no texture inside model, then manger's callback won't be called
			// 	var node = await thiz.parseToNode(fbxobject, scene);
      //
			// 	scene.root = node;
			// 	scene.root.name = clean_filename;
      //
			// 	//apply 90 degrees rotation to match the Y UP AXIS of the system
			// 	if( scene.metadata && scene.metadata.up_axis == "Z_UP" )
			// 		scene.root.model = mat4.rotateX( mat4.create(), mat4.create(), -90 * 0.0174532925 );
      //
			// 	//rename meshes, nodes, etc
			// 	var renamed = {};
			// 	var basename = clean_filename.substr(0, clean_filename.indexOf("."));
      //
			// 	// clear memory, maybe can do something here
			// 	resolve(scene);
			// }
	  });
	},

	parseAnimation: function(animationsData, scene){
		if(animationsData.length < 1){
			console.log("no animation data ...");
			return null;
		}
		var animations = {
			object_class: "Animation",
			takes: {}
		};

		var default_take = { tracks: [] };
		var tracks = default_take.tracks; // contain all new subtracks

		for(let i = 0; i < animationsData.length; i++){ //typically, length is 1
			let track = animationsData[i];
			let subtracks = track.tracks;
			if(subtracks.length < 1){
				continue;
			}
			let j = 0;

			while(j < subtracks.length){
				let nodename = "";
				let animtype = "";

				let timeBaseIndex = j;
				let timeBaseArraryLen = subtracks[j].times.length;
				let groupSize = 1;

				let trackname = subtracks[j].name;
				var pos = trackname.lastIndexOf(".");
				if(pos != -1){
					nodename = trackname.substr(0, pos);
					animtype = trackname.substr(pos+1);
				}else{
					j++;
					continue;
				}

				//property name need to be aligned with node's uid
				if((j+1 < subtracks.length) && subtracks[j+1].name.startsWith(nodename + ".")){
					if(subtracks[j+1].times.length > timeBaseArraryLen){
						timeBaseIndex = j + 1;
						timeBaseArraryLen = subtracks[j+1].times.length;
					}
					if((j+2 < subtracks.length) && subtracks[j+2].name.startsWith(nodename + ".")){
						if(subtracks[j+2].times.length > timeBaseArraryLen){
							timeBaseIndex = j + 2;
							timeBaseArraryLen = subtracks[j+2].times.length;
						}
						groupSize = 3;
						// j = j + 3; //next iterator index
						//start to convert j, j + 1 and j + 2
					}else {
						groupSize = 2;
						// j = j + 2; //next iterator index
						//start to convert j and j + 1
					}
				}else {
					groupSize = 1;
					// j = j + 1; //next iterator index
					//start to convert j
				}

				//try to create matrix

				let timeArray = subtracks[timeBaseIndex].times;
				let animLen = timeArray.length;
				let animData = new Float32Array(17 * animLen); // 17 == length of matrix + 1

				let translate = vec3.create();
				let rotation = quat.create();
				let scale = vec3.fromValues(1,1,1);

				for(let tIndex = 0; tIndex < timeArray.length; tIndex++){
					let t = timeArray[tIndex];
					// let matrix = mat4.create();



					for(let g = 0; g < groupSize; g++){
						let dataIndex = j + g;
						let iData = subtracks[dataIndex].times.indexOf(t);
						if(iData != -1){
							//contains time in this sub track
							if(subtracks[dataIndex].name.endsWith(".position")){
								//position / translate
								// let translate = vec3.create();
								translate = vec3.create();
								translate[0] = subtracks[dataIndex].values[iData * 3];
								translate[1] = subtracks[dataIndex].values[iData * 3 + 1];
								translate[2] = subtracks[dataIndex].values[iData * 3 + 2];
								// mat4.translate(matrix, matrix, translate);
							}
							if(subtracks[dataIndex].name.endsWith(".quaternion")){
								//quaternion / rotate
								// let rotation = quat.create();
								rotation = quat.create();

								rotation[0] = subtracks[dataIndex].values[iData * 3];
								rotation[1] = subtracks[dataIndex].values[iData * 3 + 1];
								rotation[2] = subtracks[dataIndex].values[iData * 3 + 2];
								rotation[3] = subtracks[dataIndex].values[iData * 3 + 3];

								// mat4.multiply( matrix, matrix, tmpmatrix );
							}
							if(subtracks[dataIndex].name.endsWith(".scale")){
								//scale / scale
								// let scale = vec3.fromValues(1,1,1);
								scale = vec3.fromValues(1,1,1);
								scale[0] = subtracks[dataIndex].values[iData * 3];
								scale[1] = subtracks[dataIndex].values[iData * 3 + 1];
								scale[2] = subtracks[dataIndex].values[iData * 3 + 2];
								// mat4.scale( matrix, matrix, scale );
							}
						} //end if iData
					}//end for groupSize

					let matrix = mat4.create();
					let tmpmatrix = mat4.create();
					mat4.fromQuat( tmpmatrix , rotation );
					mat4.multiply( matrix, matrix, tmpmatrix );
					mat4.scale( matrix, matrix, scale );
					mat4.translate(matrix, matrix, translate);

					// if(translate){
					// 	if(rotation){
					// 		if(scale){
					// 			//r t s
					// 			matrix = mat4.fromRotationTranslationScale(matrix, rotation, translate, scale);
					// 		}else{
					// 			//r t
					// 			matrix = mat4.fromRotationTranslation(matrix, rotation, translate);
					// 		}
					// 	}else {
					// 		if(scale){
					// 			console.error('ONLY POSITION and SCALE');
					// 		}else{
					// 			//t
					// 			matrix = mat4.fromTranslation(matrix, rotation);
					// 		}
					// 	}
					// }else{
					// 	if(rotation){
					// 		if(scale){
					// 			console.error('ONLY ROTATION and SCALE');
					// 		}else {
					// 			//r
					// 			matrix = mat4.fromQuat(matrix, rotation);
					// 		}
					// 	}else{
					// 		if(scale){
					// 			//s
					// 			matrix = mat4.fromScaling(matrix, scale);
					// 		}else {
					// 			console.error('NO available data be used');
					// 		}
					// 	}
					// }

					// mat4.transpose(matrix,matrix);

					//got matrix and then insert it into animData
					animData[17 * tIndex] = t;
					animData.set(matrix, 17 * tIndex + 1);


				}// end of for tIndex

				//create anim data for this node
				let anim = {};
				anim.name = "transform";
				// anim.name = "matrix";
				anim.property = "@" + scene.file_name + "::" + nodename + "/matrix";
				anim.type = "mat4";
				anim.value_size = 16;
				anim.duration = timeArray[ animLen - 1];
				anim.packed_data = true;
				anim.data = animData;


				tracks.push( anim );

				j = j + groupSize;
			}

			if(i == 0){
				default_take.name = "default";
				default_take.duration = 0;
				animations.takes[ default_take.name ] = default_take;
			}else{
				console.error("more than 1 animation tack ...");
			}
		}

		if(animations.takes.length < 1){
			return null;
		}

		return animations;
	},

	hasTexture: function(object){
		object.traverse( function ( child ) {
			if(child.material){
				if(child.material.length > 1){
					for(let i =0; i < child.material.length; i++){
						if(child.material[0].map){
							return true;
						}
					}
				}else{
					if(child.material.map){
						return true;
					}
				}
			}
		});
		return false;
	},

	uploadTexture: function(texture){
		return new Promise((resolve, reject) => {
			DriveModule.saveResource(texture, function(v){
				resolve(v);
			}, { skip_alerts: true });
		});
	},

	parseToNode: async function(child, scene){

		let indexArray = []; //indexBuffers triangles
		let vertexArray = []; //vertexBuffers
		let normalsArray = [];
		let boneIndexArray = []; //bone indices
		let weightsArray = []; //
		let uvArray = []; //coords

		let bindMatrix = null;
		let joints = [];

		//transform
		let matrix = mat4.create();
		let temp = mat4.create();
		//rotation
		let tmpq = quat.create();

		let node = {
			name: child.name,
			id: child.name,
			sid: child.name,
			uid: "@" + scene.file_name + "::" + child.name,
			children:[]
		};

		//MESH
		if ( child instanceof THREE.Mesh ) {

			if(child.isSkinnedMesh){
				console.log("SKINNED MESH: ", child);
			}
			//console.log("Mesh from Child of FBX object: ", child.geometry);
			let bufferGeometry = child.geometry;
			if(!bufferGeometry.attributes.position || bufferGeometry.attributes.position.array.length < 3)
			{
				console.log("NO GEOMETRY, ignore it");
				//continue;
			}else{
				let geometry = new THREE.Geometry().fromBufferGeometry( bufferGeometry );
				//console.log("got geometry data from bufferGeometry is, ", geometry);

				//Float32Array
				for(let i = 0; i < geometry.vertices.length; i++){
					for(let j = 0; j < 3; j++){
						let index = 3*i + j;
						vertexArray[index] = geometry.vertices[i].getComponent(j);
					}
				}
				//Uint16Array
				for(let i = 0; i < geometry.faces.length; i++){
					let baseIndex = 3 * i;
					indexArray[baseIndex] = geometry.faces[i].a;
					indexArray[baseIndex + 1] = geometry.faces[i].b;
					indexArray[baseIndex + 2] = geometry.faces[i].c;
				}

				if(bufferGeometry.attributes.uv){
					uvArray = bufferGeometry.attributes.uv.array.slice();
				}

				if(child.bindMatrix){
					bindMatrix = child.bindMatrix.elements.slice();
				}else{
					bindMatrix = mat4.create(); //identity
				}

				//1bones
				if(bufferGeometry.FBX_Deformer){
					let bonesNum = bufferGeometry.FBX_Deformer.bones.length;
					if(bonesNum > 0){
						for(let bIndex =0; bIndex < bonesNum; bIndex++){
							let bNodeName = "@" + scene.file_name + "::" + bufferGeometry.FBX_Deformer.bones[bIndex].name;
							//let bMatrix = bufferGeometry.FBX_Deformer.bones[bIndex].matrix.elements.slice();

							//use rawBones
							//yes, use rawBones can make bones seems better, currently mesh is -90 that bones
							let bMatrix = bufferGeometry.FBX_Deformer.rawBones[bIndex].transform.elements.slice();
							//caculate from RTS
							//let bMatrix = mat4.create();
							joints.push([ bNodeName, bMatrix ]);
						}
					}
				}

				if(bufferGeometry.attributes.normal)
					normalsArray = bufferGeometry.attributes.normal.array.slice();
				if(bufferGeometry.attributes.skinIndex)
					boneIndexArray = bufferGeometry.attributes.skinIndex.array.slice();
				if(bufferGeometry.attributes.skinWeight)
					weightsArray = bufferGeometry.attributes.skinWeight.array.slice();

				let mesh_data = {};

				if(vertexArray && vertexArray.length > 0)
					mesh_data.vertices = new Float32Array(vertexArray);

				if(indexArray && indexArray.length > 0)
					mesh_data.triangles = new Uint16Array(indexArray);

				if(normalsArray && normalsArray.length > 0)
					mesh_data.normals = normalsArray;

				if(uvArray && uvArray.length > 0)
					mesh_data.coords = uvArray;

				if(boneIndexArray && boneIndexArray.length > 0)
					mesh_data.bone_indices = boneIndexArray;

				if(weightsArray && weightsArray.length > 0)
					mesh_data.weights = weightsArray;

				if(bindMatrix && bindMatrix.length > 0){
					mesh_data.bind_matrix = bindMatrix;
				}

				if(joints && joints.length > 0){
					mesh_data.bones = joints;
				}

				mesh_data.name = scene.file_name + "-" + child.name;
				mesh_data.filename = scene.file_name + "-" + child.name;
				mesh_data.object_class = "Mesh";

				let mesh_id = scene.file_name + "-" + child.name + "-mesh";
				scene.meshes[mesh_id] = mesh_data;

				node.mesh = mesh_id;

				if(child.material){
					if(child.material.length > 1){
						for(let i =0; i < child.material.length; i++){
							let childmat = child.material[i];
							let material = {};
							material.id = scene.file_name + "-" + childmat.name;
							material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"_") + ".json";

							if(childmat.opacity)
								material.opacity = childmat.opacity;
							if(childmat.shiness){
								material.specular_gloss = childmat.shiness;
							}

							// if(childmat.color){
							// 	let color = new Uint8Array([childmat.color.r,childmat.color.g,childmat.color.b]);
							// 	material.color = color;
							// }
							if(child.material.emissive){
								let emissive = new Uint8Array([childmat.emissive.r,childmat.emissive.g,childmat.emissive.b]);
								material.emissive = emissive;
							}

							//TBD
							//bumpMap
							//envMap
							//aoMap
							//alphaMap
							//lightMap
							//normalMap
							//specularMap

							if(childmat.map){
								material.textures = {};
								if(childmat.map.image){
									let texture_name = child.name;
									if(childmat.map.name)
										texture_name = childmat.map.name;

									// material.id = scene.file_name + "-" + texture_name;
									// material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"_") + ".json";

									if(childmat.map.image.src){
										let fname = childmat.map.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture
											//maybe need try to save it
											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											fname = fname.toLowerCase();

											let texture = GL.Texture.fromImage(childmat.map.image, {minFilter: gl.NEAREST});
											texture.filename = resource_base_path + fname;
											texture.fullpath = resource_base_path + fname;
											texture.remotepath = resource_base_path + fname;
											if(!scene.texture_uploaded.includes(texture.filename)){
												scene.texture_uploaded.push(texture.filename);
												await this.uploadTexture(texture);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;

											material.textures["color"] = {
												texture: resource_base_path + fname,
												uvs: RS.Material.COORDS_UV0
											};

										}else{
											fname = this.getFilename(fname);

											let image = {
												filename: fname,
												map: texture_name,
												name: texture_name,
												path: fname
											};

											image.filename = resource_base_path + image.filename;
											image.path = resource_base_path + image.path;
											scene.images[texture_name] = image;

											material.textures["color"] = {
												texture: image.path,
												uvs: RS.Material.COORDS_UV0
											};
										}
									}
								}


							}

							material.type = "phong";
							material.object_class = "StandardMaterial";

							scene.materials [material.id] = material;

							if(i == 0){
								node.material = material.id;
							}else{
								if(!node.materials)
									node.materials = [];
								node.materials.push(material.id);
							}
						}
					}else{
						let material = {};
						material.id = scene.file_name + "-" + child.material.name;
						material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"_") + ".json";
						if(child.material.opacity)
							material.opacity = child.material.opacity;

						if(child.material.shiness){
							material.specular_gloss = child.material.shiness;
						}

						// if(child.material.color){
						// 	let color = new Uint8Array([child.material.color.r,child.material.color.g,child.material.color.b]);
						// 	material.color = color;
						// }
						if(child.material.emissive){
							let emissive = new Uint8Array([child.material.emissive.r,child.material.emissive.g,child.material.emissive.b]);
							material.emissive = emissive;
						}

						//TBD
						//bumpMap
						//envMap
						//aoMap
						//alphaMap
						//lightMap
						//normalMap
						//specularMap

						if(child.material.map){
							material.textures = {};
							if(child.material.map.image){

								let texture_name = child.name;
								if(child.material.map.name)
									texture_name = child.material.map.name;

								// material.id = scene.file_name + "-" + texture_name;
								// material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"_") + ".json";

								if(child.material.map.image.src){
									let fname = child.material.map.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										fname = scene.file_name + "_" + texture_name + ".png";
										fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
										fname = fname.toLowerCase();

										let texture = GL.Texture.fromImage(child.material.map.image, {minFilter: gl.NEAREST});
										texture.filename = resource_base_path + fname;
										texture.fullpath = resource_base_path + fname;
										texture.remotepath = resource_base_path + fname;
										if(!scene.texture_uploaded.includes(texture.filename)){
											scene.texture_uploaded.push(texture.filename);
											await this.uploadTexture(texture);
										}

										let image = {
											filename: resource_base_path + fname,
											map: texture_name,
											name: texture_name,
											path: resource_base_path + fname
										};

										scene.images[texture_name] = image;

										material.textures["color"] = {
											texture: image.filename,
											uvs: RS.Material.COORDS_UV0
										};
									}else{
										fname = this.getFilename(fname);

										let image = {
											filename: fname,
											map: texture_name,
											name: texture_name,
											path: fname
										};

										image.filename = resource_base_path + image.filename;
										image.path = resource_base_path + image.path;
										scene.images[texture_name] = image;

										material.textures["color"] = {
											texture: image.path,
											uvs: RS.Material.COORDS_UV0
										};
									}


								}
							}



						}
						material.type = "phong";
						material.object_class = "StandardMaterial";

						scene.materials [material.id] = material;

						node.material = material.id;
					}
				}
			}
		}

		//TBD: OTHER TYPES (not MESH, such as Camera, Light and so on)

		if(child.position){
			let pos = child.position;
			mat4.translate(matrix, matrix, pos.toArray());
		}

		if(child.quaternion){
			let q = child.quaternion;
			mat4.fromQuat( temp, [q._x, q._y, q._z,q._w] );
			mat4.multiply(matrix, matrix, temp);
		}

		if(child.scale){
			let scale = child.scale;
			mat4.scale(matrix, matrix, scale.toArray());
		}
		node.model = matrix;

		if(child instanceof THREE.Bone || child.parent instanceof THREE.Bone ){ //some bones in 3 is parsed as GROUP type
			node.node_type = "JOINT";
		}

		if(child.children.length > 0){
			var thiz = this;
			for(const ch of child.children){
				let child_node = await thiz.parseToNode(ch, scene);
				node.children.push(child_node);
			}
			// child.children.forEach(async function(ch){
			// 	let child_node = thiz.parseToNode(ch, scene);
			// 	node.children.push(child_node);
			// });
		}

		return node;
	},

	getFilename: function(filename)
	{
		var pos = filename.lastIndexOf("\\");
		if(pos != -1)
			filename = filename.substr(pos+1);
		//strip unix slashes
		pos = filename.lastIndexOf("/");
		if(pos != -1)
			filename = filename.substr(pos+1);
		return filename;
	},

	renameResource: function( old_name, new_name, resources )
	{
		var res = resources[ old_name ];
		if(!res)
		{
			if(!resources[ new_name ])
				console.warn("Resource not found: " + old_name );
			return new_name;
		}
		delete resources[ old_name ];
		resources[ new_name ] = res;
		res.filename = new_name;
		return new_name;
	},

	processMesh: function( mesh, renamed )
	{
		if(!mesh.vertices)
			return; //mesh without vertices?!

		var num_vertices = mesh.vertices.length / 3;
		var num_coords = mesh.coords ? mesh.coords.length / 2 : 0;

		if(num_coords && num_coords != num_vertices )
		{
			var old_coords = mesh.coords;
			var new_coords = new Float32Array( num_vertices * 2 );

			if(num_coords > num_vertices) //check that UVS have 2 components (MAX export 3 components for UVs)
			{
				for(var i = 0; i < num_vertices; ++i )
				{
					new_coords[i*2] = old_coords[i*3];
					new_coords[i*2+1] = old_coords[i*3+1];
				}
			}
			mesh.coords = new_coords;
		}

		//rename morph targets names
		if(mesh.morph_targets)
			for(var j = 0; j < mesh.morph_targets.length; ++j)
			{
				var morph = mesh.morph_targets[j];
				if(morph.mesh && renamed[ morph.mesh ])
					morph.mesh = renamed[ morph.mesh ];
			}
	},

	//depending on the 3D software used, animation tracks could be tricky to handle
	processAnimation: function( animation, renamed )
	{
		for(var i in animation.takes)
		{
			var take = animation.takes[i];

			//apply renaming
			for(var j = 0; j < take.tracks.length; ++j)
			{
				var track = take.tracks[j];
				var pos = track.property.indexOf("/");
				if(!pos)
					continue;
				var nodename = track.property.substr(0,pos);
				var extra = track.property.substr(pos);
				if(extra == "/transform") //blender exports matrices as transform
					extra = "/matrix";

				if( !renamed[nodename] )
					continue;

				nodename = renamed[ nodename ];
				track.property = nodename + extra;
			}

			//rotations could come in different ways, some of them are accumulative, which doesnt work in realscene, so we have to accumulate them previously
			var rotated_nodes = {};
			for(var j = 0; j < take.tracks.length; ++j)
			{
				var track = take.tracks[j];
				track.packed_data = true; //hack: this is how it works my loader
				if(track.name == "rotateX.ANGLE" || track.name == "rotateY.ANGLE" || track.name == "rotateZ.ANGLE")
				{
					var nodename = track.property.split("/")[0];
					if(!rotated_nodes[nodename])
						rotated_nodes[nodename] = { tracks: [] };
					rotated_nodes[nodename].tracks.push( track );
				}
			}

			for(var j in rotated_nodes)
			{
				var info = rotated_nodes[j];
				var newtrack = { data: [], type: "quat", value_size: 4, property: j + "/Transform/rotation", name: "rotation" };
				var times = [];

				//collect timestamps
				for(var k = 0; k < info.tracks.length; ++k)
				{
					var track = info.tracks[k];
					var data = track.data;
					for(var w = 0; w < data.length; w+=2)
						times.push( data[w] );
				}

				//create list of timestamps and remove repeated ones
				times.sort();
				var last_time = -1;
				var final_times = [];
				for(var k = 0; k < times.length; ++k)
				{
					if(times[k] == last_time)
						continue;
					final_times.push( times[k] );
					last_time = times[k];
				}
				times = final_times;

				//create samples
				newtrack.data.length = times.length;
				for(var k = 0; k < newtrack.data.length; ++k)
				{
					var time = times[k];
					var value = quat.create();
					//create keyframe
					newtrack.data[k] = [time, value];

					for(var w = 0; w < info.tracks.length; ++w)
					{
						var track = info.tracks[w];
						var sample = getTrackSample( track, time );
						if(!sample) //nothing to do if no sample or 0
							continue;
						sample *= 0.0174532925; //degrees to radians
						switch( track.name )
						{
							case "rotateX.ANGLE": quat.rotateX( value, value, -sample ); break;
							case "rotateY.ANGLE": quat.rotateY( value, value, sample ); break;
							case "rotateZ.ANGLE": quat.rotateZ( value, value, sample ); break;
						}
					}
				}

				//add track
				take.tracks.push( newtrack );

				//remove old rotation tracks
				for(var w = 0; w < info.tracks.length; ++w)
				{
					var track = info.tracks[w];
					var pos = take.tracks.indexOf( track );
					if(pos == -1)
						continue;
					take.tracks.splice(pos,1);
				}
			}

		}//takes

		function getTrackSample( track, time )
		{
			var data = track.data;
			var l = data.length;
			for(var t = 0; t < l; t+=2)
			{
				if(data[t] == time)
					return data[t+1];
				if(data[t] > time)
					return null;
			}
			return null;
		}
	},

	processMaterial: function(material)
	{
		//cw: get rid of bad characters...
		material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"-");

		material.object_class = "StandardMaterial";
		if(material.id)
			material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"_") + ".json";

		if( material.transparency !== undefined )
		{
			material.opacity = 1.0; //fuck it
			//I have no idea how to parse the transparency info from DAEs...
			//https://github.com/openscenegraph/OpenSceneGraph/blob/master/src/osgPlugins/dae/daeRMaterials.cpp#L1185
			/*
			material.opacity = 1.0 - parseFloat( material.transparency );
			if( material.opaque_info == "RGB_ZERO")
				material.opacity = 1.0 - parseFloat( material.transparent[0] ); //use the red channel
			*/
		}

		//collada supports materials with colors as specular_factor but StandardMaterial only support one value
		if(material.specular_factor && material.specular_factor.length)
			material.specular_factor = material.specular_factor[0];

		if(material.textures)
		{
			for(var i in material.textures)
			{
				var tex_info = material.textures[i];
				var coords = RS.Material.COORDS_UV0;
				if( tex_info.uvs == "TEX1")
					coords = RS.Material.COORDS_UV1;
				tex_info = {
					texture: tex_info.map_id,
					uvs: coords
				};
				material.textures[i] = tex_info;
			}
		}
	}
};

RS.Formats.addSupportedFormat( "fbx", parserFBX );
