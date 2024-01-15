import { Amount } from "@gdk/core";
import type { INotifier, IPurseInformation } from "@falcon/bridge";
import type { AbstractGame } from "@gdk/gamekit";
import { EVisualIdentityAction } from "@gdk/gamekit";

export class Notifier implements INotifier {
  private _game: AbstractGame;

  /**
   * Constructor.
   * @param game defines the reference to the game itself. Used to dispatch notifications across targeted components.
   */
  public constructor(game: AbstractGame) {
    this._game = game;
  }

  /**
   * Notifies the game that the purse information changed.
   * @param purseInformation defines the new purse information to display in the game.
   */
  public notifyPurseInformationChange(purseInformation?: IPurseInformation): void {
    if (purseInformation) {
      this._game.vi.emit(EVisualIdentityAction.SetPurse, new Amount(purseInformation.displayedAmount));
    } else {
      this._game.getPurse(true);
    }
  }

  /**
   * Notifies the game that the sound status changed.
   * @param soundEnabled defines the sound status.
   */
  public notifySoundStatus(soundEnabled?: boolean): void {
    this._game.vi.emit(EVisualIdentityAction.SoundEnabled, soundEnabled ?? false);
  }

  /**
   * Notifies the game about pause/resume status.
   * @param isPaused defines the pause/resume status.
   * @param reason reason the game is paused for
   */
  public notifyPause(message: { isPaused: boolean; reason: string }): void {
    const { isPaused, reason } = message;

    if (isPaused) {
      this._game.pause(`notifier_${reason}`);
    } else {
      this._game.unpause(`notifier_${reason}`);
    }
  }
}
