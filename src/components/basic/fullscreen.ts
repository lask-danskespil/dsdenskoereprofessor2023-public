import { Container, Sprite, Texture } from "pixi.js";
import { Docking, DockingBounds, Resize } from "@gdk/core-pixi";
import { Loader, SoundLayer } from "@gdk/core";

import { DanskeSpil } from "./helper";
import { EFullscreen } from "./enums";

export class Fullscreen extends Container {
  private sfx: Howl;

  public constructor() {
    super();

    const padding: number = 20;
    const scale: number = 1;

    this.interactive = true;

    this.sfx = Loader.get<Howl>("sfx-button");
    SoundLayer.setSoundLayer(this.sfx, 2);

    this.on("pointertap", () => {
      this.sfx.play();
    });

    this.dockingBounds = new DockingBounds(1920, 1200);
    this.docking = new Docking(Docking.topRight);
    this.resize = new Resize(Resize.contain);

    const onIcon = new Sprite(Texture.fromImage("vi/fullscreen_on"));
    onIcon.scale.set(scale, scale);
    onIcon.docking = new Docking(Docking.topRight);
    onIcon.docking.position.set(padding * -1, padding);
    onIcon.anchor.set(0, 0);
    onIcon.visible = true;
    this.addChild(onIcon);

    const offIcon = new Sprite(Texture.fromImage("vi/fullscreen_off"));
    offIcon.scale.set(scale, scale);
    offIcon.docking = new Docking(Docking.topRight);
    offIcon.docking.position.set(padding * -1, padding);
    offIcon.anchor.set(0, 0);
    offIcon.visible = false;
    this.addChild(offIcon);

    this.on("pointertap", async (): Promise<void> => {
      DanskeSpil.toggleFullScreen().then((data: EFullscreen) => {
        switch (data) {
          case EFullscreen.IsFullscreen:
            onIcon.visible = false;
            offIcon.visible = true;
            this.sfx.play();
            break;
          case EFullscreen.IsNormal:
            onIcon.visible = true;
            offIcon.visible = false;
            this.sfx.play();
            break;
          case EFullscreen.Unsupported:
            onIcon.visible = false;
            offIcon.visible = false;
            this.interactive = false;
            break;
        }
      });
    });
  }
}
