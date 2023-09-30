import { GLScreen } from "./engine/src/screen/screen.js";
import { mat4, vec2, vec3 } from "./engine/lib/gl-matrix/src/index.js";

import { Mesh } from "./engine/src/objects/mesh.js";
import { MeshGeometry } from "./engine/src/geometries/mesh-geometry.js";
import { Material } from "./engine/src/materials/material.js";

import obj from "./obj/index.js";
import { buildShaderProgram } from "./engine/src/screen/gl.js";

import { loadImage } from "./engine/src/util/web/image_loader.js";
import { createImageTexture } from "./engine/src/renderers/webgl/tools/texture.js";
import { Geometry } from "./engine/src/geometries/geometry.js";

import { parseObj, readByLine } from "./engine/src/util/parse_string.js";
import { getFileContent } from "./engine/src/util/web/string_loader.js";

import { PerspectiveCamera } from "./engine/src/camera/perspective-camera.js";
import { LibManager, RequireLoader, Chunk } from "./engine/src/renderers/webgl/shaders/lib/manager.js";

window.addEventListener("load", demo3, false);

function demo1() {
    const glCanvas = document.getElementById("glCanvas");
    const glscreen = new GLScreen(glCanvas);
    const fps = document.getElementById("fps");

    let s1 = vec3.set(new vec3.create(), 0.0, 1.0, 0.0);
    let s2 = vec3.rotateZ(new vec3.create(), s1, [0.0, 0.0, 0.0], 2 * Math.PI / 3);
    let s3 = vec3.rotateZ(new vec3.create(), s1, [0.0, 0.0, 0.0], 4 * Math.PI / 3);
    let scale = vec3.set(new vec3.create(), 0.5, 0.5, 0.5);
    vec3.mul(s1, s1, scale);
    vec3.mul(s2, s2, scale);
    vec3.mul(s3, s3, scale);
    let theta = 0.0;
    let p1 = vec3.create(), p2 = vec3.create(), p3 = vec3.create();

    let k = 0.0;

    setInterval(() => {
        k += 0.0001;
        k %= 10;
    }, 1);

    glscreen.start(function () {
        glscreen.beginFrame();
        for (let i = 0; i < 10; i++) {
            vec3.rotateZ(p1, s1, [0.0, 0.0, 0.0], theta + i * k);
            vec3.rotateZ(p2, s2, [0.0, 0.0, 0.0], theta + i * k);
            vec3.rotateZ(p3, s3, [0.0, 0.0, 0.0], theta + i * k);
            glscreen.drawPolygon([
                ...p1, ...p2, ...p3,
            ], [
                1.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0
            ], 3);
            theta = (theta) % (2 * Math.PI);
            /*
            glscreen.drawPolygon([
                -1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
                0.5, -0.5, 0.0,
            ], [
                1.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,
                1.0, 0.5, 0.5, 1.0
            ], 4);
            */
            /*
            glscreen.drawPolygon([
                -0.4 + 0.5,  0.4, 0.0,
                 0.4 + 0.5,  0.4, 0.0,
                 0.4 + 0.5, -0.4, 0.0,
                -0.4 + 0.5, -0.4, 0.0,
            ], [
                1.0, 0.5, 0.5, 1.0,
                0.0, 1.0, 0.5, 1.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 0.5, 1.0
            ], 4);
            
            glscreen.drawSingleColorPolygon([
                -0.4 - 0.5,  0.4, 0.0,
                 0.4 - 0.5,  0.4, 0.0,
                 0.4 - 0.5, -0.4, 0.0,
                -0.4 - 0.5, -0.4, 0.0,
            ], [1.0, 0.5, 0.5, 1.0], 4);
            */
        }
        fps.textContent = glscreen.getFps();
    });
}

