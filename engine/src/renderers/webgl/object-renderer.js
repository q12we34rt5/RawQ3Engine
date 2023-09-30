import { EventDispatcher } from "../../core/event-dispatcher.js";

/* Format:
 * 
 * attributes | uniforms = {
 *     some_property: { value: ..., changed: ... }
 * }
 * 
 */

export class ObjectRenderer extends EventDispatcher {

    attributes = {};
    uniforms = {};

    constructor(datapack) {

    }

}
