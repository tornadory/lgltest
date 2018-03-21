/* This module allow to browse the resources (in memory, local or in the repository) 
	TODO: Local repository uses IndexedDB to store the files Blobs
*/

var DriveModule = {
	name: "Drive",
	bigicon: "imgs/tabicon-drive.png",

	server_files_path: "",

	registered_drive_bridges: {},

	//this tree contains all the info about the files in the system
	tree: { 
		id:"Files", skipdrag:true, state: true, visible: false, children:[]
	},

	server_resources: {}, //indexed by filename (includes all resources on the server) 
	server_resources_by_id: {}, //indexed by id in DB
	proxy: null,

	preview_format: "image/jpg",
	preview_size: 256,
	generated_previews: {}, //cache generated previews

	categories_by_type: { "image/jpeg":"Texture", "image/jpg":"Texture", "image/webp": "Texture", "image/png": "Texture" },
	categories_by_extension: { "obj": "Mesh", "txt": "Text", "dds":"Texture" },
	ignore_thumbnail_for_extension: ["js","ts","txt","html","css","csv","wav","mp3"],

	root: null,

	insert_resource_callbacks: [], //when inserting a resource from the drive to the scene, what should we do?

	preferences_panel: [ {name:"drive", title:"Drive", icon:null } ],

	preferences: {
		show_leaving_warning: true,
		fileserver_url: null, //default,
		fileserver_files_url: null,
		proxy: null,
		store_meshes_with_lossy_compression: true
	},

	init: function()
	{
		CORE.server_url = CORE.config.server;
		this.server_files_path = CORE.config.resources;
		this.proxy = CORE.config.proxy;

		if( this.preferences.fileserver_url )
			CORE.server_url = this.preferences.fileserver_url;
		if( this.preferences.fileserver_files_url )
			this.server_files_path = this.preferences.fileserver_files_url;
		if( this.preferences.proxy )
			this.proxy = this.preferences.proxy;
		if( this.preferences.store_meshes_with_lossy_compression === undefined )
			this.preferences.store_meshes_with_lossy_compression = true;
		GL.Mesh.enable_wbin_compression = this.preferences.store_meshes_with_lossy_compression;

		//assign
		RS.ResourcesManager.setPath( this.server_files_path );

		if(this.proxy)
			RS.ResourcesManager.setProxy( this.proxy );

		RS.ResourcesManager.keep_files = true;
		var that = this;

		//prepare tree
		//this.tree.children.unshift({ id:"Memory", skipdrag:true, className:"memory", children:[], callback: DriveModule.showMemoryResources.bind(DriveModule) });


		// Events related to resources being loaded **********************************
		LEvent.bind( RS.ResourcesManager, "resource_loading", function( e, url ) {
			if(url.indexOf("_th_") != -1)
				return;
			NotifyModule.show("FILE: " + url, { id: "res-msg-" + url.hashCode(), closable: true, time: 0, left: 60, top: 30, parent: "#visor" } );
		});

		LEvent.bind( RS.ResourcesManager, "resource_loading_progress", function( e, data ) {
			var id = "res-msg-" + data.url.hashCode();
			var msg = NotifyModule.get(id);
			if(msg)
				msg.setProgress( data.progress );
		});
		
		LEvent.bind( RS.ResourcesManager, "resource_loaded", function(e, url) {
			EditorModule.refreshAttributes();
			var msg = document.getElementById( "res-msg-" + url.hashCode() );
			if(!msg)
				return;
			msg.content.style.backgroundColor = "rgba(100,200,150,0.5)";
			msg.kill(500);

			//we fetch asset previews in case the user browses the assets in the drive
			if( url.substr(0,7) != "http://" && url.indexOf("_th_") == -1 )
				DriveModule.fetchPreview(url);
		});

		function error_loading(e, url) {
			var msg = document.getElementById( "res-msg-" + url.hashCode() );
			if(!msg)
				return;
			msg.content.style.backgroundColor = "rgba(200,100,100,0.5)";
			msg.kill(1000);
		}

		LEvent.bind( RS.ResourcesManager, "resource_not_found", error_loading );
		LEvent.bind( RS.ResourcesManager, "resource_problem_loading", error_loading );

		//this uses the texture thumbnails as a low resolution version while loading the high res
		LEvent.bind( RS.ResourcesManager, "load_resource_preview", function(e, url) {
			if(url.indexOf("http") != -1)
				return; //external file
			if(url.toLowerCase().indexOf("cubemap") != -1)
				return;

			var folder = RS.RM.getFolder( url );
			var basename = RS.RM.getBasename( url );
			var filename = RS.RM.getFilename( url );
			if(filename.substr(0,4) == "_th_" || filename.indexOf("CUBECROSS") != -1)
				return;
			var extension = RS.RM.getExtension( url );
			var format_info = RS.Formats.getFileFormatInfo( extension );
			if(format_info.resourceClass === GL.Texture)
			{
				var preview_url = folder + "/_th_" + filename + ".jpg";
				RS.ResourcesManager.load( preview_url, { is_preview: true, preview_of: url } );				
			}
		});


		//initGUI **********************
		this.root = RealGUI.main_tabs.root.querySelector("#visortab");

		LEvent.bind( RS.ResourcesManager, "resource_registered", function(e,res) { 
			DriveModule.onResourceRegistered(res); 
		});

		//this create widget inside of the #visortab
		var assets_tab = InterfaceModule.lower_tabs_widget.addWidgetTab( ResourcesPanelWidget );
		this.resources_panel = assets_tab.widget;

		//keep original files to store on server
		RS.ResourcesManager.keep_original = true;

		//RealGUI.menubar.add("Window/Resources Panel", { callback: function(){ ResourcesPanelWidget.createDialog(); }});

		this.retrieveNoCacheFiles();
	},

	createPanel: function()
	{
		var resources_area = this.root;
		var that = this;

		//create
		this.resources_panel = new ResourcesPanelWidget();
		this.root.appendChild( this.resources_panel.root );

		//bind
		RealGUI.bind( this.resources_panel, "item_selected", function(e){
			var element = e.detail;
			if(!element)
				return;

			var filename = element.dataset["fullpath"] || element.dataset["filename"];
			if(filename)
				that.showResourceInfo( filename );
		});
		this.resources_panel.showMemoryResources();
	},

	guessCategoryFromFile: function(file)
	{
		var category = this.categories_by_type[ file.type ];
		var ext = RS.RM.getExtension( file.name );
		if(!category)
			category = this.categories_by_extension[ ext ];
		if(!category && ext == "wbin")
		{
			//hardcoded...
			if(file.name.indexOf(".mesh.") != -1)
				category = "Mesh";
		}
		return category;
	},

	openTab: function()
	{
		RealGUI.main_tabs.selectTab( this.tab_name );
	},

	closeTab: function()
	{
		RealGUI.main_tabs.selectTab( RenderModule.tab_name );
	},

	//Bridges represent places to store resources (LiteFileServer, localStorage, Dropbox...)
	registerDriveBridge: function(bridge)
	{
		//register bridge
		this.registered_drive_bridges[ bridge.name ] = bridge;
		bridge.tree_root = this.tree;
	},

	getDriveBridge: function(name)
	{
		return this.registered_drive_bridges[ name ];
	},

	showStartUploadingFile: function( fullpath )
	{
		NotifyModule.show("UPLOAD: " + fullpath, { id: "res-msg-" + fullpath.hashCode(), closable: true, time: 0, left: 80, top: 30 } );
	},

	showProgressUploadingFile: function( fullpath, progress )
	{
		var msg = NotifyModule.get( "res-msg-" + fullpath.hashCode() );
		if(msg)
			msg.setProgress( progress );
	},

	showEndUploadingFile: function( fullpath )
	{
		var msg = NotifyModule.get( "res-msg-" + fullpath.hashCode() );
		if(!msg)
			return;
		msg.content.style.backgroundColor = "rgba(100,200,150,0.5)";
		msg.kill(500);
	},

	showErrorUploadingFile: function( fullpath, error )
	{
		var msg = NotifyModule.get( "res-msg-" + fullpath.hashCode() );
		if(!msg)
			return;
		msg.content.style.backgroundColor = "rgba(200,100,100,0.5)";
		msg.kill(1000);
		RealGUI.alert( error, { title: "Error uploading file" } );
	},

	onTreeUpdated: function()
	{
		this.refreshTree();
		RealGUI.trigger( DriveModule, "tree_updated", this.tree );
	},

	refreshTree: function()
	{
		//this.resources_panel.refreshTree();
	},

	refreshContent: function()
	{
		this.resources_panel.refreshContent();
		/*
		if( this.current_bridge )
			this.current_bridge.updateContent( this.current_folder );
		else
			this.showInBrowserContent( this.visible_resources );
		*/
	},

	showInBrowserContent: function( items, options )
	{
		this.resources_panel.showInBrowserContent( items, options );
	},

	updateServerTreePanel: function(callback)
	{
		for(var i in this.registered_drive_bridges)
		{
			var bridge = this.registered_drive_bridges[i];
			if( bridge && bridge.updateTree )
				bridge.updateTree(function() {
					DriveModule.onTreeUpdated(); //triggers events
				});
		}
	},

	selectFolder: function( fullpath )
	{
		this.resources_panel.tree_widget.setSelectedItem( fullpath, true, true );
		this.current_folder = fullpath;
	},

	getFilename: function(fullpath)
	{
		if(!fullpath)
			return null;

		var pos = fullpath.indexOf("?");
		if(pos != -1)
			fullpath = fullpath.substr(0,pos); //remove params
		pos = fullpath.lastIndexOf("/");
		if(pos == -1) 
			return fullpath;
		return fullpath.substr(pos+1);
	},

	getExtension: function (filename)
	{
		var pos = filename.lastIndexOf(".");
		if(pos == -1)
			return "";
		return filename.substr(pos+1).toLowerCase();
	},	

	getDriveBridgeFromFullpath: function( fullpath )
	{
		if(!fullpath)
			return null;
		for(var i in this.registered_drive_bridges)
		{
			var bridge = this.registered_drive_bridges[i];
			if( bridge.isPath && bridge.isPath( fullpath ) )
				return bridge;
		}
		return null;
	},

	getResourceCategory: function( resource )
	{
		if(resource.category)
			return resource.category;
		if(resource.getCategory)
			return resource.getCategory();
		if(resource.constructor.is_material)
			return "Material";
		var type = resource.object_class || resource.category || RS.getObjectClassName( resource );
		if(type == "Object") //in server_side resources that dont have category
			type = RS.Formats.guessType( resource.fullpath || resource.filename );
		if(!type)
			type = "unknown";
		return type;
	},

	/*
	filterResources: function(type)
	{
		//if(!this.dialog) return;

		//var parent = $("#dialog_resources-browser .resources-container ul.file-list")[0];
		var parent = this.root.querySelector(".resources-container ul.file-list");

		$(parent).find(".resource").show();
		if(!type)
		{
			$(parent).find(".resource").show();
			return;
		}

		$(parent).find(".resource").hide();
		$(parent).find(".resource-" + type).show();
	},

	filterResourcesByName: function(text)
	{
		//if(!this.dialog) return;

		//var parent = $("#dialog_resources-browser .resources-container ul.file-list")[0];
		var parent = this.root.querySelector(".resources-container ul.file-list");

		$(parent).find(".resource").show();
		if(!text)
		{
			$(this.dialog).find(".resource").show();
			return;
		}

		var res = $(parent).find(".resource");
		$.each(res, function(i,e) {
			if( e.dataset["filename"].indexOf(text) == -1 )
				$(e).hide();
			else
				$(e).show();
		});
	},
	*/

	showUploadDialog: function(resource)
	{

	},

	showRenameResourceDialog: function( resource, on_complete )
	{
		var fullpath = resource.fullpath || resource.filename;
		var folder = RS.RM.getFolder( fullpath );
		var filename = RS.RM.getFilename( fullpath );

		RealGUI.prompt("Choose new filename", function (v){
			if(!v)
				return;
			var new_filename = RS.RM.cleanFullpath( folder + "/" + v );
			DriveModule.renameResource( fullpath, new_filename, resource );
			DriveModule.refreshContent();		
			if(on_complete)
				on_complete(new_filename);
		}, { title: "Rename resource", value: filename, width: 400 });
	},

	showCloneResourceDialog: function( resource )
	{
		RealGUI.prompt("Choose filename", function (v){
			if(!v)
				return;
			var folder = RS.RM.getFolder( resource.fullpath || resource.filename );
			var new_filename = RS.RM.cleanFullpath( folder + "/" + v );
			DriveModule.cloneResource( resource, new_filename, function(){
				DriveModule.refreshContent();			
			});
		}, { title: "Clone resource", value: RS.RM.getFilename( resource.fullpath || resource.filename ), width: 400 });
	},

	showResourceInfoInDialog: function( resource )
	{
		var dialog = new RealGUI.Dialog( { title:"Properties", fullcontent: true, closable: true, draggable: true, detachable: true, minimize: true, resizable: true, width: 400, height: 500, scroll: true });
		var inspector = new RealGUI.Inspector();
		dialog.add( inspector );
		this.showResourceInfo( resource, inspector );
		dialog.on_close = function()
		{

		}
		dialog.show();
		return dialog;
	},

	showMemoryResources: function( node )
	{
		while ((node = node.parentElement) && !node.classList.contains("resources-panel"));

		var panel = DriveModule.resources_panel;
		if(node && node.panel)
			panel = node.panel;
		panel.showMemoryResources();
		return true; 
	},

	showResourceInfo: function( resource, inspector )
	{
		if(!resource)
			return;

		var fullpath = resource.constructor === String ? resource : resource.fullpath || resource.filename;
		var local_resource = RS.ResourcesManager.resources[ fullpath ];
		var server_resource = DriveModule.server_resources[ fullpath ];
		var resource = local_resource || server_resource;
		if(!resource)
			return;

		var preview_url = resource._preview_url || LFS.getPreviewPath( fullpath );
		var category = resource.category || resource.object_class;
		if(resource.getCategory)
			category = resource.getCategory();

		if(!inspector)
		{
			inspector = InterfaceModule.inspector_widget.inspector;
			InterfaceModule.inspector_widget.setTitle(i18n.gettext("Resource"));
			inspector.clear();
		}

		var old_name_width = inspector.name_width;
		inspector.name_width = 100;

		inspector.addTitle(i18n.gettext("Resource"));
		inspector.widgets_per_row = 2;
		inspector.addString("Fullpath", resource.fullpath, {width: "calc( 100% - 60px )", disabled:true} );
		inspector.addButton(null, "Open", { width: 60, callback: function(){
			var folder = RS.RM.getFolder(resource.fullpath);
			DriveModule.selectFolder(folder);
		}});
		inspector.widgets_per_row = 1;

		if(preview_url)
		{
			var img = new Image();
			img.src = preview_url;
			img.className = "preview_image";
			img.onerror = function(){ this.parentNode.removeChild(this); }

			var img_container = inspector.addInfo(null, img);
			var preview_image = inspector.root.querySelector(".preview_image");
			img_container.style.backgroundColor = "black";
			img_container.style.textAlign = "center";
		}

		var filename = resource.filename;
		if(!filename && server_resource)
			filename = server_resource.filename;

		inspector.addString("Filename", filename, { callback: function(v) { 
			var fullpath = resource.fullpath || resource.filename;
			var folder = RS.RM.getFolder( fullpath );
			if(folder.indexOf("://") != -1) //it was a URL, then no folder
				folder = "";
			var new_fullpath = RS.RM.cleanFullpath( folder + "/" + v );
			DriveModule.renameResource( fullpath, new_fullpath, resource );
			DriveModule.refreshContent();
		}});
		inspector.addFolder("Folder", resource.folder || "", { disabled: true, callback: function(v) {
			var newname = v + "/" + RS.ResourcesManager.getFilename( resource.filename );
			DriveModule.renameResource( resource.filename, newname );
		}});

		inspector.addString("Category", category, { callback: function(v) {
			resource.category = v;
		}});

		if( resource.size )
			inspector.addInfo("Size", DriveModule.beautifySize( resource.size ) );

		/*
		if(resource.metadata && typeof(resource.metadata) == "object")
		{
			inspector.addTextarea("Description",resource.metadata["description"] , { callback: function(v) { 
				resource.metadata["description"] = v;
			}});

			var metadata = "";
			for(var i in resource.metadata)
			{
				if(i != "description")
					metadata += "<p style='padding:0'><strong>"+i+"</strong>: " + resource.metadata[i] + "</p>\n";
			}
		}
		*/

		inspector.addSeparator();

		//inspector.addInfo("Metadata", metadata, {height:50});
		if( (category == "Prefab" || category == "Pack") && local_resource)
		{
			inspector.addButton( category,"Show content", function(){ PackTools.showPackDialog( local_resource ); });
		}
		else if( category == "json" && local_resource )
			inspector.addButton( category,"Show content", function(){ EditorModule.checkJSON( local_resource._data ); });

		if(local_resource)
		{
			if( local_resource.from_pack )
				inspector.addInfo( "From Pack" , local_resource.from_pack );
			if( local_resource.from_prefab )
				inspector.addStringButton( "From Prefab" , local_resource.from_prefab, { callback_button: function(){
					//TODO
				}});
		}


		if( server_resource )
		{
			var link = RS.ResourcesManager.getFullURL( resource.remotepath || resource.fullpath || resource.filename );
			inspector.addInfo("Link", "<a target='_blank' href='"+link+"'>link to the file</a>" );
		}

		if(local_resource)
			inspector.addButton(null,"Open in Inspector", function(){
				EditorModule.inspect( local_resource );
			});
		else
		{
			inspector.addButton(null,"Load / Open in Inspector", function(){
				RS.RM.load( resource.remotepath || resource.fullpath, function(res){
					EditorModule.inspect( res );
				});
			});
		}

		this.addResourceInspectorFields( resource, inspector );

		inspector.name_width = old_name_width;
	},

	addResourceInspectorFields: function( resource, inspector )
	{
		if(!resource)
			return;

		inspector = inspector || InterfaceModule.inspector_widget.inspector;

		inspector.addSeparator();

		if(resource._original_data || resource._original_file)
		{
			var data = resource._original_data || resource._original_file;
			if(data.buffer)
				data = data.buffer;

			var bytes = 0;
			if(typeof(data) == "string")
				bytes = data.length;
			else if(data.constructor == ArrayBuffer)
				bytes = data.byteLength;

			inspector.widgets_per_row = 2;
			inspector.addInfo("Bytes", DriveModule.beautifySize( bytes ) );
			if( resource.serialize )
				inspector.addButton(null, "Check JSON" , function(){
					EditorModule.checkJSON( resource.serialize() );
				});
			else
				inspector.addInfo(null,"");
			inspector.widgets_per_row = 1;
		}

		var fullpath = resource.constructor === String ? resource : resource.fullpath || resource.filename;
		var local_resource = RS.ResourcesManager.resources[ fullpath ];
		var server_resource = DriveModule.server_resources[ fullpath ];

		inspector.addButtons(null,["Update Preview","Update metadata"], { callback: function(v) {
			if(!local_resource)
			{
				RealGUI.alert("You must load the resource before updating it");
				return;
			}

			if(v == "Update Preview")
			{
				//update image
				var url = DriveModule.generatePreview( resource.fullpath, true );
				var preview_image = inspector.root.querySelector(".preview_image");
				if(preview_image)
					preview_image.src = url;
				resource._preview_url = url;
				//upload it in case is a server side file
				DriveModule.onUpdatePreview(resource, function() {
					console.log("preview updated!");
					//preview.src = resource._preview_url;
				});
			}
			else if(v == "Update metadata")
			{
				if(resource.generateMetadata)
				{
					resource.generateMetadata();
					//
				}
			}
		}});

		inspector.addButtons(null,["Load","Unload"], {callback: function(v){
			var restype = resource.category || resource.object_class;
			if(v == "Load")
				DriveModule.loadResource( resource.fullpath, null, true );
			else
			{
				DriveModule.unloadResource(resource.fullpath);
				DriveModule.refreshContent();
			}
		}});

		/*
		if(resource.fullpath)
			inspector.addButton(null,"Open in Code Editor", {callback: function(v){
				
			}});
		*/

		inspector.addButtons(null,["Save","Delete"], {callback: function(v){
			if (v == "Save")
			{
				//var res = RS.ResourcesManager.resources[resource.fullpath];
				if( resource.from_pack || resource.from_prefab )
					return RealGUI.alert("Resource belongs to Pack or Prefab, save that one instead: " + resource.from_pack ? resource.from_pack : resource.from_prefab );

				if(resource.fullpath)
				{
				DriveModule.saveResource( resource );
				return;
			}

				//return RealGUI.alert("Resource must have a folder assigned");
				DriveModule.showSelectFolderFilenameDialog( "", function(folder, filename, fullpath){
					RS.RM.renameResource( resource.fullpath || resource.filename, fullpath );
				DriveModule.saveResource( resource );
				}, { filename: resource.filename, extension: RS.RM.getExtension( resource.filename) });
				return;
			}

			RealGUI.confirm("Are you sure? This file will be deleted from the server forever.", function(v2) {
				if(!v2)
					return;

				if (v == "Delete")
				{
					var fullpath = resource.fullpath || resource.filename;
					RS.RM.unregisterResource( fullpath );
					DriveModule.serverDeleteFile( fullpath, function(v) { 
						if(v)
							DriveModule.refreshContent();
					});
				}
			});
		}});
		
		var widget = inspector.addButton(null,"Download", {callback: function(){
			if(local_resource)
			{
				var file = DriveModule.getResourceAsBlob( resource );
				if(!file)
					return;
				RealGUI.downloadFile( RS.RM.getFilename( file.filename ), file );
			}
			else
			{
				RealGUI.downloadURL( RS.RM.getFullURL( resource.fullpath ), RS.RM.getFilename( resource.filename ) );
			}
		}});
		widget.querySelector("button").setAttribute("download", resource.filename );

		if(resource.optimize)
			inspector.addButton(null,"Optimize", {callback: function(){
				resource.optimize();
				DriveModule.refreshContent();
			}});
	},

	getResourceAsBlob: function( resource )
	{
		if(!resource)
			return null;

		var filename = resource.filename;
		var internal_data = RS.Resource.getDataToStore( resource );
		var data = internal_data.data;
		if(data.data) //HACK, ugly, but sometimes returns an object with info about the file, but I want the data
			data = data.data;
		var extension = RS.RM.getExtension( filename ); //recompute it in case it changed
		if( internal_data.extension && internal_data.extension != extension )
		{
			filename += "." + internal_data.extension;
			extension = internal_data.extension; //recompute it in case it changed
		}

		//if the file doesnt have an extension...
		if( !extension )
		{
			var ext = "";
			if( data.constructor == ArrayBuffer || data.constructor == Blob || data.constructor == File )
				ext = ".wbin"; //add binary extension
			else
				ext = ".txt"; //add text
			filename += ext;
		}

		var blob = new Blob( [ data ], {type : "application/octet-stream"});
		blob.filename = filename;
		return blob;
	},

	/*
	showNewResourceDialog: function()
	{
		var dialog = new RealGUI.Dialog( { title:"New Resource", fullcontent: true, closable: true, draggable: true, detachable: true, minimize: true, resizable: true, width: 300, height: 300, scroll: true });
		var inspector = new RealGUI.Inspector();
		dialog.add( inspector );

		var valid_types = ["Text","Script","Material"];
		var type = valid_types[0];
		var filename = "unknown.txt";

		inspector.on_refresh = function()
		{
			inspector.clear();
			inspector.addCombo("Type", type, { values: valid_types, callback: function(v){
				type = v;
				//inspector.refresh();
			}});

			inspector.addString("Filename",filename, function(v){
				filename = v;
			});

			inspector.addButtons(null,["Create","Cancel"], function(v){
				if(v == "Cancel")
				{
					dialog.close();
					return;
				}
				if(v == "Create")
				{
					//TODO
					RealGUI.alert("Feature not finished");
					dialog.close();
				}
			});

			dialog.adjustSize();
		}

		inspector.refresh();

		dialog.on_close = function()
		{

		}
		dialog.show();
		return dialog;
	},
	*/

	//using fullpaths
	renameResource: function( old_name, new_name, resource )
	{
		if(!old_name || !new_name || old_name.constructor !== String || new_name.constructor !== String )
			throw("DriveModule.renameResource wrong parameters");

		//making it local
		if( RS.RM.getFolder( old_name ) && !RS.RM.getFolder( new_name ) )
		{
			if(resource && resource.in_server)
				throw("DriveModule.renameResource new_name must have a folder");

			RS.ResourcesManager.renameResource( old_name, new_name ); //rename and inform
			return;
		}

		
		var tabs = CodingModule.coding_tabs_widget.tabs.tabs;
		var old_pro = tabs[old_name];//tab
		if(tabs&&old_pro){
			old_pro.tab.children[1].classList.add("modify");
		}

		//File is stored in the server (HARDCODED WITH LFS)
		if(resource && (resource.in_server || resource.remotepath) )
		{
			//rename in server
			console.log("Renaming server file");
			old_name = resource.fullpath;

			

			this.serverMoveFile( old_name, new_name, function(){
				DriveModule.refreshContent();
			});
		}

		var res = RS.ResourcesManager.resources[ old_name ];
		if(res)
			return;
		RS.ResourcesManager.renameResource( old_name, new_name ); //rename and inform
	},

	cloneResource: function( resource, cloned_name, callback )
	{
		if(!resource)
			return;

		var fullpath = resource.fullpath || resource.filename;

		//it is a server file
		if(resource.in_server)
		{
			DriveModule.serverCopyFile( fullpath, cloned_name, callback );
			return;
		}

		//is local
		if(!resource.clone)
		{
			console.log("Resource type cannot be cloned: " + RS.getObjectClassName( resource ) );
			return;
		}

		var cloned = resource.clone();
		RS.RM.registerResource( cloned_name, cloned );

		if(resource.remotepath) //save in server
			DriveModule.saveResource( cloned );
	},

	showSelectFolderDialog: function(callback, callback_close, default_folder )
	{
		if(!LoginModule.session)
		{
			RealGUI.alert("You must be logged in to select a folder");
			return;
		}

		this.serverGetFolders( inner );

		function inner( tree_data )
		{	
			if(!tree_data)
			{
				RealGUI.alert("Not logged to server");
				return;
			}

			var data = DriveModule.convertToTree( tree_data );

			var dialog = new RealGUI.Dialog( { id: "select-folder-dialog", title:"Select folder", close: true, width: 360, height: 240, scroll: false, draggable: true});

			var tree_widget = new RealGUI.Tree( data , { id: "files-tree", allow_rename: false, height: 200} );

			tree_widget.root.style.backgroundColor = "#111";
			tree_widget.root.style.padding = "5px";
			tree_widget.root.style.width = "100%";
			tree_widget.root.style.overflow = "auto";

			dialog.add( tree_widget );
			var selected = null;

			tree_widget.root.addEventListener("item_selected", function(e) {
				var data = e.detail;
				selected = data.item.data;
			});

			dialog.addButton("Select", { className: "big", callback: function ()
			{
				var path = null;
				if(selected)
					path = RS.ResourcesManager.cleanFullpath( selected.fullpath ); //remove extra trails
				if(callback)
					callback( path );
				dialog.close();
			}});


			dialog.adjustSize(20);
			dialog.show('fade');

			if(default_folder)
				tree_widget.setSelectedItem( default_folder, true );
		}
	},

	showSelectFolderFilenameDialog: function( fullpath, on_complete, options )
	{
		options = options || {};
		var folder = "";
		var filename = "";
		if(fullpath)
		{
			folder = RS.RM.getFolder(fullpath);
			filename = RS.RM.getFilename(fullpath);
		}
		if(options.filename)
			filename = options.filename;
		if(options.folder)
			folder = options.folder;

		var dialog = new RealGUI.Dialog( { id: "select-folder-filename-dialog", title:"Select folder and filename", close: true, width: 360, height: 240, scroll: false, draggable: true});
		var widgets = new RealGUI.Inspector();
		if(options.text)
			widgets.addInfo(null,options.text);
		widgets.addFolder("Folder",folder,{ callback: function(v){
			if(!v)
				return;
			folder = v;
		}});
		widgets.addString("Filename",filename,{ callback: function(v){
			if(!v)
				return;
			filename = v;
		}});

		widgets.addButton(null,"Continue",function(){
			if( (!folder && !options.allow_no_folder) || !filename)
				return;

			dialog.close();
			//force extension
			if(options.extension)
			{
				var ext = RS.RM.getExtension( filename );
				if(ext == "")
					filename += "." + options.extension;
			}

			var fullpath = RS.RM.cleanFullpath( folder + "/" + filename );
			if(on_complete)
				on_complete( folder, filename, fullpath );
		});

		dialog.add(widgets);
		dialog.adjustSize(20);
		dialog.show();
	},

	getServerFoldersTree: function(callback)
	{
		//HARDCODED WITH LFS

		//request folders
		this.serverGetFolders(inner);

		function inner( units )
		{
			//index of the server tree info
			var index = DriveModule.tree.children.findIndex( function(v) { return v.id == "Server" } );

			if(!units)
			{
				//if(index != -1)
				//	DriveModule.tree.children[index].children = [];

				if(callback) 
					callback(null);
			}

			//server root node in the list
			var server_root = { id: "Server", children:[] };
			for(var i in units)
			{
				var unit = units[i];
				var item = { id: unit.metadata.name, type:"unit", candrag: true, className: 'folder unit', fullpath: unit.name }; //ADD MORE INFO
				item.children = get_folders( unit.name + "/", unit.folders );
				server_root.children.push( item );
			}

			//replace in tree
			/*
			if(index != -1)
				DriveModule.tree.children[index] = server_root;
			else
				DriveModule.tree.children.push( server_root );
			*/

			if(callback) 
				callback(server_root);
		}

		//recursive function
		function get_folders(fullpath, root)
		{
			var folders = [];
			for(var i in root)
			{
				var clean_fullpath = RS.ResourcesManager.cleanFullpath( fullpath + "/" + i );
				var folder = { id: clean_fullpath, content: i, fullpath: clean_fullpath, type:"folder", candrag: true, className: 'folder', folder: i };
				if(root[i])
					folder.children = get_folders( clean_fullpath, root[i] );
				folders.push( folder );
			}
			return folders;
		}
	},

	showLoadingBrowserContent: function()
	{
		var parent = $(this.root).find(".resources-container")[0];
		$(parent).empty();
		$(parent).append("<strong>loading...</strong>");
	},

	//Retrieve a resource from the server and stores it for later use, it shoudnt do anything with it, just ensure is in memory.
	loadResource: function( fullpath, on_complete, force_reload )
	{
		if(force_reload)
			RS.ResourcesManager.unregisterResource( fullpath );
		delete RS.ResourcesManager.resources_not_found[ fullpath ]; //in case it was missing before
		RS.ResourcesManager.load(fullpath, null, function(data) { 
			if(on_complete)
				on_complete(data);
		});
	},

	unloadResource: function(fullpath)
	{
		if(!RS.ResourcesManager.resources[fullpath])
			return;
		RS.ResourcesManager.unregisterResource( fullpath );
	},

	//called when a resource is loaded into memory, used to fetch info from the server
	onResourceRegistered: function(resource)
	{
		var fullpath = resource.fullpath || resource.filename;
		if(!fullpath)
			return;

		if(fullpath[0] == "#") 
			return;

		if( this.server_resources[ fullpath ] )
		{
			resource._server_info = this.server_resources[ fullpath ];
			return;
		}

		//fetch info
		if(LoginModule.session)
			LoginModule.session.getFileInfo( fullpath, function(info) { 
				if(info)
					DriveModule.processServerResource(info); 
			});
	},

	//called when clicking the "Insert in scene" button after selecting a resource
	onInsertResourceInScene: function( resource_item, options ) 
	{
		if(!resource_item)
		{
			RealGUI.alert("No resource selected");
			return;
		}

		options = options || {};
		var fullpath = null;
		var restype = null;
		var resource = null;
		var thisfullpath = '';


		// comes here if drag+drop from assets into scene.
		if (resource_item.dataset)
		{
			var thisfullpath = resource_item.dataset.fullpath || resource_item.dataset.filename;
			
			var thispath = thisfullpath.lastIndexOf("/");
			if (thispath!=-1)
			{
				resource_base_path = thisfullpath.substr(0,thispath)+"/";
			}
		}
		else
		{
			// comes here if double clicked on the file in assets
			var respath;

			// dialog "import and insert into scene OR DnD from outside browser, what a mess!"
			if (!resource_item.unit)
			{
				var thisfullpath = resource_item.fullpath || resource_item.filename;
				
				var thispath = thisfullpath.lastIndexOf("/");
				if (thispath!=-1)
				{
					resource_base_path = thisfullpath.substr(0,thispath)+"/";
				}

				//resource_base_path = resource_item.fullpath;
			}
			else
			{
			//cw: save the base path of this resource, so we can use it when looking for sub-resources (eg textures)
				respath = resource_item.resource.unit + "/" +resource_item.resource.folder+"/"
				resource_base_path = respath;
			}
			
			
			//cw: end of 
			//resource_base_path = ""; 
			//resource_base_path = ""; 
			
		}

		if( resource_item.dataset ) //item from the drive
		{
			fullpath = resource_item.dataset["fullpath"] || resource_item.dataset["filename"];
			restype = resource_item.dataset["restype"];
			resource = RS.ResourcesManager.getResource( fullpath );
		}
		else if( resource_item.fullpath ) //resource
		{
			resource = resource_item;
			fullpath = resource.fullpath || resource.filename;
			restype = RS.ResourcesManager.getResourceType( resource );
		}

		//DriveModule.closeTab();
		RS.GlobalScene.refresh();

		//resource is not in memory
		/*
		if(!resource)
		{
			RS.ResourcesManager.load( fullpath, null, function(url,resource){ DriveModule.onInsertResourceInScene(url,resource); });
			return;
		}
		*/
		CollaborateModule.onUserAction( [] );	// send whole scene to others if in collab mode.

		//search for function in charge or processing this file
		var found = false;
		for( var i in DriveModule.insert_resource_callbacks )
		{
			var info = DriveModule.insert_resource_callbacks[i];
			if(info[0] == restype || !info[0] )
			{
				var ret = info[1].call( DriveModule, fullpath, restype, options );
				if(ret == false)
					continue;

				found = true;

				
				return;
			}
		}


		var type = resource ? RS.getObjectClassName( resource ) : restype;


		
		if(!found)
			RealGUI.alert("Insert not implemented for this resource type: " + type );

	},

	//if className is omited, it will be call with all
	registerAssignResourceCallback: function( className, callback )
	{
		if( className && className.constructor === Array )
		{
			for(var i in className)
				this.insert_resource_callbacks.push([ className[i], callback ]);
		}
		else
			this.insert_resource_callbacks.push([ className, callback ]);
	},

	//SERVER ACTIONS *************************************************

	onCreateFolderInServer: function( root_path, on_complete )
	{
		RealGUI.prompt("Folder name", inner);
		function inner(name)
		{
			if(!name)
				return;

			var folder = root_path + "/" + name.toLowerCase();
			DriveModule.serverCreateFolder( folder, inner_complete, inner_error );
		}

		function inner_complete(v)
		{
			DriveModule.updateServerTreePanel();
			if(on_complete)
				on_complete(v);
		}

		function inner_error(v)
		{
			RealGUI.alert("Cannot be done (be sure your are logged and have rights to write in this unit)");
		}
	},

	onMoveFolderInServer: function( origin_fullpath, target_fullpath, on_complete )
	{
		RealGUI.confirm("Are you sure? All projects using the files inside this folder will have broken references.", inner);
		function inner(v)
		{
			if(!v)
				return;
			LoginModule.session.moveFolder( origin_fullpath, target_fullpath, inner_complete);
		}

		function inner_complete(v)
		{
			if(v)
				DriveModule.updateServerTreePanel();
			else
				RealGUI.alert("Cannot be done (are you logged?)");
			if(on_complete)
				on_complete(v);
		}
	},

	onDeleteFolderInServer: function( fullpath, on_complete )
	{
		RealGUI.confirm("Are you sure you want to delete the folder? All files will be lost", inner);
		function inner(v)
		{
			if(!v)
				return;
			if(fullpath == null)
				return;
			DriveModule.serverDeleteFolder( fullpath, inner_complete );
		}

		function inner_complete(v)
		{
			if(v)
				DriveModule.updateServerTreePanel();
			else
				RealGUI.alert("Cannot be done (are you logged?)");
			if(on_complete)
				on_complete(v);
		}
	},

	onImportToFolder: function( fullpath, on_complete )
	{
		RealGUI.alert("feature not developed yet");
	},

	onUpdatePreview: function(resource, on_complete)
	{
		if(!resource || !resource.fullpath)
		{
			console.error("fullpath not found");
			return;
		}

		//Generate
		var preview = DriveModule.generatePreview( resource.fullpath );
		if(!preview)
			return;

		//Save
		DriveModule.serverUpdatePreview(resource.fullpath, preview, inner, inner_error );

		//after callback
		function inner(status)
		{
			if(status)
			{
				RealGUI.alert("Preview updated");
				resource._ignore_preview_cache = true;
				//force reload the thumbnail without cache
				if(DriveModule.resources_panel.selected_item)
				{
					var img = DriveModule.resources_panel.selected_item.querySelector("img");
					if(img)
					{
						resource._preview_url = preview;
						img.src = preview;
					}
				}
			}
			else
				console.error("Error updating preview");
			if(on_complete) 
				on_complete();
		}

		function inner_error(err)
		{
			RealGUI.alert("Error updating preview");
		}
	},

	filterByCategory: function(category)
	{
		this.resources_panel.filterByCategory( category );
	},

	//returns preview in base64 format
	generatePreview: function( fullpath, force_read_from_memory, skip_screenshot )
	{
		var resource = RS.ResourcesManager.getResource( fullpath );
		if(!resource) //take from the screen (reuse old ones)
		{
			if(!skip_screenshot)
				return this.takeScreenshotUsingCache( this.preview_size,this.preview_size, fullpath );
			return null;
		}

		if( resource.updatePreview )
		{
			resource.updatePreview( this.preview_size );
			if( resource._preview_url )
				return resource._preview_url;
		}

		if( resource.toCanvas ) //careful, big textures stall the app for few seconds
		{
			console.log("Generating resource preview using a canvas: ", resource.filename );
			var canvas = resource.toCanvas(null,true,256); 
			if(canvas)
			{
				resource._preview_url = canvas.toDataURL( this.preview_format );
				return resource._preview_url;
			}
		}

		//it has an image, then downscale it
		if( resource.img && !force_read_from_memory )
		{
			var img = resource.img;
			try //avoid safety problems when no CORS enabled 
			{
				//preview
				var mini_canvas = createCanvas(this.preview_size,this.preview_size);
				ctx = mini_canvas.getContext("2d");

				if(img.height == img.width * 6) //cubemap
				{
					return RenderModule.takeScreenshot(this.preview_size,this.preview_size);
				}
				else if(img.pixels) //non-native image
				{
					var tmp_canvas = createCanvas(img.width,img.height);
					var tmp_ctx = tmp_canvas.getContext("2d");
					var tmp_pixels = tmp_ctx.getImageData(0,0,img.width,img.height);
					var channels = img.bytesPerPixel;
					var img_pixels = img.pixels;
					for(var i = 0; i*channels < img.pixels.length; i += 1)
						tmp_pixels.data.set( [ img_pixels[i*channels], img_pixels[i*channels+1], img_pixels[i*channels+2], channels == 4 ? img_pixels[i*channels+3] : 255 ], i*4);
					tmp_ctx.putImageData(tmp_pixels,0,0);
					ctx.drawImage(tmp_canvas,0,0,mini_canvas.width,mini_canvas.height);
				}
				else
					ctx.drawImage(img,0,0,mini_canvas.width,mini_canvas.height);
				return mini_canvas.toDataURL("image/png");
			}
			catch (err)
			{
				if(on_complete) on_complete(-1, "Image doesnt come from a safe source");
				return null;
			}
		}

		//a generated texture
		if( resource.constructor === GL.Texture )
		{
			var w = resource.width;
			var h = resource.height;

			if( resource.texture_type === gl.TEXTURE_CUBE_MAP )
				return RenderModule.takeScreenshot(this.preview_size,this.preview_size);


			//Read pixels form WebGL
			var buffer = resource.getPixels();
			/*
			var buffer = new Uint8Array(w*h*4);
			resource.drawTo( function() {
				try
				{
					gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,buffer);
				}
				catch (err)
				{
				}
			});
			*/

			//dump to canvas
			var canvas = createCanvas(w,h);
			var ctx = canvas.getContext("2d");
			var pixels = ctx.getImageData(0,0,w,h);
			pixels.data.set( buffer );
			ctx.putImageData( pixels,0,0 );

			//flip Y
			var final_canvas = createCanvas(this.preview_size,this.preview_size);
			var final_ctx = final_canvas.getContext("2d");
			final_ctx.translate(0,final_canvas.height);
			final_ctx.scale(1,-1);
			final_ctx.drawImage( canvas, 0, 0, final_canvas.width, final_canvas.height );

			return final_canvas.toDataURL("image/png");
		}

		//other form of resource, then do a snapshot of the viewport
		if(!skip_screenshot)
			return this.takeScreenshotUsingCache( this.preview_size, this.preview_size, fullpath );
		return null;
	},

	takeScreenshotUsingCache: function(w,h, fullpath)
	{
		var now = getTime();
		if( this._last_screenshot && (now - this._last_screenshot.time) < 2000 )
			return this._last_screenshot.data;
		console.log("Screenshot taken for resource: " + (fullpath || "") );
		var screenshot = RenderModule.takeScreenshot( w,h );
		this._last_screenshot = { time: now, data: screenshot };
		return screenshot;
	},

	fetchPreview: function( url )
	{
		var that = this;
		if(this.generated_previews[ url ])
			return;

		//already a preview
		if(url.indexOf("_th_") != -1)
			return;

		var path = LFS.getPreviewPath( url );
		var img = new Image();
		img.src = path;
		img.onerror = function() {
			delete that.generated_previews[ url ];
		}
		this.generated_previews[ url ] = img;
	},

	//trys to fetch one preview
	//resource could be a server resource or a local resource
	getServerPreviewURL: function( resource )
	{
		var memory_resource = RS.RM.resources[ resource.fullpath ];

		//clear old preview
		if( memory_resource && memory_resource._ignore_preview_cache )
		{
			resource._preview_url = LFS.getPreviewPath( resource.fullpath, true );
			resource._ignore_preview_cache = false;
			return resource._preview_url;
		}

		if(resource._preview_url)
			return resource._preview_url;

		var ext = RS.RM.getExtension( resource.fullpath );
		if( this.ignore_thumbnail_for_extension.indexOf( ext ) != -1 )
			return null;
		if(ext == "json")
		{
			var subext = RS.RM.getExtension( RS.RM.getBasename( resource.fullpath ) );
			if(subext == "COMP")
				return null;
		}

		resource._preview_url = LFS.getPreviewPath( resource.fullpath );
		return resource._preview_url;
	},

	//called when the resource should be saved (after modifications)
	//no path is passed because all the info must be inside (including fullpath)
	saveResource: function( resource, on_complete, options )
	{
		options = options || {};
		if(!resource)
		{
			console.error("DriveModule.saveResource: error, resource is null");
			return;
		}

		if(!resource.fullpath)
		{
			console.warn("DriveModule.saveResource: resource without fullpath.");
			if(!RS.RM.getFolder(resource.filename)) //it doesnt has a folder, cannot be saved
				return;
			resource.fullpath = resource.filename;
		}

		var container_fullpath = resource.from_pack || resource.from_prefab;
		if(container_fullpath && container_fullpath.constructor == String)
		{
			CORE.log("Saving resource that belongs to a Pack or Prefab, so saving the Pack/Prefab: " + resource.fullpath );
			resource = RS.RM.getResource( container_fullpath );
			if(!resource)
			{
				RealGUI.alert("Error saving: Saving a resource inside a pack, but the pack is not in memory");
				return;
			}
		}


		//used to change between upload or update (incase the file exist)
		//var func_name = resource._server_info ? "serverUpdateResource" : "serverUploadResource";

		//uploading dialog...
		var dialog = null;
		var upload_progress = null;
		if(!options.skip_alerts)
		{
			dialog = RealGUI.alert("<p>Uploading file... <span class='upload_progress'></span></p>");
			upload_progress = dialog.root.querySelector(".upload_progress");
		}

		//add to nocache
		RS.RM.nocache_files[ resource.fullpath ] = new Date().getTime();

		this.serverUploadResource( resource, resource.fullpath,
			function(v, msg) {  //after resource saved
				if(v)
					RS.ResourcesManager.resourceSaved( resource );
				RealGUI.remove( upload_progress ); 
				if(dialog)
					dialog.close();
				if(!options.skip_alerts)
					RealGUI.alert( v ? "Resource saved" : "Problem saving the resource: " + msg);

				//upload new preview
				/*
				if( DriveModule.getResourceCategory( resource ) == "Material" )
					DriveModule.onUpdatePreview(resource, function() {
						console.log("preview updated!");
						//preview.src = resource._preview_url;
					});
				*/

				if(on_complete)
					on_complete( resource );
			},
			function (err, status) { 
				if(!dialog)
					return;
				if(status == 413)
					err = "File too big";
				dialog.content.innerHTML = "Error Uploading: " + err; 
				if(on_complete) 
					on_complete(false, err);
			},
			function (progress) { 
				if(upload_progress)
					upload_progress.innerHTML = ((progress*100)|0) + "%";
			}
		);
	},

	saveResourcesToFolder: function( list, folder, on_complete, on_error, on_progress )
	{
		if(folder === undefined) folder = LFSBridge.getDefaultProjectDirName();
		//sort list
		list.sort( function( a, b ) {
			var res_a = null;
			var res_b = null;
			if(!a || !b)
				return 0;

			if(a.constructor === String)
				res_a = RS.ResourcesManager.resources[a];
			if(b.constructor === String)
				res_b = RS.ResourcesManager.resources[b];
			
			if(!res_a || !res_b)
				return 0;
			return (res_a.constructor.save_priority || 0) - (res_b.constructor.save_priority || 0);
		});

		var total = list.length;
		inner(true);

		function inner(v,msg)
		{
			if(!list.length)
			{
				if(on_complete)
					on_complete();
				return;
			}

			if(!v)
			{
				if(on_error)
					on_error(v,msg);
				return;
			}

			if(on_progress)
				on_progress( list.length / total );
		
			var resource = list.shift();
			if(!resource)
			{
				inner(true);
				return;
			}
			if(resource.constructor === String)
				resource = RS.ResourcesManager.resources[resource];

			if(!RS.RM.getFolder(resource.filename)) { //if it doesn't have a folder
				if(folder.indexOf('/') == -1) folder = '/' + folder;
				var new_name = folder + "/" + resource.filename;
				//ensure the scene info gets updated

				// cw: only rename if there is no unit in there already.. horrendous bodge until I fix this properly.
				var old_name = new_name;
				RS.RM.renameResource( resource.fullpath || resource.filename, new_name );
				
				DriveModule.saveResource( resource, inner );
				//cw: added as might have changed the filename when saving (adding extension)
				//RS.RM.renameResource( old_name, resource.filename );

			} else
				DriveModule.saveResource( resource, inner );
		}
	},

	viewResource: function( resource )
	{
		var url = resource.url;
		if(!url)
			url = RS.ResourcesManager.getFullURL( resource.filename );
		window.open(url,'_blank');
	},

	//returns a list of resources in memory that are not stored in the server (so they will be lost if the app closes)
	getResourcesNotSaved: function( only_in_scene )
	{
		var resources = null;

		if(only_in_scene)
			resources = RS.GlobalScene.getResources();
		else
			resources = RS.RM.resources;

		var missing = [];
		for(var i in resources)
		{
			i = LFSBridge.getResourceFullPath(i);
			var resource = null;
			if(only_in_scene) 
				resource = RS.RM.resources[i];
			else
				resource = resources[i];
			if(!resource)
				continue;
			var name = resource.fullpath || resource.filename;
			if(name[0] == ":" || name[0] == "_") //local
				continue;
			if(resource.remotepath && !resource._modified)
				continue;
			if(resource.from_prefab || resource.from_pack)
				continue;

			missing.push( name );
		}

		if(!missing.length)
			return null;
		return missing;
	},

	//======================================================================================
	// cw: Called after importing a resource, flushes all unsaved memory resources to disk.
	// This assumes we have an open project and so know the directory to save to.
	// If we don't have a project open we just don't save. Later we can assume we ALWAYS have a project open.
	//======================================================================================
	autoSaveMissingResources: function( on_complete )
	{

		// Check what to save
		var missing = this.getResourcesNotSaved(false);
		if(!missing)
		{
			// Nothing to save
		//	if(on_complete)
		//		on_complete();
			return true;
		}

		if (RS.GlobalScene.extra && RS.GlobalScene.extra.folder)
		{
			var memResourceSaveFolder = RS.GlobalScene.extra.folder;
			// Save the resources to project folder...
			this.checkResourcesSaved( true /*only scene*/, on_complete /*call when done*/, true /*silently*/, memResourceSaveFolder /*where to save*/ );
		}
		else
		{
			RealGUI.alert("couldn't autosave resources, you need to have a scene loaded");
		//	if(on_complete)
		//		on_complete();
		
		}

	},

	//==============================================================================================
	checkFolderExist: function( folder_name, on_complete )
	{
		LoginModule.session.checkFolderExist(folder_name, function(v){
			if(on_complete)
				on_complete(v);
		});
	},

	// Shows a warning dialog if you have resources in memory that are not stored in the server
	// cw: Pass save_silently=true to not show any dialogs but instead just save all assets to the 
	// cw: last loaded project folder. save_silently is used after eg importng DAE's to save out materials/animations etc.
	// cw: silentl save of assets needed for collaboration (so other clients have access to the materials/anims you import)...
	//==============================================================================================
	checkResourcesSaved: function( only_in_scene, on_complete, save_silently, save_silently_path )
	{
		var that = this;
		var missing = this.getResourcesNotSaved(true);
		if(!missing)
		{
			if(on_complete)
				on_complete();
			return true;
		}

		if (!save_silently)
		{
			// cw: NOT saving silently, bring up the dialog (later we will remove all save dialogs)

			//extra from scene
			var pack_folder = "";
			if( RS.GlobalScene.extra.folder )
				pack_folder = RS.GlobalScene.extra.folder;

			var pack_filename = RS.generateUId("").substr(1) + ".PACK";

			if( RS.GlobalScene.extra.filename )
				pack_filename = RS.RM.getBasename( RS.GlobalScene.extra.filename ) + ".PACK";

			var files_folder = pack_folder;

			var dialog = new RealGUI.Dialog( {id:"ResourceNotSaved", title:"Resources not saved", closable: true, draggable: true, width: 400 });
			var widgets = new RealGUI.Inspector();
			widgets.on_refresh = inner_refresh;
			dialog.add( widgets );
			widgets.refresh();

			// cw: This dialog has callbacks triggered by user button presses.
			dialog.show();
		}
		else
		{
			//cw: saving silently, just get a list of missing files, set the folder to save to and kick off the saving...
			missing = that.getResourcesNotSaved(true);
			if(!missing)
			{
				if (on_complete) on_complete();
				return;	//cw: no resources missing, done.
			}
			var resFolder = RS.GlobalScene.extra.folder;	// cw: This should be the project folder.

			// set the resource folder.
			inner_save_individually( resFolder );

		}

		//--------------------------------------------------------------
		//cw:
		//--------------------------------------------------------------
		function inner_refresh()
		{
			missing = that.getResourcesNotSaved(true);
			if(!missing)
			{
				dialog.close();
				if(on_complete)
					on_complete();
				return true;
			}

			widgets.clear();
			widgets.addInfo(null,"There are some resources in this scene that are not stored in the server, this resources will be lost if you close the application or wont be seen by other users if you share your scene.<br/>You must save them.");
			widgets.addTitle("Resources not saved in server");

			var missing_list = [];
			for(var i in missing)
			{
				var res_name = missing[i];
				var resource = RS.RM.resources[ res_name ];
				if(!resource)
				{
					console.warn("checkResourcesSaved: resource not found:", res_name );
					continue;
				}
				var str = DriveModule.beautifyPath( res_name, { "class":"ellipsis", style:"max-width: 80%;"} );
				if( resource._modified && resource.remotepath )
					str += "<button class='save-item' data-path='"+res_name+"' style='float:right; width: 60px; margin-top: 3px;'>Save</button>";
				missing_list.push({content: str });
			}

			var list_widget = widgets.addList(null,missing_list,{height:200});
			var rows = list_widget.querySelectorAll(".save-item");
			if(rows && rows.length)
				RealGUI.bind( rows, "click", function(e){
					console.log(this.dataset["path"]);
					var resource = RS.RM.resources[ res_name ];
					DriveModule.saveResource( resource, function() { widgets.refresh() }, { skip_alerts: true } );
				});

			widgets.addTitle("Save individually");
			widgets.addButton(null,"Save only modified ones", inner_save_modified );
			widgets.widgets_per_row = 2;
			widgets.addFolder("Folder", files_folder, { name_width: 60, callback: function(v){
				files_folder = v;
			}});
			widgets.addButton(null,"Save them individually", inner_save_individually );
			widgets.widgets_per_row = 1;

			widgets.addTitle("Save all inside a Pack");

			widgets.widgets_per_row = 2;
			widgets.addFolder("Folder", pack_folder, { name_width: 60, callback: function(v){
				pack_folder = v;
			}});
			widgets.addString("Filename", pack_filename, { callback: function(v){
				pack_filename = v;
			}});
			widgets.widgets_per_row = 1;
			widgets.addButton(null,"Create PACK & Save", { callback: function(){
				if(!pack_folder)
					return RealGUI.alert("You must select a folder");
				if(!pack_filename)
					return RealGUI.alert("You must choose a filename");
				dialog.close();
				inner_save_to_pack();
			}});

			widgets.widgets_per_row = 1;
			widgets.addSeparator();
			widgets.addButtons(null,["Close","Save anyway"], function(v){ 
				dialog.close();
				if(v == "Save anyway" && on_complete)
					on_complete();
			});
		}

		//--------------------------------------------------------------
		//cw:
		//--------------------------------------------------------------
		function inner_save_modified()
		{
			var alert_dialog = RealGUI.alert("Saving...");
			var modified = [];
			for(var i in missing)
			{
				var res_filename = missing[i];
				var resource = RS.RM.resources[res_filename];
				if(!resource)
					continue;
				if(!resource.remotepah || !resource._modified)
					modified.push( res_filename );
			}		

			DriveModule.saveResourcesToFolder( modified, files_folder, function(){
				alert_dialog.close();
				RealGUI.alert("Modified resources saved");
				widgets.refresh();
			}, function(v,err){ //error
				alert_dialog.content.innerHTML = "Error saving resources: " + err;
			}, function(v){
				alert_dialog.content.innerHTML = "Saving..." + (Math.floor(v * 100)) + "%";
			});
		}


		//--------------------------------------------------------------------------------------
		// User clicked on "save files individually" to save modified/created memory resources
		// (usually animations, materials etc from an import, or other stuff created in editor)
		// (This is called with force_folder set to a folder for silent saving, after importing assets).
		//--------------------------------------------------------------------------------------
		function inner_save_individually(force_folder)
		{
			var alert_dialog = RealGUI.alert("Saving...");
			var use_folder = files_folder;

			if (force_folder) use_folder = force_folder;
			DriveModule.saveResourcesToFolder( missing, use_folder, function(){
				if (widgets)
					widgets.refresh();
				alert_dialog.close();
				RealGUI.alert("All resources saved");
				if(on_complete)
					on_complete();
			}, function(v,err){ //error
				alert_dialog.content.innerHTML = "Error saving resources: " + err;
			}, function(v){
				alert_dialog.content.innerHTML = "Saving..." + (Math.floor(v * 100)) + "%";
			});

			if (widgets)
				widgets.refresh();
		}

		//--------------------------------------------------------------
		//cw:
		//--------------------------------------------------------------
		function inner_save_to_pack()
		{
			var alert_dialog = RealGUI.alert("Saving...");

			var fullpath = pack_folder + "/" + pack_filename;
			if( fullpath.toLowerCase().indexOf(".wbin") == -1 )
				fullpath += ".wbin";

			var pack = RS.RM.getResource( fullpath, RS.Pack );
			if(pack)
			{
				//append to existing pack
				pack.addResources( missing );
			}
			else
			{
				//create pack
				pack = RS.Pack.createPack( pack_filename, missing, null, true );
			}

			if(pack)
			{
				pack.fullpath = fullpath;
				RS.ResourcesManager.registerResource(  pack.fullpath || pack.filename, pack ); 
				DriveModule.saveResource( pack, inner_complete );
			}
		}

		//--------------------------------------------------------------
		//cw:
		//--------------------------------------------------------------
		function inner_complete( res )
		{
			if(res)
			{
				RS.GlobalScene.addPreloadResource( res.fullpath );
				RealGUI.alert("Pack created: " + res.fullpath );
			}
			else
			{
				RealGUI.alert("Error creating Pack, check size in LFS");
				return;
			}

			if(on_complete)
				on_complete(res);
		}

		return false;
	},


	//==============================================================================================
	//called after the server gets a file info
	//==============================================================================================
	processServerResource: function(data)
	{
		var resource = data;
		
		resource.id = parseInt(resource.id);
		resource.fullpath = resource.folder + "/" + resource.filename;
		resource.url = CORE.server_url + "resources/" + resource.fullpath;
		resource.object_class = resource.category;
		if(resource.metadata)
			resource.metadata = JSON.parse( resource.metadata );
		else
			resource.metadata = {};
		resource._preview_url = CORE.server_url + "resources/_pics/_" + resource.id + ".png";

		this.server_resources[ resource.fullpath ] = resource;
		if( RS.ResourcesManager.resources[ resource.fullpath ] )
			RS.ResourcesManager.resources[ resource.fullpath ]._server_info = resource;

		return resource;
	},

	//==============================================================================================
	//
	//==============================================================================================
	convertToTree: function( data, fullpath )
	{
		fullpath = fullpath || "";

		if(!data)
			return {};

		var o = { children:[] };

		if( data.constructor == Array ) //root node
		{
			o.id = "Files";
			for( var i = 0; i < data.length; ++i )
			{
				var name = data[i].name
				var item_fullpath = fullpath + "/" + name;
				var folders = this.convertToTree( data[i].folders, item_fullpath );
				folders.content = name;
				folders.id = item_fullpath;
				folders.fullpath = item_fullpath;
				o.children.push( folders );
			}
		}
		else {
			for( var i in data )
			{
				var item_fullpath = fullpath + "/" + i;
				var folder = this.convertToTree( data[i], item_fullpath );
				folder.content = i;
				folder.id = item_fullpath;
				folder.fullpath = item_fullpath;
				o.children.push( folder );
			}
		}

		return o;
	},


	//==============================================================================================
	//
	//==============================================================================================
	onShowPreferencesPanel: function(name,widgets)
	{
		if(name != "drive")
			return;

		var that = this;

		widgets.addTitle("Files server configuration");
		widgets.addInfo(null,"You must restart WebGLStudio to changes take effect");

		widgets.addString("Drive Service URL", this.preferences.fileserver_url, function(v){ 
			v = LFS.cleanPath(v) + "/";
			that.preferences.fileserver_url = v;
			if(!v)
				v = CORE.config.server;
			CORE.server_url = v;
		});

		widgets.addString("Drive Files URL", this.preferences.fileserver_files_url, function(v){ 
			v = LFS.cleanPath(v) + "/";
			that.preferences.fileserver_files_url = v;
			if(!v)
				v = CORE.config.resources;
			DriveModule.server_files_url = v;
			RS.ResourcesManager.setPath( this.server_files_path );
		});

		widgets.addString("Proxy URL", this.preferences.proxy, function(v){ 
			that.preferences.proxy = v;
			RS.ResourcesManager.setProxy( v || CORE.config.proxy );
		});

		var fetch_widget = widgets.addStringButton("Fetch from server", "", { button_width: "25%", button:"Fetch", callback_button: function(){ 
			var new_server_url = fetch_widget.getValue();

			if(!new_server_url)
				return;

			RealGUI.requestJSON( new_server_url + "/config.json", function(config){
				if(!config)
					return RealGUI.alert("Cannot retrieve config.json file from server");
				that.preferences.fileserver_url = LFS.cleanPath( new_server_url + "/" + config.server ) + "/";
				that.preferences.fileserver_files_url = LFS.cleanPath( new_server_url + "/" + config.resources ) + "/";
				RealGUI.alert("Config found. You must restart to apply new server config.");
			});
		}});

		widgets.addButton(null, "Use default server", { callback: function(){ 
			that.preferences.fileserver_url = "";
			that.preferences.fileserver_files_url = "";
			RealGUI.alert("You must restart to apply new server config.");
		}});

		widgets.addSeparator();
		widgets.addCheckbox( "Show leaving warning", this.preferences.show_leaving_warning, { name_width: "80%", callback: function(v){ that.preferences.show_leaving_warning = v; }} );
		widgets.addCheckbox( "Use lossy compression with meshes", this.preferences.store_meshes_with_lossy_compression, { name_width: "80%", callback: function(v){ 
			that.preferences.store_meshes_with_lossy_compression = v;
			GL.Mesh.enable_wbin_compression = v;
		}});
	},



	//==============================================================================================
	//
	//==============================================================================================
	retrieveNoCacheFiles: function()
	{
		console.log("load");

		//this helps avoiding cached version of files recently saved
		var files = localStorage.getItem( "wgl_nocache_files" );
		if( files && files != "undefined" ) //it happens...
		{
			files = JSON.parse(files);
			var now = new Date().getTime();
			if(files)
				for(var i in files)
				{
					var diff = now - files[i];
					if( diff < (24 * 60 * 60 * 1000) ) //one day of no cache
						RS.ResourcesManager.nocache_files[i] = files[i];
				}
		}
	},



	//==============================================================================================
	//
	//==============================================================================================
	onUnload: function()
	{
		//this helps avoiding cached version of files recently saved
		if(RS.RM.nocache_files)
			localStorage.setItem( "wgl_nocache_files", JSON.stringify( RS.RM.nocache_files ) );

		if(this.preferences.show_leaving_warning)
		{
			var res = this.getResourcesNotSaved();
			if(res && res.length)
				return "There are Resources in memory that must be saved or they will be lost. Are you sure you want to exit?";
		}
	},

	//**** LFS SERVER CALLS **************

	//==============================================================================================
	//
	//==============================================================================================
	serverGetFolders: function(on_complete)
	{
		var that = this;
		if(!LoginModule.session)
		{
			if(on_complete)
				on_complete(null);
			return;
		}

		LoginModule.session.getUnitsAndFolders(function(units){
			that.units = units;
			if(on_complete)
				on_complete(units);
		});
	},


	//==============================================================================================
	//
	//==============================================================================================
	serverGetFiles: function(folder, on_complete)
	{
		var that = this;
		if(!LoginModule.session)
			throw("Session not found");

		LoginModule.session.getFilesByPath( folder, function(files){
			if(on_complete)
				on_complete(files);
		});
	},


	//==============================================================================================
	//
	//==============================================================================================
	serverSearchFiles: function( filter, on_complete, on_error )
	{
		var that = this;
		if(!LoginModule.session)
			throw("Session not found");

		if(!filter || typeof(filter) != "object")
			throw("filter must be object");

		if(filter.category)
			LoginModule.session.searchByCategory( filter.category, inner, inner_error );
		else if(filter.filename)
			LoginModule.session.searchByFilename( filter.filename, inner, inner_error );

		function inner( files ){
			if(on_complete)
				on_complete(files);
		}

		function inner_error( err ){
			if(on_error)
				on_error(err);
		}
	},


	//==============================================================================================
	//
	//==============================================================================================
	serverCopyFile: function( fullpath, new_fullpath, on_complete )
	{
		LoginModule.session.copyFile( fullpath, new_fullpath, on_complete );
	},


	//==============================================================================================
	//
	//==============================================================================================
	serverMoveFile: function( fullpath, new_fullpath, on_complete )
	{
		LoginModule.session.moveFile( fullpath, new_fullpath, on_complete );
	},


	//==============================================================================================
	//
	//==============================================================================================
	serverDeleteFile: function(fullpath, on_complete)
	{
		LoginModule.session.deleteFile( fullpath, on_complete );
	},

	//Takes into account if the file is already uploaded
	//TODO: this functions goes directly to LiteFileSystem, make it more generic

	//==============================================================================================
	//
	//==============================================================================================
	serverUploadResource: function( resource, fullpath, on_complete, on_error, on_progress )
	{
		var filename = resource.filename;

		if( resource.in_server && RS.ResourcesManager.resources[ fullpath ] )
			resource = RS.ResourcesManager.resources[ fullpath ];

		//guess category
		var category = this.getResourceCategory(resource);

		//in case we update info of a file we dont have in memory
		if( resource.in_server && !RS.ResourcesManager.resources[ fullpath ] )
		{
			var info = {};

			if(resource.metadata !== undefined)
				info.metadata = resource.metadata;
			if(resource.category !== undefined)
				info.category = resource.category;

			//update info like filename, category and metadata (and maybe preview)
			LoginModule.session.updateFileInfo( fullpath, info, 
				function(v,resp){ //on_complete
					console.log("updated!");
					if(on_complete)
						on_complete(v, fullpath, resp);
				},
				function(err,resp){ //on_error
					console.log(err);
					if(on_error)
						on_error(err);
				});
			return;
		}

		var extra_info = {
			metadata: {},
			category: category
		};

		var extension = RS.RM.getExtension( filename );

		//get the data
		var internal_data = RS.Resource.getDataToStore( resource );

		var data = internal_data.data;
		if(data.data) //HACK, ugly, but sometimes returns an object with info about the file, but I want the data
			data = data.data;
		if( internal_data.extension && internal_data.extension != extension )
		{
			filename += "." + internal_data.extension;
			fullpath += "." + internal_data.extension;;
		}

		extension = RS.RM.getExtension( filename ); //recompute it in case it changed
		//if the file doesnt have an extension...
		if( !extension )
		{
			var ext = "";
			if( data.constructor == ArrayBuffer || data.constructor == Blob || data.constructor == File )
				ext = ".wbin"; //add binary extension
			else
				ext = ".txt"; //add text
			filename += ext;
			fullpath += ext;
		}

		//in case it was changed
		resource.filename = filename;

		//generate preview
		if(resource.constructor.hasPreview !== false)
		{
			if( resource._preview_url && resource._preview_url.substr(0,11) == "data:image/" )
				extra_info.preview = resource._preview_url;
			else
				extra_info.preview = this.generatePreview( resource.fullpath );
		}

		//check size (the system allows to break files into parts)
		var size = data.length;
		if(size === undefined) //typed array?
			size = data.byteLength;
		/*
		if( size > LFS.system_info.max_filesize )
		{
			console.error("File too big:",size,"max is",LFS.system_info.max_filesize);
			if(on_error)
				on_error("File too big");
			return;
		}
		*/

		LoginModule.session.uploadFile( fullpath, data, extra_info, 
			function(v,resp){ //on_complete
				console.log("uploaded: ", fullpath );
				if(on_complete)
					on_complete(v, fullpath, resp);
			},
			function(err,resp){ //on_error
				console.log(err);
				if(on_error)
					on_error(err);
			},
			function(v){ //on_progress
				//console.log("Progress",v);
				if(on_progress)
					on_progress(v);
		});
	},

	//QUARANTINE: move them to the bridge?



	//==============================================================================================
	//
	//==============================================================================================
	serverUpdatePreview: function( fullpath, preview, on_complete, on_error)
	{
		console.warn("Quarantine method");
		LoginModule.session.updateFilePreview( fullpath, preview, on_complete, on_error);
	},



	//==============================================================================================
	//
	//==============================================================================================
	serverCreateFolder: function( name, on_complete, on_error )
	{
		console.warn("Quarantine method");
		if(!name)
			return;
		LoginModule.session.createFolder( name, on_complete, on_error );
	},



	//==============================================================================================
	//
	//==============================================================================================
	serverDeleteFolder: function(name, on_complete)
	{
		console.warn("Quarantine method");
		if(!name)
			return;
		LoginModule.session.deleteFolder( name, function(v,resp){
			if(on_complete)
				on_complete(v);
		});
	},


	//==============================================================================================
	//
	//==============================================================================================
	beautifyPath: function ( path, extra )
	{
		var str = "";
		var extra_class = "";
		if(extra)
		{
			for(var i in extra)
			{
				if(i == 'class')
					extra_class = extra[i];
				else
					str += " " + i + "='" + extra[i] + "'";
			}
		}
		return "<span class='path "+extra_class+"' "+str+"><span class='foldername'>" + path.split("/").join("<span class='foldername-slash'>/</span>") + "</span></span>"
	},



	//==============================================================================================
	//
	//==============================================================================================
	beautifySize: function ( bytes )
	{
		bytes = parseInt( bytes );
		if(bytes > 1024*1024)
			bytes = (bytes / (1024*1024)).toFixed(1) + " <span class='bytes'>MBs</span>";
		else if(bytes > 1024)
			bytes = (bytes / 1024).toFixed() + " <span class='bytes'>KBs</span>";
		else
			bytes += " <span class='bytes'>bytes</span>";
		return bytes;
	},



	//==============================================================================================
	//
	//==============================================================================================
	showCreateNewFileMenu: function( folder, e, prev_menu, on_complete )
	{
		var that = this;

		var options = [
			"Script",
			//"Text",
			"Shader",
            //"Pack",
            "Animation",
			"Material"
		];

		var menu = new RealGUI.ContextMenu( options, { event: e, title: "", callback: inner, parentMenu: prev_menu });
		
		function inner( action, options, event )
		{
			if(action == "Script")
				that.showCreateScriptDialog({filename: "script", folder: folder });
			else if(action == "Text")
				that.showCreateFileDialog({filename: "text.txt", folder: folder});
			else if(action == "Pack")
                PackTools.showCreatePackDialog({folder: folder });
           else if(action == "Animation")
                that.showCreateAnimationDialog({folder: folder });
			else if(action == "Shader")
				that.showCreateShaderDialog({filename: "shader.glsl", folder: folder });
			else if(action == "Material")
				that.showResourceMaterialDialog({filename: "new_material.json", folder: folder });
		}
	},



 
    showCreateAnimationDialog:function(options){
        var that = this;
		options = options || {};
		var filename = options.filename || "new animation";
        var folder = options.folder || this.current_folder;
        var duration = options.duration ||10;
        var dialog = new RealGUI.Dialog( { title: i18n.gettext("New Animation"), fullcontent: true, closable: true, draggable: true, resizable: true, width: 580 });
		var inspector = new RealGUI.Inspector();

		inspector.addString("Filename",filename, function(v){ filename = v; }); 
        inspector.addNumber("Duration",duration, {min:0,step:0.1,units:"s"});
        inspector.addButton(null,"Create", inner);



        function inner(){ 
            if(!filename)
            return;

            var extension = RS.RM.getExtension(filename);
            if(extension == "") { 
				filename += ".wbin";
            }
             
            //create dummy file 
            var fullPath = null;
            if(folder && folder != "")
                fullPath = folder + "/" + filename;

            var animation = new RS.Animation();
            animation.filename = filename;
            animation.fullpath = fullPath;
            animation.folder = folder; 
            animation.name = filename;
            var take = animation.createTake( "default", duration );   
            RS.ResourcesManager.registerResource( fullPath , animation );
	 
            if(fullPath)
            {
                DriveModule.saveResource( animation, function(v){
                    that.refreshContent();
                }, { skip_alerts: true });
            }  

            dialog.close();
        };
    
        dialog.add( inspector );
        dialog.adjustSize();
        dialog.show( null, this.root );
        return dialog;
    },


 


	//==============================================================================================
	//
	//==============================================================================================
	showResourceMaterialDialog: function( options )
	{
		var that = this;
		options = options || {};
		var filename = options.filename || "unnamed_material.json";
		var folder = options.folder || this.current_folder;
		var material_classname = "StandardMaterial";
		var material = null;
		var button_text = options.button || (options.material ? "Save" : "Create");

		if(options.material)
		{
			material = options.material;
			material_classname = RS.getObjectClassName( options.material );
			if(material.fullpath)
			{
				filename = RS.RM.getFilename( material.fullpath );
				folder = RS.RM.getFolder( material.fullpath );
			}
		}
		var dialog = new RealGUI.Dialog( { title: options.material ? "Material" : "New Material", fullcontent: true, closable: true, draggable: true, resizable: true, width: 400, height: 300 });
		var inspector = new RealGUI.Inspector();

		inspector.addString("Filename",filename, function(v){ filename = v; });
		inspector.addFolder("Folder",folder, function(v){ folder = v; });

        var materials_classes = []; 
		// for(var i in RS.MaterialClasses)
        // 	materials_classes.push( i );
        materials_classes.push( "ShaderMaterial" );
        materials_classes.push( "StandardMaterial");

		inspector.addCombo("Material Class", material_classname, { disabled: !!options.material, values: materials_classes, callback: function(v){ material_classname = v; }});
		inspector.addButton(null, button_text , inner);

		function inner()
		{
			if(!filename)
				return;
			folder = folder || "";

			var material = options.material;

			if(!material)
			{
				var material_class = RS.MaterialClasses[ material_classname ];
				if(!material_class)
					return;
				material = new material_class();
			}

			var fullpath = RS.RM.cleanFullpath( folder + "/" + filename );
			material.filename = filename;
			material.fullpath = RS.RM.cleanFullpath( folder + "/" + filename );

			RS.RM.registerResource( fullpath, material );
			RS.RM.resourceModified( material );
			if( RS.RM.getFolder( material.fullpath ) )
			{
				DriveModule.saveResource( material, function(){
					that.refreshContent();
					if(options.callback)
						options.callback(material);
				}, { skip_alerts: true });
			}
			else
				if(options.callback)
					options.callback( material );
			that.refreshContent();
			dialog.close();
		}

		dialog.add( inspector );
		dialog.show( null, this._root );
		dialog.adjustSize();
		return dialog;
	},



	//==============================================================================================
	//
	//==============================================================================================
	showCreateFileDialog: function( options )
	{
		var that = this;
		options = options || {};
		var filename = options.filename || "unnamed.txt";
		var folder = options.folder || this.current_folder;

		var dialog = new RealGUI.Dialog( { title: "New File", fullcontent: true, closable: true, draggable: true, resizable: true, width: 300, height: 300 });
		var inspector = new RealGUI.Inspector();

		inspector.addString("Filename",filename, function(v){ filename = v; });
		inspector.addFolder("Folder",folder, function(v){ folder = v; });
		inspector.addButton(null,"Create", inner);

		function inner()
		{
			folder = folder || "";
			//create dummy file
			var resource = new RS.Resource();
			resource.filename = filename;
			if(folder && folder != "")
				resource.fullpath = folder + "/" + filename;
			resource.data = options.content || "";

			//upload to server? depends if it is local or not
			resource.register();
			if(resource.fullpath)
			{
				DriveModule.saveResource( resource, function(v){
					that.refreshContent();
				}, { skip_alerts: true });
			}

			//refresh
			//close
			dialog.close();
		}

		dialog.add( inspector );
		dialog.show( null, this._root );
		dialog.adjustSize();
		return dialog;
	},



	//==============================================================================================
	//
	//==============================================================================================
	showCreateScriptDialog: function( options, on_complete )
	{
		var that = this;
		options = options || {};
		var filename = options.filename || "unnamed.js";
		var folder = options.folder || this.current_folder;
		var lang = options.lang || "javascript";
		var template = options.template || "default";

		var dialog = new RealGUI.Dialog( { title: "New Script", fullcontent: true, closable: true, draggable: true, resizable: true, width: 580, height: 380 });
		var inspector = new RealGUI.Inspector();

		inspector.addString("Filename",filename, function(v){ filename = v; });
		//inspector.addFolder("Folder",folder, function(v){ folder = v; });
		folder = '/projects/'+folder;

		var templates = [];
		for(var i in RS.Script.templates)
			templates.push(i);

		inspector.addCombo("Template",template, { values: templates, callback: function(v){ template = v; }});
		inspector.addCombo("Type", "javascript", { values: ["javascript","typescript"], callback: function(v){ lang = v; }});
		inspector.addButton(null,"Create", inner);

		function inner()
		{
			if(!filename)
				return;

			var extension = RS.RM.getExtension(filename);
			if(extension == "") {
				if(lang == "typescript")
					filename += ".ts";
				else
				filename += ".js";
			}

			folder = folder || "";
			//create dummy file
			var resource = new RS.Resource();
			resource.filename = filename;
			if(folder && folder != "")
				resource.fullpath = folder + "/" + filename;

			var code = RS.Script.templates[template][lang] || "";
			resource.setData( code );
			resource.lang = lang;
			
			//upload to server? depends if it is local or not
			resource.register();
			if(resource.fullpath)
			{
				DriveModule.saveResource( resource, function(v){
					that.refreshContent();
					CodingModule.coding_assets.widget.refreshContent();//coding area refresh
				}, { skip_alerts: true });
			}

			if(on_complete)
				on_complete( resource );

			dialog.close();
		}

		dialog.add( inspector );
		dialog.show( null, this._root );
		dialog.adjustSize();
		return dialog;
	},



	//==============================================================================================
	//
	//==============================================================================================
	showCreateShaderDialog: function( options )
	{
		var that = this;
		options = options || {};
		var filename = options.filename || "shader.glsl";
		var folder = options.folder || this.current_folder;
		var type = options.type || "light_and_deformers";

		var dialog = new RealGUI.Dialog( { title: i18n.gettext("New Shader"), fullcontent: true, closable: true, draggable: true, resizable: true, width: 580 });
		var inspector = new RealGUI.Inspector();

		inspector.addString("Filename",filename, function(v){ filename = v; });
		inspector.addFolder("Folder",folder, function(v){ folder = v; });

		var types = [];
		for(var i in RS.ShaderCode.examples)
			types.push(i);

		inspector.addCombo("Shader Type", type, { values: types, callback: function(v){ type = v; }});
		inspector.addButton(null,"Create", inner);

		function inner()
		{
			folder = folder || "";
			//create dummy file
			var shader_code = new RS.ShaderCode();
			shader_code.filename = filename;
			if(folder && folder != "")
				shader_code.fullpath = folder + "/" + filename;
			shader_code.code = options.content || RS.ShaderCode.examples[type];

			//upload to server? depends if it is local or not
			RS.ResourcesManager.registerResource( shader_code.fullpath || shader_code.filename, shader_code );
			if(shader_code.fullpath)
			{
				DriveModule.saveResource( shader_code, function(v){
					that.refreshContent();
				}, { skip_alerts: true });
			}

			if(options.on_complete)
				options.on_complete(shader_code, filename, folder, shader_code.fullpath);

			//refresh
			//close
			dialog.close();
		}

		dialog.add( inspector );
		dialog.show( null, this._root );
		dialog.adjustSize();
		return dialog;
	}

};