function startup() {
    const glCanvas = document.getElementById("glCanvas");
    const glscreen = new GLScreen(glCanvas);
    const fps = document.getElementById("fps");
    console.log(glscreen);

    let p1 = vec3.rotateZ([0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0], 0.0);
    let p2 = vec3.rotateZ([0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0], 2 * Math.PI / 3);
    let p3 = vec3.rotateZ([0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0], 4 * Math.PI / 3);

    const mesh = new Mesh([
        ...p1, ...p2, ...p3
    ], [
        0, 1, 2
    ], {
        scale: [2, 2, 2],
        rotate: 0.0,
        normal: [0.0, 0.0, 1.0],
        center: [0.0, 0.0, 0.0]
    });
    mesh.transform.setScale([1, 1, 1]);

    //mesh.setRotate(Math.PI / 2);

    //mesh.setModelScale([2, 2, 2]);

    const vertices = new Float32Array(9);

    let theta = 0.0;
    let scale = [1.0, 1.0, 1.0];
    let normal = [1.0, 1.0, 1.0];
    let translate = [0.5, 0.0, 0.0];

    setInterval(() => {
        theta += 0.03;
        theta %= Math.PI * 4;

        scale[0] = 1.5 * Math.sin(theta / 4);
        scale[1] = 1.5 * Math.sin(theta / 4);
        scale[2] = 1.5 * Math.sin(theta / 4);

        vec3.rotateZ(normal, normal, [0.0, 0.0, 0.0], 0.01);

        vec3.rotateZ(translate, translate, [0.0, 0.0, 0.0], 0.01);
    }, 10);

    function mapMeshToVertices() {
        mesh.transform.processVertices(function (v, i) {
            const res_v = new Float32Array(vertices.buffer,
                i * 3 * Float32Array.BYTES_PER_ELEMENT, 3);
            vec3.transformMat4(res_v, v, mesh.transform.getModelMatrix());
        });
    }

    glscreen.start(function () {
        glscreen.beginFrame();
        for (let i = 0; i < 1; i++) {
            mesh.transform.setRotate(theta, true);
            //mesh.transform.setScale(scale, true);
            //mesh.transform.setNormal(normal, true);
            //mesh.transform.setTranslate(translate, true);
            mapMeshToVertices();
            glscreen.drawMesh(
                vertices,
                mesh.indices,
                [
                    1.0, 1.0, 0.0, 1.0,
                    0.0, 1.0, 1.0, 1.0,
                    1.0, 0.0, 1.0, 1.0
                ], 3, glscreen.gl.LINE_LOOP);
        }
        fps.textContent = glscreen.getFps();
    });

}

const material = new Material();

console.log(material);
material.setValues({ alpha_map: 20 });

console.log(material);

