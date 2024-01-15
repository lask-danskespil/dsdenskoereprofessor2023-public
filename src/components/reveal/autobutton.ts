import i18n from "i18next";
import { Container } from "pixi.js";

import type Game from "../..";
import { ViButton } from "../basic/viButton";
import { EAutoButton, ELockframe } from "../basic/enums";

export class AutoButton extends Container {
  private autoButton: ViButton;
  private stopAutoButton: ViButton;
  private game: Game;
  private _isEnabled: boolean;
  private _wasEnabled: boolean;
  private isRunning: boolean;

  public constructor(game: Game) {
    super();

    this.game = game;

    this.autoButton = new ViButton(
      {
        idleTexture: "buttons/autoskrab/idle",
        overTexture: "buttons/autoskrab/over",
        clickedTexture: "buttons/autoskrab/down",
        disabledTexture: "buttons/autoskrab/disabled"
      },
      i18n.t("reveal.buttonAuto")
    );

    this.autoButton.position.set(this.autoButton.width / -2, this.autoButton.height / -2);
    this.autoButton.visible = false;
    this.addChild(this.autoButton);

    this.stopAutoButton = new ViButton(
      {
        idleTexture: "buttons/autoskrab/idle",
        overTexture: "buttons/autoskrab/over",
        clickedTexture: "buttons/autoskrab/down",
        disabledTexture: "buttons/autoskrab/disabled"
      },
      i18n.t("reveal.buttonStopAuto")
    );

    this.stopAutoButton.position.set(this.stopAutoButton.width / -2, this.stopAutoButton.height / -2);
    this.stopAutoButton.visible = false;
    this.addChild(this.stopAutoButton);

    // Manage auto button
    this.autoButton.on("pointertap", async (): Promise<void> => {
      if (this.isRunning) {
        return;
      }

      this.isRunning = true;
      this.autoButton.visible = false;
      this.autoButton.enabled = false;
      this.stopAutoButton.visible = true;
      this.stopAutoButton.enabled = true;
      this.game.vi.emit(EAutoButton.StartAuto);
    });

    // Manage stop auto button
    this.stopAutoButton.on("pointertap", async () => {
      if (!this.isRunning) {
        return;
      }

      this.isRunning = false;
      this.autoButton.visible = true;
      this.autoButton.enabled = true;
      this.stopAutoButton.visible = false;
      this.stopAutoButton.enabled = false;
      this.game.vi.emit(EAutoButton.StopAuto);
    });

    this.game.vi.emitter.on(EAutoButton.Enable, () => {
      this.enable();
    });

    this.game.vi.emitter.on(EAutoButton.Disable, () => {
      this.disable();
    });

    this.game.vi.emitter.on(ELockframe.Lock, () => {
      if (this._isEnabled) {
        this._wasEnabled = true;
        this.disable();
      }
    });

    this.game.vi.emitter.on(ELockframe.FullyUnlocked, () => {
      if (this._wasEnabled) {
        this._wasEnabled = false;
        this.enable();
      }
    });
  }

  private enable(): void {
    this._isEnabled = true;

    this.autoButton.visible = !this.isRunning;
    this.autoButton.enabled = !this.isRunning;
    this.stopAutoButton.visible = this.isRunning;
    this.stopAutoButton.enabled = this.isRunning;
  }

  private disable(): void {
    this._isEnabled = false;
    this.isRunning = false;

    this.autoButton.visible = false;
    this.autoButton.enabled = false;
    this.stopAutoButton.visible = false;
    this.stopAutoButton.enabled = false;
  }

  public get isEnabled(): boolean {
    return this._isEnabled;
  }
}
