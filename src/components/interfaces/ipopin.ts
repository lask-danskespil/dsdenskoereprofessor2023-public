import type { Container, Texture } from "pixi.js";
import type { Button, TextField } from "@gdk/core-pixi";

import type { INineSlicePlane } from "./inineSlicePlane";

export interface IPopin extends Container {
  backgroundNineSlice: INineSlicePlane;
  backgroundSprite: Texture;
  background: INineSlicePlane;
  confirmQuitButton: Button;
  closeButton: Button;
  title: TextField;
  body: TextField;
}
