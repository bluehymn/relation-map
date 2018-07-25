import { Rect, Text, Group, Layer } from "konva";
import { MapLine } from "./MapLine";
import { MapNodeText } from "./MapText";
import { MapRectShape } from "./MapShape";
import { MapGroup } from "./MapGroup";
import { MapLayer } from "./MapLayer";
import { calcPoint } from "./utils";

let allMapNodes = {};

export function getMapNodeById(id: number) {
  return allMapNodes[id];
}

export abstract class MapNode {
  static mapNodeId = 0;
  static mapNodes: any;
  id: number;
  shape: Rect;
  mapShapeNode: any;
  linkedLines: MapLine[] = [];
  mapGroup: MapGroup;
  mapLayer: MapLayer;
  mapTextNode: MapNodeText;
  parentMapNode: MapNode;
  childrenElem: MapNode[];
  draggable: boolean;
  data: any;
  width: number;
  height: number;
  linkPoints: number[][];

  constructor(
    id: number,
    text: string,
    mapLayer: MapLayer,
    x: number,
    y: number,
    parentMapNode: MapNode | null,
    draggable: boolean,
    data: any,
    style?: any
  ) {
    this.id = id;
    this.mapLayer = mapLayer;
    this.parentMapNode = parentMapNode;
    this.draggable = draggable;
    this.data = data;

    this.mapTextNode = new MapNodeText(text, 0, 0, style.color);

    this.width = this.mapTextNode.kText.width();
    this.height = this.mapTextNode.kText.height();

    this.mapGroup = new MapGroup(
      x - this.width / 2,
      y - this.height / 2,
      draggable
    );
    this.mapGroup.add(this.mapTextNode);
    this.mapLayer.add(this.mapGroup);

    allMapNodes[id] = this;
  }

  bindLine(mapLine: MapLine) {
    this.linkedLines.push(mapLine);
  }
}

export class RectMapNode extends MapNode {
  mapShapeNode: MapRectShape;
  constructor(
    id: number,
    text: string,
    mapLayer: MapLayer,
    x: number,
    y: number,
    parentMapNode: MapNode | null,
    draggable: boolean,
    data: any,
    style?: any
  ) {
    super(id, text, mapLayer, x, y, parentMapNode, draggable, data, style);

    const width = this.mapTextNode.kText.getWidth();
    const height = this.mapTextNode.kText.getHeight();

    const mapRectShape = new MapRectShape({ width, height, ...style });
    this.mapShapeNode = mapRectShape;

    this.mapGroup.kGroup.add(mapRectShape.kShape);
    this.mapTextNode.kObject.moveToTop();

    this.calcLinkPoints();

    if (draggable) {
      this.bindDrag();
    }
  }

  calcLinkPoints() {
    const point0 = [this.width / 2, 0];
    const point1 = [this.width, this.height / 2];
    const point2 = [this.width / 2, this.height];
    const point3 = [0, this.height / 2];
    this.linkPoints = [point0, point1, point2, point3];
  }

  bindDrag() {
    const group = this.mapGroup.kGroup;
    const thisNode = this;
    group.on("dragmove", () => {
      this.linkedLines.forEach((linkedLine: MapLine) => {
        linkedLine.reDraw();
      });
    });
    group.on("tap", event => {
      console.log(event.target);
    });
  }
}
