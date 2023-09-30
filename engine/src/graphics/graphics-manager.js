export class GraphicsManager {

    graphics = Array();

    constructor() {}

    addGraphics = (graphic) => {
        let success = false;
        graphic.enumerateGraphics((graphic) => {
            if (this.graphics.indexOf(graphic) == -1) {
                this.graphics.push(graphic);
                success = true;
            }
        });
        this.graphics.sort((a, b) => a.z_index - b.z_index);
        return success;
    };

    removeGraphics = (graphic) => {
        let success = false;
        graphic.enumerateGraphics((graphic) => {
            const index = this.graphics.indexOf(graphic);
            if (index != -1) {
                this.graphics.splice(index, 1);
                success = true;
            }
        });
        return success;
    };

    enumerateGraphics = (callback) => {
        this.graphics.forEach(graphic => callback(graphic));
    };

}