function heart_demo() {
    const glCanvas = document.getElementById("glCanvas");
    const glscreen = new GLScreen(glCanvas);
    const fps = document.getElementById("fps");

    const _vertices = obj.teapot.vertices;
    const _indices = new Uint16Array(obj.teapot.indices).map(v => v - 1);

    // make geometry
    const geometry = new MeshGeometry(_vertices, _indices, {
        scale: [4.5, 4.5, 4.5],
        rotate: 0.0,
        normal: [0.0, 1.0, 0.0],
        center: [0.0, 0.0, 0.0]
    });

    const mesh = new Mesh(geometry, new Material(), {
        scale: [1, 1, 1],
        rotate: 0.0,
        normal: [0.0, 0.0, 1.0],
        center: [0.0, 0.0, 0.0]
    });
    mesh.setScale([1, 1, 1]);
    mesh.setNormal([0, 0, 1]);
    mesh.setTranslate([0, 0, 0]);

    //mesh.setRotate(Math.PI / 2);
    //mesh.setModelScale([2, 2, 2]);

    const vertices = new Float32Array(mesh.geometry.vertices.length);

    let theta = 0.0;
    let scale = [1.0, 1.0, 1.0];
    let normal = [0.0, 1.0, 1.0];
    let translate = [0.0, 0.0, 0.0];

    setInterval(() => {
        // theta
        theta += 0.001;
        theta %= Math.PI * 4;
        // scale
        scale[0] = 1.5 * Math.sin(theta / 4);
        scale[1] = 1.5 * Math.sin(theta / 4);
        scale[2] = 1.5 * Math.sin(theta / 4);
        // normal
        vec3.rotateX(normal, normal, [0.0, 0.0, 0.0], 0.005);
        // translate
        vec3.rotateZ(translate, translate, [0.0, 0.0, 0.0], 0.005);
    }, 20);

    function mapMeshToVertices() {
        mesh.geometry.processVertices(function (v, i) {
            const res_v = new Float32Array(vertices.buffer,
                i * 3 * Float32Array.BYTES_PER_ELEMENT, 3);
            vec3.transformMat4(res_v, v, mesh.getModelMatrix());
        });
    }

    function generateRandomColors(num_colors) {
        const colors = new Float32Array(4 * num_colors);
        for (let i = 0; i < num_colors; i++) {
            colors[4 * i] = Math.random();
            colors[4 * i + 1] = Math.random();
            colors[4 * i + 2] = Math.random();
            colors[4 * i + 3] = 1 - Math.random() / 2;
        }
        return colors;
    }

    function generateColors(num_colors, color) {
        const colors = new Float32Array(4 * num_colors);
        for (let i = 0; i < num_colors; i++) {
            colors[4 * i] = color[0];
            colors[4 * i + 1] = color[1];
            colors[4 * i + 2] = color[2];
            colors[4 * i + 3] = color[3];
        }
        return colors;
    }

    function addRandomColors(colors, dc, da = 0) {
        for (let i = 0; i < Math.floor(colors.length / 4); i++) {
            colors[4 * i] = (colors[4 * i] + dc * Math.random()) % 1;
            colors[4 * i + 1] = (colors[4 * i + 1] + dc * Math.random()) % 1;
            colors[4 * i + 2] = (colors[4 * i + 2] + dc * Math.random()) % 1;
            colors[4 * i + 3] = (colors[4 * i + 3] + da * Math.random()) % 1;
        }
    }

    /**
     * 
     * @param {Float32Array} colors 
     * @param {Function} callback 
     */
    function processColors(colors, callback) {
        const length = Math.floor((colors.length + 0.5) / 4);
        for (let i = 0; i < length; i++) {
            const color = new Float32Array(colors.buffer, 4 * i * Float32Array.BYTES_PER_ELEMENT, 4);
            callback(color, i);
        }
    }

    const face_colors = generateRandomColors(mesh.geometry.getNumberOfVertices());
    const mesh_colors = generateRandomColors(mesh.geometry.getNumberOfVertices());
    const fix_colors = generateColors(mesh.geometry.getNumberOfVertices(), [1, 1, 1, 1]);

    function mix(a, b, wa = 1, wb = 1) {
        return (wa * a + wb * b) / (wa + wb);
    }

    function nsin(x, s = 0, e = 100) {
        return (Math.sin(x) * (e - s) / 2) + s;
    }

    {
        let i = 0, j = 0, k = 0, l = 0;
        setInterval(() => {
            processColors(face_colors, function (color, index) {
                color[0] = nsin(i * index / 1000);
                color[1] = nsin(j * index / 1000);
                color[2] = nsin(k * index / 1000);
                color[3] = 1;
            });
            //i += Math.random() * 0.013;
            //j += Math.random() * 0.017;
            //k += Math.random() * 0.023;
            //l += Math.random() * 0.023;
            i += 0.003;
            j += 0.017;
            k += 0.029;
            l += 0.029;
        }, 10);
    }

    glscreen.setBackground([0, 0, 0, 0]);
    glscreen.start(function () {
        glscreen.beginFrame();
        for (let i = 0; i < 1; i++) {
            mesh.setRotate(theta, true);
            //mesh.setScale(scale, true);
            mesh.setNormal(normal, true);
            mapMeshToVertices();
            mesh.setTranslate(translate, true);
            if (true)
                glscreen.drawMesh(
                    vertices,
                    mesh.geometry.indices,
                    face_colors,
                    mesh.geometry.indices.length,
                    glscreen.gl.TRIANGLES
                /* glscreen.gl.LINE_LOOP */);
            if (true)
                glscreen.drawMesh(
                    vertices,
                    mesh.geometry.indices,
                    fix_colors,
                    mesh.geometry.indices.length,
                    glscreen.gl.LINE_LOOP);
        }
        fps.textContent = glscreen.getFps();
    });
    //glscreen.stop();
}

