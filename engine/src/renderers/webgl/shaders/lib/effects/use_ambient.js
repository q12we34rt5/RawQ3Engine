import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "u_ambientIntensity",
        "u_ambientColor",
        "fl_lightColor",
        "set_light_color_zero",
    ],
    codes: {
        fragment: {
            local: [
                `fl_lightColor += u_ambientIntensity * u_ambientColor;`,
            ]
        },
    }
};