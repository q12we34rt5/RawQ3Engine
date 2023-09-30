import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.attribute,
            dtype: DType.vec3,
            name: "a_position",
        },
    ],
    codes: {
        vertex: {
            global: `attribute vec3 a_position;`,
        },
    },
};