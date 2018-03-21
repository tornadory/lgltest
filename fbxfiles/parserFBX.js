var parserFBX = {
	extension: "fbx",
	type: "scene",
	resource: "SceneNode",
	format: "binary",
	dataType:'arraybuffer',

	parse: async function( data, options, filename )
	{
		var scene = await this.fakeParser(data, options, filename);
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
				resolve(null);
			}
			var clean_filename = RS.RM.getBasename( filename );
			var parsed = false;

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
				texture_uploaded: new Map(),
				nodes_by_uid: {},
				url: filename
			};

			scene.root.name = clean_filename;

			var manager = new THREE.LoadingManager( async function() {
				if(fbxobject != null){
					parsed = true;
					var node;
					try{
						node = await thiz.parseToNode(fbxobject, scene);
					}catch(err){
						LEvent.trigger( RS.ResourcesManager, "end_loading_resources", false);
						DriveModule.refreshContent();
						resolve(null);
					}


					scene.root = node;
					if(scene.root)
						scene.root.name = clean_filename;

					if(fbxobject.animations.length > 0)
					{
						var animations = thiz.parseAnimation(fbxobject.animations, scene);
						if(animations)
						{
							var animations_name = resource_base_path + "animations_" + clean_filename + ".wbin";
							animations.filename = animations_name;
							scene.resources[ animations_name ] = animations;
							scene.root.animation = animations_name;
						}
					}

					// clear memory, maybe can do something here
					scene.nodes_by_uid = {};

					scene.texture_uploaded.clear();

		      resolve(scene);
				}
			});

			var loader = new THREE.FBXLoader(manager);
			var path = window.location.origin + resource_base_path;

			try{
				var fbxobject = loader.parse(data, path);
			}catch(err){
				LEvent.trigger( RS.ResourcesManager, "end_loading_resources", false);
				DriveModule.refreshContent();
				resolve(null);
			}

			await thiz.sleep(3000); //for models without textures, callback of manager won't be called, so need a way to resolve it

			if(!parsed){
				if(fbxobject){
					var node;
					try{
						node = await thiz.parseToNode(fbxobject, scene);
					}catch(err){
						LEvent.trigger( RS.ResourcesManager, "end_loading_resources", false);
						DriveModule.refreshContent();
						resolve(null);
					}

					scene.root = node;
					if(scene.root)
						scene.root.name = clean_filename;

					if(fbxobject.animations.length > 0)
					{
						var animations = thiz.parseAnimation(fbxobject.animations, scene);
						if(animations)
						{
							var animations_name = resource_base_path + "animations_" + clean_filename + ".wbin";
							animations.filename = animations_name;
							scene.resources[ animations_name ] = animations;
							scene.root.animation = animations_name;
						}
					}

					// clear memory, maybe can do something here
					scene.nodes_by_uid = {};

					resolve(scene);
				}
			}
	  });
	},

	sleep: function (time) {
		return new Promise(function (resolve, reject) {
		    setTimeout(function () {
		        resolve();
		    }, time);
		})
	},

	getTranslation(out, mat) {
	  out[0] = mat[12];
	  out[1] = mat[13];
	  out[2] = mat[14];

	  return out;
	},

	getScaling(out, mat) {
	  var m11 = mat[0];
	  var m12 = mat[1];
	  var m13 = mat[2];
	  var m21 = mat[4];
	  var m22 = mat[5];
	  var m23 = mat[6];
	  var m31 = mat[8];
	  var m32 = mat[9];
	  var m33 = mat[10];

	  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
	  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
	  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

	  return out;
	},

	getRotation(out, mat) {
	  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
	  var trace = mat[0] + mat[5] + mat[10];
	  var S = 0;

	  if (trace > 0) {
	    S = Math.sqrt(trace + 1.0) * 2;
	    out[3] = 0.25 * S;
	    out[0] = (mat[6] - mat[9]) / S;
	    out[1] = (mat[8] - mat[2]) / S;
	    out[2] = (mat[1] - mat[4]) / S;
	  } else if (mat[0] > mat[5] & mat[0] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
	    out[3] = (mat[6] - mat[9]) / S;
	    out[0] = 0.25 * S;
	    out[1] = (mat[1] + mat[4]) / S;
	    out[2] = (mat[8] + mat[2]) / S;
	  } else if (mat[5] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
	    out[3] = (mat[8] - mat[2]) / S;
	    out[0] = (mat[1] + mat[4]) / S;
	    out[1] = 0.25 * S;
	    out[2] = (mat[6] + mat[9]) / S;
	  } else {
	    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
	    out[3] = (mat[1] - mat[4]) / S;
	    out[0] = (mat[8] + mat[2]) / S;
	    out[1] = (mat[6] + mat[9]) / S;
	    out[2] = 0.25 * S;
	  }

	  return out;
	},

	parseAnimation: function(animationsData, scene){
		if(animationsData.length < 1){
			console.warn("no animation data ...");
			return null;
		}
		var animations = {
			object_class: "Animation",
			takes: {}
		};

		for(let i = 0; i < animationsData.length; i++){ //typically, length is 1
			let default_take = { tracks: [] };
			let tracks = default_take.tracks; // contain all new subtracks

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

				let node_uid = "@" + scene.file_name + "::" + nodename;
				let nodeObj = scene.nodes_by_uid[node_uid];
				if(!nodeObj)
				{
					console.warn("Node " + nodename + " not found");
					continue;
				}

				//let nodeModel = nodeObj.model;

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
					}else {
						groupSize = 2;
					}
				}else {
					groupSize = 1;
				}

				let timeArray = subtracks[timeBaseIndex].times;
				let animLen = timeArray.length;
				let animData = new Float32Array(17 * animLen); // 17 == length of matrix + 1

				let translate = vec3.create();
				let rotation = quat.create();
				let scale = vec3.fromValues(1,1,1);
				if(nodeObj.model){
					this.getTranslation(translate, nodeObj.model);
					this.getRotation(rotation, nodeObj.model);
					this.getScaling(scale, nodeObj.model);
				}

				for(let tIndex = 0; tIndex < timeArray.length; tIndex++){
					let t = timeArray[tIndex];

					for(let g = 0; g < groupSize; g++){
						let dataIndex = j + g;
						let iData = subtracks[dataIndex].times.indexOf(t);
						if(iData != -1){
							//contains time in this sub track
							if(subtracks[dataIndex].name.endsWith(".position")){
								//position / translate
								translate[0] = subtracks[dataIndex].values[iData * 3];
								translate[1] = subtracks[dataIndex].values[iData * 3 + 1];
								translate[2] = subtracks[dataIndex].values[iData * 3 + 2];
							}
							if(subtracks[dataIndex].name.endsWith(".quaternion")){
								//quaternion / rotate
								rotation[0] = subtracks[dataIndex].values[iData * 4];
								rotation[1] = subtracks[dataIndex].values[iData * 4 + 1];
								rotation[2] = subtracks[dataIndex].values[iData * 4 + 2];
								rotation[3] = subtracks[dataIndex].values[iData * 4 + 3];
							}
							if(subtracks[dataIndex].name.endsWith(".scale")){
								//scale / scale
								scale[0] = subtracks[dataIndex].values[iData * 3];
								scale[1] = subtracks[dataIndex].values[iData * 3 + 1];
								scale[2] = subtracks[dataIndex].values[iData * 3 + 2];
							}
						} //end if iData
					}//end for groupSize

					let matrix = mat4.create();
					mat4.translate(matrix, matrix, translate);
					let tmpmatrix = mat4.create();
					mat4.fromQuat( tmpmatrix , rotation );
					mat4.multiply( matrix, matrix, tmpmatrix );
					mat4.scale( matrix, matrix, scale );

					//got matrix and then insert it into animData
					animData[17 * tIndex] = t;
					animData.set(matrix, 17 * tIndex + 1);
				}// end of for tIndex

				//create anim data for this node
				let anim = {};
				// anim.name = "transform";
				anim.name = "matrix";
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
			}else{
				default_take.name = animationsData[i].name;
			}

			default_take.duration = animationsData[i].duration;

			animations.takes[ default_take.name ] = default_take;
		}//endof animations for loop animationsData

		if(animations.takes.length < 1){
			return null;
		}

		return animations;
	},

	uploadTexture: function(texture){
		return new Promise((resolve, reject) => {
			try{
				DriveModule.saveResource(texture, function(v){
					resolve(v);
				}, { skip_alerts: true });
			}catch(err){
				LEvent.trigger( RS.ResourcesManager, "end_loading_resources", false);
				resolve(null);
			}

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

		let node_uid = "@" + scene.file_name;

		if(child.name){
			node_uid = node_uid + "::" + child.name;
		}

		let node = {
			name: child.name,
			id: child.name,
			sid: child.name,
			uid: node_uid,
			children:[],
			model: matrix
		};

		//MESH
		if ( child instanceof THREE.Mesh ) {

			let bufferGeometry = child.geometry;
			if(!bufferGeometry.attributes.position || bufferGeometry.attributes.position.array.length < 3)
			{
				console.warn("NO GEOMETRY, ignore it"); //TBD
				//continue;
			}else{
				//MATERIAL
				let groupmaterials = [];
				if(child.material){

					if(child.material.length > 1){
						for(let i =0; i < child.material.length; i++){
							let material = {};
							material.textures = {};

							let childmat = child.material[i];

							if(childmat.name){
								material.id = scene.file_name + "-" + childmat.name;
							}else{
								material.id = scene.file_name + "-" + "material" + "-" + i;
							}

							material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"_") + ".json";
							material.id = resource_base_path + material.id;

							if(childmat.opacity){
								material.opacity = childmat.opacity;
								if(childmat.opacity < 1){
									material.blend_mode = RS.Blend.ALPHA;
								}
							}

							if(childmat.shiness){
								material.specular_gloss = childmat.shiness;
							}

							if(childmat.color){
								let color = new Float32Array([childmat.color.r,childmat.color.g,childmat.color.b]);
								material.color = color;
							}
							if(child.material.emissive){
								let emissive = new Float32Array([childmat.emissive.r,childmat.emissive.g,childmat.emissive.b]);
								material.emissive = emissive;
							}

							//TBD
							//bumpMap //OK
							//envMap //OK
							//aoMap
							//alphaMap //OK
							//lightMap
							//normalMap //OK
							//specularMap //OK
							//emissiveMap //OK

							if(childmat.normalMap){
								if(childmat.normalMap.image){
									let texture_name = child.name + "_normal";
									if(childmat.name){
										texture_name = child.name + "_" + childmat.name + "_normal";
									}

									if(childmat.normalMap.image.src){
										let fname = childmat.normalMap.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture

											if(!scene.texture_uploaded.get(childmat.normalMap.image.src)){
												fname = scene.file_name + "_" + texture_name + ".png";
												fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
												// fname = fname.toLowerCase();

												scene.texture_uploaded.set(childmat.normalMap.image.src, resource_base_path + fname);

												let imgData = childmat.normalMap.image;
												let imgWidth = imgData.width;
												let imgHeight = imgData.height;
												let imgCanvas = document.createElement('canvas');
												imgCanvas.width = imgWidth;
												imgCanvas.height = imgHeight;
												let imgCtx = imgCanvas.getContext("2d");
												imgCtx.drawImage(imgData, 0, 0);

												let dataURL = imgCanvas.toDataURL("image/png");
												let texture = {
													data: dataURL,
													filename: resource_base_path + fname,
													fullpath: resource_base_path + fname,
													toBase64: function(){
														return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
													},
													toBinary: function(){ //from GL.Texture.toBinary
														let data = dataURL;
														let index = data.indexOf(",");
														let base64_data = data.substr(index+1);
														let binStr = atob( base64_data );
														let len = binStr.length,
														arr = new Uint8Array(len);
														for (let i=0; i<len; ++i ) {
															arr[i] = binStr.charCodeAt(i);
														}
														return arr;
													},
													width: imgWidth,
													height: imgHeight,
													constructor: {
														binary_extension: "png"
													}
												};

												try{
													await this.uploadTexture(texture);
												}catch(err){
													console.error(err);
												}

												let image = {
													filename: resource_base_path + fname,
													map: texture_name,
													name: texture_name,
													path: resource_base_path + fname
												};

												scene.images[texture_name] = image;
											}

											material.textures["normal"] = {
												texture: scene.texture_uploaded.get(childmat.normalMap.image.src),
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

											material.textures["normal"] = {
												texture: image.path,
												uvs: RS.Material.COORDS_UV0
											};
										}
									}
								}
							}

							if(childmat.specularMap){
								if(childmat.specularMap.image){
									let texture_name = child.name + "_specular";
									if(childmat.name){
										texture_name = child.name + "_" + childmat.name + "_specular";
									}

									if(childmat.specularMap.image.src){
										let fname = childmat.specularMap.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture

											if(!scene.texture_uploaded.get(childmat.specularMap.image.src)){
												fname = scene.file_name + "_" + texture_name + ".png";
												fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
												// fname = fname.toLowerCase();

												scene.texture_uploaded.set(childmat.specularMap.image.src, resource_base_path + fname);

												let imgData = childmat.specularMap.image;
												let imgWidth = imgData.width;
												let imgHeight = imgData.height;
												let imgCanvas = document.createElement('canvas');
												imgCanvas.width = imgWidth;
												imgCanvas.height = imgHeight;
												let imgCtx = imgCanvas.getContext("2d");
												imgCtx.drawImage(imgData, 0, 0);

												let dataURL = imgCanvas.toDataURL("image/png");
												let texture = {
													data: dataURL,
													filename: resource_base_path + fname,
													fullpath: resource_base_path + fname,
													toBase64: function(){
														return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
													},
													toBinary: function(){ //from GL.Texture.toBinary
														let data = dataURL;
														let index = data.indexOf(",");
														let base64_data = data.substr(index+1);
														let binStr = atob( base64_data );
														let len = binStr.length,
														arr = new Uint8Array(len);
														for (let i=0; i<len; ++i ) {
															arr[i] = binStr.charCodeAt(i);
														}
														return arr;
													},
													width: imgWidth,
													height: imgHeight,
													constructor: {
														binary_extension: "png"
													}
												};

												try{
													await this.uploadTexture(texture);
												}catch(err){
													console.error(err);
												}

												let image = {
													filename: resource_base_path + fname,
													map: texture_name,
													name: texture_name,
													path: resource_base_path + fname
												};

												scene.images[texture_name] = image;
											}

											material.textures["specular"] = {
												texture: scene.texture_uploaded.get(childmat.specularMap.image.src),
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

											material.textures["specular"] = {
												texture: image.path,
												uvs: RS.Material.COORDS_UV0
											};
										}
									}
								}
							}

							if(childmat.envMap){
								if(childmat.envMap.image){
									let texture_name = child.name + "_env";
									if(childmat.name){
										texture_name = child.name + "_" + childmat.name + "_env";
									}

									if(childmat.envMap.image.src){
										let fname = childmat.envMap.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture

											if(!scene.texture_uploaded.get(childmat.envMap.image.src)){
												fname = scene.file_name + "_" + texture_name + ".png";
												fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
												// fname = fname.toLowerCase();

												scene.texture_uploaded.set(childmat.envMap.image.src, resource_base_path + fname);

												let imgData = childmat.envMap.image;
												let imgWidth = imgData.width;
												let imgHeight = imgData.height;
												let imgCanvas = document.createElement('canvas');
												imgCanvas.width = imgWidth;
												imgCanvas.height = imgHeight;
												let imgCtx = imgCanvas.getContext("2d");
												imgCtx.drawImage(imgData, 0, 0);

												let dataURL = imgCanvas.toDataURL("image/png");
												let texture = {
													data: dataURL,
													filename: resource_base_path + fname,
													fullpath: resource_base_path + fname,
													toBase64: function(){
														return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
													},
													toBinary: function(){ //from GL.Texture.toBinary
														let data = dataURL;
														let index = data.indexOf(",");
														let base64_data = data.substr(index+1);
														let binStr = atob( base64_data );
														let len = binStr.length,
														arr = new Uint8Array(len);
														for (let i=0; i<len; ++i ) {
															arr[i] = binStr.charCodeAt(i);
														}
														return arr;
													},
													width: imgWidth,
													height: imgHeight,
													constructor: {
														binary_extension: "png"
													}
												};

												try{
													await this.uploadTexture(texture);
												}catch(err){
													console.error(err);
												}

												let image = {
													filename: resource_base_path + fname,
													map: texture_name,
													name: texture_name,
													path: resource_base_path + fname
												};

												scene.images[texture_name] = image;
											}

											material.textures["environment"] = {
												texture: scene.texture_uploaded.get(childmat.envMap.image.src),
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

											material.textures["environment"] = {
												texture: image.path,
												uvs: RS.Material.COORDS_UV0
											};
										}
									}
								}
							}

							if(childmat.emissiveMap){
								if(childmat.emissiveMap.image){
									let texture_name = child.name + "_emissive";
									if(childmat.name){
										texture_name = child.name + "_" + childmat.name + "_emissive";
									}

									if(childmat.emissiveMap.image.src){
										let fname = childmat.emissiveMap.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture

											if(!scene.texture_uploaded.get(childmat.emissiveMap.image.src)){
												fname = scene.file_name + "_" + texture_name + ".png";
												fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
												// fname = fname.toLowerCase();

												scene.texture_uploaded.set(childmat.emissiveMap.image.src, resource_base_path + fname);

												let imgData = childmat.emissiveMap.image;
												let imgWidth = imgData.width;
												let imgHeight = imgData.height;
												let imgCanvas = document.createElement('canvas');
												imgCanvas.width = imgWidth;
												imgCanvas.height = imgHeight;
												let imgCtx = imgCanvas.getContext("2d");
												imgCtx.drawImage(imgData, 0, 0);

												let dataURL = imgCanvas.toDataURL("image/png");
												let texture = {
													data: dataURL,
													filename: resource_base_path + fname,
													fullpath: resource_base_path + fname,
													toBase64: function(){
														return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
													},
													toBinary: function(){ //from GL.Texture.toBinary
														let data = dataURL;
														let index = data.indexOf(",");
														let base64_data = data.substr(index+1);
														let binStr = atob( base64_data );
														let len = binStr.length,
														arr = new Uint8Array(len);
														for (let i=0; i<len; ++i ) {
															arr[i] = binStr.charCodeAt(i);
														}
														return arr;
													},
													width: imgWidth,
													height: imgHeight,
													constructor: {
														binary_extension: "png"
													}
												};

												try{
													await this.uploadTexture(texture);
												}catch(err){
													console.error(err);
												}

												let image = {
													filename: resource_base_path + fname,
													map: texture_name,
													name: texture_name,
													path: resource_base_path + fname
												};

												scene.images[texture_name] = image;
											}

											material.textures["emissive"] = {
												texture: scene.texture_uploaded.get(childmat.emissiveMap.image.src),
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

											material.textures["emissive"] = {
												texture: image.path,
												uvs: RS.Material.COORDS_UV0
											};
										}
									}
								}
							}

							if(childmat.bumpMap){
								if(childmat.bumpMap.image){
									let texture_name = child.name + "_bump";
									if(childmat.name){
										texture_name = child.name + "_" + childmat.name + "_bump";
									}

									if(childmat.bumpMap.image.src){
										let fname = childmat.bumpMap.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture

											if(!scene.texture_uploaded.get(childmat.bumpMap.image.src)){
												fname = scene.file_name + "_" + texture_name + ".png";
												fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
												// fname = fname.toLowerCase();

												scene.texture_uploaded.set(childmat.bumpMap.image.src, resource_base_path + fname);

												let imgData = childmat.bumpMap.image;
												let imgWidth = imgData.width;
												let imgHeight = imgData.height;
												let imgCanvas = document.createElement('canvas');
												imgCanvas.width = imgWidth;
												imgCanvas.height = imgHeight;
												let imgCtx = imgCanvas.getContext("2d");
												imgCtx.drawImage(imgData, 0, 0);

												let dataURL = imgCanvas.toDataURL("image/png");
												let texture = {
													data: dataURL,
													filename: resource_base_path + fname,
													fullpath: resource_base_path + fname,
													toBase64: function(){
														return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
													},
													toBinary: function(){ //from GL.Texture.toBinary
														let data = dataURL;
														let index = data.indexOf(",");
														let base64_data = data.substr(index+1);
														let binStr = atob( base64_data );
														let len = binStr.length,
														arr = new Uint8Array(len);
														for (let i=0; i<len; ++i ) {
															arr[i] = binStr.charCodeAt(i);
														}
														return arr;
													},
													width: imgWidth,
													height: imgHeight,
													constructor: {
														binary_extension: "png"
													}
												};

												try{
													await this.uploadTexture(texture);
												}catch(err){
													console.error(err);
												}

												let image = {
													filename: resource_base_path + fname,
													map: texture_name,
													name: texture_name,
													path: resource_base_path + fname
												};

												scene.images[texture_name] = image;
											}

											material.textures["bump"] = {
												texture: scene.texture_uploaded.get(childmat.bumpMap.image.src),
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

											material.textures["bump"] = {
												texture: image.path,
												uvs: RS.Material.COORDS_UV0
											};
										}
									}
								}
							}

							if(childmat.alphaMap){
								material.blend_mode = RS.Blend.ALPHA;
								if(childmat.alphaMap.image){
									let texture_name = child.name + "_alpha";
									if(childmat.name){
										texture_name = child.name + "_" + childmat.name + "_alpha";
									}

									if(childmat.alphaMap.image.src){
										let fname = childmat.alphaMap.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture

											if(!scene.texture_uploaded.get(childmat.alphaMap.image.src)){
												fname = scene.file_name + "_" + texture_name + ".png";
												fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
												// fname = fname.toLowerCase();

												scene.texture_uploaded.set(childmat.alphaMap.image.src, resource_base_path + fname);

												let imgData = childmat.alphaMap.image;
												let imgWidth = imgData.width;
												let imgHeight = imgData.height;
												let imgCanvas = document.createElement('canvas');
												imgCanvas.width = imgWidth;
												imgCanvas.height = imgHeight;
												let imgCtx = imgCanvas.getContext("2d");
												imgCtx.drawImage(imgData, 0, 0);

												let dataURL = imgCanvas.toDataURL("image/png");
												let texture = {
													data: dataURL,
													filename: resource_base_path + fname,
													fullpath: resource_base_path + fname,
													toBase64: function(){
														return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
													},
													toBinary: function(){ //from GL.Texture.toBinary
														let data = dataURL;
														let index = data.indexOf(",");
														let base64_data = data.substr(index+1);
														let binStr = atob( base64_data );
														let len = binStr.length,
														arr = new Uint8Array(len);
														for (let i=0; i<len; ++i ) {
															arr[i] = binStr.charCodeAt(i);
														}
														return arr;
													},
													width: imgWidth,
													height: imgHeight,
													constructor: {
														binary_extension: "png"
													}
												};

												try{
													await this.uploadTexture(texture);
												}catch(err){
													console.error(err);
												}

												let image = {
													filename: resource_base_path + fname,
													map: texture_name,
													name: texture_name,
													path: resource_base_path + fname
												};

												scene.images[texture_name] = image;
											}

											material.textures["opacity"] = {
												texture: scene.texture_uploaded.get(childmat.alphaMap.image.src),
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

											material.textures["opacity"] = {
												texture: image.path,
												uvs: RS.Material.COORDS_UV0
											};
										}
									}
								}
							}

							if(childmat.map){
								if(childmat.map.image){
									let texture_name = child.name + "_color";
									if(childmat.name){
										texture_name = child.name + "_" + childmat.name + "_color";
									}

									if(childmat.map.image.src){
										let fname = childmat.map.image.src;
										if(fname.startsWith("blob")){ //blob file embeded texture
											if(!scene.texture_uploaded.get(childmat.map.image.src)){
												fname = scene.file_name + "_" + texture_name + ".png";
												fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
												// fname = fname.toLowerCase();

												scene.texture_uploaded.set(childmat.map.image.src, resource_base_path + fname);

												let imgData = childmat.map.image;
												let imgWidth = imgData.width;
												let imgHeight = imgData.height;
												let imgCanvas = document.createElement('canvas');
												imgCanvas.width = imgWidth;
												imgCanvas.height = imgHeight;
												let imgCtx = imgCanvas.getContext("2d");
												imgCtx.drawImage(imgData, 0, 0);

												let dataURL = imgCanvas.toDataURL("image/png");
												let texture = {
													data: dataURL,
													filename: resource_base_path + fname,
													fullpath: resource_base_path + fname,
													toBase64: function(){
														return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
													},
													toBinary: function(){ //from GL.Texture.toBinary
														let data = dataURL;
														let index = data.indexOf(",");
														let base64_data = data.substr(index+1);
														let binStr = atob( base64_data );
														let len = binStr.length,
														arr = new Uint8Array(len);
														for (let i=0; i<len; ++i ) {
															arr[i] = binStr.charCodeAt(i);
														}
														return arr;
													},
													width: imgWidth,
													height: imgHeight,
													constructor: {
														binary_extension: "png"
													}
												};

												try{
													await this.uploadTexture(texture);
												}catch(err){
													console.error(err);
												}

												let image = {
													filename: resource_base_path + fname,
													map: texture_name,
													name: texture_name,
													path: resource_base_path + fname
												};

												scene.images[texture_name] = image;
											}

											material.textures["color"] = {
												texture: scene.texture_uploaded.get(childmat.map.image.src),
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

							groupmaterials.push(material.id);
						}
					}else{
						let material = {};
						material.textures = {};

						material.id = scene.file_name + "-" + child.material.name;
						material.id = material.id.replace(/[^a-z0-9\.\-]/gi,"_") + ".json";
						material.id = resource_base_path + material.id;

						if(child.material.opacity){
							material.opacity = child.material.opacity;
							if(child.material.opacity < 1){
								material.blend_mode = RS.Blend.ALPHA;
							}
						}

						if(child.material.shiness){
							material.specular_gloss = child.material.shiness;
						}

						if(child.material.color){
							let color = new Float32Array([child.material.color.r,child.material.color.g,child.material.color.b]);
							material.color = color;
						}
						if(child.material.emissive){
							let emissive = new Float32Array([child.material.emissive.r,child.material.emissive.g,child.material.emissive.b]);
							material.emissive = emissive;
						}

						//TBD
						//bumpMap //OK
						//envMap //OK
						//aoMap
						//alphaMap //OK
						//lightMap
						//normalMap //OK
						//specularMap //OK
						//emissiveMap //OK

						if(child.material.normalMap){
							if(child.material.normalMap.image){
								let texture_name = child.name + "_normal";
								if(child.material.name){
									texture_name = child.name + "_" + child.material.name + "_normal";
								}

								if(child.material.normalMap.image.src){
									let fname = child.material.normalMap.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										if(!scene.texture_uploaded.get(child.material.normalMap.image.src)){
											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											// fname = fname.toLowerCase();

											scene.texture_uploaded.set(child.material.normalMap.image.src, resource_base_path + fname);

											let imgData = child.material.normalMap.image;
											let imgWidth = imgData.width;
											let imgHeight = imgData.height;
											let imgCanvas = document.createElement('canvas');
											imgCanvas.width = imgWidth;
											imgCanvas.height = imgHeight;
											let imgCtx = imgCanvas.getContext("2d");
											imgCtx.drawImage(imgData, 0, 0);

											let dataURL = imgCanvas.toDataURL("image/png");
											let texture = {
												data: imgData,
												filename: resource_base_path + fname,
												fullpath: resource_base_path + fname,
												toBase64: function(){
													return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
												},
												toBinary: function(){ //from GL.Texture.toBinary
													let data = dataURL;
													let index = data.indexOf(",");
													let base64_data = data.substr(index+1);
													let binStr = atob( base64_data );
													let len = binStr.length,
													arr = new Uint8Array(len);
													for (let i=0; i<len; ++i ) {
														arr[i] = binStr.charCodeAt(i);
													}
													return arr;
												},
												width: imgWidth,
												height: imgHeight,
												constructor: {
													binary_extension: "png"
												}
											};

											try{
												await this.uploadTexture(texture);
											}catch(err){
												console.error(err);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;
										}

										material.textures["normal"] = {
											texture: scene.texture_uploaded.get(child.material.normalMap.image.src),
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

										material.textures["normal"] = {
											texture: image.path,
											uvs: RS.Material.COORDS_UV0
										};
									}

								}
							}
						}

						if(child.material.specularMap){
							if(child.material.specularMap.image){
								let texture_name = child.name + "_specular";
								if(child.material.name){
									texture_name = child.name + "_" + child.material.name + "_specular";
								}

								if(child.material.specularMap.image.src){
									let fname = child.material.specularMap.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										if(!scene.texture_uploaded.get(child.material.specularMap.image.src)){
											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											// fname = fname.toLowerCase();

											scene.texture_uploaded.set(child.material.specularMap.image.src, resource_base_path + fname);

											let imgData = child.material.specularMap.image;
											let imgWidth = imgData.width;
											let imgHeight = imgData.height;
											let imgCanvas = document.createElement('canvas');
											imgCanvas.width = imgWidth;
											imgCanvas.height = imgHeight;
											let imgCtx = imgCanvas.getContext("2d");
											imgCtx.drawImage(imgData, 0, 0);

											let dataURL = imgCanvas.toDataURL("image/png");
											let texture = {
												data: imgData,
												filename: resource_base_path + fname,
												fullpath: resource_base_path + fname,
												toBase64: function(){
													return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
												},
												toBinary: function(){ //from GL.Texture.toBinary
													let data = dataURL;
													let index = data.indexOf(",");
													let base64_data = data.substr(index+1);
													let binStr = atob( base64_data );
													let len = binStr.length,
													arr = new Uint8Array(len);
													for (let i=0; i<len; ++i ) {
														arr[i] = binStr.charCodeAt(i);
													}
													return arr;
												},
												width: imgWidth,
												height: imgHeight,
												constructor: {
													binary_extension: "png"
												}
											};

											try{
												await this.uploadTexture(texture);
											}catch(err){
												console.error(err);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;
										}

										material.textures["specular"] = {
											texture: scene.texture_uploaded.get(child.material.specularMap.image.src),
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

										material.textures["specular"] = {
											texture: image.path,
											uvs: RS.Material.COORDS_UV0
										};
									}

								}
							}
						}

						if(child.material.envMap){
							if(child.material.envMap.image){
								let texture_name = child.name + "_env";
								if(child.material.name){
									texture_name = child.name + "_" + child.material.name + "_env";
								}

								if(child.material.envMap.image.src){
									let fname = child.material.envMap.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										if(!scene.texture_uploaded.get(child.material.envMap.image.src)){
											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											// fname = fname.toLowerCase();

											scene.texture_uploaded.set(child.material.envMap.image.src, resource_base_path + fname);

											let imgData = child.material.envMap.image;
											let imgWidth = imgData.width;
											let imgHeight = imgData.height;
											let imgCanvas = document.createElement('canvas');
											imgCanvas.width = imgWidth;
											imgCanvas.height = imgHeight;
											let imgCtx = imgCanvas.getContext("2d");
											imgCtx.drawImage(imgData, 0, 0);

											let dataURL = imgCanvas.toDataURL("image/png");
											let texture = {
												data: imgData,
												filename: resource_base_path + fname,
												fullpath: resource_base_path + fname,
												toBase64: function(){
													return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
												},
												toBinary: function(){ //from GL.Texture.toBinary
													let data = dataURL;
													let index = data.indexOf(",");
													let base64_data = data.substr(index+1);
													let binStr = atob( base64_data );
													let len = binStr.length,
													arr = new Uint8Array(len);
													for (let i=0; i<len; ++i ) {
														arr[i] = binStr.charCodeAt(i);
													}
													return arr;
												},
												width: imgWidth,
												height: imgHeight,
												constructor: {
													binary_extension: "png"
												}
											};

											try{
												await this.uploadTexture(texture);
											}catch(err){
												console.error(err);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;
										}

										material.textures["environment"] = {
											texture: scene.texture_uploaded.get(child.material.envMap.image.src),
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

										material.textures["environment"] = {
											texture: image.path,
											uvs: RS.Material.COORDS_UV0
										};
									}

								}
							}
						}

						if(child.material.emissiveMap){
							if(child.material.emissiveMap.image){
								let texture_name = child.name + "_emissive";
								if(child.material.name){
									texture_name = child.name + "_" + child.material.name + "_emissive";
								}

								if(child.material.emissiveMap.image.src){
									let fname = child.material.emissiveMap.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										if(!scene.texture_uploaded.get(child.material.emissiveMap.image.src)){
											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											// fname = fname.toLowerCase();

											scene.texture_uploaded.set(child.material.emissiveMap.image.src, resource_base_path + fname);

											let imgData = child.material.emissiveMap.image;
											let imgWidth = imgData.width;
											let imgHeight = imgData.height;
											let imgCanvas = document.createElement('canvas');
											imgCanvas.width = imgWidth;
											imgCanvas.height = imgHeight;
											let imgCtx = imgCanvas.getContext("2d");
											imgCtx.drawImage(imgData, 0, 0);

											let dataURL = imgCanvas.toDataURL("image/png");
											let texture = {
												data: imgData,
												filename: resource_base_path + fname,
												fullpath: resource_base_path + fname,
												toBase64: function(){
													return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
												},
												toBinary: function(){ //from GL.Texture.toBinary
													let data = dataURL;
													let index = data.indexOf(",");
													let base64_data = data.substr(index+1);
													let binStr = atob( base64_data );
													let len = binStr.length,
													arr = new Uint8Array(len);
													for (let i=0; i<len; ++i ) {
														arr[i] = binStr.charCodeAt(i);
													}
													return arr;
												},
												width: imgWidth,
												height: imgHeight,
												constructor: {
													binary_extension: "png"
												}
											};

											try{
												await this.uploadTexture(texture);
											}catch(err){
												console.error(err);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;
										}

										material.textures["emissive"] = {
											texture: scene.texture_uploaded.get(child.material.emissiveMap.image.src),
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

										material.textures["emissive"] = {
											texture: image.path,
											uvs: RS.Material.COORDS_UV0
										};
									}

								}
							}
						}

						if(child.material.bumpMap){
							if(child.material.bumpMap.image){
								let texture_name = child.name + "_bump";
								if(child.material.name){
									texture_name = child.name + "_" + child.material.name + "_bump";
								}

								if(child.material.bumpMap.image.src){
									let fname = child.material.bumpMap.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										if(!scene.texture_uploaded.get(child.material.bumpMap.image.src)){
											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											// fname = fname.toLowerCase();

											scene.texture_uploaded.set(child.material.bumpMap.image.src, resource_base_path + fname);

											let imgData = child.material.bumpMap.image;
											let imgWidth = imgData.width;
											let imgHeight = imgData.height;
											let imgCanvas = document.createElement('canvas');
											imgCanvas.width = imgWidth;
											imgCanvas.height = imgHeight;
											let imgCtx = imgCanvas.getContext("2d");
											imgCtx.drawImage(imgData, 0, 0);

											let dataURL = imgCanvas.toDataURL("image/png");
											let texture = {
												data: imgData,
												filename: resource_base_path + fname,
												fullpath: resource_base_path + fname,
												toBase64: function(){
													return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
												},
												toBinary: function(){ //from GL.Texture.toBinary
													let data = dataURL;
													let index = data.indexOf(",");
													let base64_data = data.substr(index+1);
													let binStr = atob( base64_data );
													let len = binStr.length,
													arr = new Uint8Array(len);
													for (let i=0; i<len; ++i ) {
														arr[i] = binStr.charCodeAt(i);
													}
													return arr;
												},
												width: imgWidth,
												height: imgHeight,
												constructor: {
													binary_extension: "png"
												}
											};

											try{
												await this.uploadTexture(texture);
											}catch(err){
												console.error(err);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;
										}

										material.textures["bump"] = {
											texture: scene.texture_uploaded.get(child.material.bumpMap.image.src),
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

										material.textures["bump"] = {
											texture: image.path,
											uvs: RS.Material.COORDS_UV0
										};
									}

								}
							}
						}

						if(child.material.alphaMap){
							material.blend_mode = RS.Blend.ALPHA;
							if(child.material.alphaMap.image){

								let texture_name = child.name + "_alpha";
								if(child.material.name){
									texture_name = child.name + "_" + child.material.name + "_alpha";
								}

								if(child.material.alphaMap.image.src){
									let fname = child.material.alphaMap.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										if(!scene.texture_uploaded.get(child.material.alphaMap.image.src)){
											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											// fname = fname.toLowerCase();

											scene.texture_uploaded.set(child.material.alphaMap.image.src, resource_base_path + fname);

											let imgData = child.material.alphaMap.image;
											let imgWidth = imgData.width;
											let imgHeight = imgData.height;
											let imgCanvas = document.createElement('canvas');
											imgCanvas.width = imgWidth;
											imgCanvas.height = imgHeight;
											let imgCtx = imgCanvas.getContext("2d");
											imgCtx.drawImage(imgData, 0, 0);

											let dataURL = imgCanvas.toDataURL("image/png");
											let texture = {
												data: imgData,
												filename: resource_base_path + fname,
												fullpath: resource_base_path + fname,
												toBase64: function(){
													return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
												},
												toBinary: function(){ //from GL.Texture.toBinary
													let data = dataURL;
													let index = data.indexOf(",");
													let base64_data = data.substr(index+1);
													let binStr = atob( base64_data );
													let len = binStr.length,
													arr = new Uint8Array(len);
													for (let i=0; i<len; ++i ) {
														arr[i] = binStr.charCodeAt(i);
													}
													return arr;
												},
												width: imgWidth,
												height: imgHeight,
												constructor: {
													binary_extension: "png"
												}
											};

											try{
												await this.uploadTexture(texture);
											}catch(err){
												console.error(err);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;
										}

										material.textures["opacity"] = {
											texture: scene.texture_uploaded.get(child.material.alphaMap.image.src),
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

										material.textures["opacity"] = {
											texture: image.path,
											uvs: RS.Material.COORDS_UV0
										};
									}

								}
							}
						}

						if(child.material.map){
							if(child.material.map.image){
								let texture_name = child.name + "_color";
								if(child.material.name){
									texture_name = child.name + "_" + child.material.name + "_color";
								}

								if(child.material.map.image.src){
									let fname = child.material.map.image.src;
									if(fname.startsWith("blob")){ //blob file embeded texture
										if(!scene.texture_uploaded.get(child.material.map.image.src)){

											fname = scene.file_name + "_" + texture_name + ".png";
											fname = fname.replace(/[^a-z0-9\.\-]/gi,"_");
											// fname = fname.toLowerCase();

											scene.texture_uploaded.set(child.material.map.image.src, resource_base_path + fname);

											let imgData = child.material.map.image;
											let imgWidth = imgData.width;
											let imgHeight = imgData.height;
											let imgCanvas = document.createElement('canvas');
											imgCanvas.width = imgWidth;
											imgCanvas.height = imgHeight;
											let imgCtx = imgCanvas.getContext("2d");
											imgCtx.drawImage(imgData, 0, 0);

											let dataURL = imgCanvas.toDataURL("image/png");
											let texture = {
												data: imgData,
												filename: resource_base_path + fname,
												fullpath: resource_base_path + fname,
												toBase64: function(){
													return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
												},
												toBinary: function(){ //from GL.Texture.toBinary
													let data = dataURL;
													let index = data.indexOf(",");
													let base64_data = data.substr(index+1);
													let binStr = atob( base64_data );
													let len = binStr.length,
													arr = new Uint8Array(len);
													for (let i=0; i<len; ++i ) {
														arr[i] = binStr.charCodeAt(i);
													}
													return arr;
												},
												width: imgWidth,
												height: imgHeight,
												constructor: {
													binary_extension: "png"
												}
											};

											try{
												await this.uploadTexture(texture);
											}catch(err){
												console.error(err);
											}

											let image = {
												filename: resource_base_path + fname,
												map: texture_name,
												name: texture_name,
												path: resource_base_path + fname
											};

											scene.images[texture_name] = image;
										}

										material.textures["color"] = {
											texture: scene.texture_uploaded.get(child.material.map.image.src),
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

				//MESH
				let geometry = new THREE.Geometry().fromBufferGeometry( bufferGeometry );

				for(let i = 0; i < geometry.vertices.length; i++){
					for(let j = 0; j < 3; j++){
						let index = 3*i + j;
						vertexArray[index] = geometry.vertices[i].getComponent(j);
					}
				}

				for(let i = 0; i < geometry.faces.length; i++){
					let baseIndex = 3 * i;
					indexArray[baseIndex] = geometry.faces[i].a;
					indexArray[baseIndex + 1] = geometry.faces[i].b;
					indexArray[baseIndex + 2] = geometry.faces[i].c;
				}

				if(bufferGeometry.attributes.uv){
					uvArray = bufferGeometry.attributes.uv.array.slice();
				}

				// if(child.bindMatrix){ //ignore bindMatrix
				// 	bindMatrix = child.bindMatrix.elements.slice();
				// }else{
				// 	bindMatrix = mat4.create(); //identity
				// }

				//bones
				if(bufferGeometry.FBX_Deformer){
					let bonesNum = bufferGeometry.FBX_Deformer.bones.length;
					if(bonesNum > 0){
						for(let bIndex =0; bIndex < bonesNum; bIndex++){
							let bNodeName = "@" + scene.file_name + "::" + bufferGeometry.FBX_Deformer.bones[bIndex].name;
							let bMatrix = bufferGeometry.FBX_Deformer.rawBones[bIndex].transform.elements.slice();
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

				let groups = [];
				if(bufferGeometry.groups && bufferGeometry.groups.length > 0){
					for(let g=0; g < bufferGeometry.groups.length; g++){
						let group = {
							name: "group" + g,
							start: bufferGeometry.groups[g].start,
							length: bufferGeometry.groups[g].count,
							material: ( groupmaterials[bufferGeometry.groups[g].materialIndex] || "" )
						};

						groups.push( group );
					}
				}

				let mesh_data = {};

				mesh_data.info = {groups: groups};

				if(vertexArray && vertexArray.length > 0)
					mesh_data.vertices = new Float32Array(vertexArray);

				if(indexArray && indexArray.length > 0){
					if(indexArray.length <= 65535){
						mesh_data.triangles = new Uint16Array(indexArray);
					}
					else {
						mesh_data.triangles = new Uint32Array(indexArray);
					}
				}

				if(normalsArray && normalsArray.length > 0)
					mesh_data.normals = normalsArray;

				if(uvArray && uvArray.length > 0)
					mesh_data.coords = uvArray;

				if(boneIndexArray && boneIndexArray.length > 0)
					mesh_data.bone_indices = boneIndexArray;

				if(weightsArray && weightsArray.length > 0)
					mesh_data.weights = weightsArray;

				// if(bindMatrix && bindMatrix.length > 0){ //use bind_matrix will cause some abnormal behaviour, so ignore it right now
				// 	mesh_data.bind_matrix = bindMatrix;
				// }

				if(joints && joints.length > 0){
					mesh_data.bones = joints;
				}

				mesh_data.name = scene.file_name + "-" + child.name;
				mesh_data.filename = scene.file_name + "-" + child.name + ".wbin";
				mesh_data.fullpath = resource_base_path + scene.file_name + "-" + child.name + ".wbin";
				mesh_data.object_class = "Mesh";
				mesh_data.uid = "@" + scene.file_name + "-" + child.name;

				let mesh_id = resource_base_path + scene.file_name + "-" + child.name + "-mesh" + ".wbin";
				scene.meshes[mesh_id] = mesh_data;

				node.mesh = mesh_id;


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

		// if(child instanceof THREE.Bone || child.parent instanceof THREE.Bone ){ //some bones in 3 is parsed as GROUP type
		if(child instanceof THREE.Bone){
			node.node_type = "JOINT";
		}

		if(child.children.length > 0){
			var thiz = this;
			for(const ch of child.children){
				let child_node = await thiz.parseToNode(ch, scene);
				node.children.push(child_node);
			}
		}

		if(node_uid){
			scene.nodes_by_uid[ node_uid ] = node;
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
	}
};

RS.Formats.addSupportedFormat( "fbx", parserFBX );
