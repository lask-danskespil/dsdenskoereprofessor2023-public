import { Docking, LoadedView, Resize } from "@gdk/core-pixi";
import { EVisualIdentityAction } from "@gdk/gamekit";
import { Sprite, Texture } from "pixi.js";
import { Back, Sine, TimelineMax, TweenMax } from "gsap";

import type Game from "../index";
import type { IResizable } from "../components/interfaces/iresizable";

export default class SplashView extends LoadedView implements IResizable {
  private game: Game;
  private logo: Sprite;
  private timeline: TimelineMax;
  private background: Sprite;

  /**
   * Constructor
   * @param game: the express reference kept to access the state, com, etc.
   */
  public constructor(game: Game) {
    super();
    this.game = game;

    this.dockingBounds.setBounds(this.game.parameters.width, this.game.parameters.height);
    this.docking = new Docking(Docking.topCenterHorizontal);
    this.resize = new Resize(Resize.contain);
  }

  /**
   * On load the view
   */
  public onLoad(): void {
    this.background = new Sprite(Texture.fromImage("grad"));
    this.background.anchor.set(0.5, 0.5);
    this.background.scale.set(0, 0);
    this.background.alpha = 1;
    this.background.position = this.game.gameCenterPoint;
    this.addChild(this.background);

    TweenMax.to(this.background.scale, 1.5, {
      x: 15,
      y: 10,
      ease: Sine.easeIn,
    });

    this.logo = Sprite.from("logo");
    this.logo.anchor.set(0.5, 0.5);
    this.logo.scale.set(0.5, 0.5);
    this.logo.position = this.game.gameCenterPoint;
    this.addChild(this.logo);

    this.logo.interactive = true;
    this.logo.on("pointertap", () => {
      this.timeline.pause();
      this.game.state.to(this.game.gameState.getViewAfterSplash());
    });
  }

  public onWillAppear(): void {
    this.visible = true;
    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, false);

    this.timeline = new TimelineMax();
    this.timeline.to(this.logo.scale, 2, {
      x: 1.1,
      y: 1.1,
      ease: Back.easeInOut,
      repeat: 0
    });

    this.timeline.to(this.logo.scale, 1, {
      delay: 1,
      onComplete: () => {
        this.game.state.to(this.game.gameState.getViewAfterSplash());
      }
    });
  }

  public async onDidAppear(): Promise<void> {}

  public async onWillDisappear(): Promise<void> {}

  public onDidDisappear(): void {
    this.visible = false;
  }

  public onResize(): void {
    this.logo.position = this.game.gameCenterPoint;
  }
}
