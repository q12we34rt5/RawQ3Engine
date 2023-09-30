import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.attribute,
            dtype: DType.vec2,
            name: "a_texcoord",
        },
    ],
    codes: {
        vertex: {
            global: `attribute vec2 a_texcoord;`
        },
    }
};