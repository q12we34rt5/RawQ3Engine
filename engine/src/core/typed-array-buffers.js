import { EventDispatcher } from "./event-dispatcher.js";

export class TypedArrayBuffer extends EventDispatcher {

    changed = true;

}

function argumentCheck(array, copy, ArrayType) {
    const isArray = array instanceof Array;
    if (!isArray && !(array instanceof ArrayType)) throw Error(`'array' must be ${ArrayType.name}.`);
    if (isArray && !copy) throw Error("Can not use untyped Array instance while uncopy.");
}

export class Int8ArrayBuffer extends TypedArrayBuffer {

    /** @type {Int8Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Int8Array);
        super();
        this.array = array;
        if (copy) this.array = new Int8Array(this.array);
    }

}

export class Uint8ArrayBuffer extends TypedArrayBuffer {

    /** @type {Uint8Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Uint8Array);
        super();
        this.array = array;
        if (copy) this.array = new Uint8Array(this.array);
    }

}

export class Uint8ClampedArrayBuffer extends TypedArrayBuffer {

    /** @type {Uint8ClampedArray} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Uint8ClampedArray);
        super();
        this.array = array;
        if (copy) this.array = new Uint8ClampedArray(this.array);
    }

}

export class Int16ArrayBuffer extends TypedArrayBuffer {

    /** @type {Int16Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Int16Array);
        super();
        this.array = array;
        if (copy) this.array = new Int16Array(this.array);
    }

}

export class Uint16ArrayBuffer extends TypedArrayBuffer {

    /** @type {Uint16Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Uint16Array);
        super();
        this.array = array;
        if (copy) this.array = new Uint16Array(this.array);
    }

}

export class Int32ArrayBuffer extends TypedArrayBuffer {

    /** @type {Int32Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Int32Array);
        super();
        this.array = array;
        if (copy) this.array = new Int32Array(this.array);
    }

}

export class Uint32ArrayBuffer extends TypedArrayBuffer {

    /** @type {Uint32Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Uint32Array);
        super();
        this.array = array;
        if (copy) this.array = new Uint32Array(this.array);
    }

}

export class Float32ArrayBuffer extends TypedArrayBuffer {

    /** @type {Float32Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Float32Array);
        super();
        this.array = array;
        if (copy) this.array = new Float32Array(this.array);
    }

}

export class Float64ArrayBuffer extends TypedArrayBuffer {

    /** @type {Float64Array} */
    array = null;

    constructor(array = null, copy = true) {
        argumentCheck(array, copy, Float64Array);
        super();
        this.array = array;
        if (copy) this.array = new Float64Array(this.array);
    }

}
