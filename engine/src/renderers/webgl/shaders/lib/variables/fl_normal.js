import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "v_normal",
    ],
    codes: {
        fragment: {
            local: `vec3 fl_normal = normalize(v_normal);`,
        },
    },
};