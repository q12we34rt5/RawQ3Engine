function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

/**
 * 
 * @param {WebGLRenderingContext} gl
 * @param {Image} img
 * @param {*} default_color
 * @returns
 */
export function createImageTexture(gl, img, default_color = [0, 0, 255, 255]) {
    const texture = gl.createTexture();

    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

    function img_load() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, img);
        if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };

    if (img.complete) {
        img_load();
    } else {
        const width = 1;
        const height = 1;
        const border = 0;
        const pixel = new Uint8Array(default_color);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        img.addEventListener("load", img_load);
    }

    return texture;
}
