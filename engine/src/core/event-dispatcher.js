export class EventDispatcher {

    /**
     * @param {string} type 
     * @param {(event: any, type: string, this: object) => void} listener 
     */
    addEventListener(type, listener) {
        if (this.events === undefined)
            this.events = {};
        const events = this.events;
        if (events[type] === undefined)
            events[type] = [];
        if (events[type].indexOf(listener) === -1)
            events[type].push(listener);
    }

    /**
     * @param {string} type 
     * @param {(event: any, type: string, this: object) => void} listener 
     */
    hasEventListener(type, listener) {
        const events = this.events;
        if (events === undefined)
            return false;
        return events[type] !== undefined && events.indexOf(listener) !== -1;
    }

    /**
     * @param {string} type 
     * @param {(event: any, type: string, this: object) => void} listener 
     */
    removeEventListener(type, listener) {
        const events = this.events;
        if (events === undefined)
            return;
        const callbackArray = events[type];
        if (callbackArray !== undefined) {
            const index = callbackArray.indexOf(listener);
            if (index !== -1)
                callbackArray.splice(index, 1);
        }
    }

    /**
     * @param {string} type 
     * @param {any} event 
     */
    dispatchEvent(type, event) {
        const events = this.events;
        if (events === undefined)
            return;
        const callbackArray = events[type];
        if (callbackArray !== undefined) {
            const callbackArrayCopy = callbackArray.slice();
            for (let i = 0; i < callbackArrayCopy.length; i++)
                callbackArrayCopy[i](event, type, this);
        }
    }

}