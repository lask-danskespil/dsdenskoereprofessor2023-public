import i18n from "i18next";

import type Game from "../..";
import { EBetEvents } from "../basic/enums";
import { ThreeButtonPopup } from "../basic/threeButtonPopup";

export class ResumeGame extends ThreeButtonPopup {
  public constructor(game: Game) {
    super(game, 350);

    this.addTitle(i18n.t("resumeGame.title"));
    this.addText(i18n.t("resumeGame.text"));

    this.addCenterButton(
      i18n.t("resumeGame.button"),
      () => {
        console.log("Home: resume clicked");
        this.hide();
        game.vi.emit(EBetEvents.resumeGame, true);
      },
      true,
      true
    );
  }
}
