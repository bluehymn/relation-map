import {MapNode} from './MapNode';

export function calcPoint(node0: MapNode, node1: MapNode): number[] {

  const shape0 = node0.mapShapeNode.kObject;
  const offset0 = {
    x: shape0.getWidth() / 2,
    y: shape0.getHeight() / 2
  }
  const group0 = node0.mapGroup;
  const posX0 = group0.kObject.getAttr("x");
  const posY0 = group0.kObject.getAttr("y");

  const shape1 = node1.mapShapeNode.kObject;
  const offset1 = {
    x: shape1.getWidth() / 2,
    y: shape1.getHeight() / 2
  }
  const group1 = node1.mapGroup;
  const posX1 = group1.kObject.getAttr("x");
  const posY1 = group1.kObject.getAttr("y");

  // 查找最近距离连接点
  const linkPoints0 = node0.linkPoints;
  const linkPoints1 = node1.linkPoints;

  let linkPoint0, linkPoint1, distance = Infinity;
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      let dis = Math.pow((posX0 + linkPoints0[i][0]) - (posX1 + linkPoints1[j][0]), 2) + Math.pow((posY0 + linkPoints0[i][1]) - (posY1 + linkPoints1[j][1]), 2);
      if (dis < distance) {
        linkPoint0 = linkPoints0[i];
        linkPoint1 = linkPoints1[j];
        distance = dis;
      }
    }
  }

  return [posX0 + linkPoint0[0], posY0 + linkPoint0[1], posX1 + linkPoint1[0], posY1 + linkPoint1[1]];
}

export function calcMapNodeCoordinate(nodesLength: number, centerCoordinate: number[]) {
  const unitRadius = 160;
  const firstCircleNodeNumber = 8;
  // TODO
  let circleNumber = 1;
  let rest = nodesLength + 1;
  let order = 0;
  let circleNodeNumber = 0;
  // 计算order
  while (rest > 0) {
    rest = rest - firstCircleNodeNumber * Math.pow(2, circleNumber - 1); 
    if (rest > 0) {
      order = rest - 1;
      circleNumber++;
    }
    if (rest < 0 && circleNumber === 1) {
      order = rest;
    } 
  }

  circleNodeNumber = firstCircleNodeNumber * Math.pow(2, circleNumber - 1);
  let angle = order / circleNodeNumber * 2 * Math.PI;
  if (circleNumber !== 1) {
    angle += 1 / circleNodeNumber * 2 * Math.PI;
  }

  let x = unitRadius * circleNumber * Math.cos(angle) + centerCoordinate[0];
  let y = unitRadius * circleNumber * Math.sin(angle) * -1 + centerCoordinate[1];
  x = Math.floor(x);
  y = Math.floor(y);
  return [x, y];
}