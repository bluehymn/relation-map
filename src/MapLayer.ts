import {Layer} from 'konva';

export class MapLayer {
  static mapLayerId = 0;
  id: number;
  kLayer: Layer;
  elements: any[] = [];
  constructor() {
    this.id = MapLayer.mapLayerId++;
    this.kLayer = new Layer();
  }
  add(element: any) {
    this.elements.push(element);
    this.kLayer.add(element.kObject);
  }
  get kObject() {
    return this.kLayer
  }
}