import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "v_texcoord",
        "u_normalMap",
        "fl_TBN",
        "fl_normal",
    ],
    codes: {
        fragment: {
            local: [
                `fl_normal = normalize(fl_TBN * (2.0 * texture2D(u_normalMap, v_texcoord).xyz - 1.0));`,
            ]
        },
    }
};