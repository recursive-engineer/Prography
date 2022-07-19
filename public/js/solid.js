class Node {
  constructor(xx, yy, zz) {
    this.x = xx;
    this.y = yy;
    this.z = zz;
    this.tx = 0;
    this.ty = 0;

    this.sc = 7000;
    this.project();
  }

  project() {
    let gx = this.x;
    let gy = this.y;
    let gz = this.z + 8000;

    this.tx = (this.sc * gx) / gz;
    this.ty = (this.sc * gy) / gz;
  }

  rotate(rx, ry, rz) {
    let x0 = this.x * Math.cos(ry) - this.z * Math.sin(ry);
    let y0 = this.y;
    let z0 = this.x * Math.sin(ry) + this.z * Math.cos(ry);

    let x1 = x0;
    let y1 = y0 * Math.cos(rx) - z0 * Math.sin(rx);
    let z1 = y0 * Math.sin(rx) + z0 * Math.cos(rx);

    this.x = x1 * Math.cos(rz) - y1 * Math.sin(rz);
    this.y = x1 * Math.sin(rz) + y1 * Math.cos(rz);
    this.z = z1;

    this.project();
  }
}

let node = new Array();

let degX = Math.PI * 0.2;
let degY = -Math.PI * 0.2;
let degZ = -Math.PI * 0.0;

function setup() {
  let edgeLen = 50;

  node[0] = new Node(edgeLen, edgeLen, edgeLen);
  node[1] = new Node(edgeLen, edgeLen, -edgeLen);
  node[2] = new Node(-edgeLen, edgeLen, -edgeLen);
  node[3] = new Node(-edgeLen, edgeLen, edgeLen);
  node[4] = new Node(edgeLen, -edgeLen, edgeLen);
  node[5] = new Node(edgeLen, -edgeLen, -edgeLen);
  node[6] = new Node(-edgeLen, -edgeLen, -edgeLen);
  node[7] = new Node(-edgeLen, -edgeLen, edgeLen);
}

function loop(canvas, ctx) {
  for (let i = 0; i < node.length; ++i) {
    node[i].rotate(degX, degY, degZ);
  }

  let screenWidth = canvas.width;
  let screenHeight = canvas.height;
  ctx.clearRect(0, 0, screenWidth, screenHeight);

  ctx.save();
  ctx.translate(screenWidth / 2, screenHeight / 2);

  ctx.lineWidth = 1;
  ctx.lineJoin = "round";

  //console.log(node[0].tx+","+node[0].ty);
  //console.log(node[1].tx+","+node[1].ty);
  //console.log(node[2].tx+","+node[2].ty);

  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(node[0].tx, node[0].ty);
  ctx.lineTo(node[1].tx, node[1].ty);
  ctx.lineTo(node[2].tx, node[2].ty);
  ctx.lineTo(node[3].tx, node[3].ty);
  ctx.lineTo(node[0].tx, node[0].ty);
  ctx.lineTo(node[4].tx, node[4].ty);
  ctx.lineTo(node[5].tx, node[5].ty);
  ctx.lineTo(node[6].tx, node[6].ty);
  ctx.lineTo(node[7].tx, node[7].ty);
  ctx.lineTo(node[4].tx, node[4].ty);
  ctx.moveTo(node[1].tx, node[1].ty);
  ctx.lineTo(node[5].tx, node[5].ty);
  ctx.moveTo(node[2].tx, node[2].ty);
  ctx.lineTo(node[6].tx, node[6].ty);
  ctx.moveTo(node[3].tx, node[3].ty);
  ctx.lineTo(node[7].tx, node[7].ty);

  ctx.stroke();

  ctx.restore();
}

export { Node, setup, loop };
