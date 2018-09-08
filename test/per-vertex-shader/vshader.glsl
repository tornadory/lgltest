attribute vec3 VertexPosition;
attribute vec3 VertexNormal;

uniform vec4 LightPosition;
uniform vec3 Kd;
uniform vec3 Ld;

uniform mat4 ModelViewMatrix;
uniform mat4 MVP;

varying vec3 LightIntensity;

void main() {
  // Convert normal and position to eye coords.
  vec3 tnorm = normalize(VertexNormal);
  vec4 eyeCoords = ModelViewMatrix * vec4(VertexPosition, 1.0);
  vec3 s = normalize(vec3(LightPosition - eyeCoords));

  // Diffuse shading equation.
  LightIntensity = Ld * Kd * max(dot(s, tnorm), 0.0);

  // Convert position to clip coords and pass along.
  gl_Position = MVP * vec4(VertexPosition, 1.0);
}