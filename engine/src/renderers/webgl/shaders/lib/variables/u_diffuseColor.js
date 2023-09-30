import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.uniform,
            dtype: DType.vec3,
            name: "u_diffuseColor",
        },
    ],
    codes: {
        fragment: {
            global: `uniform vec3 u_diffuseColor;`,
        },
    },
};