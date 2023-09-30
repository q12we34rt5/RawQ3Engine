export const LOAD_LIB = {
    STATIC_LOAD: 0,
    DYNAMIC_LOAD: 1,
};

export const Var = {
    a_position: "a_position",
    a_texcoord: "a_texcoord",
    a_normal: "a_normal",
    a_tangent: "a_tangent",

    u_model: "u_model",
    u_texture: "u_texture",
    u_normalMap: "u_normalMap",
    u_pointLightLocation: "u_pointLightLocation",

    v_position: "v_position",
    v_texcoord: "v_texcoord",
    v_normal: "v_normal",
    v_tangent: "v_tangent",
};

export const Prefix = {
    attribute: "attribute",
    uniform: "uniform",
};

export const DType = {
    bool: "bool",
    int: "int",
    float: "float",
    vec2: "vec2",
    vec3: "vec3",
    vec4: "vec4",
    mat2: "mat2",
    mat3: "mat3",
    mat4: "mat4",
    sampler2D: "sampler2D",
};

/*
code = {
    require_attribute: {
        ...
    },
    require_varying: {

    },
    require_uniform: {
        u_normal
    }
    code: `
        vec3 normal = 2.0 * texture2D(uNormal, vTexcoord).xyz - 1.0;
    `
}
*/

// const
/*
N
T
B
TBN
*/