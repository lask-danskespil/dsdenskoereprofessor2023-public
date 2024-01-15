import type { IButtonStyle } from "@gdk/core-pixi";
import { EAlign } from "@gdk/core-pixi";
import { Point, Rectangle } from "pixi.js";

import { Templates } from "./templates";
import { DanskeSpil } from "./helper";
import { SfxButton } from "./sfxButton";

export class ViButton extends SfxButton {
  public constructor(style: IButtonStyle, text: string, trackingName?: string) {
    super(style, Templates.viButtonTextStyle, "");

    this.isNineSlice = true;
    this.backgroundNineSlice.rightWidth = 15;
    this.backgroundNineSlice.leftWidth = 15;
    this.backgroundNineSlice.topHeight = 15;
    this.backgroundNineSlice.bottomHeight = 15;
    this.nineSlicePadding = new Rectangle(20, 15, 20, 15);
    this.nineSliceMinSize = new Point(70, 40);
    this.label = text;
    this.text.align = EAlign.Center;
    this.name = "viButton";

    if (!trackingName) {
      trackingName = DanskeSpil.camelize(text);
    }
    this.trackingName = trackingName;
  }
}
