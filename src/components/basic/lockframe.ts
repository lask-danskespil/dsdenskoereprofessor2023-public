import { DockingBounds } from "@gdk/core-pixi";
import { Sine, TweenLite } from "gsap";
import { Graphics } from "pixi.js";
import { EVisualIdentityEvent } from "@gdk/gamekit";

import { ELockframe } from "./enums";
import type Game from "../..";

export class Lockframe extends Graphics {
  private game: Game;
  private active: boolean;
  private busy: number;

  public constructor(game: Game) {
    super();

    this.active = false;
    this.interactive = false;
    this.alpha = 0;

    this.name = "lockframe";
    this.game = game;

    this.beginFill(0x000000, 0);
    this.drawRect(0, 0, this.game.parameters.width, this.game.parameters.height);
    this.endFill();
    this.dockingBounds = new DockingBounds(this.game.parameters.width, this.game.parameters.height);

    this.game.vi.emitter.on(ELockframe.Lock, () => {
      this.busy++;

      this.update();
    });

    this.game.vi.emitter.on(ELockframe.Unlock, () => {
      this.busy--;

      if (this.busy < 0) {
        this.busy = 0;
      }

      this.update();
    });

    this.game.vi.emitter.on(EVisualIdentityEvent.ShowSettings, () => {
      this.game.vi.emit(ELockframe.Lock);
    });

    this.game.vi.emitter.on(EVisualIdentityEvent.HideSettings, () => {
      this.game.vi.emit(ELockframe.Unlock);
    });

    this.onResize();
  }

  private update(): void {
    if (this.active === this.busy > 0) {
      return;
    }

    this.active = this.busy > 0;

    this.interactive = this.active;

    if (!this.active) {
      this.game.vi.emit(ELockframe.FullyUnlocked);
    }

    TweenLite.to(this, 0.5, {
      alpha: this.active ? 1 : 0,
      ease: Sine.easeOut
    });
  }

  public onResize(): void {
    this.scale.set(1, this.game.gameAspect);

    if (this.game.gameAspect < 1 / this.game.parameters.aspect) {
      this.scale.set(1 + (this.game.gameAspect - this.game.parameters.aspect), 1);
    } else {
      this.scale.set(1, this.game.gameAspect);
    }
  }
}
