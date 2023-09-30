import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "v_tangent",
        "fl_normal",
    ],
    codes: {
        fragment: {
            local: `vec3 fl_tangent = normalize(v_tangent - dot(fl_normal, v_tangent) * fl_normal);`,
        },
    },
};