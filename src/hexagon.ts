import { MyObject } from "./MyObject";

export function getHexagon(length: number): MyObject {
  return {
    vertices: getVertices(length),
    indices: getIndicese(length)
  };
}

function getVertices(length: number): number[][] {
  const th = 1.0 / length;
  const tw2 = th / Math.sqrt(3);
  const tw = tw2 * 2;

  const arr = [];
  for (let i = -length; i <= length; i++) {
    const absi = Math.abs(i);

    const y = th * i;
    let x = tw2 * absi - 2.0 / Math.sqrt(3);
    const n = length * 2 + 1 - absi;

    for (let j = 0; j < n; j++) {
      arr.push([x, y]);
      x += tw;
    }
  }

  return arr;
}

function triangles(top: number, bottom: number, n: number): number[][] {
  let t = top;
  let b = bottom;
  const arr = [];

  for (var i = 0; i < n; i++) {
    arr.push([t, b, b + 1]);
    t++;
    b++;
  }

  return arr;
}

function getIndicese(length: number): number[][] {
  let index = 0;
  let num_triangles = length;
  let arr: number[][] = [];

  for (let i = 0; i < length; i++) {
    const next_index = index + length + i + 1;
    arr = arr.concat(triangles(next_index + 1, index, num_triangles++));
    arr = arr.concat(triangles(index, next_index, num_triangles));
    index = next_index;
  }

  for (let i = 0; i < length; i++) {
    const next_index = index + 2 * length - i + 1;
    arr = arr.concat(triangles(next_index, index, num_triangles--));
    arr = arr.concat(triangles(index + 1, next_index, num_triangles));
    index = next_index;
  }

  return arr;
}
