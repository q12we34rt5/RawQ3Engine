import { Q3Object } from "../objects/object.js";
import { mat4 } from "../../lib/gl-matrix/src/index.js";

export class Camera extends Q3Object {

    view = {
        matrix: mat4.create()
    };

    /**
     * @param {{
     *   scale: [number, number, number],
     *   rotate: number,
     *   normal: [number, number, number],
     *   center: [number, number, number]
     * }} config 
     */
    constructor(config = {}) {
        super(config);
    }

    calculateViewMatrix = () => {
        this.calculateModelMatrix();
        mat4.invert(this.view.matrix, this.model.matrix);
    };

    getViewMatrix = () => {
        return this.view.matrix;
    };

}
