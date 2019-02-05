window.onload = () => {
    const c = document.getElementById("webgl") as HTMLCanvasElement

    const width = c.width
    const height = c.height
    
    const _gl = c.getContext("webgl")
    if (!_gl) {
        alert("ERROR: WebGL API is not available")
        return
    }
    
    const gl = _gl as WebGLRenderingContext
    
    gl.viewport(0, 0, width, height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}