import { EventDispatcher } from "../core/event-dispatcher.js";
import pcfg from "../util/parse_config.js";
import { mat4, vec3 } from "../../lib/gl-matrix/src/index.js";

export class Geometry extends EventDispatcher {

    static #empty_vertices = new Float32Array([]);
    static #default_config = {
        copy_vertices: true,
        scale: [1.0, 1.0, 1.0],
        rotate: 0.0,
        normal: [0.0, 0.0, 1.0],
        center: [0.0, 0.0, 0.0],
    };

    static #zero_vec = vec3.create();
    static #z_univec = new Float32Array([0.0, 0.0, 1.0]);

    /**
     * Vertices data array.
     * @type {Float32Array}
     */
    vertices = null;
    /**
     * Number of vertices.
     * @type {Number}
     */
    num_vertices = -1;

    /**
     * @param {Float32Array | Array<Number>} vertices 
     * @param {{
     *   copy_vertices: boolean,
     *   scale: [number, number, number],
     *   rotate: number,
     *   normal: [number, number, number],
     *   center: [number, number, number]
     * }} config 
     */
    constructor(vertices = Geometry.#empty_vertices, config = {}) {
        super();
        const copy_vertices = pcfg(config.copy_vertices, Geometry.#default_config.scale);
        const scale = pcfg(config.scale, Geometry.#default_config.scale);
        const rotate = pcfg(config.rotate, Geometry.#default_config.rotate);
        const normal = pcfg(config.normal, Geometry.#default_config.normal);
        const center = pcfg(config.center, Geometry.#default_config.center);
        if (copy_vertices)
            vertices = new Float32Array(vertices);
        if (!(vertices instanceof Float32Array))
            throw new TypeError("vertices must be Float32Array.");
        // initialize vertices
        this.num_vertices = Math.floor(vertices.length / 3);
        this.vertices = new Float32Array(vertices.buffer, 0, this.num_vertices * 3);
        // transform vertices
        this.setModelCenter(center);
        this.setModelNormal(normal);
        this.setModelRotate(rotate);
        this.setModelScale(scale);
    }

    processVertices = (callback, begin = 0, end = this.num_vertices) => {
        for (let i = begin; i < end; i++) {
            const vertex = new Float32Array(this.vertices.buffer,
                i * 3 * Float32Array.BYTES_PER_ELEMENT, 3);
            callback(vertex, i);
        }
    };

    setModelScale = (scale) => {
        const scale_x = scale[0];
        const scale_y = scale[1];
        const scale_z = scale[2];
        this.processVertices(function (v) {
            v[0] /= scale_x;
            v[1] /= scale_y;
            v[2] /= scale_z;
        });
    };

    setModelRotate = (angle) => {
        const rotate_angle = -angle;
        this.processVertices(function (v) {
            vec3.rotateZ(v, v, Geometry.#zero_vec, rotate_angle);
        });
    };

    setModelNormal = (normal) => {
        const angle = vec3.angle(normal, Geometry.#z_univec);
        const axis = vec3.cross(vec3.create(), normal, Geometry.#z_univec)
        const rotate_mat = mat4.fromRotation(mat4.create(), angle, axis);
        if (!rotate_mat)
            return;
        this.processVertices(function (v) {
            vec3.transformMat4(v, v, rotate_mat);
        });
    };

    setModelCenter = (center) => {
        const offset_x = -center[0];
        const offset_y = -center[1];
        const offset_z = -center[2];
        this.processVertices(function (v) {
            v[0] += offset_x;
            v[1] += offset_y;
            v[2] += offset_z;
        });
    };

    getVertices = () => {
        return this.vertices;
    };

    getNumberOfVertices = () => {
        return this.num_vertices;
    };

}
