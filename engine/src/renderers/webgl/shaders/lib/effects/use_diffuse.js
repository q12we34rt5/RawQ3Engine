import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "u_diffuseIntensity",
        "u_diffuseColor",
        "fl_lightColor",
        "set_light_color_zero",
        "fl_diffuseCoef",
    ],
    codes: {
        fragment: {
            local: [
                `fl_lightColor += u_diffuseIntensity * fl_diffuseCoef * u_diffuseColor;`,
            ]
        },
    }
};