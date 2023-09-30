import { Material } from "./material";
import pcfg from "../util/parse_config.js";

export class VertexColorMaterial extends Material {

    static #default_config = {
        copy_colors: true
    };

    /**
     * Vertices color.
     * @type {Float32Array}
     */
    colors = null;

    /**
     * @param {Float32Array | Array<Number>} colors
     * @param {{
     *   copy_colors: boolean
     * }} config
     */
    constructor(colors, config) {
        const copy_colors = pcfg(config.copy_colors, VertexColorMaterial.#default_config.copy_colors);
        if (copy_colors)
            colors = new Float32Array(colors);
        if (!(colors instanceof Float32Array))
            throw new TypeError("colors must be Float32Array.");
        this.colors = colors;
    }

}
