import type { IButtonStyle } from "@gdk/core-pixi";
import { Point, Rectangle, Sprite, Texture } from "pixi.js";
import { Bounce, Power0, Sine, TimelineMax, TweenMax } from "gsap";

import { Templates } from "./templates";
import { DanskeSpil } from "./helper";
import { SfxButton } from "./sfxButton";

export class NineSliceButton extends SfxButton {
  private shineLeft: Sprite;
  private shineRight: Sprite;

  public constructor(style: IButtonStyle, text: string, trackingName?: string, shine?: boolean) {
    super(style, Templates.buttonTextStyle, "");

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
    this.nineSliceMinSize = new Point(150, 80);
    this.label = text;

    if (!trackingName) {
      trackingName = DanskeSpil.camelize(text);
    }
    this.trackingName = trackingName;

    if (shine) {
      this.shineLeft = new Sprite(Texture.fromImage("vi/shine"));
      this.shineLeft.anchor.set(0, 0.5);
      this.shineLeft.position.y = 4;
      this.shineLeft.position.x = 0;
      this.shineLeft.alpha = 0;
      this.addChildAt(this.shineLeft, 1);

      this.shineRight = new Sprite(Texture.fromImage("vi/shine"));
      this.shineRight.anchor.set(0, 0.5);
      this.shineRight.position.y = 78;
      this.shineRight.position.x = this.width - this.shineRight.width;
      this.shineRight.alpha = 0;
      this.addChildAt(this.shineRight, 1);

      const timelineAlpha = new TimelineMax({ repeat: -1 });
      timelineAlpha.to([this.shineLeft, this.shineRight], 0.25, {
        alpha: 1,
        ease: Power0.easeIn,
        delay: 3,
        onStart: () => {
          // Use static one-use tween to assure correct length/mode of shine
          TweenMax.to(this.shineLeft, 1, {
            x: this.width - this.shineLeft.width,
            ease: Sine.easeInOut,
            onComplete: () => {
              this.shineLeft.position.x = 0;
            }
          });

          TweenMax.to(this.shineRight, 1, {
            x: 0,
            ease: Sine.easeInOut,
            onComplete: () => {
              this.shineRight.position.x = this.width - this.shineRight.width;
            }
          });

        }
      });
      timelineAlpha.to([this.shineLeft, this.shineRight], 0.25, {
        alpha: 0.25,
        ease: Bounce.easeOut
      });
      timelineAlpha.to([this.shineLeft, this.shineRight], 0.25, {
        alpha: 1,
        ease: Bounce.easeIn
      });
      timelineAlpha.to([this.shineLeft, this.shineRight], 0.25, {
        alpha: 0,
        ease: Power0.easeOut
      });
    }
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
