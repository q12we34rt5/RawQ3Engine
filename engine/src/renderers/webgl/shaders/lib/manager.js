import { config } from "./config.js";

class LibLoader {

    path = null;
    lib_list = new Map();

    constructor(path) {
        this.path = path;
    }

    /** @deprecated */
    _loadChunk(name) {
        return new Promise((resolve, reject) => {
            if (this.lib_list.has(name))
                resolve(this.lib_list.get(name));
            import(this.path + name + ".js").then(chunk => {
                chunk.default.name = name;
                this.lib_list.set(name, chunk.default);
                resolve(chunk.default);
            }).catch(function () {
                reject(new Error(`Failed to load chunk '${name}'.`));
            });
        });
    }

    async loadChunk(name) {
        if (this.lib_list.has(name))
            return this.lib_list.get(name);
        let chunk;
        try {
            chunk = await import(this.path + name + ".js");
        } catch (e) {
            throw new Error(`Failed to load chunk '${name}'.`, { cause: e });
        }
        chunk.default.name = name;
        this.lib_list.set(name, chunk.default);
        return chunk.default;
    }

}

export class LibManager {

    /** @type {Array<String>} */
    paths = null;
    /** @type {String} */
    default_path = null;
    /** @type {Array<LibLoader>} */
    libLoaders = [];

    constructor(paths = [], default_path = config.load_path) {
        this.paths = paths;
        this.default_path = default_path;
        this.default_path.forEach(path => this.libLoaders.push(new LibLoader(path)));
        this.paths.forEach(path => this.libLoaders.push(new LibLoader(path)));
    }

    /** @deprecated */
    _loadChunk(name) {
        return new Promise(async (resolve, reject) => {
            const results_length = this.libLoaders.length;
            const results = Array(results_length).fill();
            let count = 0;
            this.libLoaders.forEach(function (libLoader, index) {
                libLoader.loadChunk(name).then(function (chunk) {
                    results[index] = chunk;
                }, function () {
                    results[index] = null;
                }).finally(function () {
                    count++;
                    check();
                });
            });
            function check() {
                if (count != results_length)
                    return;
                for (let i = 0; i < results_length; i++)
                    if (results[i]) {
                        resolve(results[i]);
                        return;
                    }
                reject(new Error(`Failed to load chunk '${name}'.`));
            }
        });
    }

    async loadChunk(name) {
        const results_length = this.libLoaders.length;
        const wait_chunks = Array(results_length).fill();
        this.libLoaders.forEach(function (libLoader, index) {
            wait_chunks[index] = libLoader.loadChunk(name);
        });
        for (let i = 0; i < results_length; i++) {
            try {
                wait_chunks[i] = await wait_chunks[i];
            } catch (e) {
                wait_chunks[i] = null;
            }
        }
        for (let i = 0; i < results_length; i++) {
            if (wait_chunks[i])
                return wait_chunks[i];
        }
        throw new Error(`Failed to load chunk '${name}'.`);
    }

    loadChunks(names) {
        return new Promise(async (resolve, reject) => {
            const results = {};
            const total_count = names.length;
            let count = 0;
            names.forEach((name) => {
                this.loadChunk(name).then(function (chunk) {
                    results[name] = chunk;
                }).catch(console.warn).finally(function () {
                    count++;
                    check();
                });
            });
            function check() {
                if (count != total_count)
                    return;
                setTimeout(() => resolve(results), 1000);
            }
        });
    }

}

class DistanceCounter {

    onchange = [];
    distance = undefined;

    constructor(distance = undefined) {
        this.distance = distance;
    }

    setDistance(distance) {
        if (this.distance !== distance) {
            this.distance = distance;
            this.onchange.slice().forEach((callback) => {
                callback(this.distance);
            });
        }
    }

    addListener(callback, call = true) {
        if (callback instanceof Function) {
            this.removeListener(callback);
            this.onchange.push(callback);
            if (call)
                callback(this.distance);
        }
    }

    removeListener(callback) {
        const index = this.onchange.indexOf(callback);
        if (index != -1)
            this.onchange.splice(index, 1);
    }

}

export class RequireLoader {

    /** @type {LibManager} */
    libManager = null;
    prefetch_depth = 0;

    unfetct_count = 0;
    fetched_count = 0;

    fetch_failed = false;
    load_failed = false;

    fetch_finished = {
        promise: null,
        resolve: null,
        reject: null
    };

    constructor(libManager, prefetch_depth = 1) {
        this.prefetch_depth = prefetch_depth;
        this.libManager = libManager;
        this.reset();
    }

    reset() {
        this.unfetct_count = 0;
        this.fetched_count = 0;
        this.fetch_failed = false;
        this.load_failed = false;
        this.fetch_finished.promise = new Promise((resolve, reject) => {
            this.fetch_finished.resolve = resolve;
            this.fetch_finished.reject = reject;
        });
    }

