import { Loader, SoundLayer } from "@gdk/core";
import type { IButtonStyle, IStyle, IStyles } from "@gdk/core-pixi";
import { Button } from "@gdk/core-pixi";

export class SfxButton extends Button {
  private sfx: Howl;

  public constructor(style?: IButtonStyle, textStyle?: IStyle | IStyles, text?: string) {
    super(style, textStyle, text);

    this.sfx = Loader.get<Howl>("sfx-button");
    SoundLayer.setSoundLayer(this.sfx, 2);

    this.on("pointertap", () => {
      this.sfx.play();
    });
  }
}
