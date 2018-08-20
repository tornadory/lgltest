// build BufferGeometry.          
var geometry = new THREE.BufferGeometry();
geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geometry.addAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
geometry.addAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
geometry.setIndex(indices);
for (var i = 0, il = groups.length; i < il; i++) {
    geometry.addGroup(groups[i].offset, groups[i].count, i);
}











function onDocumentTouchStart(event) {

    touchbegin = true;
    switch (event.touches.length) {
        case 1:
            event.preventDefault();
            document.addEventListener('touchmove',onTouchMove,false);
            toucharry.sx = event.targetTouches[0].pageX;
            toucharry.sy = event.targetTouches[0].pageY;

            break;
        case 2:
            document.addEventListener('touchmove',onTouchMove2,false);
            touchbegin = false;
            toucharry.sx = event.targetTouches[0].pageX;
            toucharry.sy = event.targetTouches[0].pageY;
            toucharry.ex = event.targetTouches[1].pageX;
            toucharry.ey = event.targetTouches[1].pageY;

            break;


    }
    animate();
}
function onTouchMove( event ) {

    if(!touchbegin){
        return;
    }

    var x = event.targetTouches[0].pageX;
    var y = event.targetTouches[0].pageY;
    //mouseY = - ( y / rheight ) * 2 + 1;

    var delax = x- toucharry.sx;
    var delay = -y -toucharry.sy ;

    rotationobj(delax,delay);

}
function rotationobj(delax, delay) {
    var dex = delax / 270;
    var dey = delay / 270;
    modelgroup.rotation.x = modelgroup.rotation.x + dex;
    modelgroup.rotation.y = modelgroup.rotation.y + dey;
    animate();
}