/**
 * @readonly
 * @enum {number}
 */
export const M_ATTR = {
    // renderer
    VISIBLE: 0,

    // opengl
    /* ... */

    // vertex shader
    /* ... */

    // fragment shader
    OPACITY: 1,
    COLOR: 2,
    VERTEX_COLORS: 3,
    SPECULAR: 4,
    ROUGHNESS: 5,
    METALLIC: 6,

    // maps
    UV_MAP: 7,
    NORMAL_MAP: 8,
    SPECULAR_MAP: 9,
    ROUGHNESS_MAP: 10,
    METALLIC_MAP: 11,
};

export const MATERIAL_ATTR_BIT_MAP = {
    visible: M_ATTR.VISIBLE,
    opacity: M_ATTR.OPACITY,
    color: M_ATTR.COLOR,
    vertex_colors: M_ATTR.VERTEX_COLORS,
    specular: M_ATTR.SPECULAR,
    roughness: M_ATTR.ROUGHNESS,
    metallic: M_ATTR.METALLIC,
    uv_map: M_ATTR.UV_MAP,
    normal_map: M_ATTR.NORMAL_MAP,
    specular_map: M_ATTR.SPECULAR_MAP,
    roughness_map: M_ATTR.ROUGHNESS_MAP,
    metallic_map: M_ATTR.METALLIC_MAP,
};

/*
fog = true;
blending = NormalBlending;
side = FrontSide;
vertexColors = false;
opacity = 1;
transparent = false;
blendSrc = SrcAlphaFactor;
blendDst = OneMinusSrcAlphaFactor;
blendEquation = AddEquation;
blendSrcAlpha = null;
blendDstAlpha = null;
blendEquationAlpha = null;
depthFunc = LessEqualDepth;
depthTest = true;
depthWrite = true;
stencilWriteMask = 0xff;
stencilFunc = AlwaysStencilFunc;
stencilRef = 0;
stencilFuncMask = 0xff;
stencilFail = KeepStencilOp;
stencilZFail = KeepStencilOp;
stencilZPass = KeepStencilOp;
stencilWrite = false;
clippingPlanes = null;
clipIntersection = false;
clipShadows = false;
shadowSide = null;
colorWrite = true;
precision = null; // override the renderer's default precision for this material
polygonOffset = false;
polygonOffsetFactor = 0;
polygonOffsetUnits = 0;
dithering = false;
alphaToCoverage = false;
premultipliedAlpha = false;
visible = true;
toneMapped = true;
userData = {};
version = 0;
_alphaTest = 0;
*/