function demo2() {
    const glCanvas = document.getElementById("glCanvas");
    const glscreen = new GLScreen(glCanvas);
    const fps = document.getElementById("fps");

    // make geometry
    const geometry = new MeshGeometry([
        -1, 1, 0,
        1, 1, 0,
        -1, -1, 0,
    ], [
        0, 1, 2
    ], {
        scale: [2, 2, 2],
        rotate: 0.0,
        normal: [0.0, 0.0, 1.0],
        center: [0.0, 0.0, 0.0]
    });

    const mesh = new Mesh(geometry, new Material(), {
        scale: [1, 1, 1],
        rotate: 0.0,
        normal: [0.0, 0.0, 1.0],
        center: [0.0, 0.0, 0.0]
    });

    const vertices = new Float32Array(mesh.geometry.vertices.length);
    const colors = new Float32Array([
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1
    ]);

    function mapMeshToVertices() {
        mesh.geometry.processVertices(function (v, i) {
            const res_v = new Float32Array(vertices.buffer,
                i * 3 * Float32Array.BYTES_PER_ELEMENT, 3);
            vec3.transformMat4(res_v, v, mesh.getModelMatrix());
        });
    }

    glscreen.setBackground([0, 0, 0, 0]);
    glscreen.start(function () {
        glscreen.beginFrame();
        for (let i = 0; i < 1; i++) {
            mapMeshToVertices();
            glscreen.drawMesh(
                vertices,
                mesh.geometry.indices,
                colors,
                mesh.geometry.indices.length,
                glscreen.gl.TRIANGLES);
        }
        fps.textContent = glscreen.getFps();
    });
}

function makeDict(names, getFunc) {
    const dict = {};
    names.forEach(function (name) {
        if (name in dict) return;
        const loc = getFunc(name);
        if (loc != -1)
            dict[name] = loc;
    });
    return dict;
}