DriveModule.getResourceAsFile = DriveModule.getResourceAsBlob;
if (typeof CORE !== 'undefined')	// not in player
	CORE.registerModule( DriveModule );


//==============================================================================================
//
//==============================================================================================

//Resource Insert button ***********************************
DriveModule.registerAssignResourceCallback( "Mesh", function( fullpath, restype, options ) {

	DriveModule.loadResource( fullpath );

	var action = options.mesh_action || "replace";

	var node = null;

	if( action == "replace" && options.node && 0) //DISABLED
	{
		node = options.node;
		var component = node.getComponent( RS.Components.MeshRenderer );
		if(!component)
		{
			component = new RS.Components.MeshRenderer();
			node.addComponent( component );
			component.mesh = fullpath;
		}
		else
			component.mesh = fullpath;
	}
	else
	{
		if( action == "replace") //to prioritize
			action = "scene";

		//create new node
		node = RS.newMeshNode( RS.GlobalScene.generateUniqueNodeName(), fullpath );
		EditorModule.getAddRootNode().addChild( node );

		if( options.event )
		{
			//test collision with grid
			GL.augmentEvent( options.event );
			var position =  null;
			if( action == "plane")
				position = RenderModule.testGridCollision( options.event.canvasx, options.event.canvasy );
			else if( action == "scene")
			{
				var camera = ToolUtils.getCamera();
				var ray = camera.getRayInPixel( options.event.canvasx, options.event.canvasy );
				var collisions = RS.Physics.raycastRenderInstances( ray.origin, ray.direction, { triangle_collision: true } );
				if(collisions && collisions.length)
					position = collisions[0].position;
				else //grid plane
					position = RenderModule.testGridCollision( options.event.canvasx, options.event.canvasy );
			}
			if(position)
				node.transform.position = position;
		}
	}

	SelectionModule.setSelection( node );
});


