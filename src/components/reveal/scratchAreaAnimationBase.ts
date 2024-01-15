import type { TimelineMax } from "gsap";
import { Container } from "pixi.js";

export default class ScratchAreaAnimationBase extends Container {
  protected timelines: TimelineMax[] = [];
  protected elements: Container;
  private _active: boolean;

  public constructor() {
    super();

    this.elements = new Container();
    this.addChild(this.elements);
    this.active = true;
  }

  public play(): void {
    this.timelines.forEach((timeline) => {
      timeline.play();
    });
  }

  public pause(): void {
    this.timelines.forEach((timeline) => {
      timeline.pause();
    });
  }

  public reset(): void {
    this.active = true;
    this.play();
  }

  public async end(callBack: Function): Promise<void> {
    this.timelines.forEach((element) => {
      element.pause();
    });

    await callBack();
  }

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean) {
    this._active = value;
    this.visible = value;
    this.interactive = value;
  }
}
