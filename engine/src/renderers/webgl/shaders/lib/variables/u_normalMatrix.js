import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.uniform,
            dtype: DType.mat4,
            name: "u_normalMatrix",
        },
    ],
    codes: {
        vertex: {
            global: `uniform mat4 u_normalMatrix;`,
        },
    },
};