//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback(["Texture","image/jpg","image/png"], function( fullpath, restype, options ) {

	var node = RS.GlobalScene.selected_node;

	var action = options.texture_action || "material";

	if(options.event)
	{
		GL.augmentEvent(options.event);
		node = RenderModule.getNodeAtCanvasPosition( options.event.canvasx, options.event.canvasy );
	}
	
	DriveModule.loadResource( fullpath );

	var component = null;

	if( action == "replace" || action == "material" )
	{
		var channel = options.channel || options.target || RS.Material.COLOR_TEXTURE;
		if( node )
		{
			if(!node.material)
				node.material = new RS.StandardMaterial();
			var material = node.getMaterial();
			var channels = material.getTextureChannels();
			if( channels.indexOf( channel ) == -1 )
				channel = channels[0];
			if(channel)
				material.setTexture( channel , fullpath );
		}
	}
	else if(action == "plane")
	{
		node = new RS.SceneNode();
		component = new RS.Components.GeometricPrimitive({geometry: RS.Components.GeometricPrimitive.PLANE});
		node.addComponent( component );
		component.texture = fullpath;
		EditorModule.getAddRootNode().addChild( node );

		if(!node.material)
			node.material = new RS.StandardMaterial();
		node.material.setTexture( "color" , fullpath );
	}
	else if(action == "sprite")
	{
		node = new RS.SceneNode();
		node.name = RS.ResourcesManager.getBasename( fullpath );
		component = new RS.Components.Sprite();
		node.addComponent( component );
		component.texture = fullpath;
		var texture = RS.ResourcesManager.getTexture( fullpath );
		if(texture)
			component.size = [texture.width, texture.height];
		EditorModule.getAddRootNode().addChild( node );
	}

	if(component)
	{
		CORE.userAction("component_created", component );
		SelectionModule.setSelection( component );
	}

	EditorModule.inspect( node );
});


