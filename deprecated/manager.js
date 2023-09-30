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
            throw new Error(`Failed to load chunk '${name}'.`);
        }
        this.lib_list.set(name, chunk.default);
        return chunk.default;
    }

}

export const libLoader = new LibLoader();

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
        this.libLoaders.push(new LibLoader(this.default_path));
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
                }).catch(function () {
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
        wait_chunks.forEach(async function (promise, index) {
            try {
                wait_chunks[index] = await promise;
            } catch (e) {
                wait_chunks[index] = null;
            }
        });
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

const libManager = new LibManager(["./hihihi/"]);

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

const root = new DistanceCounter(10);
let prev = root;
for (let i = 0; i < 10; i++) {
    const child = new DistanceCounter();
    prev.addListener(function (distance) {
        console.log(distance);
        child.setDistance(distance - 1);
    }, false);
    prev = child;
}

root.setDistance(20);

class UniqueNumberGenerator {

    _value = 0;

    get value() {
        return this._value++;
    }

}

const cr = new UniqueNumberGenerator();
const de = new UniqueNumberGenerator();

class RequireLoader {

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
        const uv = cr.value;
        console.log(`CREATE ${uv} ${name}`);
        const neighbors_count = chunk.requires ? chunk.requires.length : 0;
        this.unfetct_count += neighbors_count;
        this.fetched_count += 1;
        if (this.fetched_count - this.unfetct_count == 1) {
            this.fetch_finished.resolve();
            console.log("END");
        }
        //console.log(`UF: ${this.unfetct_count}`);
        //console.log(`F: ${this.fetched_count}`);
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
                    console.log("Error", name);
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
                console.log(`DESTRUCT ${de.value} ${uv}`);
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
    };

    /* TODO: Handling exceptions */

    async load(chunk, callback) {
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
                throw e;
            }
            for (let i = 0; i < node.neighbors.length; i++) {
                const neighbor = await node.get_neighbor(i);
                await traverse(neighbor);
            }
            if (!this.fetch_failed && !this.load_failed)
                node.destruct();
            /* TODO: destruct */
        };
        for (let i = 0; i < root.neighbors.length; i++) {
            const neighbor = await root.get_neighbor(i);
            await traverse(neighbor);
            /* TODO: destruct */
        }
        await wait(1000);
        root.distanceCounter.setDistance(1);
        if (!this.fetch_failed && !this.load_failed)
            node.destruct();
        /* TODO: destruct */
        await this.fetch_finished.promise;
    }

    prefetchRequires(chunk, dc = new DistanceCounter(0)) {
        const child_dc = new DistanceCounter();
        dc.addListener(function (distance) {
            child_dc.setDistance(distance + 1);
        });
        if (chunk.requires === undefined) {
            return {
                chunk: chunk,
                neighbors: [],
                distanceCounter: dc
            };
        }
        const neighbors = Array(chunk.requires.length).fill();
        for (let i = 0; i < chunk.requires.length; i++) {

            neighbors[i] = new Promise((resolve, reject) => {

                const name = chunk.requires[i];

                const uv = ung.value;

                const onDistanceChange = (distance) => {
                    if (distance > this.prefetch_depth)
                        return;
                    dc.removeListener(onDistanceChange);
                    console.warn(`U${uv}`, `Fetch '${name}'! D = ${distance}`);
                    this.libManager.loadChunk(name).then(async (chunk) => {
                        //await wait(100);
                        console.warn(`U${uv}`, `'${name}' fetched! with distance = ${distance}`);
                        const neighbor = this.prefetchRequires(chunk, child_dc);
                        resolve(neighbor);
                    });
                };

                dc.addListener(onDistanceChange);

            });
        }
        return {
            chunk: chunk,
            neighbors: neighbors,
            distanceCounter: dc
        };
    }

}
async function test1() {
    const lm = new LibManager([], "./test/");
    const rl = new RequireLoader(new LibManager([], "./test/"), 1);
    const chunk = await lm.loadChunk("a");
    const tree = rl.prefetchRequires(chunk);
    console.log(tree);

    await wait(1000);
    tree.distanceCounter.setDistance(0);
    await wait(1000);
    tree.distanceCounter.setDistance(-1);

    await wait(1000);
    tree.distanceCounter.setDistance(-2);

    await wait(1000);
    tree.distanceCounter.setDistance(-3);
}

