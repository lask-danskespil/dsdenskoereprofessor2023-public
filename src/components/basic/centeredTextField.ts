import type { IStyle } from "@gdk/core-pixi";
import { EAlign, TextField } from "@gdk/core-pixi";

import { Templates } from "./templates";

export class CenteredTextField extends TextField {
  public constructor(text: string, style?: IStyle) {
    super(text, style ? style : Templates.defaultTextStyle);

    this.align = EAlign.Center;
    this.centerPivotOnceUpdated = true;
  }

  public updateText(text: string): void {
    super.update({ text: text });
    this.position.x = this.width / 2;
    this.position.y = this.height / 2;
  }
}
