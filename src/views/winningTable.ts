import i18n from "i18next";
import { Docking, DockingBounds, EAlign, EScrollBarAlign2, ScrollBar2, ScrollContainer2, TextArea } from "@gdk/core-pixi";
import { Texture, mesh } from "pixi.js";
import { EVisualIdentityAction } from "@gdk/gamekit";

import type Game from "..";
import { ThreeButtonPopup } from "../components/basic/threeButtonPopup";
import { Templates } from "../components/basic/templates";


export class WinningTable extends ThreeButtonPopup {
  private scrollContainer: ScrollContainer2;

  public constructor(game: Game) {
    super(game);

    this.addTitle(i18n.t("winningTable.title"));

    this.scrollContainer = new ScrollContainer2();
    this.scrollContainer.setDimensions(750, 350);
    this.scrollContainer.automaticTrackHeight = true;
    this.scrollContainer.automaticScrollBarVisibility = true;
    this.scrollContainer.docking = new Docking(Docking.centerHorizontal);
    this.scrollContainer.dockingBounds = new DockingBounds(750, 600);
    this.scrollContainer.position.set(0, this.game.gameCenterPoint.y - 500 / 2 + 125);
    this.addChild(this.scrollContainer);

    const handleNineSlice = new mesh.NineSlicePlane(Texture.fromFrame("vi/scroll-handle"), 6, 6, 6, 6);
    const trackNineSlice = new mesh.NineSlicePlane(Texture.fromFrame("vi/scroll-bar"), 6, 6, 6, 6);

    const scrollBar = new ScrollBar2(handleNineSlice, trackNineSlice, EScrollBarAlign2.Vertical);
    scrollBar.x = 740;
    this.scrollContainer.addScrollBar(scrollBar);

    const ranksText = i18n.t("winningTable.ranks", { returnObjects: true });
    let ranks: string = "";
    ranksText.forEach((element) => {
      ranks += element + "\n";
    });

    const leftColumn = new TextArea(ranks, Templates.ranksTextStyle);
    leftColumn.docking = new Docking(Docking.topLeft);
    this.scrollContainer.addContent(leftColumn);

    const gainRanksText = i18n.t("winningTable.gainRanks", { returnObjects: true });
    let gainRanks: string = "";
    gainRanksText.forEach((element) => {
      gainRanks += element + "\n";
    });

    const rightColumn = new TextArea(gainRanks, Templates.ranksTextStyle);
    rightColumn.align = EAlign.Right;
    rightColumn.position.x = 550;
    this.scrollContainer.addContent(rightColumn);

    this.addCloseButton(() => {
      this.hide();
    });
  }

  public show(lock: boolean = false): void {
    super.show(lock);

    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, false);
  }

  public hide(): void {
    super.hide();
    this.game.unpause("rules");

    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, true);
  }

  public onResize(): void {
    super.onResize();
    this.scrollContainer.position.set(0, this.game.gameCenterPoint.y - 500 / 2 + 125);
  }
}