async function test2() {
    const lm = new LibManager([], "./test/");
    const rl = new RequireLoader(new LibManager([], "./test/"), 5);
    const chunk = await lm.loadChunk("a");
    rl.load(chunk, async function (chunk, name) {
        await wait((100 * Math.random()) | 0);
        throw new Error("HIHI");
        console.log(name);
    }).then(console.log, console.warn);
    rl.fetch_finished.promise.then(function () {
        console.log("Fetch finished.");
    }, function (e) {
        console.warn(e);
    });
    rl.load_finished.promise.then(function () {
        console.log("Load finished.");
    }, function (e) {
        console.warn(e);
    });
    // const root = rl.createNode(chunk);
    /*
    setTimeout(() => {
        root.distanceCounter.setDistance(-1);
        root.get_neighbor(100);
        console.log(root);
    }, 500);
    */
    /*
    const tree = rl.prefetchRequires(chunk);
    console.log(tree);

    let name = "a";
    async function trav(name, node, callback) {
        await wait(1000);
        node.distanceCounter.setDistance(0);
        callback(name, node.chunk);
        if (node.chunk.requires === undefined)
            return;
        for (let i = 0; i < node.neighbors.length; i++)
            await trav(node.chunk.requires[i], await node.neighbors[i], callback);
    }
    trav(name, tree, function (name, chunk) {
        console.log(name, "=========================");
    });
    */

}

test2();


// console.log(libManager.loadChunks(["a_position", "a_texcoord"]).then(console.log).catch(console.warn));

// tree = (await import("./lib/manager.js")).default;

class Chunk {

    mergeChunks(chunks) {

    }

}

class Parser {

    libManager = null;

    constructor(use_libs = [], default_lib = config.load_path) {
        this.use_libs = use_libs;
        this.default_lib = default_lib;
        this.libManager = new LibManager(use_libs, default_lib);
    }

    loadRequires(chunk) {
        return new Promise((resolve, reject) => {
            if (chunk.requires === undefined)
                resolve([]);
            const requires = Array(chunk.requires.length).fill();
            let count = 0;
            for (let i = chunk.requires.length - 1; i >= 0; i--) {
                const name = chunk.requires[i];
                this.libManager.loadChunk(name).then((chunk) => {
                    this.loadRequires(chunk).then(function (chunks) {
                        chunks.push({ name: name, chunk: chunk });
                        requires[i] = chunks;
                        count++;
                        check();
                    }).catch(function (e) {
                        reject(e);
                    });
                }).catch(function (e) {
                    reject(e);
                });
            }
            function check() {
                if (count != chunk.requires.length)
                    return;
                const require_chunks = [];
                requires.forEach(function (chunks) {
                    chunks.forEach(function (chunk) {
                        require_chunks.push(chunk);
                    });
                });
                resolve(require_chunks);
            }
        });
    }

    buildRequiresTreeAsync(chunk) {
        if (chunk.requires === undefined)
            return async function () { };
        const chunks = Array(chunk.requires.length).fill();
        const requires = Array(chunk.requires.length).fill();
        chunk.requires.forEach((name, index) => {
            console.warn(`Fetch ${name}!`);
            chunks[index] = new Promise(async (resolve, reject) => {
                await wait((Math.random() * 2000) | 0);
                console.warn(`'${name}' fetched!`);
                this.libManager.loadChunk(name).then((chunk) => {
                    requires[index] = this.buildRequiresTreeAsync(chunk);
                    resolve([chunk, name]);
                }).catch(reject);
            });
        });
        async function enumerate(callback) {
            for (let i = 0; i < requires.length; i++) {
                callback(...await chunks[i]);
                await requires[i](callback);
            }
        }
        return enumerate;
    }

