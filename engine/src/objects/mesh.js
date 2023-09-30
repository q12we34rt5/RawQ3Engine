import { Q3Object } from "./object.js";
import { Geometry } from "../geometries/geometry.js";
import { Material } from "../materials/material.js";
import pcfg from "../util/parse_config.js";

export class Mesh extends Q3Object {

    /**
     * @type {Geometry}
     */
    geometry = null;
    /**
     * @type {Material}
     */
    material = null;

    /**
     * @param {Geometry} geometry
     * @param {Material} material
     * @param {{
     *   scale: [number, number, number],
     *   rotate: number,
     *   normal: [number, number, number],
     *   center: [number, number, number]
     * }} config 
     */
    constructor(
        geometry = new Geometry(),
        material = new Material(),
        config = {}) {
        super(config);
        this.geometry = geometry;
        this.material = material;
    }

}

const mesh = new Mesh();

console.log(mesh);
