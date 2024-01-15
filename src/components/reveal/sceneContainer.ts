import { TextArea } from "@gdk/core-pixi";
import { Container } from "pixi.js";

export class PinchInfo {
  public p: PinchData;
  public pp: PinchData;
  public intervalId: any;
}

export class PinchData {
  public distance: number;
  public date: Date;
  public center?: any;

  public constructor(distance: number, date: Date) {
    this.distance = distance;
    this.date = date;
  }
}

export class SceneContainer extends Container {
  public _pinch: PinchInfo;
  public debug: TextArea;



  public constructor() {
    super();
  }

}