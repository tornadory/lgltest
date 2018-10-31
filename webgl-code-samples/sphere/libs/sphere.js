// function sphere(row, column, rad, color) {
//     let positions = new Array(),
//         normals = new Array(),
//         colors = new Array(),
//         uv = new Array(),
//         index = new Array();
//     let tcol = undefined;

//     //yz平面上的半圆周
//     //y = cos r, x = 0, z = sin r
//     //圆,绕y轴旋转360度得到完整的球
//     //x = rad * sin r * cos tr, y = rad * cos r, z = rad * sin r * sin tr
//     for (let i = 0; i <= row; i++) {
//         let r = Math.PI / row * i;
//         let ry = Math.cos(r);
//         let rr = Math.sin(r);
//         for (let j = 0; j <= column; j++) {
//             let tr = Math.PI * 2.0 / column * j;
//             let tx = rr * rad * Math.cos(tr);
//             let ty = ry * rad;
//             let tz = rr * rad * Math.sin(tr);
//             let rx = rr * Math.cos(tr);
//             let rz = rr * Math.sin(tr);

//             if (color) {
//                 tcol = color;
//             } else {
//                 tcol = hsva(360 / row * i, 1, 1, 1);
//             }
//             positions.push(tx, ty, tz);
//             normals.push(rx, ry, rz);
//             colors.push(tcol[0], tcol[1], tcol[2], tcol[3]);
//             uv.push(1 - 1 / column * j, 1 / row * i);
//         }
//     }

//     let r = 0;
//     for (let i = 0; i < row; i++) {
//         for (let j = 0; j < column; j++) {
//             r = (column + 1) * i + j;
//             index.push(r, r + 1, r + column + 2);
//             index.push(r, r + column + 2, r + column + 1);
//         }
//     }

//     return {
//         positions: positions,
//         normals: normals,
//         colors: colors,
//         uvs: uv,
//         index: index
//     }

// }

function sphere(row, column, rad, color) {
    var pos = new Array(),
        nor = new Array(),
        col = new Array(),
        idx = new Array();
    for (var i = 0; i <= row; i++) {
        var r = Math.PI / row * i;
        var ry = Math.cos(r);
        var rr = Math.sin(r);
        for (var ii = 0; ii <= column; ii++) {
            var tr = Math.PI * 2 / column * ii;
            var tx = rr * rad * Math.cos(tr);
            var ty = ry * rad;
            var tz = rr * rad * Math.sin(tr);
            var rx = rr * Math.cos(tr);
            var rz = rr * Math.sin(tr);
            if (color) {
                var tc = color;
            } else {
                tc = hsva(360 / row * i, 1, 1, 1);
            }
            pos.push(tx, ty, tz);
            nor.push(rx, ry, rz);
            col.push(tc[0], tc[1], tc[2], tc[3]);
        }
    }
    r = 0;
    for (i = 0; i < row; i++) {
        for (ii = 0; ii < column; ii++) {
            r = (column + 1) * i + ii;
            idx.push(r, r + 1, r + column + 2);
            idx.push(r, r + column + 2, r + column + 1);
        }
    }
    // return {
    //     p: pos,
    //     n: nor,
    //     c: col,
    //     i: idx
    // };

    return {
        positions: pos,
        normals: nor,
        colors: col,
        // uvs: uv,
        index: idx
    }
}

function hsva(h, s, v, a) {
    if (s > 1 || v > 1 || a > 1) {
        return;
    }
    var th = h % 360;
    var i = Math.floor(th / 60);
    var f = th / 60 - i;
    var m = v * (1 - s);
    var n = v * (1 - s * f);
    var k = v * (1 - s * (1 - f));
    var color = new Array();
    if (!s > 0 && !s < 0) {
        color.push(v, v, v, a);
    } else {
        var r = new Array(v, n, m, m, k, v);
        var g = new Array(k, v, v, n, m, m);
        var b = new Array(m, m, k, v, v, n);
        color.push(r[i], g[i], b[i], a);
    }
    return color;
}