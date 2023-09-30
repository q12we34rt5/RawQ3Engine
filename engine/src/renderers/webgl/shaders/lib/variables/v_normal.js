import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "a_normal",
        "u_normalMatrix",
    ],
    codes: {
        vertex: {
            global: `varying vec3 v_normal;`,
            local: `v_normal = vec3(u_normalMatrix * vec4(a_normal, 0.0));`,
        },
        fragment: {
            global: `varying vec3 v_normal;`,
        },
    },
};