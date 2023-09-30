import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "fl_normal",
        "fl_tangent",
        "fl_bitangent",
    ],
    codes: {
        fragment: {
            local: `mat3 fl_TBN = mat3(fl_normal, fl_tangent, fl_bitangent);`,
        },
    },
};