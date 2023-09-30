import { LibManager, RequireLoader } from "./lib/manager.js";
import { UniqueStringGenerator } from "../../../util/unique-string-generator.js";

function getInputsInfo(inputs) {
    let inputsInfo = [];
    for (let i = 0; i < inputs.length; i++) {

    }
}

/*

a_texcoord           | 
u_texture            | 
u_normalMap          | 
a_normal             | 
u_normalMatrix       | 
a_tangent            | 
u_modelMatrix        | 
u_ambientIntensity   | 
u_ambientColor       | 
u_diffuseIntensity   | 
u_diffuseColor       | 
a_position           | 
u_pointLightLocation | 
u_specularIntensity  | 
u_specularColor      | 
u_viewPosition       | 

uniform ─┬─ sampler2D
         ├─ bool
         ├─ int
         ├─ float
         ├─ vec2
         ├─ vec3
         ├─ vec4
         ├─ mat2
         ├─ mat3
         └─ mat4
attributes

├ ─ │ └ ┬

Mesh ─┬─ Geometry
      │
      └─ Material

DrawObject {
    light from sense
    projection matrix from sense
    model matrix from mesh
    
}

Shader ─┬─ 
        │
        ├─
        │
        ├─
        │
        ├─
        │
        └─



*/



export class Shader {

    /** @type {WebGLRenderingContext} */
    gl = null;

    names = null;

    vertex_shader = null;
    fragment_shader = null;

    inputs = [];

    constructor(gl, chunk) {
        this.gl = gl;
        this.names = chunk.names.slice();
        this.vertex_shader = chunk.codes.vertex;
        this.fragment_shader = chunk.codes.fragment;
    }

}

export function makeMaterialTable(material) {

}