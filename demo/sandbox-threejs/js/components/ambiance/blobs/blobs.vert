uniform float elapsed;
uniform float uRange;
attribute float size;
attribute float aOffset;

varying float vOffset;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {

	// vec3 movement = vec3(0.0, elapsed * 0.001, 0.0);
	vec3 movement = vec3(
		sin( elapsed * 0.002 * aOffset) * uRange * 0.003,
		elapsed * (-uRange / 100000.0 - uRange / 100000.0 * aOffset),
		cos( elapsed * 0.002 * aOffset ) * uRange * 0.003
	);
	
	vec3 range = vec3(uRange, uRange * 0.3, uRange);
	
	vec3 cameraOffset = cameraPosition - range;
	
	vec3 moduloPosition = mod( position + movement - cameraOffset, range * 2.0 ) + cameraOffset;
	vec4 mvPosition = modelViewMatrix * vec4( moduloPosition, 1.0 );
	
	vOffset = aOffset;
	
	gl_PointSize = size * ( uRange / (length( mvPosition.xyz ) + 1.0) );
	gl_Position = projectionMatrix * mvPosition;

}