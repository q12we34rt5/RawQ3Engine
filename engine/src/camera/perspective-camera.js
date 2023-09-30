import { Camera } from "./camera.js";
import { mat4 } from "../../lib/gl-matrix/src/index.js";

export class PerspectiveCamera extends Camera {

    projection = {
        matrix: mat4.create()
    };

    fov = 50;
    aspect = 1;
    near = 0.1;
    far = 2000;

    /**
     * @param {number} fov
     * @param {number} aspect
     * @param {number} near
     * @param {number} far
     * @param {{
     *   scale: [number, number, number],
     *   rotate: number,
     *   normal: [number, number, number],
     *   center: [number, number, number]
     * }} config 
     */
    constructor(fov = 50, aspect = 1, near = 0.1, far = 2000, config = {}) {
        super(config);
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }

    calculateProjectionMatrix = () => {
        mat4.perspective(this.projection.matrix, this.fov, this.aspect, this.near, this.far);
    };

    getProjectionMatrix = () => {
        return this.projection.matrix;
    };

}