//Materials
//==============================================================================================
//
//==============================================================================================
DriveModule.onInsertMaterial = function( fullpath, restype, options ) 
{
	var node = RS.GlobalScene.selected_node;

	if(restype != "Material" && !RS.MaterialClasses[restype]) // if(!RS.MaterialClasses[ restype ]) //class not supported?
		return false;

	if( options.event )
	{
		GL.augmentEvent( options.event );
		node = RenderModule.getNodeAtCanvasPosition( options.event.canvasx, options.event.canvasy );
	}

	DriveModule.loadResource( fullpath, function(material) { 
		RS.ResourcesManager.resources[fullpath] = material; //material in Material format (textures and all loaded)

		EditorModule.inspect( node );
	});

	if( node )
	{
		node.material = fullpath;
		EditorModule.inspect( node );
	}
};



//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback( null, DriveModule.onInsertMaterial );


//==============================================================================================
// cw: This is the callback when assigning a "scenenode" resource.
// Due to the complete fn lack of comments, I am assuming this is called after a LOAD that is assigning the scenenode resource.
//==============================================================================================
DriveModule.registerAssignResourceCallback( "SceneNode", function( fullpath, restype, options ) {
	var root = RS.GlobalScene.root;   // the newly-created node be added to the last children of the root
	var res = RS.RM.resources[ fullpath ];
	if(res && res.constructor === RS.SceneNode )
	{
		CORE.userAction( "node_created", res );
		//apply position?
		root.addChild( res );
	}
	else
	{
		RS.RM.load( fullpath, function(res,fullpath){
			if(res && res.constructor === RS.SceneNode )
			{
				CORE.userAction( "node_created", res );
				//RealGUI.dialog("autosaving resources");
				
				root.addChild( res );

				
			
			}
		});
		/*
		RS.GlobalScene.load( fullpath, function(v,res){
			if(res && res.constructor === RS.SceneNode )
				root.addChild( res );
		});
		*/
	}
	SelectionModule.setSelection(res);
});



