import { Group, Layer } from "konva";
import {MapNodeText} from './MapText';
import {MapRectShape} from './MapShape';

export class MapGroup {
  kGroup: Group;
  members: any[] = [];
  constructor(x: number, y: number, draggable: boolean) {
    let config = {
      x,
      y,
      draggable: draggable === false ? false : true
    };
    this.kGroup = new Group(config);
  }
  add(member) {
    let kElement;
    if (member instanceof MapNodeText) {
      kElement = member.kText;
    }
    else if (member instanceof MapRectShape) {
      kElement = member.kShape;
    } else {console.log('type error')}
    this.members.push(member);
    this.kGroup.add(kElement);
  }
  get kObject() {
    return this.kGroup
  }
}
