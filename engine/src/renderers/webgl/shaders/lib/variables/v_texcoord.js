import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "a_texcoord",
    ],
    codes: {
        vertex: {
            global: `varying vec2 v_texcoord;`,
            local: `v_texcoord = a_texcoord;`,
        },
        fragment: {
            global: `varying vec2 v_texcoord;`,
        },
    },
};