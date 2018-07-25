import { Stage, Layer, Text, Rect, Group } from "konva";
import {MapLayer} from "./MapLayer";
import { MapNode, RectMapNode, getMapNodeById } from "./MapNode";
import {MapLine} from "./MapLine";
import { calcPoint, calcMapNodeCoordinate } from "./utils";
import {MapRectShapeConfig} from './MapShape';

export default class RelationMap {
  layers: MapLayer[] = [];
  nodes: MapNode[] = [];
  lines: MapLine[] = [];
  stage: Stage;
  rootNode: MapNode;
  nodeKLayer: Layer;
  arrangedNodesCount = 0;

  constructor(containerId) {
    this.stage = this.genStage(containerId);
  }

  private genStage(containerId) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return new Stage({
      container: containerId,
      width: width,
      height: height,
      x: width / 2,
      y: height / 2,
      offset: {
        x: width / 2,
        y: height / 2
      },
      draggable: true
    });
  }

  private genMapLayer(): MapLayer {
    const mapLayer = new MapLayer();
    this.layers.push(mapLayer);
    return mapLayer;
  }

  genMap(nodes: NodeInfo[], links: LinkInfo[]) {
    const mapLayer = this.genMapLayer();
    const kLayer = mapLayer.kObject;

    nodes.forEach((nodeInfo: NodeInfo) => {
      if (nodeInfo.innode) {
        this.rootNode = this.genMapNode(
          nodeInfo,
          mapLayer,
          this.stage.getWidth() / 2,
          this.stage.getHeight() / 2,
          null,
          false,
          {
            fill: '#628DCD',
            color: '#fff'
          }
        );
      }
    });

    const posX = this.rootNode.mapGroup.kGroup.getAttr('x') + this.rootNode.width / 2;
    const posY = this.rootNode.mapGroup.kGroup.getAttr('y') + this.rootNode.height / 2;

    nodes = nodes.filter((nodeInfo: NodeInfo) => {
      return !nodeInfo.innode
    });

    nodes.forEach((nodeInfo: NodeInfo, index) => {
      const centerCoordinate = [
        posX,
        posY
      ];
      const coordinate = calcMapNodeCoordinate(
        index,
        centerCoordinate
      );
      if (!nodeInfo.innode) {
        this.genMapNode(
          nodeInfo,
          mapLayer,
          coordinate[0],
          coordinate[1],
          null,
          true,
          {
            color: '#657899'
          }
        );
      }
    })

    console.log('links', links)

    this.genLines(links, mapLayer);

    this.stage.add(kLayer);
    this.nodeKLayer = kLayer;
    this.nodeKLayer.draw();
    this.stageBindZoom();

  }

  genLines(links: LinkInfo[], mapLayer: MapLayer) {
    links.forEach(link => {
      const mapLine = new MapLine(getMapNodeById(link.from), getMapNodeById(link.to), mapLayer, link.lineLabel0, link.lineLabel1);
    })
  }

  private genMapNode(nodeInfo: NodeInfo, mapLayer: MapLayer, x: number, y: number, parentMapNode: MapNode, draggable: boolean, style?: NodeStyle): MapNode {
    let mapNode;

    mapNode = new RectMapNode(
      nodeInfo.id,
      nodeInfo.name,
      mapLayer,
      x,
      y,
      parentMapNode,
      draggable,
      nodeInfo,
      style
    );

    this.nodes.push(mapNode);

    return mapNode;
  }

  stageBindZoom() {
    let startDistance = 0;
    let initScaleRatio = 1;
    let scaleRatio = 1;
    this.stage.container().addEventListener("touchstart", e => {
      const touches = e.touches;
      if (touches.length > 1) {
        const touch0 = touches[0];
        const touch1 = touches[1];
        const d =
          (touch0.clientX - touch1.clientX) *
            (touch0.clientX - touch1.clientX) +
          (touch0.clientY - touch1.clientY) * (touch0.clientY - touch1.clientY);
        startDistance = Math.pow(d, 0.5);
      }
    });
    this.stage.container().addEventListener("touchmove", e => {
      const touches = e.touches;
      if (touches.length > 1) {
        const touch0 = touches[0];
        const touch1 = touches[1];
        const d =
          (touch0.clientX - touch1.clientX) *
            (touch0.clientX - touch1.clientX) +
          (touch0.clientY - touch1.clientY) * (touch0.clientY - touch1.clientY);
        const distance = Math.pow(d, 0.5);
        scaleRatio = (distance / startDistance) * initScaleRatio;
        this.stage.scale({
          x: scaleRatio,
          y: scaleRatio
        });
      }
    });
    this.stage.container().addEventListener("touchend", e => {
      initScaleRatio = scaleRatio;
    });
  }
}

interface NodeInfo {
  id: number;
  name: string;
  type: number;
  innode: boolean;
  properties: any;
}

interface LinkInfo {
  id: number;
  type: number;
  from: number;
  to: number;
  properties: any;
  lineLabel0: any;
  lineLabel1: any;
}

interface NodeStyle {
  color?: string;
  fill?: string;
}
