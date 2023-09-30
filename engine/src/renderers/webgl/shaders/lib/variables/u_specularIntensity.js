import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.uniform,
            dtype: DType.float,
            name: "u_specularIntensity",
        },
    ],
    codes: {
        fragment: {
            global: `uniform float u_specularIntensity;`,
        },
    },
};