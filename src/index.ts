import { getHexagon } from "./hexagon";

import imageURL from "./assets/images/theta360me.jpg";

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
  if (!gl.getExtension("OES_standard_derivatives")) {
    alert("ERROR: Extension 'OES_standard_derivatives' was not found");
  }
  glInit(width, height);

  const vs = `
    #define M_PI_INV 0.3183098861837907
    #define M_PI_INV_HALF 0.15915494309189535

    attribute vec2 xy;
    varying float u1, u2, v, r;

    void main(void) {
      float z2 = 1.0 - dot(xy, xy);
      float mask = step(0.0, z2);
      float z = sqrt(z2 * mask);
      vec3 normal = vec3(xy, z);
      vec3 view = vec3(0.0, 0.0, 1.0);
      vec3 light = normal * (2.0 * z) - view;
      v = acos(light.y) * M_PI_INV;
      u1 = atan(light.x, light.z) * M_PI_INV_HALF;
      if(u1 > 0.0) {
        u2 = u1;
      } else {
        u2 = u1 + 1.0;
      }
      gl_Position = vec4(xy, 0.0, 1.0);
      r = mask;
    }`;
  const fs = `#extension GL_OES_standard_derivatives : enable
    precision mediump float;
    uniform sampler2D texture;
    varying float u1, u2, v, r;

    void main(void) {
      float u;
      if(fwidth(u1) <= fwidth(u2)) {
        u = u1;
      } else {
        u = u2;
      }
      vec2 uv = vec2(u, v);
      vec4 smpColor = texture2D(texture, uv);
      vec3 vColor = smpColor.xyz * r;
      gl_FragColor = vec4(vColor, 1.0);
  }`;
  const _program = create_program(vs, fs);
  if (!_program) {
    console.log("ERROR: failed to create a program.");
    return;
  }

  const program = _program as WebGLProgram;
  const location_xy = gl.getAttribLocation(program, "xy");
  gl.enableVertexAttribArray(location_xy);

  const hexagon = getHexagon(gl, 16);
  hexagon.bind();
  gl.vertexAttribPointer(location_xy, 2, gl.FLOAT, false, 0, 0);

  const location_t = gl.getUniformLocation(program, "texture");
  const updateTexture = init_texture(location_t as WebGLUniformLocation);
  updateTexture(imageURL);

  setInterval(() => {
    hexagon.draw();
    gl.flush();
  }, 1000);

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

function init_texture(location: WebGLUniformLocation) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGB;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = internalFormat;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.uniform1i(location, 0);

  return (imgSrc: string) => {
    const img = new Image();

    img.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        img
      );
    };
    img.src = imgSrc;
  };
}
