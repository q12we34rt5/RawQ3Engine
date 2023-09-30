import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "vl_position",
    ],
    codes: {
        vertex: {
            global: `varying vec3 v_position;`,
            local: `v_position = vl_position.xyz;`,
        },
        fragment: {
            global: `varying vec3 v_position;`,
        },
    },
};