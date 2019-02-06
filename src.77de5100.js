// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"MyObject.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MyObject =
/** @class */
function () {
  function MyObject(gl, vertices, indices) {
    var flatten_vertices = flatten(vertices);
    var flatten_indices = flatten(indices);
    var vbo = gl.createBuffer();
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten_vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(flatten_indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    this.vbo = vbo;
    this.ibo = ibo;
    this.count = flatten_indices.length;
    this.gl = gl;
  }

  MyObject.prototype.bind = function () {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
  };

  MyObject.prototype.draw = function () {
    this.bind();
    this.gl.drawElements(this.gl.TRIANGLES, this.count, this.gl.UNSIGNED_SHORT, 0);
  };

  return MyObject;
}();

exports.MyObject = MyObject;

function flatten(arr) {
  return arr.reduce(function (acc, x) {
    return acc.concat(x);
  });
}
},{}],"hexagon.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MyObject_1 = require("./MyObject");

function getHexagon(gl, length) {
  return new MyObject_1.MyObject(gl, getVertices(length), getIndicese(length));
}

exports.getHexagon = getHexagon;

function getVertices(length) {
  var th = 1.0 / length;
  var tw2 = th / Math.sqrt(3);
  var tw = tw2 * 2;
  var arr = [];

  for (var i = -length; i <= length; i++) {
    var absi = Math.abs(i);
    var y = th * i;
    var x = tw2 * absi - 2.0 / Math.sqrt(3);
    var n = length * 2 + 1 - absi;

    for (var j = 0; j < n; j++) {
      arr.push([x, y]);
      x += tw;
    }
  }

  return arr;
}

function triangles(top, bottom, n) {
  var t = top;
  var b = bottom;
  var arr = [];

  for (var i = 0; i < n; i++) {
    arr.push([t, b, b + 1]);
    t++;
    b++;
  }

  return arr;
}

function getIndicese(length) {
  var index = 0;
  var num_triangles = length;
  var arr = [];

  for (var i = 0; i < length; i++) {
    var next_index = index + length + i + 1;
    arr = arr.concat(triangles(next_index + 1, index, num_triangles++));
    arr = arr.concat(triangles(index, next_index, num_triangles));
    index = next_index;
  }

  for (var i = 0; i < length; i++) {
    var next_index = index + 2 * length - i + 1;
    arr = arr.concat(triangles(next_index, index, num_triangles--));
    arr = arr.concat(triangles(index + 1, next_index, num_triangles));
    index = next_index;
  }

  return arr;
}
},{"./MyObject":"MyObject.ts"}],"assets/images/theta360me.jpg":[function(require,module,exports) {
module.exports = "/theta360me.0da67ed4.jpg";
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var hexagon_1 = require("./hexagon");

var theta360me_jpg_1 = __importDefault(require("./assets/images/theta360me.jpg"));

var gl;

window.onload = function () {
  var c = document.getElementById("webgl");
  var width = c.width;
  var height = c.height;

  var _gl = c.getContext("webgl");

  if (!_gl) {
    alert("ERROR: WebGL API is not available");
    return;
  }

  gl = _gl;

  if (!gl.getExtension("OES_standard_derivatives")) {
    alert("ERROR: Extension 'OES_standard_derivatives' was not found");
  }

  glInit(width, height);
  var vs = "\n    #define M_PI_INV 0.3183098861837907\n    #define M_PI_INV_HALF 0.15915494309189535\n\n    attribute vec2 xy;\n    varying float u1, u2, v, r;\n\n    void main(void) {\n      float z2 = 1.0 - dot(xy, xy);\n      float mask = step(0.0, z2);\n      float z = sqrt(z2 * mask);\n      vec3 normal = vec3(xy, z);\n      vec3 view = vec3(0.0, 0.0, 1.0);\n      vec3 light = normal * (2.0 * z) - view;\n      v = acos(light.y) * M_PI_INV;\n      u1 = atan(light.x, light.z) * M_PI_INV_HALF;\n      if(u1 > 0.0) {\n        u2 = u1;\n      } else {\n        u2 = u1 + 1.0;\n      }\n      gl_Position = vec4(xy, 0.0, 1.0);\n      r = mask;\n    }";
  var fs = "#extension GL_OES_standard_derivatives : enable\n    precision mediump float;\n    uniform sampler2D texture;\n    varying float u1, u2, v, r;\n\n    void main(void) {\n      float u;\n      if(fwidth(u1) <= fwidth(u2)) {\n        u = u1;\n      } else {\n        u = u2;\n      }\n      vec2 uv = vec2(u, v);\n      vec4 smpColor = texture2D(texture, uv);\n      vec3 vColor = smpColor.xyz * r;\n      gl_FragColor = vec4(vColor, 1.0);\n  }";

  var _program = create_program(vs, fs);

  if (!_program) {
    console.log("ERROR: failed to create a program.");
    return;
  }

  var program = _program;
  var location_xy = gl.getAttribLocation(program, "xy");
  gl.enableVertexAttribArray(location_xy);
  var hexagon = hexagon_1.getHexagon(gl, 16);
  hexagon.bind();
  gl.vertexAttribPointer(location_xy, 2, gl.FLOAT, false, 0, 0);
  var location_t = gl.getUniformLocation(program, "texture");
  var updateTexture = init_texture(location_t);
  updateTexture(theta360me_jpg_1.default);
  setInterval(function () {
    hexagon.draw();
    gl.flush();
  }, 1000);
  console.log("DONE.");
};

function glInit(width, height) {
  gl.viewport(0, 0, width, height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function create_program(vs, fs) {
  var _program = gl.createProgram();

  if (!_program) {
    return null;
  }

  var program = _program;
  gl.attachShader(program, create_shader(vs, gl.VERTEX_SHADER));
  gl.attachShader(program, create_shader(fs, gl.FRAGMENT_SHADER));
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(program);
    return program;
  } else {
    alert(gl.getProgramInfoLog(program));
    return null;
  }
}

function create_shader(code, shader_type) {
  var _shader = gl.createShader(shader_type);

  if (!_shader) {
    return null;
  }

  var shader = _shader;
  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
}

function init_texture(location) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture); // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.

  var level = 0;
  var internalFormat = gl.RGB;
  var width = 1;
  var height = 1;
  var border = 0;
  var srcFormat = internalFormat;
  var srcType = gl.UNSIGNED_BYTE;
  var pixel = new Uint8Array([0, 0, 255]); // opaque blue

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.uniform1i(location, 0);
  return function (imgSrc) {
    var img = new Image();

    img.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, img);
    };

    img.src = imgSrc;
  };
}
},{"./hexagon":"hexagon.ts","./assets/images/theta360me.jpg":"assets/images/theta360me.jpg"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35699" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.map