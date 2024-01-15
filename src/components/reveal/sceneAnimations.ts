import { Container } from "pixi.js";
import { ISpineTimelineAnimation, SpineTimeline } from "@gdk/core-pixi";
import { Ease } from "gsap";

export class SpineTimelineAnimation implements ISpineTimelineAnimation {
  public name: string;
  public repeat?: number;
  public repeatDelay?: number;
  public delay?: number;
  public ease?: Ease;
  public inverted?: boolean;
  public label?: string;

  public constructor(name: string) {
    this.name = name;
  }
}

export class SceneAnimations extends Container {
  private idleTimeline: SpineTimeline;
  private animations: ISpineTimelineAnimation[] = [];

  public constructor() {
    super();

    this.scale.set(0.5, 0.5);
    this.position.set(1920/2, 1200/2);

    this.animations.push(new SpineTimelineAnimation("idle"));
    // this.animations.push(new SpineTimelineAnimation("cat"));
    // this.animations.push(new SpineTimelineAnimation("fish"));
    // this.animations.push(new SpineTimelineAnimation("droplet"));

    this.idleTimeline = new SpineTimeline("room-animations");
    this.idleTimeline.addSequence("idleSequence", {
      loop: true,
      animations: this.animations
    });

    this.addChild(this.idleTimeline);
  }

  public playIdle() {
    this.idleTimeline.play("idleSequence");
    // this.playCatSequence();
    // this.playFishSequence();
    // this.playDropletSequence();
  }

  // public async playIdleSequence(): Promise<void> {
  //   await this.idleTimeline.play("roomIdleSequence");
  // }

  // public async playCatSequence(): Promise<void> {
  //   await this.catTimeline.play("roomCatSequence");
  // }

  // public async playFishSequence(): Promise<void> {
  //   await this.animationTimeline.play("roomFishSequence");
  // }

  // public async playDropletSequence(): Promise<void> {
  //   await this.animationTimeline.play("roomDropletSequence");
  // }


}