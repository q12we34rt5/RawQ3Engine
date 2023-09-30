import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "a_position",
    ],
    codes: {
        vertex: {
            local: `vec4 vl_position = vec4(a_position, 1.0);`,
        },
    },
};