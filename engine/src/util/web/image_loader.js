/**
 * @param {String} url 
 * @returns {HTMLImageElement}
 */
export function loadImage(url) {
    const img = new Image();
    img.src = url;
    return img;
}
