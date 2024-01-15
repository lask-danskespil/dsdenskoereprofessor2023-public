import { EAlign, type IButtonStyle } from "@gdk/core-pixi";
import { Point, Rectangle, Sprite, Texture } from "pixi.js";
import { SfxButton } from "../basic/sfxButton";
import { Templates } from "../basic/templates";
import { DanskeSpil } from "../basic/helper";

export class BottomButton extends SfxButton {
  private shineLeft: Sprite;
  private shineRight: Sprite;

  public constructor(style: IButtonStyle, text: string, trackingName?: string) {
    super(style, Templates.largeButtonTextStyle, "");

    this.isNineSlice = true;
    this.backgroundNineSlice.rightWidth = 30;
    this.backgroundNineSlice.leftWidth = 30;
    this.backgroundNineSlice.topHeight = 30;
    this.backgroundNineSlice.bottomHeight = 30;

    // nineSlicePadding.x : the left padding of the content
    // nineSlicePadding.y : the top padding of the content
    // nineSlicePadding.width : the right padding of the content
    // nineSlicePadding.height : the bottom padding of the content

    this.nineSlicePadding = new Rectangle(20, 0, 0, 0);
    this.nineSliceMinSize = new Point(260, 137);
    //this.text.centerPivotOnceUpdated = true;
    //this.text.align = EAlign.Center;
    this.label = text;

    if (!trackingName) {
      trackingName = DanskeSpil.camelize(text);
    }
    this.trackingName = trackingName;
  }

  public updateLabel(value: string): void {
    this.label = value;
  }

  public disable(): void {
    this.interactive = false;
  }

  public enable(): void {
    this.interactive = true;
  }
}
