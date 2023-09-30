import { Material } from "./material";
import pcfg from "../util/parse_config.js";

export class SingleColorMaterial extends Material {

    static #default_config = {
        copy_color: true
    };

    /**
     * Vertices color.
     * @type {Float32Array}
     */
    color = null;

    /**
     * @param {Float32Array | Array<Number>} colors
     * @param {{
     *   copy_color: boolean
     * }} config
     */
    constructor(color, config) {
        const copy_color = pcfg(config.copy_color, SingleColorMaterial.#default_config.copy_color);
        if (copy_color)
            color = new Float32Array(color);
        if (!(color instanceof Float32Array))
            throw new TypeError("color must be Float32Array.");
        this.color = color;
    }

}
