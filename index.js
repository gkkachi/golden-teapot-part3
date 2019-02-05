var c = document.getElementById("webgl")

var width = c.width
var height = c.height

var gl = c.getContext("webgl")

gl.viewport(0, 0, width, height);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
