import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "fl_viewDirection",
        "fl_reflectDirection",
    ],
    codes: {
        fragment: {
            local: `float fl_specularCoef = pow(max(dot(fl_viewDirection, fl_reflectDirection), 0.0), 32.0);`,
        },
    },
};