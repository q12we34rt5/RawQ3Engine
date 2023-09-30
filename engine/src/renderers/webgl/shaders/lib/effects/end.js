import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "vl_position",
        "fl_color",
        "fl_lightColor",
    ],
    codes: {
        vertex: {
            local: `gl_Position = vl_position;`
        },
        fragment: {
            local: `gl_FragColor = vec4(fl_lightColor * fl_color.rgb, fl_color.a);`
        },
    }
};