//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback("component", function( fullpath, restype, options ) {
	DriveModule.loadResource( fullpath, function(resource){
		if(!resource)
			return;

		var comp_data = resource.data;
		if(comp_data.constructor === String)
			comp_data = JSON.parse( comp_data );
		var class_name = comp_data.object_class;
		if(!class_name || !RS.Components[ class_name ] )
			RealGUI.alert("Unknown object class type: " + class_name );
		else
		{
			var compo = new RS.Components[ class_name ]();
			compo.configure( comp_data );
			var node = SelectionModule.getSelectedNode() || RS.GlobalScene.root;
			node.addComponent( compo );
			EditorModule.refreshAttributes();
			RenderModule.requestFrame();
		}
	});
});



//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback( "SceneTree", function( fullpath, restype, options ) {

	RealGUI.confirm("Are you sure? you will loose the current scene", function(v) {
		if(!v)
			return;

		RS.GlobalScene.clear();

		var res = RS.RM.resources[ fullpath ];
		if(!res)//load
		{
			SceneStorageModule.loadScene( fullpath, null, true ); 
			return;
		}
		SceneStorageModule.setSceneFromJSON( res.serialize() ); //ugly but we cannot replace the current scene
		res.extra.folder = RS.ResourcesManager.getFolder( fullpath );
		res.extra.fullpath = fullpath;
		DriveModule.closeTab();
	});

});



