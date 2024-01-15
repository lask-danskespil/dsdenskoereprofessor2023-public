import i18n from "i18next";
import { Resize, DockingBounds, ContainerView, TextArea, Docking } from "@gdk/core-pixi";
import { EGameEvents, EVisualIdentityAction, EVisualIdentityEvent } from "@gdk/gamekit";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Back, Linear, Sine, TimelineMax, TweenMax } from "gsap";
import { Amount } from "@gdk/core";

import type Game from "../index";
import { Templates } from "../components/basic/templates";
import { DanskeSpil } from "../components/basic/helper";
import type { IResizable } from "../components/interfaces/iresizable";

export default class ResultView extends ContainerView implements IResizable {
  private game: Game;
  private title: TextArea;
  private text: TextArea;
  private prize: Sprite;
  private rays: Sprite[] = [];
  private raysContainer: Container;
  private background: Graphics;
  private winner: boolean;

  public constructor(game: Game) {
    super();
    this.game = game;

    this.dockingBounds = new DockingBounds(this.game.parameters.width, this.game.parameters.height);
    this.docking = new Docking(Docking.topCenterHorizontal);
    this.resize = new Resize(Resize.contain);

    this.raysContainer = new Container();
    this.addChild(this.raysContainer);

    this.alpha = 0;
  }

  public onLoad(): void {}

  public async onWillAppear(): Promise<void> {
    this.background = new Graphics();
    this.background.beginFill(0x74d0f2, 0.75);
    this.background.drawRect(0, 0, this.game.parameters.width, this.game.parameters.width);
    this.background.endFill();
    this.addChild(this.background);

    this.winner = this.game.ticket.wonAmount.value > 0;

    this.visible = true;

    this.raysContainer.position = this.game.gameCenterPoint;

    this.raysContainer.removeChildren();
    this.raysContainer.visible = false;

    this.rays = [];
    this.prize = null;

    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, false);

    let title: string;
    let text: string;

    for (let i = 0; i < 12; i++) {
      const ray = new Sprite(Texture.fromImage("result/ray"));
      ray.anchor.set(0.5, 1);
      ray.rotation = DanskeSpil.toRad(i * 30);
      this.rays.push(ray);
    }

    this.rays.forEach((element) => {
      this.raysContainer.addChild(element);
    });

    this.raysContainer.alpha = 0.6;
    this.raysContainer.scale.set(1.5, 1.5);

    if (this.game.ticket.wonAmount.value === 0) {
      title = i18n.t("result.looser");
      if (this.game.ticket.demo) {
        text = i18n.t("result.looserSubTextDemo");
      } else {
        text = i18n.t("result.looserSubText");
      }
    } else {
      title = i18n.t("result.winner");
      if (this.game.ticket.demo) {
        text = i18n.t("result.winnerSubTextDemo");
      } else {
        text = i18n.t("result.winnerSubText");
      }
    }

    this.title = new TextArea(title, Templates.resultTitleStyle);
    this.title.scale.set(0, 0);
    this.title.position.set(this.game.parameters.width / 2, 0);
    this.title.docking = new Docking(Docking.centerHorizontal);
    this.addChild(this.title);

    this.text = new TextArea(text, Templates.resultTextStyle);
    this.text.scale.set(0, 0);
    this.text.position.set(this.game.parameters.width / 2, 0);
    this.text.docking = new Docking(Docking.centerHorizontal);
    this.addChild(this.text);

    this.prize = new TextArea(Amount.formatFromWholeOrRealNumber(this.game.ticket.wonAmount.value), Templates.resultTitleStyle);
    this.prize.scale.set(0, 0);
    this.prize.position.set(this.game.parameters.width / 2, 0);
    this.prize.docking = new Docking(Docking.centerHorizontal);
    this.addChild(this.prize);

    TweenMax.to(this, 0.5, {
      alpha: 1,
      ease: Sine.easeInOut
    });

    this.onResize();
  }

  public async onWillDisappear(): Promise<void> {}

  public async onDidAppear(): Promise<void> {
    const titleTimeline = new TimelineMax();
    const titleScaleTimeline = new TimelineMax();

    const textTimeline = new TimelineMax();
    const textScaleTimeline = new TimelineMax();

    titleTimeline.to(this.title, 2, {
      y: this.raysContainer.position.y - 325,
      ease: Back.easeInOut
    });

    titleScaleTimeline.to(this.title.scale, 2, {
      x: 1,
      y: 1,
      ease: Back.easeInOut
    });

    textTimeline.to(this.text, 2, {
      y: this.raysContainer.position.y - 180,
      ease: Back.easeInOut,
      delay: 0.3
    });

    textScaleTimeline.to(this.text.scale, 2, {
      x: 1,
      y: 1,
      ease: Back.easeInOut,
      delay: 0.3
    });

    if (this.winner) {
      this.raysContainer.rotation = 0;
      this.raysContainer.visible = true;

      TweenMax.to(this.raysContainer, 10, {
        rotation: DanskeSpil.toRad(720),
        ease: Linear.easeNone
      });

      if (this.winner) {
        const prizeTimeline = new TimelineMax();
        const prizeScaleTimeline = new TimelineMax();

        prizeTimeline.to(this.prize, 2, {
          y: this.raysContainer.position.y - Templates.resultTitleStyle.default.fontSize / 2,
          ease: Back.easeInOut,
          delay: 1
        });

        prizeScaleTimeline.to(this.prize.scale, 2, {
          x: 0.8,
          y: 0.8,
          ease: Back.easeInOut,
          delay: 1
        });

        prizeScaleTimeline.to(this.prize.scale, 0.6, {
          x: 0.82,
          y: 0.82,
          ease: Sine.easeInOut,
          yoyo: true,
          repeat: 10
        });
      }
    }

    // Fade out end continue
    TweenMax.to(this, 0.5, {
      alpha: 0,
      ease: Sine.easeInOut,
      delay: 6,
      onComplete: () => {
        this.game.state.to("home");
      }
    });
  }

  public async onDidDisappear(): Promise<void> {
    this.visible = false;
    this.game.gamePlayed++;
    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, true);
    this.game.events.emit(EGameEvents.GameEnd);

    this.title.destroy();
    this.text.destroy();
    if (this.prize) {
      this.prize.destroy();
    }

    await this.game.ticket.claim();
    await this.game.com.showNotification();

    if (this.game.gameState.shouldStopAfterResult()) {
      this.game.vi.emitter.emit(EVisualIdentityEvent.QuitGame);
    }
  }

  public onResize(): void {
    if (!this.visible) {
      return;
    }

    if (this.game.gameAspect < 1 / this.game.parameters.aspect) {
      this.scale.set(1 + (this.game.gameAspect - this.game.parameters.aspect), 1);
    } else {
      this.scale.set(1, this.game.gameAspect);
    }

    this.raysContainer.position = this.game.gameCenterPoint;
    this.title.position.y = this.game.gameCenterPoint.y - 325;
    this.text.position.y = this.game.gameCenterPoint.y - 180;
    this.prize.position.y = this.game.gameCenterPoint.y;
  }
}
