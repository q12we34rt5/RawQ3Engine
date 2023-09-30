export function getFileContent(path) {
    let str = null;
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                str = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return str;
}
