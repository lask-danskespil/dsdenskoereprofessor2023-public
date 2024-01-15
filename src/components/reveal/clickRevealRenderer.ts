//@ts-nocheck

import { AbstractScratch2Renderer, Scratch2, Scratch2Zone } from "@gdk/core-pixi";
import { IPointerEvent } from "@gdk/core-pixi/ui/baseui/ui/customPointer";
import { Texture } from "pixi.js";

export class ClickRevealRenderer extends AbstractScratch2Renderer {
  public constructor(textures?: Texture[]) {
    super();
  }

  onScratch(scratch: Scratch2, event: IPointerEvent, zone: Scratch2Zone): void {
    return;
  }
  reset(): void {
    return;
  }
  export(): any {
    return {
      type: "ClickRevealRenderer",
    };
  }

}