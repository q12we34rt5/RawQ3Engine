import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "fl_normal",
        "fl_tangent",
    ],
    codes: {
        fragment: {
            local: `vec3 fl_bitangent = cross(fl_normal, fl_tangent);`,
        },
    },
};