import { VerticesTransformation } from "../core/object.js";
import { mat3, vec3 } from "../lib/gl-matrix/src/index.js";

export class Graphic {

    static TYPE = {
        CONTAINER: 0b00000001,
        S_POLYGON: 0b00000010,
        POLYGON: 0b00000100,
        TEXTURE: 0b00001000,
    };

    // Graphic properties
    properties = {
        type: Graphic.TYPE.CONTAINER,
        drawable: false
    };

    // member variables

    data = {
        cs: null,
        texcoord: null,
        colors: null,
        color: null,
        visible: false,
    }

    set z_index(z) {
        this.data.z = z;
        if (this.event.zIndexChange)
            this.event.zIndexChange(this)
        return this.data.z;
    }
    get z_index() {
        return this.data.z;
    }

    parent = null;
    childList = [];

    constructor(config = {}) {
        if (config)
            this.data.cs = new VerticesTransformation([], config);
    }

    addChild = (graphic, relative = true) => {
        if (this.childList.indexOf(graphic) != -1)
            return false;
        this.childList.push(graphic);
        if (graphic.parent)
            graphic.parent.removeChild(graphic);
        graphic.parent = this;
        return true;
    };

    removeChild = (graphic) => {
        const index = this.childList.indexOf(graphic);
        if (index == -1)
            return false;
        this.childList.splice(index, 1);
        return true;
    };

    enumerateGraphics = (callback) => {
        callback(this);
        this.childList.forEach(item => item.enumerateGraphics(callback));
    };

    // virtual functions
    init = null;
    update = null;

    // event handler
    events = {
        zIndexChange: null
    };

}

export class SingleColorPolygon extends Graphic {

    constructor(vertices, color, config = {}) {
        super(null);
        this.data.cs = new VerticesTransformation(vertices, config);
        this.properties.type |= Graphic.TYPE.S_POLYGON;
        this.properties.drawable = true;
        this.data.color = color;
    }

}

export class Polygon extends Graphic {

    constructor(vertices, colors, config = {}) {
        super(null);
        this.data.cs = new VerticesTransformation(vertices, config);
        this.properties.type |= Graphic.TYPE.POLYGON;
        this.properties.drawable = true;
        this.data.colors = colors;
    }

}

export class TexturePolygon extends Polygon {
}

class Point extends Graphic {

}

// console.log(new Polygon([], []));

