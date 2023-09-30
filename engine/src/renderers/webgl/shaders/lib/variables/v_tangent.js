import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "a_tangent",
        "u_modelMatrix",
    ],
    codes: {
        vertex: {
            global: `varying vec3 v_tangent;`,
            local: `v_tangent = vec3(u_modelMatrix * vec4(a_tangent, 0.0));`,
        },
        fragment: {
            global: `varying vec3 v_tangent;`,
        },
    },
};