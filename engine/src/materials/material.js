import { EventDispatcher } from "../core/event-dispatcher.js";
import * as CS from "../constants.js";

function cvt(value = null, enable = false, changed = true) {
    return {
        value: value,
        enable: enable,
        changed: changed,
    };
}

function setValue(dest, value, auto_enable) {
    if (value === undefined)
        value = null;
    if (dest.value === value)
        return;
    dest.value = value;
    if (dest.value === null)
        dest.enable = false;
    else if (auto_enable)
        dest.enable = true;
    dest.changed = true;
}

function setEnable(dest, enable) {
    if (enable != true || enable != false)
        return;
    if (dest.value === null)
        return;
    dest.enable = enable;
}

export class Material extends EventDispatcher {

    visible = cvt(true, true, true);

    opacity = cvt(1, false, true);
    color = cvt(null, false, true);
    vertex_colors = cvt(null, false, true);
    specular = cvt(0, false, true);
    roughness = cvt(0, false, true);
    metallic = cvt(0, false, true);

    uv_map = cvt(null, false, true);
    normal_map = cvt(null, false, true);
    specular_map = cvt(null, false, true);
    roughness_map = cvt(null, false, true);
    metallic_map = cvt(null, false, true);

    extra_data = {};
    changed = true;

    constructor(parameters) {
        super();
        this.setValues(parameters);
    }

    setValues(values, auto_enable = true) {
        for (const key in values) {
            if (!(key in this)) {
                console.warn(`Unknown property: '${key}'.`);
                continue;
            }
            const new_value = values[key];
            setValue(this[key], new_value, auto_enable);
            this.changed = true;
        }
    }

    setEnables(values) {
        for (const key in values) {
            if (!(key in this)) {
                console.warn(`Unknown property: '${key}'.`);
                continue;
            }
            setEnable(this[key], values[key]);
        }
    }
}
