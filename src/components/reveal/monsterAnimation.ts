import { Sprite, Texture } from "pixi.js";
import { Back, Sine, TimelineMax } from "gsap";

import ScratchAreaAnimationBase from "./scratchAreaAnimationBase";

export default class MonsterAnimation extends ScratchAreaAnimationBase {
  private body: Sprite;
  private leftEye: Sprite;
  private rightEye: Sprite;
  private leftEyebrow: Sprite;
  private rightEyebrow: Sprite;
  private mouth: Sprite;

  public constructor() {
    super();

    this.position.set(35, 15);

    this.body = new Sprite(Texture.fromImage("monster/body"));
    this.elements.addChild(this.body);

    this.leftEye = new Sprite(Texture.fromImage("monster/eye"));
    this.leftEye.scale.set(0.82, 0.82);
    this.leftEye.position.set(25, 65);
    this.elements.addChild(this.leftEye);

    this.leftEyebrow = new Sprite(Texture.fromImage("monster/eyebrow"));
    this.leftEyebrow.position.set(75, 30);
    this.leftEyebrow.scale.set(-0.8, 1);
    this.elements.addChild(this.leftEyebrow);

    this.rightEye = new Sprite(Texture.fromImage("monster/eye"));
    this.rightEye.position.set(87, 60);
    this.elements.addChild(this.rightEye);

    this.rightEyebrow = new Sprite(Texture.fromImage("monster/eyebrow"));
    this.rightEyebrow.position.set(87, 30);
    this.elements.addChild(this.rightEyebrow);

    this.mouth = new Sprite(Texture.fromImage("monster/mouth"));
    this.mouth.position.set(30, 135);
    this.elements.addChild(this.mouth);

    const leftEyeTimeline = new TimelineMax();
    leftEyeTimeline.to(this.leftEye, 2, {
      x: 40,
      ease: Back.easeInOut,
      repeat: -1,
      repeatDelay: 2,
      yoyo: true
    });
    this.timelines.push(leftEyeTimeline);

    const rightEyeTimeline = new TimelineMax();
    rightEyeTimeline.to(this.rightEye, 2, {
      x: 95,
      ease: Back.easeInOut,
      repeat: -1,
      delay: 0.1,
      repeatDelay: 2,
      yoyo: true
    });
    this.timelines.push(rightEyeTimeline);

    const leftEyebrowTimeline = new TimelineMax();
    leftEyebrowTimeline.to(this.leftEyebrow, 2, {
      x: 85,
      y: 25,
      ease: Back.easeInOut,
      rotation: -0.15,
      repeat: -1,
      repeatDelay: 2,
      yoyo: true
    });
    this.timelines.push(leftEyebrowTimeline);

    const rightEyebrowTimeline = new TimelineMax();
    rightEyebrowTimeline.to(this.rightEyebrow, 2, {
      x: 95,
      y: 25,
      ease: Back.easeInOut,
      rotation: 0.1,
      repeat: -1,
      delay: 0.2,
      repeatDelay: 2,
      yoyo: true
    });
    this.timelines.push(rightEyebrowTimeline);

    const mouthTimeline = new TimelineMax();
    mouthTimeline.to(this.mouth, 2, {
      x: 40,
      y: 135,
      ease: Back.easeInOut,
      rotation: -0.05,
      repeat: -1,
      delay: 0.3,
      repeatDelay: 2,
      yoyo: true
    });
    this.timelines.push(mouthTimeline);
  }

  public async end(callBack: Function): Promise<void> {
    super.end(callBack);

    return new Promise(async (resolve) => {
      const leftEyeTimeline = new TimelineMax();
      leftEyeTimeline.to(this.leftEye, 1, {
        x: 25,
        ease: Sine.easeInOut
      });
      this.timelines.push(leftEyeTimeline);

      const rightEyeTimeline = new TimelineMax();
      rightEyeTimeline.to(this.rightEye, 0.9, {
        x: 87,
        ease: Sine.easeInOut,
        delay: 0.1
      });
      this.timelines.push(rightEyeTimeline);

      const leftEyebrowTimeline = new TimelineMax();
      leftEyebrowTimeline.to(this.leftEyebrow, 1, {
        x: 75,
        y: 30,
        ease: Sine.easeInOut,
        rotation: 0
      });
      this.timelines.push(leftEyebrowTimeline);

      const rightEyebrowTimeline = new TimelineMax();
      rightEyebrowTimeline.to(this.rightEyebrow, 0.8, {
        x: 87,
        y: 30,
        ease: Sine.easeInOut,
        rotation: 0,
        delay: 0.2
      });
      this.timelines.push(rightEyebrowTimeline);

      const mouthTimeline = new TimelineMax();
      mouthTimeline.to(this.mouth, 1, {
        x: 30,
        ease: Back.easeInOut,
        rotation: 0,
        onComplete: () => {
          callBack();
          resolve();
        }
      });
      this.timelines.push(mouthTimeline);
    });
  }
}
