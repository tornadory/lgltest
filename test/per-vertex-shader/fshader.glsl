#ifdef GL_ES
  precision mediump float;
#endif

varying vec3 LightIntensity;

void main() {
 gl_FragColor = vec4(LightIntensity, 1.0);
}