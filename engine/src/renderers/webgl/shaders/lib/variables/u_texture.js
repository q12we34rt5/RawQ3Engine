import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.uniform,
            dtype: DType.sampler2D,
            name: "u_texture",
        },
    ],
    codes: {
        fragment: {
            global: `uniform sampler2D u_texture;`,
        },
    },
};