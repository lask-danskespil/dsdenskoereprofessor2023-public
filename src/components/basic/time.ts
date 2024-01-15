import { TextArea } from "@gdk/core-pixi";
import type { CanvasRenderer, WebGLRenderer } from "pixi.js";
import { Container, Sprite, Texture } from "pixi.js";

export class Time extends Container {
  private label: TextArea;
  private icon: Sprite;
  private hours = -1;
  private minutes = -1;

  public constructor(x: number, y: number, color: string) {
    super();

    this.position.set(x, y);

    if (color === "black" || color === "#000000" || color === "#000") {
      color = "black";
    } else {
      color = "white";
    }
    this.icon = new Sprite(Texture.fromImage("icons/" + color + "/clock"));
    this.icon.anchor.set(0, 0);
    this.addChild(this.icon);

    this.label = new TextArea("", {});
    this.label.position.x = 45;
    this.label.position.y = 2;
    this.label.styles.default.fill = color;
    this.label.styles.default.fontName = "Arial";
    this.label.styles.default.fontSize = 24;
    this.addChild(this.label);
  }

  private setTime(ms: number) {
    const d = new Date(ms);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    if (hours === this.hours && minutes == this.minutes) {
      return;
    }
    this.hours = hours;
    this.minutes = minutes;

    this.label.text = ""
      .concat((hours < 10 ? "0" : "") + hours, ":")
      .concat((minutes < 10 ? "0" : "") + minutes);
  }

  protected _renderCanvas(renderer: CanvasRenderer): void {
    this.setTime(Date.now());
    super._renderCanvas.call(this, renderer);
  }

  protected _renderWebGL(renderer: WebGLRenderer): void {
    this.setTime(Date.now());
    super._renderWebGL.call(this, renderer);
  }
}
