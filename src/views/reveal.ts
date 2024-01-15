import { Docking, DockingBounds, LoadedView, Resize } from "@gdk/core-pixi";
import { Inactivity, EGameEvents, ETicketStatus, ETicketMode, EVisualIdentityAction, EVisualIdentityEvent, TweenUtils } from "@gdk/gamekit";

import type Game from "../index";
import { EAutoButton, EEventQueue } from "../components/basic/enums";
import Monster from "../components/reveal/monster";
import type { IResizable } from "../components/interfaces/iresizable";
import { RevealUnderlay } from "../components/reveal/revealUnderlay";
import GameEvent from "../components/basic/gameEvent";
import { SidePanel } from "../components/reveal/sidepanel";
import { BottomPanel } from "../components/reveal/bottompanel";

export default class RevealView extends LoadedView implements IResizable {
  private game: Game;
  private inactivity: Inactivity;

  private scratchAreas: Monster[] = [];
  private firstTime: boolean = true;
  private isAuto: boolean = false;
  private promises: Array<Promise<void>> = [];

  public revealUnderlay: RevealUnderlay;

  private sidepanel: SidePanel;
  private bottompanel: BottomPanel;

  public constructor(game: Game) {
    super();
    this.game = game;

    this.dockingBounds = new DockingBounds(this.game.parameters.width, this.game.parameters.height);
    this.docking = new Docking(Docking.topCenterHorizontal);
    this.resize = new Resize(Resize.contain);
  }

  public onLoad(): void {
    this.sidepanel = new SidePanel(this.game);
    this.addChild(this.sidepanel);

    this.bottompanel = new BottomPanel(this.game);
    this.addChild(this.bottompanel);
  }

  public onWillAppear(): void {
    this.visible = true;

    if (this.firstTime) {
      this.revealUnderlay = new RevealUnderlay(this.game, () => {
        // Bring back
        const gameEvent = new GameEvent("Bring back via underlay", () => {
          this.revealUnderlay.active = false;

          this.scratchAreas.forEach(async (element) => {
            if (element.inFront) {
              await element.bringBack();
            }
          });
        });

        this.game.vi.emit(EEventQueue.Add, gameEvent);
      });
      this.addChild(this.revealUnderlay);

      // this.scratchAreas.push(new Monster(this.game, 150, 250, 0));
      // this.scratchAreas.push(new Monster(this.game, 550, 250, 1));
      // this.scratchAreas.push(new Monster(this.game, 150, 650, 2));
      // this.scratchAreas.push(new Monster(this.game, 550, 650, 3));

      // this.scratchAreas.forEach((element) => {
      //   this.addChild(element);
      // });

      this.firstTime = false;
      this.bottompanel.show();
      this.sidepanel.show();
    } else {
      this.scratchAreas.forEach((element) => {
        element.reset();
      });
    }
  }

