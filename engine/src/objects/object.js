import { EventDispatcher } from "../core/event-dispatcher.js";
import pcfg from "../util/parse_config.js";
import { mat4, vec3 } from "../../lib/gl-matrix/src/index.js";

export class Q3Object extends EventDispatcher {

    static #default_config = {
        scale: [1.0, 1.0, 1.0],
        rotate: 0.0,
        normal: [0.0, 0.0, 1.0],
        center: [0.0, 0.0, 0.0],
    };

    static #zero_vec = vec3.create();
    static #z_univec = new Float32Array([0.0, 0.0, 1.0]);

    scale = {
        values: new Float32Array(Q3Object.#default_config.scale),
        matrix: mat4.create()
    };
    rotate = {
        angle: Q3Object.#default_config.rotate,
        matrix: mat4.create()
    };
    normal = {
        vector: new Float32Array(Q3Object.#default_config.normal),
        matrix: mat4.create()
    };
    translate = {
        vector: new Float32Array(Q3Object.#default_config.center),
        matrix: mat4.create()
    };
    model = {
        state: false,
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
        super();
        const scale = pcfg(config.scale, Q3Object.#default_config.scale);
        const rotate = pcfg(config.rotate, Q3Object.#default_config.rotate);
        const normal = pcfg(config.normal, Q3Object.#default_config.normal);
        const center = pcfg(config.center, Q3Object.#default_config.center);
        // set transformations
        this.setTranslate(center, false);
        this.setNormal(normal, false);
        this.setRotate(rotate, false);
        this.setScale(scale, false);
        // calculate model matrix
        this.calculateModelMatrix();
    }

    calculateModelMatrix = () => {
        if (this.model.state)
            return;
        const scale = this.scale.matrix;
        const rotate = this.rotate.matrix;
        const normal = this.normal.matrix;
        const translate = this.translate.matrix;
        mat4.multiply(this.model.matrix, rotate, scale);
        mat4.multiply(this.model.matrix, normal, this.model.matrix);
        mat4.multiply(this.model.matrix, translate, this.model.matrix);
        this.model.state = true;
    };

    setScale = (scale, calc_model = true) => {
        this.model.state = false;
        this.scale.values[0] = scale[0];
        this.scale.values[1] = scale[1];
        this.scale.values[2] = scale[2];
        mat4.fromScaling(this.scale.matrix, this.scale.values);
        if (calc_model)
            this.calculateModelMatrix();
    };

    setRotate = (angle, calc_model = true) => {
        this.model.state = false;
        this.angle = angle;
        mat4.fromZRotation(this.rotate.matrix, angle);
        if (calc_model)
            this.calculateModelMatrix();
    };

    setNormal = (normal, calc_model = true) => {
        this.model.state = false;
        const bk_x = this.normal.vector[0],
            bk_y = this.normal.vector[1],
            bk_z = this.normal.vector[2];
        const axis = vec3.cross(this.normal.vector, Q3Object.#z_univec, normal);
        const angle = vec3.angle(normal, Q3Object.#z_univec);
        if (!mat4.fromRotation(this.normal.matrix, angle, axis)) {
            this.model.state = true;
            this.normal.vector[0] = bk_x;
            this.normal.vector[1] = bk_y;
            this.normal.vector[2] = bk_z;
            return;
        }
        this.normal.vector[0] = normal[0];
        this.normal.vector[1] = normal[1];
        this.normal.vector[2] = normal[2];
        vec3.normalize(this.normal.vector, this.normal.vector);
        if (calc_model)
            this.calculateModelMatrix();
    };

    setTranslate = (translate, calc_model = true) => {
        this.model.state = false;
        this.translate.vector[0] = translate[0];
        this.translate.vector[1] = translate[1];
        this.translate.vector[2] = translate[2];
        mat4.fromTranslation(this.translate.matrix, this.translate.vector);
        if (calc_model)
            this.calculateModelMatrix();
    };

    getScale = () => {
        return this.scale.values;
    };

    getScaleMatrix = () => {
        return this.scale.matrix;
    };

    getRotate = () => {
        return this.rotate.angle;
    };

    getRotateMatrix = () => {
        return this.rotate.matrix;
    };

    getNormal = () => {
        return this.normal.vector;
    };

    getNormalMatrix = () => {
        return this.normal.matrix;
    };

    getTranslate = () => {
        return this.translate.vector;
    };

    getTranslateMatrix = () => {
        return this.translate.matrix;
    };

    getModelMatrixState = () => {
        return this.model.state;
    };

    getModelMatrix = () => {
        return this.model.matrix;
    };

}

export class ModelTransformation extends Q3Object {

    static #empty_vertices = new Float32Array([]);

    parent = null;
    childList = [];

    /**
     * @param {Float32Array} verticeㄝs 
     * @param {{
     *   scale: [number, number, number],
     *   rotate: number,
     *   normal: [number, number, number],
     *   center: [number, number, number]
     * }} config 
     */
    constructor(vertices = ModelTransformation.#empty_vertices, config = {}) {
        super(vertices, config);
    }

    addChild = (model, relative = true) => {
        if (this.childList.indexOf(model) != -1)
            return false;
        this.childList.push(model);
        if (model.parent)
            model.parent.removeChild(model);
        model.parent = this;
        return true;
    };

    removeChild = (model) => {
        const index = this.childList.indexOf(model);
        if (index == -1)
            return false;
        this.childList.splice(index, 1);
        return true;
    };

    enumerateModels = (callback) => {
        callback(this);
        this.childList.forEach(item => item.enumerateModels(callback));
    };

}

const mt = new ModelTransformation();

console.log(mt);
