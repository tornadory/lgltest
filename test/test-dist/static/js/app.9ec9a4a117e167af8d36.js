webpackJsonp([1],{eslX:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});i("pTlp");var n=i("Zx67"),o=i.n(n),r=i("Zrlr"),a=i.n(r),s=i("wxAW"),c=i.n(s),d=i("zwoO"),h=i.n(d),u=i("yEsh"),l=i.n(u),m=i("Pf15"),w=i.n(m),y=i("Ml+6"),v=(i("tlNC"),i("O2VG"),i("TQ1x")),p=i("39R8");new v,new(function(e){function t(){a()(this,t);var e=h()(this,(t.__proto__||o()(t)).call(this));e.clock=new y.Clock,e.isMouseDown=!1,e.INTERSECTED=null,e.crosshair=new y.Mesh(new y.RingGeometry(.02,.04,32),new y.MeshBasicMaterial({color:16777215,opacity:.5,transparent:!0})),e.crosshair.position.z=-2,e.camera.add(e.crosshair),e.room=new y.Mesh(new y.BoxGeometry(6,6,6,8,8,8),new y.MeshBasicMaterial({color:4210752,wireframe:!0})),e.scene.add(e.room),e.scene.add(new y.HemisphereLight(6316128,4210752));var i=new y.DirectionalLight(16777215);i.position.set(1,1,1).normalize(),e.scene.add(i);for(var n=new y.BoxGeometry(.15,.15,.15),r=0;r<200;r++){var s=new y.Mesh(n,new y.MeshLambertMaterial({color:16777215*Math.random()}));s.position.x=4*Math.random()-2,s.position.y=4*Math.random()-2,s.position.z=4*Math.random()-2,s.rotation.x=2*Math.random()*Math.PI,s.rotation.y=2*Math.random()*Math.PI,s.rotation.z=2*Math.random()*Math.PI,s.scale.x=Math.random()+.5,s.scale.y=Math.random()+.5,s.scale.z=Math.random()+.5,s.userData.velocity=new y.Vector3,s.userData.velocity.x=.01*Math.random()-.005,s.userData.velocity.y=.01*Math.random()-.005,s.userData.velocity.z=.01*Math.random()-.005,e.room.add(s)}return e.raycaster=new y.Raycaster,e.renderer.setClearColor(5263440),e.renderer.sortObjects=!1,e.renderer.domElement.addEventListener("mousedown",e.onMouseDown.bind(e),!1),e.renderer.domElement.addEventListener("mouseup",e.onMouseUp.bind(e),!1),e.renderer.domElement.addEventListener("touchstart",e.onMouseDown.bind(e),!1),e.renderer.domElement.addEventListener("touchend",e.onMouseUp.bind(e),!1),e.animate(),e}return w()(t,e),c()(t,[{key:"onMouseDown",value:function(){this.isMouseDown=!0}},{key:"onMouseUp",value:function(){this.isMouseDown=!1}},{key:"onWindowResize",value:function(){l()(t.prototype.__proto__||o()(t.prototype),"onWindowResize",this).call(this),this.effect.setSize(window.innerWidth,window.innerHeight)}},{key:"animate",value:function(){this.effect.requestAnimationFrame(this.animate.bind(this)),this.render()}},{key:"render",value:function(){var e=60*this.clock.getDelta();if(!0===this.isMouseDown){var t=this.room.children[0];this.room.remove(t),t.position.set(0,0,-.75),t.position.applyQuaternion(this.camera.quaternion),t.userData.velocity.x=.02*(Math.random()-.5)*e,t.userData.velocity.y=.02*(Math.random()-.5)*e,t.userData.velocity.z=(.01*Math.random()-.05)*e,t.userData.velocity.applyQuaternion(this.camera.quaternion),this.room.add(t)}this.raycaster.setFromCamera({x:0,y:0},this.camera);var i=this.raycaster.intersectObjects(this.room.children);i.length>0?this.INTERSECTED!==i[0].object&&(this.INTERSECTED&&this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex),this.INTERSECTED=i[0].object,this.INTERSECTED.currentHex=this.INTERSECTED.material.emissive.getHex(),this.INTERSECTED.material.emissive.setHex(16711680)):(this.INTERSECTED&&this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex),this.INTERSECTED=void 0);for(var n=0;n<this.room.children.length;n++){var o=this.room.children[n];o.userData.velocity.multiplyScalar(1-.001*e),o.position.add(o.userData.velocity),(o.position.x<-3||o.position.x>3)&&(o.position.x=y.Math.clamp(o.position.x,-3,3),o.userData.velocity.x=-o.userData.velocity.x),(o.position.y<-3||o.position.y>3)&&(o.position.y=y.Math.clamp(o.position.y,-3,3),o.userData.velocity.y=-o.userData.velocity.y),(o.position.z<-3||o.position.z>3)&&(o.position.z=y.Math.clamp(o.position.z,-3,3),o.userData.velocity.z=-o.userData.velocity.z),o.rotation.x+=2*o.userData.velocity.x*e,o.rotation.y+=2*o.userData.velocity.y*e,o.rotation.z+=2*o.userData.velocity.z*e}this.controls.update(),this.effect.render(this.scene,this.camera)}}]),t}(function(){function e(){var t=this;a()(this,e),this._camera=new y.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,10),this._controls=new y.VRControls(this._camera),this._scene=new y.Scene,this._scene.add(this._camera),this._renderer=new y.WebGLRenderer,this._renderer.setPixelRatio(window.devicePixelRatio),this._renderer.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(this._renderer.domElement);document.body.insertAdjacentHTML("beforeend",'<div id="ui">\n                        <div id="vr-button"></div>\n                        <a id="magic-window" href="#">Try it without a headset</a>\n                      </div>');this._vrButton=new p.EnterVRButton(this._renderer.domElement,{color:"black",background:"white",corners:"square"}),this._vrButton.on("exit",function(){t._camera.quaternion.set(0,0,0,1),t._camera.position.set(0,t._controls.userHeight,0)}),this._vrButton.on("hide",function(){document.getElementById("ui").style.display="none"}),this._vrButton.on("show",function(){document.getElementById("ui").style.display="inherit"}),document.getElementById("vr-button").appendChild(this._vrButton.domElement),document.getElementById("magic-window").addEventListener("click",function(){t._vrButton.requestEnterFullscreen()}),this._effect=new y.VREffect(this._renderer),this._effect.setSize(window.innerWidth,window.innerHeight),window.addEventListener("resize",this.onWindowResize.bind(this),!1)}return c()(e,[{key:"onWindowResize",value:function(){this._camera.aspect=window.innerWidth/window.innerHeight,this._camera.updateProjectionMatrix(),this._renderer.setSize(window.innerWidth,window.innerHeight)}},{key:"animate",value:function(e){this._effect.requestAnimationFrame(this.animate.bind(this)),this._controls.update(),this._effect.render(this._scene,this._camera)}},{key:"renderer",get:function(){return this._renderer}},{key:"camera",get:function(){return this._camera}},{key:"scene",get:function(){return this._scene}},{key:"effect",get:function(){return this._effect}},{key:"controls",get:function(){return this._controls}}]),e}()))},pTlp:function(e,t){}},["eslX"]);
//# sourceMappingURL=app.9ec9a4a117e167af8d36.js.map