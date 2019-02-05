export interface MyObject {
  vertices: number[][];
  indices: number[][];
}

export interface Buffers {
  vbo: WebGLRenderbuffer;
  ibo: WebGLRenderbuffer;
}

export function getBuffers(
  gl: WebGLRenderingContext,
  obj: MyObject
): Buffers | null {
  const _vbo = gl.createBuffer();
  const _ibo = gl.createBuffer();
  if (!_vbo || !_ibo) {
    return null;
  }

  const buff: Buffers = {
    vbo: _vbo as WebGLBuffer,
    ibo: _ibo as WebGLBuffer
  };

  gl.bindBuffer(gl.ARRAY_BUFFER, buff.vbo);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(obj.vertices.flat()),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff.ibo);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Int16Array(obj.indices.flat()),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return buff;
}
