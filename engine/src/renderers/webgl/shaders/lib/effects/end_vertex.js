import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "vl_position"
    ],
    codes: {
        vertex: {
            local: `gl_Position = vl_position;`
        },
    }
};