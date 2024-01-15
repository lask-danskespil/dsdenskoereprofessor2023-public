import type { AbstractScratch2Renderer, IScratch2Options } from "@gdk/core-pixi";
import { DefaultScratchRenderer, OneClickScratchRenderer, ParticlesScratchRenderer } from "@gdk/core-pixi";
import type { Texture } from "pixi.js";
import { Container, Sprite } from "pixi.js";

export class DefaultScratch2Option implements IScratch2Options {
  public content: Container;
  public renderer: AbstractScratch2Renderer;
  public resolution?: number;
  public disableCaching?: boolean;
  public revealRatio?: number;
  public clampValue?: number;
  public inverted?: boolean;
  public fallback?: {
    defaultRenderer?: DefaultScratchRenderer;
    oneClickRenderer?: OneClickScratchRenderer;
  };
  public padding?: number;

  public constructor(texture: Texture) {
    this.content = new Container();
    this.content.addChild(new Sprite(texture));

    this.renderer = new ParticlesScratchRenderer();

    this.fallback = {
      defaultRenderer: new DefaultScratchRenderer(),
      oneClickRenderer: new OneClickScratchRenderer()
    };
  }
}


// public constructor() {
//   this.content = new Container();
//   this.renderer = new OneClickScratchRenderer();
// }
