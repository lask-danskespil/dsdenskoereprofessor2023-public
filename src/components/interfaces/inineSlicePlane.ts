import type { DisplayObject, Texture } from "pixi.js";

export interface INineSlicePlane extends DisplayObject {
  texture: Texture;
  width?: number;
  height?: number;
  leftWidth: number;
  rightWidth: number;
  topHeight: number;
  bottomHeight: number;
}
