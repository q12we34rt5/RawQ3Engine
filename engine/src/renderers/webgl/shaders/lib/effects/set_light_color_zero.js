import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "fl_lightColor",
    ],
    codes: {
        fragment: {
            local: [
                `fl_lightColor = vec3(0.0, 0.0, 0.0);`,
            ]
        },
    }
};