//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback("Pack", function( fullpath, restype, options ) {
	DriveModule.loadResource( fullpath, function(pack){
		if(!pack)
			return;

		if(!pack._data || !pack._data["scene.json"])
			return;

		RealGUI.confirm("Do you want to load the scene inside the PACK? Current scene will be lost", function(v) {
			if(!v)
				return;
			var json_data = pack._data["scene.json"];
			var data = JSON.parse(json_data);
			RS.GlobalScene.clear();
			//RS.GlobalScene.configure(data); //this wont load the global scripts
			RS.GlobalScene.setFromJSON(data);
		});
	});
});



//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback("Prefab", function( fullpath, restype, options ) {

	var position = null;
	if(options.event)
	{
		//test collision with grid
		GL.augmentEvent( options.event );
		position = RenderModule.testGridCollision( options.event.canvasx, options.event.canvasy );
	}

	//prefab
	DriveModule.loadResource( fullpath, function(resource) { 
		//console.log(resource); //log
		var node = null;

		if(resource.constructor === RS.Prefab)
			node = resource.createObject();
		else if(resource.constructor === RS.SceneNode )
			node = resource.clone(); //weird situation here

		if(!node)
			return RealGUI.alert("Error in Prefab, cannot be inserted");

		RS.GlobalScene.root.addChild(node);
		var resources = node.getResources({});
		RS.ResourcesManager.loadResources( resources );
		if(position)
			node.transform.position = position;
		EditorModule.inspect( node );
		SelectionModule.setSelection( node );
	});
});



