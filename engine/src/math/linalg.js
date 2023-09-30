function create() {
    let mat = new Float32Array(16);
    mat[0] = 1; mat[5] = 1; mat[10] = 1; mat[15] = 1;
    return mat;
}

function clone(mat) {
    let _mat = new Float32Array(16);
    _mat[0] = mat[0]; _mat[1] = mat[1]; _mat[2] = mat[2]; _mat[3] = mat[3];
    _mat[4] = mat[4]; _mat[5] = mat[5]; _mat[6] = mat[6]; _mat[7] = mat[7];
    _mat[8] = mat[8]; _mat[9] = mat[9]; _mat[10] = mat[10]; _mat[11] = mat[11];
    _mat[12] = mat[12]; _mat[13] = mat[13]; _mat[14] = mat[14]; _mat[15] = mat[15];
    return _mat;
}

function copy(dest, src) {
    dest[0] = src[0]; dest[1] = src[1]; dest[2] = src[2]; dest[3] = src[3];
    dest[4] = src[4]; dest[5] = src[5]; dest[6] = src[6]; dest[7] = src[7];
    dest[8] = src[8]; dest[9] = src[9]; dest[10] = src[10]; dest[11] = src[11];
    dest[12] = src[12]; dest[13] = src[13]; dest[14] = src[14]; dest[15] = src[15];
    return dest;
}

function set(mat,
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33
) {
    mat[0] = m00; mat[1] = m01; mat[2] = m02; mat[3] = m03;
    mat[4] = m10; mat[5] = m11; mat[6] = m12; mat[7] = m13;
    mat[8] = m20; mat[9] = m21; mat[10] = m22; mat[11] = m23;
    mat[12] = m30; mat[13] = m31; mat[14] = m32; mat[15] = m33;
    return mat;
}

function identity(mat) {
    mat[0] = 1; mat[1] = 0; mat[2] = 0; mat[3] = 0;
    mat[4] = 0; mat[5] = 1; mat[6] = 0; mat[7] = 0;
    mat[8] = 0; mat[9] = 0; mat[10] = 1; mat[11] = 0;
    mat[12] = 0; mat[13] = 0; mat[14] = 0; mat[15] = 1;
    return mat;
}

function transpose(dest, src) {
    if (dest === src) {
        let src01 = src[1], src02 = src[2], src03 = src[3];
        let src12 = src[6], src13 = src[7];
        let src23 = src[11];
        dest[1] = src[4]; dest[2] = src[8]; dest[3] = src[12];
        dest[4] = src01; dest[6] = src[9]; dest[7] = src[13];
        dest[8] = src02; dest[9] = src12; dest[11] = src[14];
        dest[12] = src03; dest[13] = src13; dest[14] = src23;
    } else {
        dest[0] = src[0]; dest[1] = src[4]; dest[2] = src[8]; dest[3] = src[12];
        dest[4] = src[1]; dest[5] = src[5]; dest[6] = src[9]; dest[7] = src[13];
        dest[8] = src[2]; dest[9] = src[6]; dest[10] = src[10]; dest[11] = src[14];
        dest[12] = src[3]; dest[13] = src[7]; dest[14] = src[11]; dest[15] = src[15];
    }
    return dest;
}