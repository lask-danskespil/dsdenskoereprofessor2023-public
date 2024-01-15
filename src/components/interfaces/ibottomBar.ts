import type { Button } from "@gdk/core-pixi";
import type { Container, Graphics } from "pixi.js";

export interface IBottomBar extends Container {
  bottomOverlay: Graphics;
  settingsButton: Button;
}
