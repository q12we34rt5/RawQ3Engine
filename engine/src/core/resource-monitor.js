import { EventDispatcher } from "./event-dispatcher.js";

export class ResourceMonitor extends EventDispatcher {

    static getUpdateInfo() {

    }

    resourcesInfo = new Map();

    updateResource(resource) {
        const info = ResourceMonitor.getUpdateInfo();
        this.resourcesInfo.set(resource, info);
    }

    deleteResource(resource) {
        if (this.resourcesInfo.has(resource))
            this.resourcesInfo.delete(resource);
    }

}

export class ResourceWrapper extends EventDispatcher {

    resourceMonitor = null;

    resource = null;
    available = false;

    constructor(resourceMonitor = null) {
        this.resourceMonitor = resourceMonitor;
    }

    get() {
        if (!this.available)
            this.construct();
        return this.resource;
    }

    constructResuorce() {
        if (this.resourceMonitor) {
            this.resourceMonitor.updateResource(this);
        }
        this.construct();
    }

    releaseResuorce() {
        if (this.resourceMonitor) {
            this.resourceMonitor.deleteResource(this);
        }
        this.release();
    }

    /** @abstract */
    construct() { }

    /** @abstract */
    release() { }

}