  public async onDidAppear(): Promise<void> {
    this.reset();

    this.inactivity = new Inactivity(this.game, this.onInactivity, this.onEndInactivity, {
      loop: true,
      loopDelay: 10
    });

    // if (this.game.gameState.isReplay()) {
    //   this.game.vi.emit(EAutoButton.Disable);
    //   await TweenUtils.wait(1);
    //   this.auto();
    //   console.log("gamestate isReplay");
    // } else {
    //   this.game.vi.emit(EAutoButton.Enable);
    // }

    // if (this.game.gameState.isResume()) {
    //   console.log("gamestate isResume");

    //   // update view according to ticket
    //   if (this.game.ticket.status === ETicketStatus.OPENED) {
    //     console.log("this.game.ticket.status === ETicketStatus.OPENED");

    //     for (let i = 0; i < this.game.ticket.revelationData.scratchsRevealed.length; i++) {
    //       if (this.game.ticket.revelationData.scratchsRevealed[i]) {
    //         this.scratchAreas[i].preScratch();
    //       }
    //     }
    //   }
    // }

    // Notify game started
    this.game.events.emit(EGameEvents.GameStart);

    this.game.vi.emitter.on(EAutoButton.StartAuto, () => {
      const gameEvent = new GameEvent("Start auto", async () => {
        await this.auto();
      });

      this.game.vi.emit(EEventQueue.Add, gameEvent);
    });

    this.game.vi.emitter.on(EAutoButton.StopAuto, () => {
      const callback = () => {
        // Don't use eventqueue if immediately stop is requered
        this.isAuto = false;
        this.scratchAreas.forEach((element) => {
          element.stop();
        });
      };

      this.game.vi.emit(EEventQueue.Flush, callback);
    });

    this.promises = [];

    // for (let i = 0; i < this.game.ticket.revelationData.scratchsRevealed.length; i++) {
    //   if (!this.game.ticket.revelationData.scratchsRevealed[i] || this.game.gameState.isReplay()) {
    //     this.promises.push(
    //       new Promise<void>(
    //         (resolve) =>
    //           (this.scratchAreas[i].scratch.onRevealComplete = async () => {
    //             this.game.ticket.revelationData.scratchsRevealed[i] = true;
    //             this.game.ticket.update();
    //             console.log("Scratch done for index " + i);
    //             resolve();
    //             await this.scratchAreas[i].bringBack();
    //           })
    //       )
    //     );
    //   }
    // }

    // // Wait until all scratches are revealed complete.
    // Promise.all(this.promises).then(() => {
    //   console.log("Promise.all(this.promises)");
    //   this._gameEnded();
    // });
  }

  public onDidDisappear(): void {
    this.visible = true;

    // Reset listeners
    this.inactivity.stop();

    // After replay remove blocking overlay
    if (this.game.ticket.mode === ETicketMode.REPLAY) {
      this.game.removeBlockingOverlay();
    }
  }

  public get anyInFront(): boolean {
    let inFront = false;

    this.scratchAreas.forEach((element) => {
      if (element.inFront) {
        inFront = true;
      }
    });

    return inFront;
  }

  private onInactivity = (): void => {
    this.scratchAreas.forEach((element) => {
      element.showInactivity();
    });
  };

  private onEndInactivity = (): void => {
    this.scratchAreas.forEach((element) => {
      element.hideInactivity();
    });
  };

  private async _gameEnded(): Promise<void> {
    console.log("private async _gameEnded()");
    this.inactivity.stop();
    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, false);

    this.game.vi.emit(EAutoButton.Disable);

    this.isAuto = false;

    this.scratchAreas.forEach((element) => {
      element.markWinner();
    });

    this.game.ticket.claim();

    await TweenUtils.wait(2);

    if (this.game.gameState.shouldStopAfterReveal()) {
      this.game.vi.emitter.emit(EVisualIdentityEvent.QuitGame);
      return;
    }

    this.game.state.next();
  }

  private async auto(): Promise<void> {
    this.isAuto = true;
    this.inactivity.stop();

    // Finish already open scrached first
    for (let i = 0; i < this.game.ticket.revelationData.scratchsRevealed.length; i++) {
      if (this.scratchAreas[i].inFront) {
        const gameEvent = new GameEvent("Auto scratch alrady in front", async () => {
          await this.scratchAreas[i].auto();
        });

        this.game.vi.emit(EEventQueue.Add, gameEvent);
      }
    }

    for (let i = 0; i < this.game.ticket.revelationData.scratchsRevealed.length; i++) {
      if (this.game.ticket.mode === ETicketMode.REPLAY) {
        const gameEvent = new GameEvent("Replay auto on scratch area " + i, async () => {
          await this.scratchAreas[i].auto();
        });

        this.game.vi.emit(EEventQueue.Add, gameEvent);
      } else {
        const gameEvent = new GameEvent("Auto on scratch area " + 1, async () => {
          if (this.isAuto && !this.game.ticket.revelationData.scratchsRevealed[i]) {
            await this.scratchAreas[i].auto();
          }
        });

        this.game.vi.emit(EEventQueue.Add, gameEvent);
      }
    }
  }

  private reset(): void {
    this.scratchAreas.forEach((element) => {
      element.reset();
    });
  }

  public onResize(): void {
    this.sidepanel.onResize();
  }
}
