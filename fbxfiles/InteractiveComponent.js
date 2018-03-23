//This is an example of a component code
function InteractiveComponent(o) {
  //define some properties
	this._last_obj = null;
  //if we have the state passed, then we restore the state
  if(o)
    this.configure(o);
}

//bind events when the component belongs to the scene
InteractiveComponent.prototype.onAddedToScene = function(scene)
{
  LEvent.bind(scene, "update", this.onUpdate, this );
  LEvent.bind( scene, "mousedown", this._onMouse, this );
  LEvent.bind( scene, "mousemove", this._onMouse, this );
  LEvent.bind( scene, "mouseup", this._onMouse, this );

  //document.writeln("<div id=\"floatAd\" style=\" position:fixed !important; position:absolute; _top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight)); z-index: 2147483647; left: 50%; margin-left: -240px !important; top: 50%; margin-top: -210px !important; width:487px; height:350px; cursor:pointer; display:none; \">");

}

//unbind events when the component no longer belongs to the scene
InteractiveComponent.prototype.onRemovedFromScene = function(scene)
{
	//bind events
  //LEvent.unbind(scene, "update", this.onUpdate, this );
  LEvent.unbindAll( scene, this );
}

//example of one method called for ever update event
InteractiveComponent.prototype.onUpdate = function(e,dt)
{
  //do something
  //...
}

InteractiveComponent.prototype.getNodeUnderMouse = function( e )
{
	var layers = this.layers;
	//console.log("RS.Picking ", RS.Picking);
	return RS.Picking.getNodeAtCanvasPosition( e.canvasx, e.canvasy, null, layers );
}

InteractiveComponent.prototype._onMouse = function(type, e)
{
	//console.log("on mouse event");

	//Intereactive: check which node was clicked (this is a mode that helps clicking stuff)
	if(e.eventType == "mousedown" || e.eventType == "mousewheel" || e.eventType == "mousemove" )
	{
		var node = this.getNodeUnderMouse(e);
		this._clicked_node = node;
		if(this._last_obj){
				this._last_obj._is_selected = false;
		}

		var floatText = document.getElementById('floatText');
			if(!floatText){
				floatText = document.createElement("div");
				floatText.id = 'floatText';
				floatText.style.width = '100px';
				floatText.style.height = '40px';
				floatText.style.background = 'white';
				floatText.style.color = '#000000';
				floatText.style.backgroundColor = '#ffffff';
				floatText.style.position = 'absolute';
				var divX = e.clientX - floatText.offsetLeft;
				var divY = e.clientY - floatText.offsetTop;
				floatText.style.left = divX + 'px';
				floatText.style.top = divY + 'px';
				floatText.style.zIndex = 100;
				console.error("divX is " + divX);
				//console.error("divY is " + divY);
				floatText.style.display = 'none';

				document.getElementsByTagName('body')[0].appendChild(floatText);
			}
		floatText.style.display = 'none';


		if(this._clicked_node){
			this._last_obj = this._clicked_node;
			this._clicked_node._is_selected = true;
			
			var txt = this._last_obj.name;
			
			var divX = e.clientX - floatText.offsetLeft;
			var divY = e.clientY - floatText.offsetTop;
			floatText.style.left = divX + 'px';
			floatText.style.top = divY + 'px';

			floatText.innerHTML = "对象：" + txt;
			
			floatText.style.display = 'block';

			//console.log("floatText is ", floatText);
			//RS.Draw.renderText(txt);
			//console.log("after draw text", txt);
			//document.getElementById('floatAd').innerHTML = txt;
			//document.getElementById('floatAd').style.display = 'block';
		}

		if(this._clicked_node && e.eventType == "mousedown" && e.button == 0 )
		{
			//console.log("Node clicked: " + this._clicked_node.name );
			

			LEvent.trigger( this._clicked_node, "clicked", this._clicked_node ); //event in node clicked
			LEvent.trigger( this._root, "node_clicked", this._clicked_node ); //event in this node
			LEvent.trigger( this._root.scene, "node_clicked", this._clicked_node ); //event in scene
		}

		if(this._clicked_node && e.eventType == "mousemove")
		{
			//console.log("Node moved: " + this._clicked_node.name );

			LEvent.trigger( this._clicked_node, "hovered", this._clicked_node ); //event in node clicked
			LEvent.trigger( this._root, "node_hovered", this._clicked_node ); //event in this node
			LEvent.trigger( this._root.scene, "node_hovered", this._clicked_node ); //event in scene
		}
	}

	var levent = null; //levent dispatched

	//send event to clicked node
	if(this._clicked_node) // && this._clicked_node.flags.interactive)
	{
		e.scene_node = this._clicked_node;
		levent = LEvent.trigger( this._clicked_node, e.eventType, e );
	}

	if(e.eventType == "mouseup")
		this._clicked_node = null;

	if(this._clicked_node)
		return true;
}

//you can also implement the methods serialize and configure

//register the class so it is a valid component for RS

RS.registerComponent( InteractiveComponent );
