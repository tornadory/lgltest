//===========================================================================
//
//Inspector Editors for the most common Components plus Materials and Scene.
//Editors are not included in RealScene because they do not depend on them
//
//===========================================================================
var TRASH_ICON_CODE = "<img src='imgs/mini-icon-trash.png'/>";

RS.Components.GlobalInfo["@inspector"] = function( component, inspector )
{
	var node = component._root;
	if(!node)
		return;
	var scene = node._in_tree;
	if(!scene)
		return;

	//inspector.addColor("Background", component.background_color, { pretitle: AnimationModule.getKeyframeCode( component, "background_color"), callback: function(color) { vec3.copy(component.background_color,color); } });
	inspector.addColor("Ambient light", component.ambient_color, { pretitle: AnimationModule.getKeyframeCode( component, "ambient_color"), callback: function(color) { vec3.copy(component.ambient_color,color); } });
	inspector.addSeparator();

	inner_setTexture("environment");
	inner_setTexture("irradiance");

	inspector.addSeparator();
	//inspector.addCheckbox("Linear Pipeline", component.linear_pipeline, { pretitle: AnimationModule.getKeyframeCode( component, "linear_pipeline"), callback: function(v) { component.linear_pipeline = v; } });

    function inner_setTexture(channel) {
        inspector.addTexture(channel, component.textures[channel], {
            pretitle: AnimationModule.getKeyframeCode(component, "textures/" + channel), channel: channel, callback: function (filename) {
			component.textures[this.options.channel] = filename;
			if(filename && filename[0] != ":")
				RS.ResourcesManager.load( filename );
	}
        });
    }

	if( component.render_settings )
	{
		inspector.widgets_per_row = 2;
		inspector.addButton( "Render Settings", "Edit", { width: "calc(100% - 30px)", callback: function(){ EditorModule.showRenderSettingsDialog( component.render_settings ); } } );
		inspector.addButton( null, TRASH_ICON_CODE, { width: "30px", callback: function(){ component.render_settings = null; EditorModule.refreshAttributes(); } } );
		inspector.widgets_per_row = 1;
	}
	else
		inspector.addButton( "Render Settings", "Create", { callback: function(){ component.render_settings = new RS.RenderSettings(); EditorModule.refreshAttributes(); } } );
}



//======================================================================================
// "Transform" component inspector
//======================================================================================
// Some components need special inspectors
RS.Components.Transform["@inspector"] = function (transform, inspector) {
	if(!transform)
		return;
	var node = transform._root;

	inspector.addVector3("Position", transform._position, {
		pretitle: AnimationModule.getKeyframeCode( transform, "position"),
		callback: function(r) {
			if(r.length == 3)
				transform.setPosition(r[0],r[1],r[2]);
		},callback_before: function() {
			CORE.userAction("component_changed", transform );
		},callback_update: function() {
			return transform._position;
		},
		precision: 3
	});

	var euler = quat.toEuler( vec3.create(), transform._rotation );
	vec3.scale(euler,euler, RAD2DEG );
	var rot = [euler[2],euler[0],euler[1]];

	inspector.addVector3("Rotation", rot, {
		pretitle: AnimationModule.getKeyframeCode( transform, "rotation"),
		callback: function(r) {
			vec3.scale(r,r, DEG2RAD );
			var euler = [r[1],r[2],r[0]];
			transform.setRotationFromEuler(euler);
		}, callback_before: function() {
			CORE.userAction("component_changed", transform );
        }
    });

	var scale_widget = inspector.addVector3("Scale", transform._scaling, {
		step: 0.01,
		pretitle: AnimationModule.getKeyframeCode( transform, "scaling"),
		callback: function(v) {
			transform.setScale(v[0],v[1],v[2]);
		},
		callback_before: function() {
			CORE.userAction("component_changed", transform );
        }
    });

	inspector.addNumber("Uniform Scale", transform._scaling[0].toFixed(3), {
		step: 0.01,
		pretitle: AnimationModule.getKeyframeCode( transform, "scaling"),
		callback: function(v) {
			scale_widget.setValue([v,v,v]);
			//transform.setScale(v,v,v);
		}, callback_before: function() {
			CORE.userAction("component_changed", transform );
}
    });
}

RS.Transform.prototype.getExtraTitleCode = function () {
	return AnimationModule.getKeyframeCode( this, "data" );
}

