import { Var, Prefix, DType } from "../constants.js";

export default {
    requires: [
        "v_texcoord",
        "u_texture",
        "fl_color",
    ],
    codes: {
        fragment: {
            local: [
                `fl_color = texture2D(u_texture, v_texcoord);`,
            ]
        },
    }
};