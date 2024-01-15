import i18n from "i18next";
import { TweenMax } from "gsap";
import { Amount } from "@gdk/core";
import { Docking, DockingBounds, LoadedView, Resize } from "@gdk/core-pixi";
import { EGameMode } from "@falcon/bridge";
import { EVisualIdentityAction } from "@gdk/gamekit";

import type Game from "../index";
import { ThreeButtonPopup } from "../components/basic/threeButtonPopup";
import { EBetEvents, ELockframe } from "../components/basic/enums";
import type { IResizable } from "../components/interfaces/iresizable";

const REPLAY_PAGE_TRACKING_NAME = "newGame";
export default class HomeView extends LoadedView implements IResizable {
  private game: Game;

  private popup: ThreeButtonPopup = null;

  /**
   * Constructor
   * @param app the express reference
   */
  public constructor(game: Game) {
    super();
    this.game = game;

    this.dockingBounds = new DockingBounds(this.game.parameters.width, this.game.parameters.height);
    this.docking = new Docking(Docking.topCenterHorizontal);
    this.resize = new Resize(Resize.contain);
  }

  /**
   * On load the view
   */
  public onLoad(): void {

    this.popup = new ThreeButtonPopup(this.game, 250);
    this.popup.alpha = 0;

    this.popup.addTitle(i18n.t("home.title"));

    const bet = Amount.formatFromWholeOrRealNumber(this.game.selectedStake.value);

    this.popup.addLeftButton(
      i18n.t("home.bet", { bet }),
      async () => {
        this.popup.leftButton.disable();

        await this.game.gameState.loadActiveTicket().then(() => {
          this.popup.leftButton.enable();

          if (this.game.gameState.isResume()) {
            this.game.resumeGame.show();
            this.popup.visible = false;
            return;
          } else {
            this.game.confirmBetPopup.show();
            this.popup.visible = false;
            return;
          }
        });

        //this.game.state.next();
      },
      true,
      true
    );

    this.popup.addRightButton(
      i18n.t("home.demo"),
      async () => {
        await this.game.performBet(EGameMode.demo);
        //this.hideBackground();
        this.game.state.next();
      },
      false
    );

    this.popup.addCloseButton(() => {
      this.popup.updateCloseButton(false);
      this.popup.visible = false;

      this.game.tryAgainButton.visible = true;
      this.game.tryAgainButton.enabled = true;
    });

    this.game.tryAgainButton.removeAllListeners("pointertap");
    this.game.tryAgainButton.on("pointertap", async () => {
      this.game.tryAgainButton.visible = false;
      this.game.tryAgainButton.enabled = false;
      this.onRetry();
    });

    this.addChild(this.popup);

    this.game.vi.emitter.on(EBetEvents.resumeGame, () => {
      //this.hideBackground();
      this.game.state.to("reveal");
    });

    this.game.vi.emitter.on(EBetEvents.replayGame, () => {
      //this.hideBackground();
      this.game.vi.emit(ELockframe.Lock);
      this.game.state.to("reveal");
    });

    this.game.vi.emitter.on(EBetEvents.confirmBet, async () => {
      await this.game.performBet(EGameMode.normal);
      //this.hideBackground();
      this.game.state.next();
    });

    this.game.vi.emitter.on(EBetEvents.cancelledBet, async () => {
      if (this.game.gameState.isReplay()) {
        //this.hideBackground();
        this.game.replayGame.show();
        this.popup.visible = false;
      } else {
        this.popup.visible = true;
      }
    });
  }

  /**
   * On the view will appear
   * @param done: callback when animation done
   */
  public async onWillAppear(done: () => void): Promise<void> {
    this.reset();

    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, true);

    if (this.game.gameState.hasActiveTicket()) {
      await this.game.gameState.loadActiveTicket()
      .then(() => {
        if (this.game.gameState.isResume()) {
          this.game.resumeGame.show();
          this.popup.hide();
        } else if (this.game.gameState.isReplay()) {
          this.game.replayGame.show();
        } else {
          // TODO: Should never hit this
          this.popup.show();
        }
      });
    } else {
      this.popup.show();
    }

    // Animate alpha
    TweenMax.fromTo(
      this.popup,
      0.75,
      { alpha: 0 },
      {
        alpha: 1,
        onStart: () => (this.visible = true),
        onComplete: () => done()
      }
    );

    // Re-enable rules in VI settings
    this.game.vi.inGameView.settingsComponent.rulesEnabled = true;
  }

  /**
   * On the view did appear
   */
  public onDidAppear(): void {}

  /**
   * On the view will disappear
   * @param done callback when animation done
   */
  public onWillDisappear(done: () => void): void {
    // Animate alpha
    TweenMax.to(this.popup, 0.5, {
      alpha: 0,
      onComplete: () => done()
    });
  }

  /**
   * On the view did disappear
   */
  public onDidDisappear(): void {
    this.popup.hide();
    // the name of the view must change from home
    // to newGame after the first game
    this.trackingName = REPLAY_PAGE_TRACKING_NAME;
  }

  /**
   * @reset
   */
  public reset(): void {
    if (this.game.gameState.isReplay()) {
      this.game.vi.emit(ELockframe.Unlock);
    } else if (this.game.gamePlayed > 0) {
      this.onRetry();
    } else if (this.game.gameState.isResume()) {
      this.popup.updateCloseButton(false);
      const bet = Amount.formatFromWholeOrRealNumber(this.game.selectedStake.value);

      this.popup.updateLeftLabel(i18n.t("home.resume", { bet }));
    } else {
      this.popup.updateCloseButton(false);
    }
  }

  /**
   * Special actions to do on retry
   */
  private onRetry(): void {
    this.popup.updateCloseButton(true);
    this.popup.visible = true;

    const bet = Amount.formatFromWholeOrRealNumber(this.game.selectedStake.value);

    if (this.game.ticket.demo) {
      this.popup.updateLeftLabel(i18n.t("home.bet", { bet }));
      this.popup.updateRightLabel(i18n.t("home.redemo", { bet }));
    } else {
      this.popup.updateLeftLabel(i18n.t("home.rebet", { bet }));
      this.popup.updateRightLabel(i18n.t("home.demo", { bet }));
    }
  }

  // public hideBackground(): void {
  //   this.background.visible = false;
  // }

  public onResize(): void {
    this.popup.onResize();
  }
}
