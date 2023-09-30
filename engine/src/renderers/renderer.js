import { EventDispatcher } from "../core/event-dispatcher";

/**
 * @interface
 */
export class Renderer extends EventDispatcher {

    constructor() { }

    render(scene, camera) { /* TODO */ }

}
