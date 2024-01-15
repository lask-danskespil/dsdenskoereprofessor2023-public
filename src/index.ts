import type { Graphics } from "pixi.js";
import { Point } from "pixi.js";
import i18n from "i18next";
import { EGameMode } from "@falcon/bridge";
import { State, EOrientation, Loader, SoundLayer, tracker, Logger } from "@gdk/core";
import { Docking, Scratch2, Timeline } from "@gdk/core-pixi";
import { EVisualIdentityEvent, Express, ETicketMode, EVisualIdentityAction } from "@gdk/gamekit";
import { ContainerView, TextArea } from "@gdk/core-pixi";
import type { IBehavioursParameters, IGameConf } from "@gdk/core";

import SplashView from "./views/splash";
import RulesView from "./views/rules";
import HomeView from "./views/home";
import RevealView from "./views/reveal";
import ResultView from "./views/result";
import { Ticket } from "./ticket";
import { GameState } from "./gameState";
import { ConfirmBet } from "./components/home/confirmBet";
import { ResumeGame } from "./components/home/resumeGame";
import { WinningTable } from "./views/winningTable";
//import { ViModifier } from "./components/basic/viModifier";
import { ReplayGame } from "./components/home/replayGame";
import { Notifier } from "./components/basic/notifier";
import { DanskeSpil } from "./components/basic/helper";
import { TestView } from "./views/test";
import { AutoButton } from "./components/reveal/autobutton";
import { Fullscreen } from "./components/basic/fullscreen";
import { EventQueue } from "./components/basic/eventQueue";
import { ViButton } from "./components/basic/viButton";
import { Lockframe } from "./components/basic/lockframe";
import type { IDimensions } from "./components/interfaces/idimensions";
import type { IInGameView } from "./components/interfaces/iinGameView";
import type { IBottomBar } from "./components/interfaces/ibottomBar";
import { Time } from "./components/basic/time";
import { ViModifier } from "./components/basic/viModifier";
import { GameScene } from "./components/reveal/gameScene";
import { Mover } from "./components/basic/mover";
import pinchable from "./components/basic/pinch";

export default class Game extends Express {
  private splashView: SplashView;
  private rulesView: RulesView;
  private homeView: HomeView;
  public revealView: RevealView;
  private resultView: ResultView;

  public ticket: Ticket = null;
  private winningTable: WinningTable = null;

  public confirmBetPopup: ConfirmBet = null;
  public resumeGame: ResumeGame = null;
  public replayGame: ReplayGame = null;

  private autoButton: AutoButton;
  public tryAgainButton: ViButton;
  private fullscreenIcon: Fullscreen;

  public gameState: GameState;
  public gamePlayed = 0;

  private _eventQueue: EventQueue = new EventQueue(this);
  public get eventQueue(): EventQueue {
    return this._eventQueue;
  }

  private dimensions: IDimensions = {
    width: 0,
    height: 0
  };

  private blockingOverlay: Graphics;
  private lockframe: Lockframe;
  private muteStateBeforeLockscreen: boolean;

  private sfxScratch: Howl;
  private sfxTheme: Howl;

  private gameScene: GameScene;

  public sfx: Howl[] = [];

  public mover: Mover;

  // Override init() in distributed abstractgame.ts
  public async init(done: () => void): Promise<void> {
    await this.com.init();

    if (this.com.bridge.channel.setNotifier) {
      this.com.bridge.channel.setNotifier(new Notifier(this));
    }

    tracker.init({ com: this.com, logger: Logger.getLogger() });

    // Init i18n
    this.settings.language = this.gameConfig.selectedLocale;

    i18n.init({
      lng: this.gameConfig.selectedLocale,
      resources: {}
    });

    i18n.setDefaultNamespace("game");

    // Init com i18n
    await this.com.initI18n();

    done();
  }

