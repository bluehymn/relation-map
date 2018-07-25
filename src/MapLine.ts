import { Arrow } from "konva";
import { MapNode } from "./MapNode";
import { calcPoint } from "./utils";
import { MapLayer } from "./MapLayer";
import { MapLineLabelText } from './MapText';
import { MapRectShape } from "./MapShape";

export class MapLine {
  static mapLineId = 0;
  static mapLines: MapLine[] = [];
  id: number;
  kLine: Arrow;
  node: MapNode;
  parentNode: MapNode;
  labelText0: MapLineLabelText;
  labelBg0: MapRectShape;
  labelText1: MapLineLabelText;
  labelBg1: MapRectShape;
  from: MapNode;
  to: MapNode;

  constructor(from: MapNode, to: MapNode, mapLayer: MapLayer, label0?: string, label1?: string) {
    const points = calcPoint(from, to);
    this.id = MapLine.mapLineId++;
    this.from = from;
    this.to = to;

    this.from.bindLine(this);
    this.to.bindLine(this);

    const thisMapLine = this;
    MapLine.mapLines.push(thisMapLine);

    this.kLine = new Arrow({
      points: points,
      tension: 10,
      fill: '#ccc',
      stroke: '#ccc',
      strokeWidth: 1,
      lineCap: 'round',
      lineJoin: 'round'
    });

    mapLayer.add(this);

    if (label0 !== null) {
      let width = 60
      let height = 20
      this.labelBg0 = new MapRectShape({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: '#fff'
      })
      mapLayer.add(this.labelBg0);

      this.labelText0 = new MapLineLabelText(label0, 0, 0, width, height);
      mapLayer.add(this.labelText0);
    }

    if (label1 !== null) {
      let width = label1.length * 12 + 20;
      let height = 20
      this.labelBg1 = new MapRectShape({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: '#fff'
      })
      mapLayer.add(this.labelBg1);

      this.labelText1 = new MapLineLabelText(label1, 0, 0, width, height);
      mapLayer.add(this.labelText1);
    }
    this.positionLabelText();
  }

  positionLabelText() {
    const points = calcPoint(this.from, this.to);

    if (this.labelText0 || this.labelText1) {
      if (this.labelText0) {
        this.labelText0.positionTo((points[0] + points[2]) / 2, (points[1] + points[3]) / 2);
        this.labelBg0.positionTo((points[0] + points[2]) / 2 - 25, (points[1] + points[3]) / 2 - 8);
      }
      if (this.labelText1) {
        this.labelText1.positionTo((points[0] + points[2]) / 2, (points[1] + points[3]) / 2);
        this.labelBg1.positionTo((points[0] + points[2]) / 2 - this.labelBg1.kShape.width() / 2, (points[1] + points[3]) / 2 - 8);
      }
    }

    if (this.labelText0 && this.labelText1) {
      if (this.labelText0) {
        this.labelText0.positionTo((points[0] + points[2]) / 2, (points[1] + points[3]) / 2 - 5);
        this.labelBg0.positionTo((points[0] + points[2]) / 2 - 30, (points[1] + points[3]) / 2 - 15);
      }
      if (this.labelText1) {
        this.labelText1.positionTo((points[0] + points[2]) / 2, (points[1] + points[3]) / 2 + 16);
        this.labelBg1.positionTo((points[0] + points[2]) / 2 - this.labelBg1.kShape.width() / 2, (points[1] + points[3]) / 2 + 8);
      }
    }
    
  }

  reDraw() {
    const points = calcPoint(this.from, this.to);
    this.kLine.points(points);
    this.positionLabelText();
  }
  
  get kObject() {
    return this.kLine;
  }
}
