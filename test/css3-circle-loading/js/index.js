
<!--this edit by mat-->

<!--this edit by dev-->

var num = 7,
    ang = 360/num,
    rad = num*5;

function setup(){
  for(var i=0; i<num; i++){
    var button = document.createElement('div');
    button.className = "dot"+i+" dot";
    button.style.top = rad*Math.cos(ang*i*Math.PI/180)-10+"px";
    button.style.left = rad*Math.sin(ang*i*Math.PI/180)-10+"px";
    button.style.backgroundColor = "hsla("+ang*i+", 50%, 50%, 1)";
    
    button.style.webkitAnimation = 
      "osc 2s ease-in-out infinite "+i/(num/2)+"s, rainbow 8s infinite "+i/(num/2)+"s";
    button.style.animation = 
      "osc 2s ease-in-out infinite "+i/(num/2)+"s, rainbow 8s infinite "+i/(num/2)+"s, spin 1s infinite";
    
    document.getElementById("hold").appendChild(button);
  }
}

setup();

