import { getBuffers, Buffers } from "./MyObject";
import { getHexagon } from "./hexagon";

var gl: WebGLRenderingContext;

window.onload = () => {
  const c = document.getElementById("webgl") as HTMLCanvasElement;

  const width = c.width;
  const height = c.height;

  const _gl = c.getContext("webgl");
  if (!_gl) {
    alert("ERROR: WebGL API is not available");
    return;
  }

  gl = _gl as WebGLRenderingContext;
  glInit(width, height);

  const vs = `
    attribute vec2 xy;
    varying float r;
    void main(void) {
        gl_Position = vec4(xy, 0.0, 1.0);
        r = sqrt(max(1.0 - dot(xy, xy), 0.0));
    }`;
  const fs = `precision mediump float;
    varying float r;
    void main(void) {
        gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * r, 1.0);
    }`;
  const _program = create_program(vs, fs);
  if (!_program) {
    console.log("ERROR: failed to create a program.");
    return;
  }

  const program = _program as WebGLProgram;
  const location = gl.getAttribLocation(program, "xy");
  gl.enableVertexAttribArray(location);

  const hexagon = getHexagon(16);
  const _buff = getBuffers(gl, hexagon);
  if (!_buff) {
    console.log("ERROR: failed to create a buffer.");
    return;
  }
  const buff = _buff as Buffers;

  gl.bindBuffer(gl.ARRAY_BUFFER, buff.vbo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff.ibo);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

  gl.drawElements(
    gl.TRIANGLES,
    hexagon.indices.flat().length,
    gl.UNSIGNED_SHORT,
    0
  );
  gl.flush();

  console.log("DONE.");
};

function glInit(width: number, height: number) {
  gl.viewport(0, 0, width, height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function create_program(vs: string, fs: string): WebGLProgram | null {
  const _program = gl.createProgram();
  if (!_program) {
    return null;
  }

  const program = _program as WebGLProgram;
  gl.attachShader(program, create_shader(vs, gl.VERTEX_SHADER) as WebGLShader);
  gl.attachShader(program, create_shader(
    fs,
    gl.FRAGMENT_SHADER
  ) as WebGLShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(program);
    return program;
  } else {
    alert(gl.getProgramInfoLog(program));
    return null;
  }
}

function create_shader(code: string, shader_type: number): WebGLShader | null {
  const _shader = gl.createShader(shader_type);
  if (!_shader) {
    return null;
  }

  const shader = _shader as WebGLShader;
  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
}
