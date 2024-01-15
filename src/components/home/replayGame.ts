import i18n from "i18next";
import { Amount } from "@gdk/core";

import type Game from "../..";
import { EBetEvents } from "../basic/enums";
import { ThreeButtonPopup } from "../basic/threeButtonPopup";

export class ReplayGame extends ThreeButtonPopup {
  public constructor(game: Game) {
    super(game, 350);

    const ticketId: number = game.ticket ? game.ticket.ticketId : 0;

    this.addTitle(i18n.t("replayGame.title"));
    this.addText(i18n.t("replayGame.text", { ticketId }));

    const bet = Amount.formatFromWholeOrRealNumber(game.selectedStake.value);

    this.addLeftButton(
      i18n.t("replayGame.replay"),
      () => {
        this.visible = false;
        game.vi.emit(EBetEvents.replayGame, false);
      },
      false
    );

    this.addRightButton(
      i18n.t("replayGame.rebet", { bet }),
      () => {
        this.hide();
        this.game.confirmBetPopup.show(true);
      },
      true,
      true
    );
  }
}
