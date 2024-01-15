import i18n from "i18next";
import { TimelineMax, TweenMax } from "gsap";
import { Amount } from "@gdk/core";
import { Docking, DockingBounds, LoadedView, Resize, TextArea } from "@gdk/core-pixi";
import { EGameMode } from "@falcon/bridge";

import type Game from "../index";
import { ThreeButtonPopup } from "../components/basic/threeButtonPopup";
import { Templates } from "../components/basic/templates";
import type { NineSliceButton } from "../components/basic/nineSliceButton";

export class TestView extends LoadedView {
  private game: Game;
  private textArea: TextArea;

  private popup: ThreeButtonPopup = null;

  /**
   * Constructor
   * @param app the express reference
   */
  public constructor(game: Game) {
    super();
    this.game = game;

    this.dockingBounds = new DockingBounds(this.game.parameters.width, this.game.parameters.height);
    this.resize = new Resize(Resize.contain);
  }

  /**
   * On load the view
   */
  public onLoad(): void {
    this.textArea = new TextArea("", Templates.defaultTextStyle);
    this.textArea.docking = new Docking(Docking.topCenterHorizontal);
    this.textArea.docking.position.y = 50;
    this.addChild(this.textArea);

    this.popup = new ThreeButtonPopup(this.game, 250);
    this.popup.alpha = 0;

    this.popup.addTitle("DEALER TEST");

    const bet = Amount.formatFromWholeOrRealNumber(this.game.selectedStake.value);

    this.popup.addCenterButton(
      i18n.t(`home.bet`, { bet }),
      async () => {
        if (!this.game.gameState.hasActiveTicket()) {
          await this.game.performBet(EGameMode.normal);
          await this.game.ticket.claim().then((result) => {
            let text = "";

            text += "ServiceName: " + result.serviceName + "\n";
            text += "Status: " + result.status + "\n";
            text += "Demo: " + (result.demo ? "true" : "false") + "\n";
            text += "PlatformBetId: " + result.platformBetId.toString() + "\n";
            text += "RreceiptId: " + result.receiptId + "\n";
            text += "WonAmount: " + result.wonAmount.value.toString() + " " + result.wonAmount.currency + " cents\n";
            text += "OpenedTime: " + result.openedTime + "\n";
            text += "Rank: " + result.prize.rank.toString() + "\n";
            text += "Ticket: " + result.symbol + "\n";
            this.textArea.text = text;
            this.textArea.update();

            //@ts-ignore
            const button = this.popup.children[0].children[3] as NineSliceButton;
            const buttonTimeline = new TimelineMax();
            buttonTimeline.to(button, 0.3, {
              alpha: 0.3,
              onStart: () => {
                button.interactive = false;
              }
            });
            buttonTimeline.to(button, 0.3, {
              alpha: 1,
              delay: 3,
              onComplete: () => {
                button.interactive = true;
              }
            });
          });
          return;
        } else if (this.game.gameState.isResume()) {
          this.textArea.text = "Resume ticket";
          this.textArea.update();
          return;
        }
      },
      true,
      true
    );

    this.addChild(this.popup);
  }

  /**
   * On the view will appear
   * @param done: callback when animation done
   */
  public async onWillAppear(done: () => void): Promise<void> {
    await this.game.gameState.loadActiveTicket();

    this.popup.show(false);

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
  }

  /**
   * On the view did appear
   */
  public onDidAppear(): void {}

  /**
   * On the view will disappear
   * @param done callback when animation done
   */
  public onWillDisappear(): void {}

  /**
   * On the view did disappear
   */
  public onDidDisappear(): void {}
}
