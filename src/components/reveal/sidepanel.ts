import { Sprite, Texture } from "pixi.js";
import Game from "../..";
import { FadeContainer } from "../basic/fadeContainer";

export class SidePanel extends FadeContainer {
  private panel: Sprite;
  private game: Game;

  public constructor(game: Game) {
    super();

    this.game = game;

    this.position.set(this.rightPosition, 150);

    this.panel = new Sprite(Texture.fromImage("vi/sidepanel"));
    this.panel.anchor.set(1, 0);
    this.panel.position.set(-20, 0);

    this.addChild(this.panel);
  }

  public onResize(): void {
    this.position.x = this.rightPosition;
  }

  private get rightPosition(): number {
    let oversize = ((1200 / this.game.gameAspect) - 1920);
    let width = 1920;

    if (oversize < 0) {
      oversize = 0;
    }

    return width + oversize / 2;
  }
}