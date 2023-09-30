import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "fl_normal",
        "fl_lightDirection",
    ],
    codes: {
        fragment: {
            local: `float fl_diffuseCoef = max(dot(fl_normal, fl_lightDirection), 0.0);`,
        },
    },
};