import { Container, Point, Sprite, Texture } from "pixi.js";
import { EAlign, Scratch2, TextField } from "@gdk/core-pixi";
import { Sine, TimelineMax, TweenMax } from "gsap";
import i18n from "i18next";
import { Loader, SoundLayer } from "@gdk/core";

import type Game from "../..";
import { Templates } from "../basic/templates";
import { Mark } from "./mark";
import type { ProtectionOverlay } from "./protectionOverlay";
import { DefaultScratch2Option } from "./defaultscratch2options";
import type ScratchAreaAnimationBase from "./scratchAreaAnimationBase";

export default class ScratchAreaBase extends Container {
  public scratch: Scratch2 = null;

  private scratchLayer: Container = new Container();
  private animationLayer: Container = new Container();
  protected protectionOverlay: ProtectionOverlay;
  protected zoomOutTo: number = 2;

  private _animation: ScratchAreaAnimationBase;
  private _inFront: boolean;

  protected game: Game;
  private mark: Mark;
  private winner: boolean;
  protected scratchIndex: number;
  private prizeSymbol: TextField;
  private background: Sprite;
  private inactivityTimeline: TimelineMax;
  private inactivity: Sprite;
  private initialPosition: Point;

  private sfxToFront: Howl;
  private sfxBringBack: Howl;

  public constructor(game: Game, x: number, y: number, scratchIndex: number) {
    super();

    this.game = game;
    this.initialPosition = new Point(x, y);
    this.scratchIndex = scratchIndex;

    this.position.set(x, y);

    this.background = new Sprite(Texture.fromImage("monster/scratch-back"));
    this.addChild(this.background);

    this.addChild(this.scratchLayer);
    this.addChild(this.animationLayer);

    this.mark = new Mark();
    this.mark.position.set(this.width / 2, this.height / 2 - 10);
    this.scratchLayer.addChild(this.mark);

    this.prizeSymbol = new TextField("", Templates.prizeTextStyle);
    this.prizeSymbol.align = EAlign.Center;
    this.prizeSymbol.position.x = this.width / 2;
    this.prizeSymbol.position.y = this.height / 2;
    this.prizeSymbol.centerPivotOnceUpdated = true;
    this.prizeSymbol.update();

    this.scratchLayer.addChild(this.prizeSymbol);

    this.scratch = new Scratch2(new DefaultScratch2Option(Texture.fromImage("monster/scratch-front")));
    this.scratchLayer.addChild(this.scratch);

    this.inactivity = new Sprite(Texture.fromImage("monster/inactivity"));
    this.inactivity.anchor.set(0.5, 0.5);
    this.inactivity.position.set(250, 250);
    this.inactivity.alpha = 0;
    this.addChild(this.inactivity);

    // this.sfxToFront = Loader.get<Howl>("sfx-transition-high");
    // this.sfxToFront.volume(0.8);
    // SoundLayer.setSoundLayer(this.sfxToFront, 2);

    // this.sfxBringBack = Loader.get<Howl>("sfx-transition-low");
    // this.sfxBringBack.volume(0.8);
    // SoundLayer.setSoundLayer(this.sfxBringBack, 2);

    this.animateInactivity();
  }

  public async bringToFront(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (this.inFront || this.game.revealView.anyInFront) {
        console.log("Already in front " + this.scratchIndex);
        resolve(false);
        return;
      }

      if (this.scratch.isRevealed) {
        resolve(false);
        return;
      }

      if (this._animation) {
        this._animation.end(() => {
          this._animation.active = false;
        });
      }

      // Bring scrach area in front of the other
      this.game.revealView.swapChildren(this, this.game.revealView.children[this.game.revealView.children.length - 1]);

      this.sfxToFront.play();

      TweenMax.to(this, 1, {
        x: this.game.gameCenterPoint.x - (this.width / 2) * this.zoomOutTo,
        y: this.game.gameCenterPoint.y - (this.height / 2) * this.zoomOutTo,
        ease: Sine.easeInOut
      });

      TweenMax.to(this.scale, 1, {
        x: this.zoomOutTo,
        y: this.zoomOutTo,
        ease: Sine.easeInOut,
        onComplete: () => {
          this._inFront = true;
          this.game.revealView.revealUnderlay.active = true;
          this.protectionOverlay.active = false;
          resolve(true);
        }
      });
    });
  }

  public async bringBack(): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.inFront) {
        return;
      }

      const zoomTo: number = 1;

      this.sfxBringBack.play();

      TweenMax.to(this, 1, {
        x: this.initialPosition.x,
        y: this.initialPosition.y,
        ease: Sine.easeInOut
      });

      TweenMax.to(this.scale, 1, {
        x: zoomTo,
        y: zoomTo,
        ease: Sine.easeInOut,
        onStart: () => {
          this.game.revealView.revealUnderlay.active = false;
          this.protectionOverlay.active = true;
        },
        onComplete: () => {
          this._inFront = false;
          resolve();
        }
      });
    });
  }

  private animateInactivity(): void {
    this.inactivityTimeline = new TimelineMax();
    this.inactivityTimeline.to(this.inactivity, 0.2, {
      alpha: 1,
      delay: this.scratchIndex + 1
    });
    this.inactivityTimeline.to(this.inactivity.scale, 0.2, {
      x: 1.1,
      y: 1.1,
      repeat: 3,
      yoyo: true,
      ease: Sine.easeInOut
    });
    this.inactivityTimeline.to(this.inactivity, 0.2, {
      alpha: 0
    });
  }

  private symbolToAmount(symbol: string): string {
    return i18n.t(`prizeValues.${symbol}`);
  }

  public showInactivity(): void {
    if (this.isRevealed || this.inFront) {
      return;
    }

    this.inactivity.alpha = 0;
    this.inactivityTimeline.play(0);
  }

  public hideInactivity(): void {
    this.inactivity.alpha = 0;
    this.inactivityTimeline.pause(0);
  }

  public async markWinner(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (!this.winner) {
        resolve(false);
        return;
      }

      await this.mark.animate();
      resolve(true);
    });
  }

  private get isRevealed(): boolean {
    return this.scratch.isRevealed;
  }

  public async auto(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (this.isRevealed) {
        await this.bringBack();

        resolve(false);
        return;
      }

      await this.bringToFront();
      await this.scratch.auto();
      await this.bringBack();
      resolve(true);
    });
  }

  public async stop(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (!this.inFront || this.isRevealed) {
        resolve(false);
        return;
      }

      this.scratch.interactive = false;
      this.scratch.stop();
      await this.bringBack();
      resolve(true);
    });
  }

  public reset(): void {
    this.scratch.reset();
    if (this._animation) {
      this._animation.reset();
    }

    this.scratch.interactive = true;

    this.winner = this.game.ticket.parsedTicket.positions.includes((this.scratchIndex + 1).toString());
    this.prizeSymbol.text = this.symbolToAmount(this.game.ticket.parsedTicket.symbols[this.scratchIndex]);
    this.mark.reset();
  }

  public preScratch(): void {
    this.scratch.forceReveal();
    if (this._animation) {
      this._animation.active = false;
    }
  }

  public set animation(animation: ScratchAreaAnimationBase) {
    if (this._animation) {
      this._animation.destroy();
    }

    this._animation = animation;
    this.animationLayer.addChild(this._animation);
  }

  public get inFront(): boolean {
    return this._inFront;
  }
}
