import { Linear, Sine, TweenMax } from "gsap";
import { Sprite, Texture } from "pixi.js";

import { DanskeSpil } from "../basic/helper";

export class Mark extends Sprite {
  public constructor() {
    super(Texture.fromImage("result/mark"));
    this.anchor.set(0.5, 0.5);
    this.alpha = 0;
    this.scale.set(1.5, 1.5);
  }

  public async animate(): Promise<void> {
    return new Promise((resolve) => {
      TweenMax.to(this, 0.5, {
        alpha: 1,
        ease: Sine.easeInOut,
        delay: 2
      });

      TweenMax.to(this, 5, {
        alpha: 0.85,
        rotation: DanskeSpil.toRad(720),
        ease: Linear.easeNone,
        delay: 2
      });

      TweenMax.to(this.scale, 0.5, {
        x: 1.8,
        y: 2,
        ease: Sine.easeInOut,
        yoyo: true,
        repeat: 10,
        delay: 2,
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  public reset(): void {
    this.scale.set(1.5, 1.5);
    this.rotation = 0;
    this.alpha = 0;
  }
}
