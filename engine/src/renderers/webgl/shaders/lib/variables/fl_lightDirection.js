import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "v_position",
        "u_pointLightLocation",
    ],
    codes: {
        fragment: {
            local: `vec3 fl_lightDirection = normalize(u_pointLightLocation - v_position);`,
        },
    },
};