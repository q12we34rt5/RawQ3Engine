import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "u_specularIntensity",
        "u_specularColor",
        "fl_lightColor",
        "set_light_color_zero",
        "fl_specularCoef",
    ],
    codes: {
        fragment: {
            local: [
                `fl_lightColor += u_specularIntensity * fl_specularCoef * u_specularColor;`,
            ]
        },
    }
};