  /**
   * Constructor
   * @param gameConfig: the game configuration
   */
  public constructor(public gameConfig: IGameConf) {
    super(gameConfig, 1920, 1200, false, {
      autoResize: true,
      backgroundColor: 0x281a12
    });

    this.gameState = new GameState(this);

    // Create all views
    this.splashView = new SplashView(this);
    this.rulesView = new RulesView(this);
    this.homeView = new HomeView(this);
    this.revealView = new RevealView(this);
    this.resultView = new ResultView(this);

    if (this.parameters.testmode) {
      // Create State of testing dealer
      this.state = new State({
        test: { view: new TestView(this) }
      });
    } else {
      // Create State of the game
      this.state = new State({
        splash: { view: this.splashView },
        rules: { view: this.rulesView, next: "home" },
        reveal: { view: this.revealView, next: "result" },
        home: { view: this.homeView, next: "reveal" },
        result: { view: this.resultView }
      });
    }

    // Set game's orientation
    this.settings.orientation = this.parameters.isPortrait ? EOrientation.Portrait : EOrientation.Landscape;

    this.vi.emitter.on(EVisualIdentityEvent.ShowRules, () => {
      this.rulesView.showRules(false);
    });

    this.vi.emitter.on(EVisualIdentityEvent.ShowWinningTable, () => {
      this.winningTable.show(true);
    });

    this.vi.emitter.on(EVisualIdentityEvent.ShowMainRules, () => {
      this.pause("blur"); // Add blur pause reason as a "trigger"
    });

    this.vi.emitter.on(EVisualIdentityEvent.AboutGame, () => {
      this.pause("blur"); // Add blur pause reason as a "trigger"
      this.pause("rules"); // Add missing rules pause reason (GDK fix)
    });

    // Unpause if "trigger" pause reason is in queue - returning to rules menu from external rules window
    this.vi.emitter.on(EVisualIdentityEvent.HideSettings, () => {
      if (this.pauseReasons.has("blur") && this.pauseReasons.has("rules")) {
        this.unpause("blur");
        this.unpause("rules");
      }
    });

    // Unpause if "trigger" pause reason is in queue - returning from external rules window
    this.vi.emitter.on(EVisualIdentityEvent.GameFocused, () => {
      if (this.pauseReasons.has("blur") && this.pauseReasons.has("rules")) {
        this.unpause("blur");
        this.unpause("rules");
      }
    });

    // Reimplement lockscreen handling - GDK fix
    this.onShowLockScreen = () => {
      this.muteStateBeforeLockscreen = (this as any)._mute;
      this.tryToMute(true);
      (this as any)._mute = true;
    };

    // Reimplement lockscreen handling - GDK fix
    this.onHideLockScreen = () => {
      if (!this.muteStateBeforeLockscreen) {
        this.tryToMute(false);
      }
      (this as any)._mute = this.muteStateBeforeLockscreen;
    };

    this.vi.emitter.on(EVisualIdentityAction.SettingsEnabled, (enabled: boolean) => {
      const settingsButton = (this.vi.inGameView as IInGameView).bottomBar.settingsButton;
      // Timeout due to concurrency problem
      setTimeout(() => {
        settingsButton.enabled = enabled;
        settingsButton.interactive = enabled;
        settingsButton.text.alpha = enabled ? 1 : 0.7;
      }, 100);
    });

    // Register game-pixi-spine preloader
    this.pixiLoader.instance.pre(Timeline.preloadedAtlasFinder());

    addEventListener("resize", () => {
      this.splashView.onResize();
      this.homeView.onResize();
      this.revealView.onResize();
      this.resultView.onResize();
      this.rulesView.onResize();
      this.winningTable.onResize();
      this.confirmBetPopup.onResize();
      this.replayGame.onResize();
      this.resumeGame.onResize();
      this.lockframe.onResize();
    });
  }

