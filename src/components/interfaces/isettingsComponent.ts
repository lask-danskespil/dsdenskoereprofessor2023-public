import type { Container, Texture } from "pixi.js";
import type { Button, TextField } from "@gdk/core-pixi";

import type { INineSlicePlane } from "./inineSlicePlane";
import type { ISoundContainer } from "./isoundContainer";

export interface ISettingsComponent extends Container {
  backgroundNineSlice: INineSlicePlane;
  backgroundSprite: Texture;
  background: INineSlicePlane;
  aboutButton: Button;
  rulesButton: Button;
  winningTableButton: Button;
  instructionsButton: Button;
  quitButton: Button;
  closeButton: Button;
  title: TextField;
  muteButton: ISoundContainer;
  unmuteButton: ISoundContainer;
}