RS.Components.Camera["@inspector"] = function (camera, inspector) {
	if(!camera)
		return;
	var node = camera._root;


    // inspector.addCombo("Type", camera.type, { values: { "Orthographic" : RS.Camera.ORTHOGRAPHIC, "Perspective": RS.Camera.PERSPECTIVE, "Ortho2D": RS.Camera.ORTHO2D }, pretitle: AnimationModule.getKeyframeCode( camera, "type"), callback: function (value) {
    // 	camera.type = value;
    // 	inspector.refresh();
    // }});
    // inspector.widgets_per_row = 2;
    if (camera.type != RS.Camera.ORTHO2D) {
		if(camera.type == RS.Camera.PERSPECTIVE)
            inspector.addNumber("Fov", camera.fov, { pretitle: AnimationModule.getKeyframeCode(camera, "fov"), min: 2, max: 180, units: 'º', callback: function (value) { camera.fov = value; } });
        //inspector.addNumber("Aspect", camera.aspect, { pretitle: AnimationModule.getKeyframeCode( camera, "aspect" ), min: 0.1, max: 10, step: 0.01, callback: function (value) { camera.aspect = value; }});
	}
	inspector.addNumber("Near", camera.near, { pretitle: AnimationModule.getKeyframeCode( camera, "near" ), callback: function (value) { camera.near = value; }});
	inspector.addNumber("Far", camera.far, { pretitle: AnimationModule.getKeyframeCode( camera, "far" ), callback: function (value) { camera.far = value; }});
    // inspector.widgets_per_row = 1;


    // if(camera.type == RS.Camera.ORTHO2D)
    // 	inspector.addVector4("Orthographic", camera.orthographic, {  pretitle: AnimationModule.getKeyframeCode( camera, "orthographic" ),  name_width: 100, callback: function (value) { camera.orthographic = value; }});
    // else
    // {
    // 	if(camera.type == RS.Camera.ORTHOGRAPHIC)
    // 		inspector.addNumber("Frustum size", camera.frustum_size, {  pretitle: AnimationModule.getKeyframeCode( camera, "frustum_size" ),  name_width: 100, callback: function (value) { camera.frustum_size = value; }});
    // 	inspector.addNumber("focalLength", camera.focalLength, { min: 0.0001, pretitle: AnimationModule.getKeyframeCode( camera, "focalLength" ),  name_width: 100, callback: function(v) {
    // 		camera.focalLength = v;
    // 	}});
    // }

	var is_node_camera = (node && !node._is_root);

    // inspector.addSeparator();
    inspector.addLayers("Layers", camera.layers, { pretitle: AnimationModule.getKeyframeCode( camera, "layers"), callback: function (value) {
    	camera.layers = value;
    	inspector.refresh();
    }});


	if(!is_node_camera)
	{
		inspector.addSeparator();
		inspector.addVector3("Eye", camera.eye, { name_width: 80, pretitle: AnimationModule.getKeyframeCode( camera, "eye" ), disabled: is_node_camera, callback: function(v) {
			camera.eye = v;
		}});
		inspector.addVector3("Center", camera.center, { name_width: 80, pretitle: AnimationModule.getKeyframeCode( camera, "center" ), disabled: is_node_camera, callback: function(v) {
			camera.center = v;
		}});
		inspector.addVector3("Up", camera.up, { name_width: 80, pretitle: AnimationModule.getKeyframeCode( camera, "up" ), disabled: is_node_camera, callback: function(v) {
			camera.up = vec3.normalize(vec3.create(), v);
		}});
	}

    inspector.addButtons(null,["Copy from current","View from here"],{ callback: function(v){
    	if(v == "Copy from current")
    		inner_copy_from_current();
    	else
    		inner_view_from_here();
    }});

	inspector.addTitle("Viewport");
	inspector.addVector2("Offset", camera._viewport.subarray(0,2), { pretitle: AnimationModule.getKeyframeCode( camera, "viewport_offset" ),  name_width: 100,min:0, max:1, step: 0.001, callback: function(v) {
		camera._viewport.subarray(0,2).set(v);
	}});
	inspector.addVector2("Size", camera._viewport.subarray(2,4), { pretitle: AnimationModule.getKeyframeCode( camera, "viewport_size" ), name_width: 100, min:0, max:1, step: 0.001, callback: function(v) {
		camera._viewport.subarray(2,4).set(v);
	}});

	inspector.addColor("Background Color", camera.background_color , { pretitle: AnimationModule.getKeyframeCode( camera, "background_color" ), callback: function (v) {
		camera.background_color = v;
		if(RenderModule.cameras)
			for(var i in RenderModule.cameras)
				RenderModule.cameras[i].background_color = v;
	}});

	inspector.widgets_per_row = 3;
	inspector.addCheckbox("clear color", camera.clear_color , { name_width: "65%", callback: function (v) { camera.clear_color = v; } });
	inspector.addCheckbox("clear depth", camera.clear_depth , { name_width: "65%", callback: function (v) { camera.clear_depth = v; } });
	inspector.addCheckbox("bg. alpha", camera.background_color[3] == 0 , { name_width: "65%", callback: function (v) { camera.background_color[3] = v ? 0 : 1; } });
	inspector.widgets_per_row = 1;

    // inspector.addTitle("Render to Texture");
    // inspector.addCheckbox("Enable", camera.render_to_texture , { callback: function (v) { camera.render_to_texture = v; inspector.refresh(); } });
    // if(camera.render_to_texture)
    // {
    // 	inspector.addRenderFrameContext("Frame", camera._frame );
    // 	inspector.addCheckbox("Show on Viewport", camera.show_frame , { callback: function (v) { camera.show_frame = v; } });
    // }

    function inner_copy_from_current() {
		camera.lookAt( RenderModule.camera.eye, RenderModule.camera.center, RenderModule.camera.up );
		inspector.refresh();
	}

    function inner_view_from_here() {
		RenderModule.camera.view_matrix = camera.view_matrix
		inspector.refresh();
	}
}

