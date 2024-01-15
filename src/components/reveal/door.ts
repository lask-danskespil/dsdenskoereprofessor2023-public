import { Ease, Sine, TweenMax } from "gsap";
import { Sprite, Texture } from "pixi.js";

export class Door extends Sprite {
  public constructor() {
    super(Texture.fromImage("furniture/door"));
    this.anchor.set(0, 0.5);
    this.position.set(1531, 630);

    TweenMax.to(this, 2.5, {
      x:1533,
      repeat: -1,
      ease: Sine.easeInOut,
      yoyo: true,
      repeatDelay: 4
    });

    TweenMax.to(this.scale, 2.5, {
      x: 0.95,
      repeat: -1,
      ease: Sine.easeInOut,
      yoyo: true,
      repeatDelay: 4
    });
  }
}