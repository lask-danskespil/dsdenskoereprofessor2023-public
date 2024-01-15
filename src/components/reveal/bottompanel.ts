import { Sprite, Texture } from "pixi.js";
import Game from "../..";
import { Templates } from "../basic/templates";
import { BottomButton } from "./bottomButton";
import { FadeContainer } from "../basic/fadeContainer";

export class BottomPanel extends FadeContainer {
  private game: Game;
  private panel: Sprite;
  private leftButton: BottomButton
  private rightButton: BottomButton
  private isNormal: boolean = true;

  public constructor(game: Game) {
    super();

    this.game = game;
    this.position.set(1920 / 2, 1040);

    this.visible = false;

    this.leftButton = new BottomButton(Templates.leftButton, "AUTOSKRAB", "autoskrab");
    this.leftButton.position.set(-600 - (this.leftButton.width - 150), 6);
    this.addChild(this.leftButton);

    this.leftButton.on("pointertap", () => {
      if (this.isNormal) {
        this.leftButton.updateLabel("      STOP\nAUTOSKRAB");
      } else {
        this.leftButton.updateLabel("AUTOSKRAB");
      }
      this.isNormal = !this.isNormal;
    });

    this.rightButton = new BottomButton(Templates.rightButton, "HINT", "hint");
    this.rightButton.position.set(450, 6);
    this.addChild(this.rightButton);

    this.panel = new Sprite(Texture.fromImage("vi/bottompanel"));
    this.panel.anchor.set(0.5, 0);
    this.addChild(this.panel);
  }

  public onResize(): void {}
}