    // TODO: How do I konw whather or not this function end?
    enumerateRequiresAsync(chunk, callback, max_requires = 10, stop_immediately = false) {
        if (!(callback instanceof Function))
            throw Error("'callback' must be a function.");
        let stop = false;
        const require_counter = {
            count: 0,
            add: function () {
                require_counter.count++;
                if (require_counter.count > max_requires)
                    stop = true;
            }
        };
        let first_error = null;
        const buildRequiresTreeAsync = (chunk) => {
            if (chunk.requires === undefined)
                return async function () { };
            const chunks = Array(chunk.requires.length).fill();
            const requires = Array(chunk.requires.length).fill();
            for (let i = 0; i < chunk.requires.length; i++) {
                const name = chunk.requires[i];
                console.warn(`Fetch ${name}!`);
                chunks[i] = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        //await wait((Math.random() * 1000) | 0);
                        console.warn(`'${name}' fetched!`);
                        require_counter.add();
                        if (stop) {
                            reject(new Error("Failed to load requires.\nMaximum requires reached."));
                            return;
                        }
                        this.libManager.loadChunk(name).then((chunk) => {
                            requires[i] = buildRequiresTreeAsync(chunk);
                            resolve([chunk, name]);
                        })/* .catch(reject) */;
                    });
                });
                chunks[i].catch(function (e) {
                    if (first_error === null)
                        first_error = e;
                    console.log(first_error);
                });
            }
            async function enumerate(callback) {
                if (stop && stop_immediately) return;
                for (let i = 0; i < requires.length; i++) {
                    let chunk_pack;
                    try {
                        chunk_pack = await chunks[i];
                    } catch (e) {
                        continue;
                    }
                    try {
                        if (!stop_immediately || !stop) {
                            callback(...chunk_pack);
                        }
                    } catch (e) {
                        stop = true;
                        if (first_error === null)
                            first_error = e;
                        console.warn(first_error);
                    }
                    if (requires[i] instanceof Function)
                        await requires[i](callback);
                }
            }
            return enumerate;
        };
        buildRequiresTreeAsync(chunk)(callback);
    }

}

const parser = new Parser([], "./test/");

(async function () {

    try {
        //const chunk = await libManager.loadChunk("v_normal");
        //const promise = parser.loadRequires(chunk);
        //console.log(promise);
        //console.log(await promise);
        let count = 0;
        parser.enumerateRequiresAsync({
            requires: [
                "a",
            ]
        }, function (chunk, name) {
            console.log(name, count++);
            //if (count == 5)
            //throw new Error("HAHAHAHAHAHAHAHAHAHAAAHHHHH@@@##$@$%#$%#$");
            //throw Error("Hey stop!!!");
        }, 100, false);
    } catch (e) {
        console.warn("@@@@@@@@@@@@", e, "@@@@@@@@@@@@@");
    }

})/*()*/;


/*

async function t() {
    throw "aaa";
    return 10;
}

console.log(await t().catch(console.log));

async function TTT() {
    let k = 0;
    for (let i = 0; i < 1000000000; i++)
        k = i;
    console.log("KKK");
    await 0;
    return k;
}

console.log(TTT().then(console.log));
console.log("@@");

try {
    await (async function () { throw new Error("Err"); })();
} catch (e) {
    console.warn(e);
}
*/

function wait(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(function (callback) {
                callback(time);
            });
        }, time);
    });
}

// const times = [];
//
// for (let i = 2000; i > 100; i -= 100) {
//     times.push(wait(i, console.log));
// }
//
// console.log(times);
//
// for (let i = 0; i < times.length; i++) {
//     (await times[i])(console.log);
// }
// 
/*
const pro = new Promise(async (resolve, reject) => {
    for (let i = 0; i < 1000000000; i++) { }
    console.log("PP");
});

console.log("HI");
*/

/*
console.log("start");
wait(1000);
console.log("end");
*/


/*
console.log("start");
setTimeout(() => {
    console.log("end");
}, 1000);

console.log("start");
await wait(1000);
console.log("end");
*/
/*
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve("p1");
    }, 1000);
});

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve("p2");
    }, 2000);
});

const p3 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve("p3");
    }, 3000);
});

function C() {
    //await wait(10);
}
/*
const a = await p1;
const b = await p2;
const c = await p3;

console.log(a);
console.log(b);
console.log(c);
*/

/*
function A() {
    return new Promise((resolve, reject) => {
        wait(1000).then(resolve);
    });
}

//await A();

async function B() {
    await wait(1000);
    return 10;
}

B().then();

await B();

console.log(B());


/*
A();

function A() {
    B();
}

function B() {
    C();
}

function C() {
    wait(10).then(

        function () {
            return;
        }

    );
}

async function C() {
    await wait(10);
}
*/