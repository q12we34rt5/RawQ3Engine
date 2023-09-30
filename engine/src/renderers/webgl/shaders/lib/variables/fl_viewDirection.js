import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "v_position",
        "u_viewPosition",
    ],
    codes: {
        fragment: {
            local: `vec3 fl_viewDirection = normalize(u_viewPosition - v_position);`,
        },
    },
};