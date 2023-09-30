import { Geometry } from "./geometry.js";
import pcfg from "../util/parse_config.js";

export class MeshGeometry extends Geometry {

    static #default_config = {
        copy_indices: true,
    };

    /** @type {Uint16Array} */
    indices = null;
    /** @type {Number} */
    num_indices = -1;

    /**
     * @param {Float32Array | Array<Number>} vertices
     * @param {Uint16Array | Array<Number>} indices
     * @param {{
     *   copy_vertices: boolean,
     *   copy_indices: boolean,
     *   scale: [number, number, number],
     *   rotate: number,
     *   normal: [number, number, number],
     *   center: [number, number, number]
     * }} config
     */
    constructor(vertices, indices, config = {}) {
        super(vertices, config);

        //const indices = [];
		//const vertices = [];
		//const normals = [];
		//const uvs = [];

        const copy_indices = pcfg(config.copy_indices, MeshGeometry.#default_config.copy_indices);
        if (copy_indices)
            indices = new Uint16Array(indices);
        if (!(indices instanceof Uint16Array))
            throw new TypeError("indices must be Uint16Array.");
        this.indices = indices;
        this.num_indices = this.indices.length;
    }

    getIndices = () => {
        return this.indices;
    };

    getNumberOfIndices = () => {
        return this.num_indices;
    };

}