function demo3() {
    /**
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {Array<String>} attributes 
     * @returns
     */
    function getAttribLocations(gl, program, names) {
        return makeDict(names, function (name) {
            const loc = gl.getAttribLocation(program, name);
            gl.enableVertexAttribArray(loc);
            return loc;
        });
    }

    /**
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {Array<String>} names 
     * @returns
     */
    function getUniformLocations(gl, program, names) {
        return makeDict(names, function (name) {
            return gl.getUniformLocation(program, name);
        });
    }

    /**
     * @param {Float32Array} vertices 
     * @param {Float32Array} uvs 
     * @param {Uint16Array} indices 
     */
    function computeTangentBitangent(vertices, uvs, indices) {
        const tangents = new Float32Array(vertices.length);
        const bitangents = new Float32Array(vertices.length);
        for (let i = 0; i < indices.length; i += 3) {
            const i1 = indices[i] * Float32Array.BYTES_PER_ELEMENT;
            const i2 = indices[i + 1] * Float32Array.BYTES_PER_ELEMENT;
            const i3 = indices[i + 2] * Float32Array.BYTES_PER_ELEMENT;
            const i1_3 = 3 * i1, i2_3 = 3 * i2, i3_3 = 3 * i3;

            const t0 = new Float32Array(tangents.buffer, i1_3, 3);
            const t1 = new Float32Array(tangents.buffer, i2_3, 3);
            const t2 = new Float32Array(tangents.buffer, i3_3, 3);

            const b0 = new Float32Array(bitangents.buffer, i1_3, 3);
            const b1 = new Float32Array(bitangents.buffer, i2_3, 3);
            const b2 = new Float32Array(bitangents.buffer, i3_3, 3);

            const v0 = new Float32Array(vertices.buffer, i1_3, 3);
            const v1 = new Float32Array(vertices.buffer, i2_3, 3);
            const v2 = new Float32Array(vertices.buffer, i3_3, 3);

            const uv0 = new Float32Array(uvs.buffer, 2 * i1, 2);
            const uv1 = new Float32Array(uvs.buffer, 2 * i2, 2);
            const uv2 = new Float32Array(uvs.buffer, 2 * i3, 2);

            const edge1 = vec3.subtract(vec3.create(), v1, v0);
            const edge2 = vec3.subtract(vec3.create(), v2, v0);

            const delta_u1 = uv1[0] - uv0[0];
            const delta_v1 = uv1[1] - uv0[1];
            const delta_u2 = uv2[0] - uv0[0];
            const delta_v2 = uv2[1] - uv0[1];

            const f = 1.0 / (delta_u1 * delta_v1 - delta_u2 * delta_v2);
            const tangent = vec3.fromValues(
                f * (delta_v2 * edge1[0] - delta_v1 * edge2[0]),
                f * (delta_v2 * edge1[1] - delta_v1 * edge2[1]),
                f * (delta_v2 * edge1[2] - delta_v1 * edge2[2])
            );
            const bitangent = vec3.fromValues(
                f * (-delta_u2 * edge1[0] - delta_u1 * edge2[0]),
                f * (-delta_u2 * edge1[1] - delta_u1 * edge2[1]),
                f * (-delta_u2 * edge1[2] - delta_u1 * edge2[2])
            );

            vec3.add(t0, t0, tangent);
            vec3.add(t1, t1, tangent);
            vec3.add(t2, t2, tangent);

            vec3.add(b0, b0, bitangent);
            vec3.add(b1, b1, bitangent);
            vec3.add(b2, b2, bitangent);
        }
        return {
            tangents: tangents,
            bitangents: bitangents
        };
        /*
            Vertex & v0 = Vertices[Indices[i]];
            Vertex & v1 = Vertices[Indices[i + 1]];
            Vertex & v2 = Vertices[Indices[i + 2]];
    
            Vector3f Edge1 = v1.m_pos - v0.m_pos;
            Vector3f Edge2 = v2.m_pos - v0.m_pos;
    
            float DeltaU1 = v1.m_tex.x - v0.m_tex.x;
            float DeltaV1 = v1.m_tex.y - v0.m_tex.y;
            float DeltaU2 = v2.m_tex.x - v0.m_tex.x;
            float DeltaV2 = v2.m_tex.y - v0.m_tex.y;
    
            float f = 1.0f / (DeltaU1 * DeltaV2 - DeltaU2 * DeltaV1);
            Vector3f Tangent, Bitangent;
            Tangent.x = f * (DeltaV2 * Edge1.x - DeltaV1 * Edge2.x);
            Tangent.y = f * (DeltaV2 * Edge1.y - DeltaV1 * Edge2.y);
            Tangent.z = f * (DeltaV2 * Edge1.z - DeltaV1 * Edge2.z);
            Bitangent.x = f * (-DeltaU2 * Edge1.x - DeltaU1 * Edge2.x);
            Bitangent.y = f * (-DeltaU2 * Edge1.y - DeltaU1 * Edge2.y);
            Bitangent.z = f * (-DeltaU2 * Edge1.z - DeltaU1 * Edge2.z);
            v0.m_tangent += Tangent;
            v1.m_tangent += Tangent;
            v2.m_tangent += Tangent;
        }
        for (unsigned int i = 0 ; i < Vertices.size(); i++) {
            Vertices[i].m_tangent.Normalize();
        }
        */
    }

    const glCanvas = document.getElementById("glCanvas");
    /** @type {WebGLRenderingContext} */
    const gl = glCanvas.getContext("webgl");

    const A_POSITION = "aPosition";
    const A_TEXCOORD = "aTexcoord";

    const program = buildShaderProgram(gl, [{
        type: gl.VERTEX_SHADER,
        code: `
        #ifndef DISABLE

        attribute vec3 aPosition;
        attribute vec2 aTexcoord;
        attribute vec3 aNormal;
        attribute vec3 aTangent;

        #endif

        uniform mat4 uModelView;
        uniform mat4 uProjection;

        varying vec3 vPosition;
        varying vec2 vTexcoord;
        varying vec3 vNormal;
        varying vec3 vTangent;
        
        void main() {
            vec4 position = uModelView * vec4(aPosition, 1.0);
            gl_Position = uProjection * position;
            vPosition = position.xyz;
            vTexcoord = aTexcoord;
            
            // vNormal = (vec4(aNormal, 0.0) * uModelView).xyz;

            vNormal = vec3(uModelView * vec4(aNormal, 0.0));
            vTangent = vec3(uModelView * vec4(aTangent, 0.0));
        }
        `
    }, {
        type: gl.FRAGMENT_SHADER,
        code: `
        precision mediump float;

        varying vec3 vPosition;
        varying vec2 vTexcoord;
        varying vec3 vNormal;
        varying vec3 vTangent;
        
        uniform sampler2D uTexture;
        uniform sampler2D uNormal;
        uniform vec3 uPointLightLocation;

        void main() {
            vec3 N = normalize(vNormal);
            vec3 T = normalize(vTangent - dot(N, vTangent) * N);
            vec3 B = cross(N, T);
            mat3 TBN = mat3(T, B, N);

            vec3 normal = 2.0 * texture2D(uNormal, vTexcoord).xyz - 1.0;
            normal = normalize(TBN * normal);

            vec3 lightDirection = normalize(uPointLightLocation - vPosition.xyz);

            float ambient_intensity = 1.0 * dot(normal, normalize(vec3(0.0, 0.0, 1.0)));

            float intensity = 1.0 * dot(normal, lightDirection);
            vec4 fragColor = texture2D(uTexture, vTexcoord);
            gl_FragColor = vec4(fragColor.xyz * (intensity + ambient_intensity), 1.0);
            // gl_FragColor = vec4(0.0, 0.0, normal.z, 1.0);
            // gl_FragColor = vec4((N + 1.0) * 0.5, 1.0);
        }

        //vec3 reflectDirection = normalize(reflect(-lightDirection, normal));
        //float intensity = 2.0 * dot(reflectDirection, vec3(-1.0, 0.0, -1.0));
        //vec4 fragColor = texture2D(uTexture, vTexcoord);
        //gl_FragColor = vec4(fragColor.xyz * intensity, 1.0);
        `
    }]);


    // gl.useProgram(program);

    // const img = loadImage("./assets/bricks/random_bricks_thick_diff_4k.jpg");
    // const img = loadImage("./assets/bricks/random_bricks_thick_rough_4k.jpg");
    // const normal_map = loadImage("./assets/bricks/random_bricks_thick_nor_gl_4k.jpg");

    // const img = loadImage("./assets/apple/food_apple_01_diff_8k.jpg");
    // const normal_map = loadImage("./assets/apple/food_apple_01_nor_gl_8k.jpg");
    // const str = getFileContent("./assets/apple/food_apple_01_8k.obj");

    // const img = loadImage("./assets/WetFloorSign/WetFloorSign_01_diff_4k.jpg");
    // const normal_map = loadImage("./assets/WetFloorSign/WetFloorSign_01_nor_gl_4k.jpg");
    // const str = getFileContent("./assets/WetFloorSign/WetFloorSign_01_4k.obj");

    const img = loadImage("./assets/woodenbowl/wooden_bowl_01_diff_4k.jpg");
    const normal_map = loadImage("./assets/woodenbowl/wooden_bowl_01_nor_gl_4k.jpg");
    const str = getFileContent("./assets/woodenbowl/wooden_bowl_01_4k.obj");

    // const img = loadImage("./assets/Camera/Camera_01_body_diff_4k.jpg");
    // const normal_map = loadImage("./assets/Camera/Camera_01_body_nor_gl_4k.jpg");
    // const str = getFileContent("./assets/Camera/Camera_01_4k.obj");

    // const img = loadImage("./assets/bricks/random_bricks_thick_diff_4k.jpg");
    // const normal_map = loadImage("./assets/bricks/random_bricks_thick_nor_gl_4k.jpg");
    // const str = getFileContent("./assets/Moon/Moon 2K.obj");

    const texture = createImageTexture(gl, img, [255, 255, 255, 255]);
    const normal_texture = createImageTexture(gl, normal_map, [128, 128, 255, 0]);

    /*
    ( 0, 1, 0) ( 1, 1, 0) ( 2, 1, 0)
    ( 0, 0, 0) ( 1, 0, 0) ( 2, 0, 0)
    */
    // const str = getFileContent("./assets/teapot.obj");
    const obj = parseObj(str);

    console.log(obj);

    const geometry = new MeshGeometry(obj.vertices, obj.indices, {
        // center: [0, 0, 0],
        // scale: [0.14, 0.14, 0.14],
        center: [0, 0.05, 0],
        scale: [0.15, 0.15, 0.15],
    });

    const mesh = new Mesh(geometry, new Material());
    mesh.setTranslate([0.0, 0.0, -2.0]);

    const TBs = computeTangentBitangent(geometry.vertices, obj.uvs, geometry.indices);

    const aspect = glCanvas.width / glCanvas.height;
    const camera = new PerspectiveCamera(50, aspect, 0.1, 2000);

    /*
    const geometry = new MeshGeometry([
        0, 1, 0,
        0, 0, 0,
        1, 1, 0,
        1, 0, 0,

        1, 1, 0,
        1, 0, 0,
        2, 1, 0,
        2, 0, 0
    ], [
        0, 1, 2,
        1, 2, 3,
        4, 5, 6,
        5, 6, 7,
    ], {
        center: [1, 0.5, 0],
        scale: [0.5, 0.5, 1]
    });
    const texcoords = new Float32Array([
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        0, 1,
        0, 0,
        1, 1,
        1, 0,
    ]);
    */

    console.log(program);

    const attrLocs = getAttribLocations(gl, program, [
        "aPosition",
        "aTexcoord",
        "aNormal",
        "aTangent"
    ]);
    const unifLocs = getUniformLocations(gl, program, [
        "uProjection",
        "uModelView",
        "uPointLightLocation",
        "uTexture",
        "uNormal"
    ])

    console.log(attrLocs, unifLocs);

    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(unifLocs.uTexture, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, normal_texture);
    gl.uniform1i(unifLocs.uNormal, 1);

    function delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n * 1000);
        });
    }

    // gl.enable(gl.DEPTH_TEST | gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vertexBuffer = gl.createBuffer();
    const texcoordBuffer = gl.createBuffer();
    const noramlBuffer = gl.createBuffer();
    const tangentBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    const light_loc = vec3.fromValues(1.0, 0.0, 0.1);

    let theta = 0.01;
    let norm = [0.0, 0.0, 1.0];
    let cam_norm = [0.1, 0.0, 1.0];

    camera.calculateProjectionMatrix();

    setInterval(function () {
        vec3.rotateZ(cam_norm, cam_norm, [0, 0, 0], 0.001);
        camera.setNormal(cam_norm);
        //camera.setTranslate([1.0, 0.0, 0.0]);
        camera.calculateViewMatrix();
        mesh.setRotate(theta);
        mesh.setNormal(norm);
        vec3.rotateX(norm, norm, [0, 0, 0], 0.001);
        theta += 0.001;
        // vec3.rotateZ(light_loc, light_loc, [0, 0, 0], 0.003);
        // geometry.setModelRotate(theta);
        // geometry.setModelNormal([0.001, 0.002, 1.0]);
        // normals.setModelNormal([0.001, 0.002, 1.0]);
    }, 6);

    const modelViewMatrix = mat4.multiply(mat4.create(), camera.view.matrix, mesh.model.matrix);

    function draw() {
        gl.clear(gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindTexture(gl.TEXTURE_2D, normal_texture);

        mat4.multiply(modelViewMatrix, camera.view.matrix, mesh.model.matrix);

        // set uniforms
        gl.uniformMatrix4fv(unifLocs.uProjection, false, camera.projection.matrix);
        gl.uniformMatrix4fv(unifLocs.uModelView, false, modelViewMatrix);
        gl.uniform3fv(unifLocs.uPointLightLocation, light_loc);
        // set attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STREAM_DRAW);
        gl.enableVertexAttribArray(attrLocs.aPosition);
        gl.vertexAttribPointer(attrLocs.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, obj.uvs, gl.STREAM_DRAW);
        gl.enableVertexAttribArray(attrLocs.aTexcoord);
        gl.vertexAttribPointer(attrLocs.aTexcoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, noramlBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, obj.normals, gl.STREAM_DRAW);
        gl.enableVertexAttribArray(attrLocs.aNormal);
        gl.vertexAttribPointer(attrLocs.aNormal, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, TBs.tangents, gl.STREAM_DRAW);
        gl.enableVertexAttribArray(attrLocs.aTangent);
        gl.vertexAttribPointer(attrLocs.aTangent, 3, gl.FLOAT, false, 0, 0);

        // set indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STREAM_DRAW);

        // gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        // gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
        gl.drawElements(gl.TRIANGLES, geometry.num_indices, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(draw);
    }

    draw();

    // const str = getFileContent("./assets/apple/food_apple_01_4k.obj");
    // const str = getFileContent("./obj/Sting-Sword-lowpoly.obj");

    // const str = getFileContent("./assets/teapot.obj");
    // const obj = parseObj(str);
    // console.log(obj);
}

import * as CS from "./engine/src/renderers/webgl/shaders/lib/constants.js";

class SdProc {

    static getUniformLocation(input) {

    }

    static getAttribLocation(input) {

    }

    static getLocations(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            switch (inputs) {

            }
        }
    }

}

