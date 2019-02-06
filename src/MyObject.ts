export interface MyObject {
  vertices: number[][];
  indices: number[][];
}

export interface Buffers {
  vbo: WebGLRenderbuffer | null;
  ibo: WebGLRenderbuffer | null;
  count: number;
}

export function getBuffers(
  gl: WebGLRenderingContext,
  obj: MyObject
): Buffers {
  const flatten_vertices = flatten(obj.vertices);
  const flatten_indices = flatten(obj.indices);

  const buff: Buffers = {
    vbo: gl.createBuffer(),
    ibo: gl.createBuffer(),
    count: flatten_indices.length
  };

  gl.bindBuffer(gl.ARRAY_BUFFER, buff.vbo);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(flatten_vertices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff.ibo);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Int16Array(flatten_indices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return buff;
}

function flatten(arr: any[][]): any[] {
  return arr.reduce((acc, x) => acc.concat(x));
}