    createNode(chunk, name = "root", distanceCounter = null) {
        const neighbors_count = chunk.requires ? chunk.requires.length : 0;
        this.unfetct_count += neighbors_count;
        this.fetched_count += 1;
        if (this.fetched_count - this.unfetct_count == 1)
            this.fetch_finished.resolve();
        const node = {
            name: name,
            chunk: chunk,
            neighbors: Array(neighbors_count).fill(null),
            parentDistanceCounter: distanceCounter,
            distanceCounter: new DistanceCounter(0),
            load_neighbor: index => {
                if (index < 0 || index >= neighbors_count) return;
                if (this.load_failed) return;
                const name = node.chunk.requires[index];
                node.neighbors[index] = this.libManager.loadChunk(name).then(chunk => {
                    if (this.fetch_failed || this.load_failed) return null;
                    const _node = this.createNode(chunk, name, node.distanceCounter);
                    return _node;
                }, e => {
                    this.fetch_finished.reject(e);
                    this.fetch_failed = true;
                    return null;
                });
            },
            get_neighbor: index => {
                if (node.neighbors[index] === null)
                    node.load_neighbor(index);
                return node.neighbors[index];
            },
            error_test_function: () => {
                if (this.fetch_failed || this.load_failed) {
                    node.destruct();
                }
            },
            destruct: () => {
                node.distanceCounter.removeListener(node.error_test_function);
                if (node.parentDistanceCounter) {
                    node.parentDistanceCounter.removeListener(node.distance_function);
                }
                for (let i = 0; i < node.neighbors.length; i++)
                    node.neighbors[i] = null;
            }
        };
        if (node.parentDistanceCounter) {
            node.distance_function = function (distance) {
                node.distanceCounter.setDistance(distance + 1);
            };
            node.parentDistanceCounter.addListener(node.distance_function);
        }
        node.distanceCounter.addListener(node.error_test_function);
        node.distanceCounter.addListener(distance => {
            if (distance >= this.prefetch_depth)
                return;
            for (let i = 0; i < node.neighbors.length; i++)
                if (node.neighbors[i] === null)
                    node.load_neighbor(i);
        });
        return node;
    }

    async loadChunk(chunk, callback) {
        this.reset();
        const root = this.createNode(chunk);
        const traverse = async (node) => {
            if (this.fetch_failed || this.load_failed)
                return;
            node.distanceCounter.setDistance(0);
            try {
                await callback(node.chunk, node.name);
            } catch (e) {
                this.load_failed = true;
                root.distanceCounter.setDistance(1);
                throw new Error("", { cause: e });
            }
            for (let i = node.neighbors.length - 1; i >= 0; i--) {
                const neighbor = await node.get_neighbor(i);
                await traverse(neighbor);
            }
            if (!this.fetch_failed && !this.load_failed)
                node.destruct();
        };
        for (let i = root.neighbors.length - 1; i >= 0; i--) {
            const neighbor = await root.get_neighbor(i);
            await traverse(neighbor);
        }
        root.distanceCounter.setDistance(1);
        if (!this.fetch_failed && !this.load_failed)
            root.destruct();
        await this.fetch_finished.promise;
    }

    async load(attr, callback) {
        if (typeof (attr) == "string")
            await this.loadChunk({ requires: [attr] }, callback);
        else if (attr instanceof Array)
            await this.loadChunk({ requires: attr }, callback);
        else
            await this.loadChunk(attr, callback);
    }

    async loadList(attr) {
        let chunk_list = [];
        await this.load(attr, chunk => chunk_list.unshift(chunk));
        return chunk_list;
    }

}

export class Chunk {