import { ResourceMonitor, ResourceWrapper } from "./engine/src/core/resource-monitor.js";
import { Shader } from "./engine/src/renderers/webgl/shaders/parser.js";
import { ShortStringMapping } from "./engine/src/util/unique-string-generator.js";

async function demo4() {

    const glCanvas = document.getElementById("glCanvas");
    /** @type {WebGLRenderingContext} */
    const gl = glCanvas.getContext("webgl");

    const lm = new LibManager();
    const rl = new RequireLoader(lm, 2);

    const chunks = await rl.loadList([
        "begin",
        "use_texture",
        "use_normalMap",
        "use_ambient",
        "use_diffuse",
        "use_specular",
        "end",
    ]);
    const uni_chunks = Chunk.removeCommon(chunks);
    const merge_chunk = Chunk.mergeChunks(uni_chunks);
    const parsed_chunk = Chunk.parseChunk(merge_chunk);
    console.log(parsed_chunk);
    console.log(parsed_chunk.inputs);
    console.log(parsed_chunk.codes.vertex);
    console.log(parsed_chunk.codes.fragment);
    console.log(parsed_chunk.inputs.map(value => value.name));

    const shader = new Shader(gl, parsed_chunk);
    console.log(shader);

    const program = buildShaderProgram(gl, [{
        type: gl.VERTEX_SHADER,
        code: parsed_chunk.codes.vertex
    }, {
        type: gl.FRAGMENT_SHADER,
        code: parsed_chunk.codes.fragment
    }]);

    console.log(program);

    //const material = new Material();
    //console.log(material);
}