  public async start(): Promise<void> {
    this.sendGameDimensions();

    this.gameState.checkReplayTicket(false).then((result) => {
      console.log("Index check replay ticket: " + result);
      if (result === ETicketMode.REPLAY) {
        console.log("Index: Replay");
      }
    });

    super.start(this.gameState.getFirstView(), () => {
      // Show the tutorial button if needed
      if (this.parameters.withTutorial) {
        this.vi.emitter.emit(EVisualIdentityAction.TutorialVisible, true, false);
      }

      (this.vi.inGameView as IInGameView).bottomBar.visible = false;

      this.sfx.push(Loader.get<Howl>("sfx-scratch")); // Index 0
      SoundLayer.setSoundLayer(this.sfx[0], 1); //What do soundlayers do?

      this.sfx.push(Loader.get<Howl>("sfx-theme")); // Index 1
      SoundLayer.setSoundLayer(this.sfx[1], 0); //What do soundlayers do?
      this.sfx[1].loop(true);
      this.sfx[1].volume(0.2);

      this.sfx.push(Loader.get<Howl>("sfx-tictac")); // Index 2
      this.sfx[2].volume(0.7);


      Scratch2.scratchSound = this.sfx[0];

      this.sfx.forEach(element => {
        element.mute(true);
      });

      this.sfx[1].play();

      this.gameScene = new GameScene(this, false);
      pinchable(this.gameScene, true);
      this.stage.addChild(this.gameScene); 

      // Add all views into the stage
      Object.keys(this.state.states).forEach((s) => {
        const view = this.state.states[s].view as ContainerView;
        view.visible = false;

        this.stage.addChild(view);
      });

      const time = new Time(25, 25, "white");
      this.stage.addChild(time);

      this.fullscreenIcon = new Fullscreen();
      this.stage.addChild(this.fullscreenIcon);

      this.lockframe = new Lockframe(this);
      this.stage.addChild(this.lockframe);

      // Add rules view in front of all other views including the overlay
      this.stage.addChild(this.rulesView);

      this.confirmBetPopup = new ConfirmBet(this);
      this.stage.addChild(this.confirmBetPopup);

      this.resumeGame = new ResumeGame(this);
      this.stage.addChild(this.resumeGame);

      this.replayGame = new ReplayGame(this);
      this.stage.addChild(this.replayGame);

      const bottomBar: IBottomBar = (this.vi.inGameView as IInGameView).bottomBar;

      this.autoButton = new AutoButton(this);
      this.autoButton.docking = new Docking(Docking.centerAll);
      bottomBar.addChild(this.autoButton);

      this.tryAgainButton = new ViButton(
        {
          idleTexture: "buttons/autoskrab/idle",
          overTexture: "buttons/autoskrab/over",
          clickedTexture: "buttons/autoskrab/down",
          disabledTexture: "buttons/autoskrab/disabled"
        },
        i18n.t("home.tryAgain")
      );
      this.tryAgainButton.docking = new Docking(Docking.centerAll);
      this.tryAgainButton.visible = false;
      bottomBar.addChild(this.tryAgainButton);

      this.winningTable = new WinningTable(this);
      this.stage.addChild(this.winningTable);

      this.mover = new Mover(this);

      // (this.vi.inGameView as IInGameView).settingsComponent = new SettingsComponent(this.vi);
      // this.stage.addChild((this.vi.inGameView as IInGameView).settingsComponent);




      new ViModifier(this.vi.inGameView as IInGameView);
    });
  }

  /**
   * Perform bet.
   */
  public async performBet(mode?: EGameMode): Promise<void> {
    const gameMode = mode || (await this.getGameMode());

    const responseTicket = await this.bet({
      applicationId: "ITG",
      serviceName: this.gameConfig.lotteryGameCode,
      stake: {
        currency: this.selectedStake.currency,
        value: this.selectedStake.value
      },
      demo: gameMode === EGameMode.demo
    });

    this.ticket = new Ticket(responseTicket, ETicketMode.DEFAULT, this);
  }

  /**
   * Remove the replay blocking overlay
   */
  public removeBlockingOverlay(): void {
    this.stage.removeChild(this.blockingOverlay);
  }

  private sendGameDimensions(): void {
    const EVENTID_DIMENSIONS = "DIMENSIONS";
    const EVENTID_DIMENSIONS_LEGACY = "dimensions";

    if (DanskeSpil.isMobile()) {
      this.dimensions.width = this.window.outerWidth;
      this.dimensions.height = this.window.outerHeight;

      console.log(`Sending mobile dimensions: ${this.dimensions.width} x ${this.dimensions.height}`);
    } else {
      this.dimensions.width = DanskeSpil.calculateWidth(this);
      this.dimensions.height = Math.floor(this.dimensions.width / this.parameters.aspect);
      console.log(`Sending desktop dimensions: ${this.dimensions.width} x ${this.dimensions.height}`);
    }

    if (this.com.bridge) {
      this.com.bridge.channel.emitEvent(EVENTID_DIMENSIONS, this.dimensions);
      this.com.bridge.channel.emitEvent(EVENTID_DIMENSIONS_LEGACY, this.dimensions);
    }
  }

  public get parameters(): IBehavioursParameters {
    return this.gameConfig.gameParameters;
  }

  public get gameAspect(): number {
    return window.innerHeight / window.innerWidth;
  }

  public get gameCenterPoint(): Point {
    return new Point(this.parameters.width / 2, this.parameters.height / 2);
  }
}
