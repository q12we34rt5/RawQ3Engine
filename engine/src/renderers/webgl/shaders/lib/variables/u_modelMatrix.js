import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.uniform,
            dtype: DType.mat4,
            name: "u_modelMatrix",
        },
    ],
    codes: {
        vertex: {
            global: `uniform mat4 u_modelMatrix;`,
        },
    },
};