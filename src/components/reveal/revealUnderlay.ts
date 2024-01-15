import { Graphics } from "pixi.js";

import type Game from "../..";

export class RevealUnderlay extends Graphics {
  private game: Game;
  private _active: boolean;

  public constructor(game: Game, tapAction: Function) {
    super();

    this.game = game;

    this.beginFill(0xffffff, 0.45);
    this.drawRect(0, 0, this.game.parameters.width, this.game.parameters.width);
    this.endFill();
    this.scale.set(1, this.game.gameAspect);

    this.active = false;

    this.on("pointertap", async (): Promise<void> => {
      if (this.active) {
        this.active = false;
        await tapAction();
      }
    });
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