//======================================================================================
// "Light" component inspector
//======================================================================================
RS.Components.Light["@inspector"] = function (light, inspector) {
	if(!light)
		return;
	var node = light._root;

	var light_types = ["Omni","Spot","Directional"];
    inspector.addCombo("Type", light_types[light.type - 1], {
        pretitle: AnimationModule.getKeyframeCode(light, "type"), values: light_types, callback: function (v) {
		light.type = light_types.indexOf(v)+1;
        }
    });

	inspector.addColor("Color", light.color, { pretitle: AnimationModule.getKeyframeCode( light, "color"), callback: function(color) { light.color = color; } });
	inspector.addSlider("Intensity", light.intensity, { pretitle: AnimationModule.getKeyframeCode( light, "intensity"), min:0, max:2, step:0.01, callback: function (value) { light.intensity = value; }});
    // inspector.widgets_per_row = 2;
    // inspector.addNumber("Angle", light.angle, { pretitle: AnimationModule.getKeyframeCode( light, "angle"), callback: function (value) { light.angle = value; }});
    // inspector.addNumber("Angle End", light.angle_end, { pretitle: AnimationModule.getKeyframeCode( light, "angle_end"), callback: function (value) { light.angle_end = value; }});
    // inspector.widgets_per_row = 1;
    // inspector.addCheckbox("Spot cone", light.spot_cone != false, { pretitle: AnimationModule.getKeyframeCode( light, "spot_cone"), callback: function(v) { light.spot_cone = v; }});
    // inspector.addNumber("Frustum size", light.frustum_size || 100, { pretitle: AnimationModule.getKeyframeCode( light, "frustum_size"), callback: function (value) { light.frustum_size = value; }});

    // var is_root_camera = node._is_root;

    // if(is_root_camera)
    // {
    // 	inspector.addSeparator();

    // 	inspector.addVector3("Position", light.position, { pretitle: AnimationModule.getKeyframeCode( light, "position"), name_width: 100,  disabled: !is_root_camera, callback: function(v) {
    // 		light.position = v;
    // 	}});

    // 	inspector.addVector3("Target", light.target, { pretitle: AnimationModule.getKeyframeCode( light, "target"), name_width: 100, disabled: !is_root_camera, callback: function(v) {
    // 		light.target = v;
    // 	}});
    // }
    // inspector.addSeparator();
    // inspector.addCombo("Attenuation type", light.attenuation_type, { pretitle: AnimationModule.getKeyframeCode( light, "attenuation_type"), values: RS.Light.AttenuationTypes, name_width: "50%", callback: function(v) { light.attenuation_type = v; }});
    // inspector.widgets_per_row = 2;
    // inspector.addNumber("Att. start", light.att_start, { pretitle: AnimationModule.getKeyframeCode( light, "att_start"), callback: function (value) { light.att_start = value;}});
    // inspector.addNumber("Att. end", light.att_end, { pretitle: AnimationModule.getKeyframeCode( light, "att_end"), callback: function (value) { light.att_end = value; }});
    // inspector.widgets_per_row = 1;
    // inspector.addSlider("Phong Offset", light.offset, { pretitle: AnimationModule.getKeyframeCode( light, "offset"), min: 0, step:0.01, max:1, callback: function (value) { light.offset = value; } });
    // inspector.addSeparator();
    // inspector.widgets_per_row = 2;
    // inspector.addCheckbox("Const Diff.", !!light.constant_diffuse, { callback: function(v) { light.constant_diffuse = v; }});
    // inspector.addCheckbox("Specular", light.use_specular != false, { callback: function(v) { light.use_specular = v; }});
    // inspector.widgets_per_row = 1;
    //
    inspector.addTitle("Shadow");
    inspector.addCheckbox("Cast shadows", light.cast_shadows, { pretitle: AnimationModule.getKeyframeCode( light, "cast_shadows"), callback: function(v) { light.cast_shadows = v; inspector.refresh(); }});

    if(light.cast_shadows)
    {
    	inspector.addCheckbox("Hard shadows", light.hard_shadows, { pretitle: AnimationModule.getKeyframeCode( light, "hard_shadows"), callback: function(v) { light.hard_shadows = v; }});
    	inspector.widgets_per_row = 2;
    	inspector.addNumber("Near", light.near, { pretitle: AnimationModule.getKeyframeCode( light, "near"), callback: function (value) { light.near = value;}});
    	inspector.addNumber("Far", light.far, { pretitle: AnimationModule.getKeyframeCode( light, "far"), callback: function (value) { light.far = value; }});
    	inspector.widgets_per_row = 1;
    	inspector.addNumber("Shadow bias", light.shadow_bias, { pretitle: AnimationModule.getKeyframeCode( light, "shadow_bias"), step: 0.001, precision: 3, min:0, callback: function (value) { light.shadow_bias = value; }});
    	inspector.addCombo("Shadowmap size", !light.shadowmap_resolution ? "Default" : light.shadowmap_resolution, { pretitle: AnimationModule.getKeyframeCode( light, "shadowmap_resolution"), values: ["Default",256,512,1024,2048,4096], callback: function(v) {
    		if(v == "Default")
    			light.shadowmap_resolution = 0;
    		else
    			light.shadowmap_resolution = parseFloat(v);
    	}});
    }

    // inspector.addTitle("Textures");
    // inspector.addTexture("Proj. texture", light.projective_texture, { pretitle: AnimationModule.getKeyframeCode( light, "projective_texture"), callback: function(filename) {
    // 	light.projective_texture = filename;
    // 	RS.GlobalScene.refresh();
    // }});

    // inspector.addTexture("Extra texture", light.extra_texture, { pretitle: AnimationModule.getKeyframeCode( light, "extra_texture"), callback: function(filename) {
    // 	light.extra_texture = filename;
    // 	RS.GlobalScene.refresh();
    // }});


    // inspector.addButton(null, "Edit Shader", { callback: function() {
    // 	CodingModule.openTab();
    // 	CodingModule.editInstanceCode( light, { id: light.uid, title: "Light Shader", lang:"glsl", help: light.constructor.coding_help, getCode: function(){ return light.extra_light_shader_code; }, setCode: function(code){ light.extra_light_shader_code = code; } } );
    // }});
}


