import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "fl_normal",
        "fl_lightDirection",
    ],
    codes: {
        fragment: {
            local: `vec3 fl_reflectDirection = reflect(-fl_lightDirection, fl_normal);`,
        },
    },
};