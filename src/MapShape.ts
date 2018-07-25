import { Rect } from "konva";

abstract class Shape {
  static shapeId = 0;
  kShape: any;
  constructor() {
    Shape.shapeId++;
  }
  get kObject() {
    return this.kShape
  }
}

export class MapRectShape extends Shape {
  kShape: Rect;
  id: string;

  constructor(config: MapRectShapeConfig) {
    super();
    const id = Shape.shapeId++;
    this.id = id.toString();
    let baseConfig = {
      id: this.id,
      x: 0,
      y: 0,
      // stroke: "#555",
      // strokeWidth: 2,
      fill: "#F2F3FC",
      width: 0,
      height: 0,
      // shadowColor: "black",
      // shadowBlur: 10,
      // shadowOpacity: 0.2,
      cornerRadius: 30,
      // opacity: 0.5
    };
    config = Object.assign(baseConfig, config);
    this.kShape = new Rect(config);
  }

  positionTo(x, y) {
    this.kShape.x(x);
    this.kShape.y(y);
  }
}

export interface MapRectShapeConfig {
  x?: number;
  y?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  width?: number;
  height?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
  cornerRadius?: number;
  opacity?: number;
}
