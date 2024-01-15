import type { LoadedView } from "@gdk/core-pixi";

import type { ISettingsComponent } from "./isettingsComponent";
import type { IBottomBar } from "./ibottomBar";
import type { IPopin } from "./ipopin";

export interface IInGameView extends LoadedView {
  settingsComponent: ISettingsComponent;
  bottomBar: IBottomBar;
  quitPopin: IPopin;
}
