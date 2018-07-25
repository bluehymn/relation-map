import { Text, Rect } from "konva";

abstract class MapText {
  static textId = 0;
  static percentTextId = 0;
  kText: Text;
  id: string;

  constructor(text: string, x: number, y: number) {
    this.id = (MapText.textId++).toString();
  }

  get kObject() {
    return this.kText;
  }
}

export class MapNodeText extends MapText {
  constructor(text: string, x: number, y: number, color) {
    super(text, x, y);
    this.genText(text, x, y, color);
  }
  genText(text, x, y, color) {
    let width = text.length * 12 + 20;
    if (text.length > 8) {
      width = text.length * 8 + 20;
    }
    let config = {
      id: this.id,
      x: x,
      y: y,
      text: text,
      fontSize: 12,
      fontFamily: "Calibri",
      fill: color || "#fff",
      width: width,
      padding: 10,
      align: "center"
    };
    this.kText = new Text(config);
  }
}

export class MapLineLabelText extends MapText {
  bgKRect: Rect;
  constructor(text: string, x: number, y: number, width: number, height: number) {
    super(text, x, y);
    this.genText(text, x, y, width, height);
  }

  genText(text: string, x: number, y: number, width: number, height: number) {
    let config = {
      id: this.id,
      x: x - width / 2,
      y: y - height / 2,
      text: text,
      fontSize: 12,
      fontFamily: "Calibri",
      fill: "#333",
      width: width,
      height: height,
      padding: 5,
      align: "center"
    };
    this.kText = new Text(config);
  }

  positionTo(x, y) {
    this.kText.x(x - this.kText.width() / 2);
    this.kText.y(y - this.kText.height() / 2);
  }
}

interface TextStyle {
  color?: string;
}