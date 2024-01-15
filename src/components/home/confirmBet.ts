import i18n from "i18next";
import { Amount } from "@gdk/core";

import type Game from "../..";
import { EBetEvents } from "../basic/enums";
import { ThreeButtonPopup } from "../basic/threeButtonPopup";


export class ConfirmBet extends ThreeButtonPopup {
  public constructor(game: Game) {
    super(game, 350);

    this.addTitle(i18n.t("confirmBet.title"));
    this.addText(i18n.t("confirmBet.text"));

    const bet = Amount.formatFromWholeOrRealNumber(game.selectedStake.value);

    this.addLeftButton(
      i18n.t("confirmBet.bet", { bet }),
      () => {
        this.hide();
        game.vi.emit(EBetEvents.confirmBet, false);
      },
      true,
      true
    );

    this.addRightButton(
      i18n.t("confirmBet.cancel"),
      () => {
        this.hide();
        game.vi.emit(EBetEvents.cancelledBet, false);
      },
      false
    );
  }
}
