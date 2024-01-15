import type { Point } from "pixi.js";
import { Graphics } from "pixi.js";

export class ProtectionOverlay extends Graphics {
  private _active: boolean;

  public constructor(points: Point[], clickAction: Function) {
    super();

    this.lineStyle(5, 0x000000, 0.5); // For testing purpose only - replace with this.lineStyle(0);
    this.beginFill(0x000000, 0);
    this.drawPolygon(points);
    this.closePath();
    this.endFill();

    // Protect by default
    this.active = true;

    this.on("pointertap", async (): Promise<void> => {
      if (!this.active) {
        return;
      }

      await clickAction();
    });
  }

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean) {
    this._active = value;
    this.interactive = this._active;
    this.visible = this._active; // For testing purpose only - delete line
  }
}
