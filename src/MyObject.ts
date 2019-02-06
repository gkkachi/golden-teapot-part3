export class MyObject {
  vbo: WebGLRenderbuffer | null;
  ibo: WebGLRenderbuffer | null;
  count: number;
  gl: WebGLRenderingContext;
  constructor(
    gl: WebGLRenderingContext,
    vertices: number[][],
    indices: number[][]
  ) {
    const flatten_vertices = flatten(vertices);
    const flatten_indices = flatten(indices);

    const vbo = gl.createBuffer();
    const ibo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(flatten_vertices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Int16Array(flatten_indices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.vbo = vbo;
    this.ibo = ibo;
    this.count = flatten_indices.length;
    this.gl = gl;
  }

  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
  }

  draw() {
    this.bind()
    this.gl.drawElements(this.gl.TRIANGLES, this.count, this.gl.UNSIGNED_SHORT, 0);
  }
}

function flatten(arr: any[][]): any[] {
  return arr.reduce((acc, x) => acc.concat(x));
}
