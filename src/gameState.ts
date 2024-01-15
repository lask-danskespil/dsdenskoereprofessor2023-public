import { ETicketMode, ETicketStatus } from "@gdk/gamekit";
import type { IItgTicket } from "@falcon/bridge";
import type { IDemo, IGame } from "@gdk/core";

import { Ticket } from "./ticket";
import { EBetEvents } from "./components/basic/enums";
import type Game from ".";

export class GameState {
  /* LIFECYCLE */
  private gameState: ETicketMode = null;

  /**
   * @constructor
   * @param game - The current game
   */
  public constructor(private game: Game) {
    this.game.vi.emitter.on(EBetEvents.confirmBet, async () => {
      this.gameState = ETicketMode.DEFAULT;
    });
  }

  /* PUBLIC METHODS */

  /**
   * Get the next view after splash view
   * @returns The next view
   */
  public getViewAfterSplash(): string {
    if ((this.isReplay() && this.parameters.startReplayOn === "splash") || (this.isResume() && this.parameters.startResumeOn === "splash")) {
      return "reveal";
    }

    return this.shouldSkipRules() ? "home" : "rules";
  }

  /**
   * Check if there is an awaiting ticket for the game
   */
  public async loadActiveTicket(): Promise<void> {
    const [ticketToReplay, ticketToResume] = await Promise.all([this.game.getTicketToReplay(false), this.game.getExistingTicket(this.game.gameConfig.lotteryGameCode, false)]);

    let activeTicket: IItgTicket = null;
    let activeMode: ETicketMode = null;

    if (ticketToReplay) {
      activeTicket = ticketToReplay;
      activeMode = ticketToReplay.status === ETicketStatus.CLAIMED ? ETicketMode.REPLAY : ETicketMode.RESUME;
    } else if (ticketToResume) {
      activeTicket = ticketToResume;
      activeMode = ETicketMode.RESUME;
    }

    if (!activeMode || (activeMode === ETicketMode.RESUME && !this.resumeIsEnabled())) {
      return;
    }

    this.game.ticket = new Ticket(activeTicket, activeMode, this.game);
  }

  public async checkReplayTicket(demo: boolean): Promise<ETicketMode> {
    console.log("loadActiveTicket");
    const [ticketToReplay] = await Promise.all([this.game.getTicketToReplay(demo)]);

    let activeTicket: IItgTicket = null;
    let activeMode: ETicketMode = null;

    if (ticketToReplay) {
      console.log(`checkReplayTicket - Replay ticket: ${ticketToReplay.id}`);
      activeTicket = ticketToReplay;
      activeMode = ETicketMode.REPLAY;
    } else {
      return ETicketMode.DEFAULT;
    }

    if (!activeMode || !this.resumeIsEnabled()) {
      return ETicketMode.DEFAULT;
    }

    console.log("checkReplayTicket - creating ticket");
    this.game.ticket = new Ticket(activeTicket, activeMode, this.game);

    if (activeMode === ETicketMode.REPLAY && this.parameters.startReplayOn === "load") {
      return ETicketMode.REPLAY;
    }

    return ETicketMode.REPLAY;
  }

  /**
   * Return the first view to show when the game is loaded
   * @returns The view to show
   */
  public getFirstView(): string {
    const { skipSplash } = this.parameters;
    const skipRules: boolean = this.shouldSkipRules();
    let view = "splash";

    if (this.game.parameters.testmode) {
      return "test";
    }

    if (skipSplash) {
      view = skipRules ? "home" : "rules";
    }

    return view;
  }

  /**
   * Check if a current ticket is ready to be resumed/played
   * @returns True if there is a current ticket available
   */
  public hasActiveTicket(): boolean {
    return this.game.ticket !== null;
  }

  /**
   * @returns True if the ticket is in replay mode
   */
  public isReplay(): boolean {
    if (this.game.ticket && this.game.ticket.status == ETicketStatus.CLAIMED && this.game.ticket.mode === ETicketMode.REPLAY) {
      if (this.gameState === null) {
        this.gameState = ETicketMode.REPLAY;
      }
    }

    return this.gameState === ETicketMode.REPLAY && this.game.ticket.mode === ETicketMode.REPLAY;
  }

  /**
   * @returns True if the current ticket is in resume mode
   */
  public isResume(): boolean {
    if (this.game.ticket && this.game.ticket.status == ETicketStatus.OPENED && this.game.ticket.mode === ETicketMode.RESUME) {
      if (this.gameState === null) {
        this.gameState = ETicketMode.RESUME;
      }
    }

    return this.gameState === ETicketMode.RESUME && this.game.ticket.mode === ETicketMode.RESUME && this.game.ticket.status == ETicketStatus.OPENED;
  }

  /**
   * @returns True if the rules views should not be shown
   */
  private shouldSkipRules(): boolean {
    return this.game.parameters.hideRules || localStorage.getItem(this.game.gameConfig.lotteryGameCode + "-noMoreRules") === "true";
  }

  /**
   * @returns true if the game should be stopped after the end of the reveal
   */
  public shouldStopAfterReveal(): boolean {
    return this.isReplay() && this.parameters.stopRevealOn === "reveal";
  }

  /**
   * @returns true if the game should be stopped after the end of the result view
   */
  public shouldStopAfterResult(): boolean {
    return this.isReplay() && this.parameters.stopRevealOn === "result";
  }

  /**
   * @returns True if the resume mode is enabled for this game
   */
  private resumeIsEnabled(): boolean {
    return this.game.gameConfig.selectedBetMode === "BET_MANUAL_CLAIM";
  }

  /**
   * @returns True if the demo mode is enabled and supported
   */
  public isDemoEnabled(): boolean {
    const demo: IDemo = this.game.gameConfig.demo;

    if (!demo) {
      return false;
    }

    return demo.enabled;
  }

  /**
   * @returns parameters
   */
  public get parameters(): IGame["parameters"] {
    return {
      homeButtons: {},
      skipRules: false,
      skipSplash: false,
      orientation: "auto",
      startReplayOn: "load",
      startResumeOn: "load",
      stopReplayOn: "result",
      numberOfStakes: 1,
      ...this.game.gameConfig.gameParameters
    };
  }
}