    /**
     * @param {Array<Chunk>} chunks 
     * @returns {Array<Chunk>}
     */
    static removeCommon(chunks) {
        const names = new Set();
        const chunk_list = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (names.has(chunk.name))
                continue;
            names.add(chunk.name);
            chunk_list.push(chunk);
        }
        return chunk_list;
    }

    /**
     * @param {Array<Chunk>} chunks 
     * @returns {Chunk}
     */
    static mergeChunks(chunks) {
        const names = new Set();
        const merged_chunk = {
            names: [],
            requires: [],
            inputs: [],
            codes: {
                vertex: {
                    global: [],
                    local: [],
                },
                fragment: {
                    global: [],
                    local: [],
                }
            }
        };
        // record names
        for (let i = 0; i < chunks.length; i++)
            if (chunks[i].name)
                names.add(chunks[i].name);
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            // names
            if (chunk.name)
                merged_chunk.names.push(chunk.name);
            else
                merged_chunk.names.push("unnamed");
            // requires
            if (chunk.requires)
                for (let j = 0; j < chunk.requires.length; j++)
                    if (!names.has(chunk.requires[j]))
                        merged_chunk.requires.push(chunk.requires[j]);
            // inputs
            if (chunk.inputs)
                merged_chunk.inputs.push(...chunk.inputs);
            // codes
            if (chunk.codes) {
                if (chunk.codes.vertex) {
                    if (chunk.codes.vertex.global) {
                        if (chunk.codes.vertex.global instanceof Array)
                            merged_chunk.codes.vertex.global.push(...chunk.codes.vertex.global);
                        else
                            merged_chunk.codes.vertex.global.push(chunk.codes.vertex.global);
                    }
                    if (chunk.codes.vertex.local) {
                        if (chunk.codes.vertex.local instanceof Array)
                            merged_chunk.codes.vertex.local.push(...chunk.codes.vertex.local);
                        else
                            merged_chunk.codes.vertex.local.push(chunk.codes.vertex.local);
                    }
                }
                if (chunk.codes.fragment) {
                    if (chunk.codes.fragment.global) {
                        if (chunk.codes.fragment.global instanceof Array)
                            merged_chunk.codes.fragment.global.push(...chunk.codes.fragment.global);
                        else
                            merged_chunk.codes.fragment.global.push(chunk.codes.fragment.global);
                    }
                    if (chunk.codes.fragment.local) {
                        if (chunk.codes.fragment.local instanceof Array)
                            merged_chunk.codes.fragment.local.push(...chunk.codes.fragment.local);
                        else
                            merged_chunk.codes.fragment.local.push(chunk.codes.fragment.local);
                    }
                }
            }
        }
        return merged_chunk;
    }

    static parseChunk(chunk) {
        let vertex_global = "";
        let vertex_local = "";
        let fragment_global = "";
        let fragment_local = "";
        if (chunk.codes) {
            if (chunk.codes.vertex) {
                if (chunk.codes.vertex.global) {
                    if (chunk.codes.vertex.global instanceof Array)
                        vertex_global = `${chunk.codes.vertex.global.join("\n")}\n`;
                    else
                        vertex_global = `${chunk.codes.vertex.global}\n`;
                }
                if (chunk.codes.vertex.local) {
                    if (chunk.codes.vertex.local instanceof Array)
                        vertex_local = `\n    ${chunk.codes.vertex.local.join("\n    ")}\n`;
                    else
                        vertex_local = `\n    ${chunk.codes.vertex.local}\n`;
                }
            }
            if (chunk.codes.fragment) {
                if (chunk.codes.fragment.global) {
                    if (chunk.codes.fragment.global instanceof Array)
                        fragment_global = `${chunk.codes.fragment.global.join("\n")}\n`;
                    else
                        fragment_global = `${chunk.codes.fragment.global}\n`;
                }
                if (chunk.codes.fragment.local) {
                    if (chunk.codes.fragment.local instanceof Array)
                        fragment_local = `\n    ${chunk.codes.fragment.local.join("\n    ")}\n`;
                    else
                        fragment_local = `\n    ${chunk.codes.fragment.local}\n`;
                }
            }
        }
        chunk.codes = {
            vertex: `${vertex_global}\nvoid main() {${vertex_local}}`,
            fragment: `${fragment_global}\nvoid main() {${fragment_local}}`,
        };
        return chunk;
    }

}



import { Var, Prefix, DType } from "./constants.js";
import { buildShaderProgram } from "../../../../screen/gl.js";



const glCanvas = document.createElement("canvas");
/** @type {WebGLRenderingContext} */
const gl = glCanvas.getContext("webgl");


const lm = new LibManager();
const rl = new RequireLoader(lm, 2);
try {
    const chunks = await rl.loadList([
        "begin",
        "use_texture",
        "use_normalMap",
        "use_ambient",
        "use_diffuse",
        "use_specular",
        "end",
    ]);
    console.log(chunks);
    const uni_chunks = Chunk.removeCommon(chunks);
    console.log(uni_chunks);
    const merge_chunk = Chunk.mergeChunks(uni_chunks);
    console.log(merge_chunk);
    const parsed_chunk = Chunk.parseChunk(merge_chunk);
    console.log(parsed_chunk);
    console.log(parsed_chunk.inputs);
    console.log(parsed_chunk.codes.vertex);
    console.log(parsed_chunk.codes.fragment);

    const program = buildShaderProgram(gl, [{
        type: gl.VERTEX_SHADER,
        code: parsed_chunk.codes.vertex
    }, {
        type: gl.FRAGMENT_SHADER,
        code: parsed_chunk.codes.fragment
    }]);

    console.log(program);
} catch (e) {
    console.warn(e);
}

function wait(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(function (callback) {
                callback(time);
            });
        }, time);
    });
}



/*
async function test2(c) {
    const lm = new LibManager([], "./test/");
    const rl = new RequireLoader(new LibManager([], "./test/"), 0);
    const chunk = await lm.loadChunk(c);
    await rl.load(chunk, async function (chunk, name) {
        //await wait((2 * Math.random()) | 0);
        console.log(name);
    });
    console.log("Finished.");
    /*
    rl.fetch_finished.promise.then(function () {
        console.log("Fetch finished.");
    }, function (e) {
        console.warn(e);
    });
    */
/*
}

const template = {
    requires: [
    ],
    inputs: [
        {
            prefix: undefined,
            dtype: undefined,
            name: undefined,
        },
    ],
    codes: {
        vertex: {
            global: undefined,
            local: undefined,
        },
        fragment: {
            global: undefined,
            local: undefined,
        },
    },
};

*/