import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.uniform,
            dtype: DType.vec3,
            name: "u_pointLightLocation",
        },
    ],
    codes: {
        fragment: {
            global: `uniform vec3 u_pointLightLocation;`,
        },
    },
};

/*
`
#version 330 core
out vec4 Fragcolor;l

in vec3 Normal;
in vec3 Fragpos;

uniform vec3 lightpos;
uniform vec3 viewPos;
uniform vec3 lightcolor;
uniform vec3 objectcolor;

void main() {
    // ambient
    float ambientstrength = 0.1;
    vec3 ambient = ambientstrength * lightcolor;

    // diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightpos - Fragpos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightcolor;

    // specular
    float specularstrength = 0.5;
    vec3 viewDir = normalize(viewPos - Fragpos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specular = specularstrength * spec * lightcolor;

    vec3 result = (ambient + diffuse + specular) * objectcolor;
    FragColor = vec4(result, 1.0);
}
`

`
precision mediump float;
varying vec3 normalInterp;  // Surface normal
varying vec3 vertPos;       // Vertex position
uniform int mode;   // Rendering mode
uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess
// Material color
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 lightPos; // Light position

void main() {
  vec3 N = normalize(normalInterp);
  vec3 L = normalize(lightPos - vertPos);

  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(-vertPos); // Vector to viewer
    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  gl_FragColor = vec4(Ka * ambientColor +
                      Kd * lambertian * diffuseColor +
                      Ks * specular * specularColor, 1.0);

  // only ambient
  if(mode == 2) gl_FragColor = vec4(Ka * ambientColor, 1.0);
  // only diffuse
  if(mode == 3) gl_FragColor = vec4(Kd * lambertian * diffuseColor, 1.0);
  // only specular
  if(mode == 4) gl_FragColor = vec4(Ks * specular * specularColor, 1.0);
}
`
*/