DriveModule.registerAssignResourceCallback("Animation", function( fullpath, restype, options ) {

	//prefab
	DriveModule.loadResource( fullpath, function(resource) { 
		if(resource.constructor !== RS.Animation)
			return console.error("This resource is not an Animation");
		var filename = resource.fullpath || resource.filename;
		var node = SelectionModule.getSelectedNode() || RS.GlobalScene.root;
		node.addComponent( new RS.Components.PlayAnimation({ animation: filename }) );
		EditorModule.inspect( node );
	});
});

//textual resource

//==============================================================================================
//
//==============================================================================================
DriveModule._textResourceCallback = function( fullpath, restype, options ) {

	var resource = RS.RM.getResource( fullpath );
	if(!resource)
	{
		RS.ResourcesManager.load( fullpath, null, function(url,resource){ DriveModule.onInsertResourceInScene(url,resource); });
		return;
	}

	if(!resource)
	{
		console.warn("Assigning resource without loading it");
		return;
	}

	//open in text editor
	var data = null;
	
	if(resource.getData)
		data = resource.getData();
	else if(resource._data)
		data = resource._data;

	if( (data !== undefined && data !== null) && data.constructor === String )
		CodingModule.editInstanceCode( resource, null, true );
	else
		RealGUI.alert("No data found in resource");
}



//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback(["Data","Resource","application/javascript","text/plain","text/html","text/css","text/csv","TEXT"], DriveModule._textResourceCallback );


//==============================================================================================
//
//==============================================================================================
DriveModule.registerAssignResourceCallback(["ShaderCode","Script"], DriveModule._textResourceCallback );



//==============================================================================================
//
//==============================================================================================
RealGUI.Inspector.prototype.addFolder = function( name,value, options )
{
	options = this.processOptions(options);

	var old_callback_button = options.callback_button;
	options.callback_button = function(){
		//show dialog with folders
		DriveModule.showSelectFolderDialog(function(v){
			w.setValue( v );	
		}, null, w.getValue() );
	}

	options.icon = "imgs/mini-icon-folder.png";

	w = this.addStringButton( name, value, options );
	w.querySelector('input').classList.add("fixed_size");

	return w;
}



//==============================================================================================
//
//==============================================================================================
RealGUI.Inspector.widget_constructors["folder"] = "addFolder";

GL.Texture.save_priority = -10;
GL.Mesh.save_priority = -5;
