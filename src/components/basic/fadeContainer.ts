import { TweenMax } from "gsap";
import { Container } from "pixi.js";

export class FadeContainer extends Container {

  public constructor() {
    super();

    this.visible = false;
  }

  public show(): void {
    this.alpha = 0;
    this.visible = true;
    TweenMax.to(this, 0.5, { 
      alpha: 1 
    });
  }

  public hide(): void {
    TweenMax.to(this, 0.5, { 
      alpha: 0,
      onComplete: () => {
        this.visible = false;
      }
    });
  }

}