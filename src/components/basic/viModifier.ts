import type { Button, LoadedView } from "@gdk/core-pixi";
import { Docking, DockingBounds } from "@gdk/core-pixi";
import { Point, Rectangle, Texture } from "pixi.js";
import { Loader, SoundLayer } from "@gdk/core";

import { Templates } from "./templates";
import type { INineSlicePlane } from "../interfaces/inineSlicePlane";
import type { IInGameView } from "../interfaces/iinGameView";

export class ViModifier {
  private sfx: Howl;

  public constructor(view: LoadedView) {
    const inGameView = view as IInGameView;
    const settings = inGameView.settingsComponent;

    settings.background.texture = Texture.fromImage(Templates.frame.fill);
    settings.backgroundNineSlice.texture = Texture.fromImage(Templates.frame.fill);

    const outline = settings.children[0] as INineSlicePlane;
    outline.texture = Texture.fromImage(Templates.frame.outline);

    settings.title.styles = Templates.defaultTitleStyle;

    this.sfx = Loader.get<Howl>("sfx-button");
    SoundLayer.setSoundLayer(this.sfx, 2);

    inGameView.bottomBar.settingsButton.on("pointertap", () => {
      this.sfx.play();
    });

    this.updateButton(settings.aboutButton);
    this.updateButton(settings.rulesButton);
    this.updateButton(settings.winningTableButton);
    this.updateButton(settings.instructionsButton);
    this.updateButton(settings.quitButton);
    this.updateCloseButton(settings.closeButton);

    const quitPopin = inGameView.quitPopin;

    quitPopin.background.texture = Texture.fromImage(Templates.frame.fill);
    quitPopin.backgroundNineSlice.texture = Texture.fromImage(Templates.frame.fill);

    const quitOutline = quitPopin.children[0] as INineSlicePlane;
    quitOutline.texture = Texture.fromImage(Templates.frame.outline);

    quitPopin.title.styles = Templates.defaultTitleStyle;
    quitPopin.body.styles = Templates.defaultTextStyle;

    this.updateButton(quitPopin.confirmQuitButton);
    this.updateCloseButton(quitPopin.closeButton);
  }

  private updateButton(button: Button) {
    button.nineSliceMinSize = new Point(400, 100);
    button.nineSlicePadding = new Rectangle(0, 0, 0, 0);

    button.backgroundNineSlice.texture = Texture.fromImage(Templates.secondaryButton.idleTexture);

    button.idleTexture = Texture.fromImage(Templates.secondaryButton.idleTexture);
    button.overTexture = Texture.fromImage(Templates.secondaryButton.overTexture);
    button.disabledTexture = Texture.fromImage(Templates.secondaryButton.disabledTexture);
    button.clickedTexture = Texture.fromImage(Templates.secondaryButton.clickedTexture);

    button.text.styles = Templates.buttonTextStyle;
    button.label = button.label; // redraw button

    button.on("pointertap", () => {
      this.sfx.play();
    });
  }

  private updateCloseButton(button: Button) {
    button.children[2].destroy();
    button.backgroundSprite.texture = Texture.fromImage(Templates.closeButton.idleTexture);
    button.idleTexture = Texture.fromImage(Templates.closeButton.idleTexture);
    button.overTexture = Texture.fromImage(Templates.closeButton.overTexture);
    button.disabledTexture = Texture.fromImage(Templates.closeButton.disabledTexture);
    button.clickedTexture = Texture.fromImage(Templates.closeButton.clickedTexture);
    button.scale.set(0.8, 0.8);
    button.dockingBounds = new DockingBounds(51, 51);
    button.docking = new Docking(Docking.topRight);
    button.docking.position.set(-22, 25);

    button.on("pointertap", () => {
      this.sfx.play();
    });
  }
}
