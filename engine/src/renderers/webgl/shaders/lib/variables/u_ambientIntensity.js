import { Var, Prefix, DType } from "../constants.js";

export default {
    inputs: [
        {
            prefix: Prefix.uniform,
            dtype: DType.float,
            name: "u_ambientIntensity",
        },
    ],
    codes: {
        fragment: {
            global: `uniform float u_ambientIntensity;`,
        },
    },
};