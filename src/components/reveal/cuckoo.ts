import { Sine, TweenMax } from "gsap";
import { CanvasRenderer, Container, WebGLRenderer } from "pixi.js";
import { Sprite, Texture } from "pixi.js";
import { DanskeSpil } from "../basic/helper";

export class Cuckoo extends Container {
  private lastMinute: number = -1;
  private minutesHouse: Sprite;
  private hourArm: Sprite;
  private minutesArm: Sprite;
  private pendul: Sprite;
  private weight1: Sprite;
  private weight2: Sprite;
  private sfx: Howl;

  public constructor(x: number, y: number, sfx: Howl) {
    super();
    this.position.set(x, y);

    this.pendul = new Sprite(Texture.fromImage("cuckoo/pendul"));
    this.pendul.position.y = 35;
    this.pendul.anchor.set(0.5, 0);
    this.pendul.rotation = DanskeSpil.toRad(-10);
    this.addChild(this.pendul);

    this.weight1 = new Sprite(Texture.fromImage("cuckoo/weight"));
    this.weight1.position.x = -10;
    this.weight1.anchor.set(0.5, 0);
    this.addChild(this.weight1);

    this.weight2 = new Sprite(Texture.fromImage("cuckoo/weight"));
    this.weight2.position.x = 10;
    this.weight2.position.y = -15;
    this.weight2.anchor.set(0.5, 0);
    this.addChild(this.weight2);


    this.minutesHouse = new Sprite(Texture.fromImage("cuckoo/house"));
    //this.minutesHouse.position.y = 6;
    this.minutesHouse.anchor.set(0.5, 0.5);
    this.addChild(this.minutesHouse);

    this.hourArm = new Sprite(Texture.fromImage("cuckoo/arm-hour"));
    this.hourArm.position.set(0, 8);
    this.hourArm.anchor.set(0.5, 1);
    this.addChild(this.hourArm);

    this.minutesArm = new Sprite(Texture.fromImage("cuckoo/arm-minute"));
    this.minutesArm.position.set(1, 8);
    this.minutesArm.anchor.set(0.5, 0.89);
    this.addChild(this.minutesArm);

    this.sfx = sfx;
    this.sfx.mute(false);

    this.animate();
  }

  private animate() {
    TweenMax.to(this.pendul, 1, {
      rotation: DanskeSpil.toRad(10),
      ease: Sine.easeInOut,
      yoyo: true,
      repeat: -1,
      onRepeat: () => {
        if (!this.sfx.mute()) {
          this.sfx.play();
        }
      }
    });
  }

  private updateTime() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (minutes === this.lastMinute) {
      return;
    }

    this.lastMinute = minutes;

    this.hourArm.rotation = DanskeSpil.toRad(((hours + minutes / 60) * 360) / 12);
    this.minutesArm.rotation = DanskeSpil.toRad((minutes * 360) / 60);
  }

  protected _renderCanvas(renderer: CanvasRenderer): void {
    this.updateTime();
    super._renderCanvas.call(this, renderer);
  }

  protected _renderWebGL(renderer: WebGLRenderer): void {
    this.updateTime();
    super._renderWebGL.call(this, renderer);
  }
}