{

//======================================================================================
// "Mesh Renderer" component inspector - seems to be when "show properties" of the meshrenderer component is clicked??
//======================================================================================
RS.Components.MeshRenderer.onShowProperties = function( component, inspector )
{
	// return; //work in progressn progress
	var mesh = component.getMesh();

	inspector.addCheckbox("use submaterials", component.use_submaterials, function(v){
		component.use_submaterials = v;
		inspector.refresh();
	});

	if(!component.use_submaterials)
		return;

	inspector.addTitle("Submaterials");
	  inspector.addNumber("num_submaterials", component.submaterials.length, {
        precision: 0, min: 0, step: 1, max: 32, callback: function (v) {
				var mesh = component.getMesh();
				console.log("from inspector, mesh is ", mesh);
			  component.submaterials.length = Number(v);
		    for (var i = 0; i < component.submaterials.length; ++i) {
					var submaterial = null;
					if(mesh && mesh.info && mesh.info.groups)
						submaterial = mesh.info.groups[i] ? mesh.info.groups[i].material : "";
					component.submaterials[i] = submaterial;
				}
				inspector.refresh();
    	}
    });

	if(component.submaterials.length)
        for (var i = 0; i < component.submaterials.length; ++i) {
			var title = i;
			if(mesh && mesh.info && mesh.info.groups && mesh.info.groups[i])
				title = i + ": " + mesh.info.groups[i].name;
            inspector.addStringButton(title, component.submaterials[i] || "", {
                index: i, callback: function () {

			}, callback_button: function(v){
				//component.submaterials[ this.options.index ] = null;
				//inspector.refresh();
                }
            });
		}

    inspector.addButton(null, "Add submaterial", {
        callback: function () {
		var submaterial = null;
		var i = component.submaterials.length;
		if(mesh && mesh.info && mesh.info.groups)
			submaterial = mesh.info.groups[i] ? mesh.info.groups[i].material : "";
		component.submaterials.push(submaterial);
		inspector.refresh();
}
    });
}

//======================================================================================
// Show CUSTOM properties for a component - cw: can't work out where this is used.. maybe when we write our own components?
//======================================================================================

EditorModule.onShowComponentCustomProperties = function (component, inspector, ignore_edit, replacement_component, extra_name) {
	//special case: for SceneInclude custom data shown from internal component
	replacement_component = replacement_component || component;
	extra_name = extra_name || "";


	//show properties
	if(component.properties)
        for (var i = 0; i < component.properties.length; i++) {
			var p = component.properties[i];
			inspector.add( p.type, p.label || p.name, p.value, { pretitle: AnimationModule.getKeyframeCode( replacement_component, extra_name + p.name ), title: p.name, values: p.values, step: p.step, property: p, callback: inner_on_property_value_change });
		}

	if(ignore_edit)
		return;

	var valid_properties = ["number","vec2","vec3","vec4","color","enum","texture","cubemap","node","string","sampler"];

    inspector.addButton(null, "Edit Properties", {
        callback: function () {
		EditorModule.showEditPropertiesDialog( component.properties, valid_properties, inner_on_editproperties );
        }
    });


    function inner_on_newproperty(p) {
        if (component[p.name]) {
			RealGUI.alert("There is already a property with that name.");
			return;
		}
        else {
			if(component.addProperty)
				component.addProperty( p );
			else
				console.error("Component doesnt have createProperty");
		}

		inspector.refresh();
	}

    function inner_on_editproperties(p) {
		//component.updateProperty( p );
		//TODO
		inspector.refresh();
	}

    function inner_on_property_value_change(v) {
		var p = this.options.property;
		p.value = v;
		if(component.updateProperty)
			component.updateProperty( p );
		RS.GlobalScene.refresh();
	}
}

//======================================================================================
// Show custom properties for a component (I think only used when we write our own components)
//======================================================================================



// RS.Components.CustomData["@inspector"] = function( component, inspector )
// {
// 	return EditorModule.onShowComponentCustomProperties( component, inspector );
// }


RS.Components.CameraFX["@inspector"] = function (camerafx, inspector) {
	if(!camerafx)
		return;
	var node = camerafx._root;

	inspector.addRenderFrameContext("Frame Settings", camerafx.frame, { pretitle: AnimationModule.getKeyframeCode( camerafx, "frame" ), callback: function(v) {} });
	inspector.addCheckbox("Antialiasing", camerafx.use_antialiasing, { name_width: "70%", pretitle: AnimationModule.getKeyframeCode( camerafx, "use_antialiasing" ), callback: function(v) { camerafx.use_antialiasing = v; } });
	inspector.addString("Camera UID", camerafx.camera_uid, { pretitle: AnimationModule.getKeyframeCode( camerafx, "camera_uid" ), callback: function(v) { camerafx.camera_uid = v; } });

	//EditorModule.showFXInfo( camerafx, inspector );
	camerafx.fx.inspect( inspector, camerafx );
}

//======================================================================================
// "FrameFX" component inspector
//======================================================================================

RS.Components.FrameFX["@inspector"] = function (component, inspector) {
	if(!component)
		return;
	var node = component._root;

	inspector.widgets_per_row = 2;
	inspector.addRenderFrameContext("Frame Settings", component.frame, { name_width: "70%", pretitle: AnimationModule.getKeyframeCode( component, "frame" ), callback: function(v) {} });
	inspector.addCheckbox("Antialiasing", component.use_antialiasing, { name_width: "70%", pretitle: AnimationModule.getKeyframeCode( component, "use_antialiasing" ), callback: function(v) { component.use_antialiasing = v; } });
	inspector.widgets_per_row = 1;

	inspector.addMaterial("Shader Material", component.shader_material, { pretitle: AnimationModule.getKeyframeCode( component, "shader_material" ), callback: function(v) { component.shader_material = v; }});

    if (component.shader_material) {
		var mat = RS.RM.getResource( component.shader_material );
		if(!mat)
			RS.RM.load( component.shader_material, function(){ inspector.refresh(); });
		else
			RS.MaterialClasses.ShaderMaterial["@inspector"]( mat, inspector, true );
	}

	component.fx.inspect( inspector, component );
}


RS.FXStack.prototype.inspect = function (inspector, component) {
	var that = this;

	var title = inspector.addTitle("Active FX");
	title.addEventListener("contextmenu", function(e) {
        if(e.button != 2) //right button
            return false;
		//create the context menu
        var contextmenu = new RealGUI.ContextMenu(["Copy", "Paste"], {
            title: "FX List", event: e, callback: function (v) {
			if(v == "Copy")
				RealGUI.toClipboard( JSON.stringify( that.serialize() ) );
			else //Paste
			{
				var data = RealGUI.getLocalClipboard();
				if(data)
					that.configure( data );
				inspector.refresh();
			}
			RS.GlobalScene.refresh();
            }
        });
        e.preventDefault();
        return false;
    });

	var enabled_fx = this.fx;

    for (var i = 0; i < enabled_fx.length; i++) {
		var fx = enabled_fx[i];
		var fx_info = RS.FXStack.available_fx[ fx.name ];
        if (!fx_info) {
			console.warn("Unknown FX: " + fx.name);
			continue;
		}
		if(fx_info.uniforms)
            for (var j in fx_info.uniforms) {
				var uniform = fx_info.uniforms[j];
				if(uniform.type == "float")
					inspector.addNumber( j, fx[j] !== undefined ? fx[j] : uniform.value, {
						pretitle: component ? AnimationModule.getKeyframeCode( component, "fx/"+i+"/"+j ) : "",
						min: uniform.min,
						max: uniform.max,
						step: uniform.step,
						fx_name: j,
						fx: fx,
						callback: function(v){
							this.options.fx[ this.options.fx_name ] = v;
						}
					});
				else if(uniform.type == "color3")
					inspector.addColor( j, fx[j] !== undefined ? fx[j] : uniform.value, {
						pretitle: component ? AnimationModule.getKeyframeCode( component, "fx/"+i+"/"+j ) : "",
						fx_name: j,
						fx: fx,
						callback: function(v){
							this.options.fx[ this.options.fx_name ] = v;
						}
					});
				else if(uniform.type == "sampler2D")
					inspector.addTexture( j, fx[j] !== undefined ? fx[j] : uniform.value, {
						pretitle: component ? AnimationModule.getKeyframeCode( component, "fx/"+i+"/"+j ) : "",
						fx_name: j,
						fx: fx,
						callback: function(v){
							this.options.fx[ this.options.fx_name ] = v;
						}
					});
				else //for vec2, vec3, vec4
					inspector.add( uniform.type, j, fx[j] !== undefined ? fx[j] : uniform.value, {
						pretitle: component ? AnimationModule.getKeyframeCode( component, "fx/"+i+"/"+j ) : "",
						fx_name: j,
						fx: fx,
						callback: function(v){
							if( this.options.fx[ this.options.fx_name ] && this.options.fx[ this.options.fx_name ].set )
								this.options.fx[ this.options.fx_name ].set( v );
							else
								this.options.fx[ this.options.fx_name ] = v;
						}
					});
			}
	}

	inspector.addButton(null,"Edit FX", { callback: inner });
	//inspector.addButton(null,"Remove FX", {});

	var selected_enabled_fx = "";

	//show camera fx dialog
    function inner() {
		var dialog = RealGUI.Dialog.getDialog("dialog_show_fx");
		if(dialog)
			dialog.clear();
		else
            dialog = new RealGUI.Dialog("dialog_show_fx", { title: "FX Settings", close: true, width: 360, height: 370, scroll: false, draggable: true });

		dialog.show();

		var split = new RealGUI.Split("load_scene_split",[50,50]);
		dialog.add(split);

		//left side
        var widgets_left = new RealGUI.Inspector("camera_fx_list", {});
		widgets_left.addTitle("Available FX");
		split.getSection(0).add( widgets_left );
		var fx = RS.FXStack.available_fx;
		var available_fx = [];
		for(var i in fx)
			available_fx.push(i);
		available_fx = available_fx.sort();
		var selected_available_fx = "";
        var available_list = widgets_left.addList(null, available_fx, {
            height: 240, callback: function (v) {
			selected_available_fx = v;
            }
        });
        widgets_left.addButton(null, "Add FX", {
            callback: function () {
			that.addFX( selected_available_fx );
			inspector.refresh();
			RS.GlobalScene.refresh();
			inner();
            }
        });

        var widgets_right = new RealGUI.Inspector("camera_fx_enabled", {});
		widgets_right.addTitle("Current FX");
        var enabled_list = widgets_right.addList(null, enabled_fx, {
            selected: selected_enabled_fx, height: 240, callback: function (v) {
			selected_enabled_fx = v;
            }
        });
		split.getSection(1).add(widgets_right);
        widgets_right.addButtons(null, ["Up", "Down", "Delete"], {
            callback: function (v) {
                if (v == "Delete") {
				that.removeFX( selected_enabled_fx );
			}
                else if (v == "Up") {
				that.moveFX( selected_enabled_fx );
			}
                else if (v == "Down") {
				that.moveFX( selected_enabled_fx, 1 );
			}
			inspector.refresh();
			RS.GlobalScene.refresh();
			inner();
            }
        });

		dialog.adjustSize();
	}
}

//======================================================================================
// "Morph deformer" component inspector
//======================================================================================

RS.Components.MorphDeformer["@inspector"] = function (component, inspector) {
    inspector.addCombo("mode", component.mode, {
        values: RS.Components.MorphDeformer["@mode"].values, callback: function (value) {
		component.mode = value;
        }
    });

    if (component.morph_targets.length) {
		inspector.widgets_per_row = 3;
        for (var i = 0; i < component.morph_targets.length; i++) {
			var morph = component.morph_targets[i];
            inspector.addMesh("", morph.mesh, {
                pretitle: AnimationModule.getKeyframeCode(component, "morphs/" + i + "/mesh"), name_width: 20, align: "right", width: "60%", morph_index: i, callback: function (v) {
				component.setMorphMesh( this.options.morph_index, v );
				RS.GlobalScene.refresh();
                }
            });

            inspector.addNumber("", morph.weight, {
                pretitle: AnimationModule.getKeyframeCode(component, "morphs/" + i + "/weight"), name_width: 20, width: "25%", step: 0.01, morph_index: i, callback: function (v) {
				component.setMorphWeight( this.options.morph_index, v );
				RS.GlobalScene.refresh();
                }
            });

			//cwx inspector.addButton(null, "<img src='imgs/mini-icon-trash.png'/>", { width: "15%", index: i, callback: function() {
            inspector.addButton(null, "<img src='imgs/mini-icon-trash.png'/>", {
                width: "15%", index: i, callback: function () {
			//cwx from javi inspector.addButton(null, TRASH_ICON_CODE, { width: "15%", index: i, callback: function() {
				component.morph_targets.splice( this.options.index, 1);
				inspector.refresh();
				RS.GlobalScene.refresh();
		}
            });
        }
		inspector.widgets_per_row = 1;
	}

    inspector.addButton(null, "Add Morph Target", {
        callback: function () {
		component.morph_targets.push({ mesh:"", weight: 0.0 });
		inspector.refresh();
        }
    });
}

//======================================================================================
// "Skin deformer" component -> "Show bones" button causes this dialog to appear
//======================================================================================

RS.Components.SkinDeformer.onShowProperties = RS.Components.SkinnedMeshRenderer.onShowProperties = function (component, inspector) {
    inspector.addButton("", "See bones", {
        callback: function () {
		EditorModule.showBonesDialog( component.getMesh() ); //right below this function
        }
    });
}

EditorModule.showBonesDialog = function (mesh) {
    if (!mesh || !mesh.bones) {
		RealGUI.alert("This mesh doesn't have bones");
		return;
	}

    var dialog = new RealGUI.Dialog("dialog_show_bones", { title: "Bones in Mesh", close: true, width: 360, height: 270, resizable: true, scroll: false, draggable: true });

    var widgets = new RealGUI.Inspector("bones_widgets", { height: "100%", noscroll: true });
	dialog.add( widgets );
	dialog.show('fade');
	widgets.on_refresh = inner_refresh;
	widgets.refresh();

    function inner_refresh() {
		widgets.clear();

		//get the names
		var selected = null;
		var bone_names = [];
		for(var i in mesh.bones)
			bone_names.push( mesh.bones[i][0] );
        var list = widgets.addList(null, bone_names, {
            height: "calc( 100% - 60px)", callback: function (v) {
			selected = v;
            }
        });

		widgets.addInfo("Num. of bones", bone_names.length );

		widgets.addButton(null,"Select Bone", function(){
			if(!selected)
				return;
			var node = RS.GlobalScene.getNode(selected);
			if(!node)
				return;
			SelectionModule.setSelection( node );
		});

		widgets.addButtons(null,["Convert Names to UIDs","Convert UIDs to Names"], function(v){
			if(v == "Convert UIDs to Names")
				mesh.convertBoneNames();
			else
				mesh.convertBoneNames(null,true);
			widgets.refresh();
		});

		//dialog.adjustSize(10);
	}

	return dialog;
}


RS.Components.Skybox["@inspector"] = function (component, inspector) {
    inspector.addTexture("Texture", component.texture, {
        pretitle: AnimationModule.getKeyframeCode(component, "texture"), callback: function (filename) {
            component.texture = filename;
            if (filename && filename[0] != ":")
                RS.ResourcesManager.load(filename);
        }
    });

}


RS.Components.VideoWindow["@inspector"] = function (component, inspector) {
    inspector.addResource("Video Source", component.video_source, {
        pretitle: AnimationModule.getKeyframeCode(component, "video_source"),
        callback: function (filename) {
            component.video_source = filename;
            if (filename && filename[0] != ":")
                RS.ResourcesManager.load(filename);
        }
    });

    inspector.addCombo("Aspect Ratio", component.aspect_ratio, {
        pretitle: AnimationModule.getKeyframeCode(component, "aspect_ratio"),
        values: {
            "1:1": RS.Components.VideoWindow.Aspect11,
            "4:3": RS.Components.VideoWindow.Aspect43,
            "16:9": RS.Components.VideoWindow.Aspect169,
            "16:10": RS.Components.VideoWindow.Aspect1610,
            "Customized": RS.Components.VideoWindow.AspectCustomized,
        },
        callback: function (v) {
            component.aspect_ratio = v;
            inspector.refresh();
}
    });

    if (component.aspect_ratio == RS.Components.VideoWindow.AspectCustomized) {
        inspector.addNumber("x", component.aspect_ratio_customized_x, {
            step: 1,
            min: 1,
            precision: 0,
            pretitle: AnimationModule.getKeyframeCode(component, "aspect_ratio_customized_x"),
            callback: function (v) {
                component.aspect_ratio_customized_x = v;
            }
        });

        inspector.addNumber("y", component.aspect_ratio_customized_y, {
            step: 1,
            min: 1,
            precision: 0,
            pretitle: AnimationModule.getKeyframeCode(component, "aspect_ratio_customized_y"),
            callback: function (v) {
                component.aspect_ratio_customized_y = v;
	}
        });

}


    inspector.addCombo("Loop Mode", component.loop_mode, {
        pretitle: AnimationModule.getKeyframeCode(component, "loop_mode"),
        values:
{
            "Loop": RS.Components.VideoWindow.LOOP,
            "Once": RS.Components.VideoWindow.ONCE
        },
        callback: function (v) {
            component.loop_mode = v;
            inspector.refresh();
        }
    });

    inspector.addCheckbox("Auto Play", component.auto_play, {
        pretitle: AnimationModule.getKeyframeCode(component, "auto_play"),
        callback: function (v) {
            component.auto_play = v;
            inspector.refresh();
        }
	});

    /*inspector.addResource("animation", component.animation, {
         pretitle: AnimationModule.getKeyframeCode(component, "animation"),
            allow_multiple: true, callback: function (v) {
                if (!v)
                    return;
                //add resource
                scene.preloaded_resources[v] = true;
                inspector.refresh();
}
        });*/

}

//======================================================================================
// "SceneInclude" component inspector
//======================================================================================

// RS.Components.PlayAnimation["@inspector"] = function (component, inspector) {

//     inspector.addCombo("Loop Mode", component.mode, {
//         pretitle: AnimationModule.getKeyframeCode(component, "mode"),
//         values: RS.Components.PlayAnimation.MODES,
//         callback: function (v) {
//             component.mode = v;
//             inspector.refresh();
//         }
//     });

//     inspector.addCheckbox("Auto Play", component.autoPlay, {
//         pretitle: AnimationModule.getKeyframeCode(component, "autoPlay"),
//         callback: function (v) {
//             component.autoPlay = v;
// 			inspector.refresh();
//         }
// 		});
//     inspector.addResource("animation", component.animation, {
//         pretitle: AnimationModule.getKeyframeCode(component, "animation"),
//         allow_multiple: true, callback: function (v) {
//                 if (!v)
// 		return;
//                 //add resource
//                 scene.preloaded_resources[v] = true;
//                 inspector.refresh();
// 	}
//         });

// }




// RS.Components.MeshRenderer["@inspector"] = function (component, inspector) {
//
//     inspector.addMesh("Mesh", component.mesh,
// 		{
//             pretitle: AnimationModule.getKeyframeCode(component, "material"),
//             callback: function (v) { component.mesh = v; }
//         });
//
//     inspector.addMaterial("Material", component.material,
//         {
//             pretitle: AnimationModule.getKeyframeCode(component, "material"),
//             callback: function (v) { component.material = v; }
//         });
// 		}

//======================================================================================
// "Poser" component inspector
//======================================================================================


RS.Components.SkinDeformer["@inspector"] = function (component, inspector) {


    inspector.addCheckbox("Search Bones in Parent", component.search_bones_in_parent, {
        pretitle: AnimationModule.getKeyframeCode(component, "search_bones_in_parent"),
        callback: function (v) { component.search_bones_in_parent = v; inspector.refresh(); }
    });

    inspector.addNode("Skeleton Root GameObject", component.skeleton_root_node,
        {
            pretitle: AnimationModule.getKeyframeCode(component, "skeleton_root_node"),
            callback: function (v) { component.skeleton_root_node = v; }
        });

    inspector.addCheckbox("Cpu Skinning", component.cpu_skinning,
{
            pretitle: AnimationModule.getKeyframeCode(component, "cpu_skinning"),
            callback: function (v) { component.cpu_skinning = v; }
        });


    inspector.addCheckbox("Ignore Transform", component.ignore_transform,
	{
            pretitle: AnimationModule.getKeyframeCode(component, "ignore_transform"),
            callback: function (v) { component.ignore_transform = v; }
        });


		}

//======================================================================================
// "Poser" component inspector -> shown on clicking "show pose nodes" button
//======================================================================================



RS.Components.Marker2D["@inspector"] = function (component, inspector) {

    inspector.addMarker2D("Marker", component.marker_img,
        {
            pretitle: AnimationModule.getKeyframeCode(component, "marker_img"),
            callback: function (v,e) {
                component.marker_img =v;
                var pattern = e.target.dataset["pattern"];
                console.log("---------------pattern file:"+pattern);
                inspector.refresh();
			}
		});

		widgets.addSeparator();
		widgets.addButton(null, "Add current scene selected node", function(){
			var nodes = SelectionModule.getSelectedNodes();
			for(var i in nodes)
				component.addBaseNode( nodes[i] );
			widgets.refresh();
		});
	}



RS.Components.TextRenderer["@inspector"] = function (component, inspector) {

    inspector.addString("Text", component.text,
    {
        //pretitle: AnimationModule.getKeyframeCode(component, "text"),
        callback: function (v) { component.text = v;inspector.refresh(); }
    });


    inspector.addNumber("Font Size", component.fontSize, {
            precision: 0, min: 0, step: 1, max: 1000,
            callback: function (v) {
                component.fontSize = v;
                inspector.refresh();
        }
    });


    inspector.addColor("Font Color", component.fontColor,
    {
        //pretitle: AnimationModule.getKeyframeCode(component, "text"),
        callback: function (v,color) {
            component.fontColor = color;
            //inspector.refresh();
        }
    });


    // inspector.addNumber("Width", component.width, {
    //     callback: function (v) {
    //         component.width = v;
    //         inspector.refresh();
    //     }
    // });


    // inspector.addNumber("Height", component.height, {
    //     callback: function (v) {
    //         component.height = v;
    //         inspector.refresh();
    //     }
    // });

    inspector.addCombo("Align", component.align, {
        pretitle: AnimationModule.getKeyframeCode(component, "align"),
        values:[
            RS.Components.TextRenderer.ALIGN_LEFT,
            RS.Components.TextRenderer.ALIGN_RIGHT,
            RS.Components.TextRenderer.ALIGN_CENTER],
        callback: function (v) {
            component.align = v;
            inspector.refresh();
        }
    });


    inspector.addCheckbox("Word Wrap", component.wordWrap,
    {
        pretitle: AnimationModule.getKeyframeCode(component, "wordWrap"),
        callback: function (v) { component.wordWrap = v;inspector.refresh(); }
    });


    inspector.addCheckbox("Auto Fill", component.autoFill,
    {
        pretitle: AnimationModule.getKeyframeCode(component, "autoFill"),
        callback: function (v) { component.autoFill = v;inspector.refresh(); }
    });

}



RS.Components.BorderContainer["@inspector"] = function (component, inspector) {


    inspector.addColor("Border Normal Color", component.borderNormalColor,
    {
        callback: function (v,color) {
            component.borderNormalColor = color;
            //inspector.refresh();
        }
    });


    inspector.addColor("Border Over Color", component.borderOverColor,
    {
        callback: function (v,color) {
            component.borderOverColor = color;
            //inspector.refresh();
        }
    });


    inspector.addColor("Border Active Color", component.borderActiveColor,
    {
        callback: function (v,color) {
            component.borderActiveColor = color;
            //inspector.refresh();
        }
    });



    inspector.addColor("BackGround Normal Color", component.backgroundNormalColor,
    {
        callback: function (v,color){
            component.backgroundNormalColor= color;
            //inspector.refresh();
        }
    });



    inspector.addColor("BackGround Over Color", component.backgroundOverColor,
    {
        callback: function (v,color){
            component.backgroundOverColor= color;
            //inspector.refresh();
        }
    });




    inspector.addColor("BackGround Active Color", component.backgroundActiveColor,
    {
        callback: function (v,color){
            component.backgroundActiveColor= color;
            //inspector.refresh();
        }
    });

    inspector.addTexture("BackGround Normal Image", component.backgroundNormalImg,
    {
        callback: function (v ){
            component.backgroundNormalImg= v;

            //inspector.refresh();
        }
    });

    inspector.addTexture("BackGround Over Image", component.backgroundOverImg,
    {
        callback: function (v){
            component.backgroundOverImg= v;

            //inspector.refresh();
        }
    });

    inspector.addTexture("BackGround Active Image", component.backgroundActiveImg,
    {
        callback: function (v){
            component.backgroundActiveImg= v;

            //inspector.refresh();
        }
    });

    inspector.addNumber("Border Width", component.borderWidth, {
        precision: 0, min: 0, step: 1, max: 1000,
        callback: function (v) {
            component.borderWidth = v;
            inspector.refresh();
        }
    });

    inspector.addNumber("Border Radius Factor", component.borderRadiusFactor, {
         min: 0,  max: 1,
        callback: function (v) {
            component.borderRadiusFactor = v;
            inspector.refresh();
        }
    });

}


RS.Components.StackPanel3d["@inspector"] = function (component, inspector) {

        inspector.addCombo("Camera", component.camera, {
            values: component.GetCameras(),
            callback: function (v) {
                 component.camera = v;
                 inspector.refresh();
             }
         });

         inspector.addCombo("Direction", component.direction, {
            values:RS.Components.StackPanel3d.Directions,
            callback: function (v) {
                 component.direction = v;
                 inspector.refresh();
             }
         });


        inspector.addSlider("x",  component.xFactor,
            {
                min:0, max:1, step:0.01,
                callback: function (v) {
                    component.xFactor = v;
                    //inspector.refresh();
                }
            }
        );

        inspector.addSlider("y",  component.yFactor,
            {
                min:0, max:1, step:0.01,
                callback: function (v) {
                    component.yFactor = v;
                    //inspector.refresh();
                }
            }
        );

        inspector.addSlider("Width",  component.widthFactor,
            {
                min:0, max:1, step:0.01,
                callback: function (v) {
                    component.widthFactor = v;
                    //inspector.refresh();
                }
            }
        );

        inspector.addSlider("Height",  component.heightFactor,
            {
                min:0, max:1, step:0.01,
                callback: function (v) {
                    component.heightFactor = v;
                    //inspector.refresh();
                }
            }
        );


        inspector.addSlider("Horizontal Padding",  component.horizontalPadding,
        {
            min:0, max:1, step:0.01,
            callback: function (v) {
                component.horizontalPadding = v;
                //inspector.refresh();
            }
        }
    );

    inspector.addSlider("Vertical Padding",  component.verticalPadding,
        {
            min:0, max:1, step:0.01,
            callback: function (v) {
                component.verticalPadding = v;
                //inspector.refresh();
            }
        }
    );


        inspector.addNumber("Distance To Camera", component.distanceToCamera, {
            min:0.1,
           callback: function (v) {
               component.distanceToCamera = v;
               //inspector.refresh();
           }
       });

}
//end of stackpanel3d

RS.Components.Button3d["@inspector"] = function (component, inspector) {
    inspector.addString("Text", component.text,
    {
        //pretitle: AnimationModule.getKeyframeCode(component, "text"),
        callback: function (v) { component.text = v;inspector.refresh(); }
    });


    inspector.addNumber("Font Size", component.fontSize, {
            precision: 0, min: 0, step: 1, max: 1000,
            callback: function (v) {
                component.fontSize = v;
                inspector.refresh();
        }
    });


    inspector.addCheckbox("Auto Fill", component.autoFontSize,
    {
        pretitle: AnimationModule.getKeyframeCode(component, "autoFontSize"),
        callback: function (v) { component.autoFontSize = v;inspector.refresh(); }
    });


    inspector.addColor("Font Color", component.fontColor,
    {
        //pretitle: AnimationModule.getKeyframeCode(component, "text"),
        callback: function (v,color) {
            component.fontColor = color;
            //inspector.refresh();
        }
    });

    inspector.addColor("Background", component.background,
    {
        //pretitle: AnimationModule.getKeyframeCode(component, "text"),
        callback: function (v,color) {
            component.background = color;
            //inspector.refresh();
        }
    });

    inspector.addColor("Mouse Over", component.overColor,
    {
        //pretitle: AnimationModule.getKeyframeCode(component, "text"),
        callback: function (v,color) {
            component.overColor = color;
            //inspector.refresh();
        }
    });



    inspector.addTexture("BackGround Normal Image", component.backgroundImg,
    {
        callback: function (v ){
            component.backgroundImg= v;

            //inspector.refresh();
        }
    });

    inspector.addTexture("BackGround Over Image", component.overColorImg,
    {
        callback: function (v){
            component.overColorImg= v;

            //inspector.refresh();
        }
    });

}



RS.Components.ParticleEmissor["@inspector"] = function(component, inspector)
{
	if(!component) return;
	var node = component._root;

	inspector.addSlider("Max. Particles", component.max_particles, {step:10,min:10,max:1000, callback: function (value) { component.max_particles = value; }});
	inspector.addNumber("Warmup time", component.warm_up_time, {step:1,min:0,max:10, callback: function (value) { component.warm_up_time = value; }});
	inspector.addCheckbox("Point particles", component.point_particles,  {callback: function (value) { component.point_particles = value; }});

	inspector.addTitle("Emisor");
	inspector.addCombo("Type",component.emissor_type, { values: RS.Components.ParticleEmissor["@emissor_type"].values, callback: function (value) {
		component.emissor_type = value;
	}});
	inspector.addNumber("Rate",component.emissor_rate, {step:0.1,min:0,max:100, callback: function (value) { component.emissor_rate = value; }});
	inspector.addVector3("Size",component.emissor_size, {step:0.1,min:0, callback: function (value) { component.emissor_size = value; }});
	inspector.addMesh("Mesh", component.emissor_mesh, { callback: function(filename) {
		component.emissor_mesh = filename;
		if(filename)
			RS.ResourcesManager.load(filename);
	}});
	inspector.addButton("Custom code", "Edit code", { callback: function() {
		CodingModule.editInstanceCode( component, { id: component.uid + ":Emit", title: "P.Emit", lang:"javascript", getCode: function(){ return component.custom_emissor_code; }, setCode: function(code){ component.custom_emissor_code = code; }},true);
	}});


	inspector.addTitle("Particles");
	inspector.addNumber("Life",component.particle_life, {step:0.1,min:0.01, callback: function (value) { component.particle_life = value; }});
	inspector.addNumber("Speed",component.particle_speed, {step:0.1,min:0, callback: function (value) { component.particle_speed = value; }});

	inspector.addNumber("Size",component.particle_size, {step:0.1,min:0, callback: function (value) { component.particle_size = value; }});
	inspector.addLine("Size Curve",component.particle_size_curve, {defaulty:0,/* width: 120,*/ callback: function (value) { component.particle_size_curve = value; }});

	inspector.addTitle("Material");
	inspector.addCheckbox("Use node material", component.use_node_material, {callback: function (value) { component.use_node_material = value; }});
	inspector.addColor("Start Color", component.particle_start_color, { callback: function(color) { component.particle_start_color = color; } });
	inspector.addColor("End Color", component.particle_end_color, { callback: function(color) { component.particle_end_color = color; } });
	inspector.addSlider("Opacity",component.opacity, {step:0.001,min:0,max:1, callback: function (value) { component.opacity = value; }});
	inspector.addLine("Opacity Curve",component.particle_opacity_curve, {defaulty:0,/* width: 120,*/ callback: function (value) { component.particle_opacity_curve = value; }});
	inspector.addNumber("Grid Texture",component.texture_grid_size, {step:1,min:1,max:5,precision:0, callback: function (value) { component.texture_grid_size = value; }});
	inspector.addTexture("Texture", component.texture, { callback: function(filename) {
		component.texture = filename;
		if(filename)
			RS.ResourcesManager.load(filename);
	}});

	inspector.widgets_per_row = 2;

	inspector.addCheckbox("Additive blending", component.additive_blending, {callback: function (value) { component.additive_blending = value; }});
	inspector.addCheckbox("Premultiply Alpha", component.premultiplied_alpha, {callback: function (value) { component.premultiplied_alpha = value; }});
	inspector.addCheckbox("Animated texture", component.animated_texture, {callback: function (value) { component.animated_texture = value; }});
	inspector.addCheckbox("Loop Animation", component.loop_animation, {callback: function (value) { component.loop_animation = value; }});
	inspector.addCheckbox("Independent color", component.independent_color, {callback: function (value) { component.independent_color = value; }});
	//inspector.addCheckbox("Soft particles", component.soft_particles, {callback: function (value) { component.soft_particles = value; }});
	inspector.widgets_per_row = 1;

	inspector.addTitle("Physics");
	inspector.addVector3("Gravity",component.physics_gravity, {step:0.1, callback: function (value) { vec3.copy(component.physics_gravity, value); }});
	inspector.addNumber("Rotation",component.particle_rotation, {step:0.1, callback: function (value) { component.particle_rotation = value; }});
	inspector.addSlider("Friction",component.physics_friction, {step:0.001,min:0,max:1, callback: function (value) { component.physics_friction = value; }});
	inspector.addButton("Custom update", "Edit code", { callback: function() {
		CodingModule.editInstanceCode( component, { id: component.uid + ":Update", title: "P.Update", lang:"javascript", getCode: function(){ return component.custom_update_code; }, setCode: function(code){ component.custom_update_code = code;	}}, true);
	}});
	inspector.addTitle("Flags");

	inspector.widgets_per_row = 2;

	inspector.addCheckbox("Align camera", component.align_with_camera, {callback: function (value) { component.align_with_camera = value; }});
	inspector.addCheckbox("Align always", component.align_always, {callback: function (value) { component.align_always = value; }});
	inspector.addCheckbox("Follow emitter", component.follow_emitter, {callback: function (value) { component.follow_emitter = value; }});
	inspector.addCheckbox("Sort in Z", component.sort_in_z, {callback: function (value) { component.sort_in_z = value; }});
	inspector.addCheckbox("Stop", component.stop_update, {callback: function (value) { component.stop_update = value; }});
	inspector.addCheckbox("Ignore Lights", component.ignore_lights, {callback: function (value) { component.ignore_lights = value; }});

	inspector.widgets_per_row = 1;
}





}

RS.Components.ReflectionProbe.onShowProperties = function( component, inspector )
{
	inspector.addButton( null, "update", function(){ component.updateTextures(null,true); RS.GlobalScene.requestFrame(); });
	inspector.widgets_per_row = 2;
	inspector.addCheckbox( "Visualize probes", RS.Components.ReflectionProbe.render_helpers, function(v){ RS.Components.ReflectionProbe.render_helpers = v; RS.GlobalScene.requestFrame(); });
	inspector.addNumber( "Size", RS.Components.ReflectionProbe.helper_size, function(v){ RS.Components.ReflectionProbe.helper_size = v; RS.GlobalScene.requestFrame(); });
	inspector.widgets_per_row = 1;
}
