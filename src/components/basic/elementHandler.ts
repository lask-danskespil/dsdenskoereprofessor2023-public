import { Container, Texture } from "pixi.js";
import { DefaultScratch2Option } from "../reveal/defaultscratch2options";
import { Scratch2 } from "@gdk/core-pixi";
import { ClickRevealRenderer } from "../reveal/clickRevealRenderer";

export class ElementHandler {

  public constructor() {

  }

  private spawnElementAt(x: number, y: number, texture: string, flipHorizontal?: boolean, flipVertical?: boolean, inFront?: boolean, scale?: number): Scratch2 {
    const scratchOptions = new DefaultScratch2Option(Texture.fromImage(texture));

    const element = new Scratch2(scratchOptions);

    if (scale) {
      element.scale.set(scale, scale);
    } 

    element.position.set(x, y);

    if (flipHorizontal) {
      element.scaleX *= -1;
    }

    if (flipVertical) {
      element.scaleY *= -1;
    }

    element.interactive = true;

    element.renderer = new ClickRevealRenderer();
    element.setCursor("default");

    // // Remove flicker
    // element.on("pointerover", () => {
    //   element.cursor = "default";
    // });
    
    // if (inFront) {
    //   this.view.viewportLayers[6].addChild(element);
    // } else {
    //   this.view.viewportLayers[3].addChild(element);
    // }

    return element;
  }

  public spawnItem(element: any): Scratch2 {
    if (!element) {
      throw new TypeError("Element not set");
    }

    return this.spawnElementAt(element.position.x, element.position.y, "elements/" + element.id, element.position.flipHorizontal, element.position.flipVertical, element.position.inFront);  //TODO: Add scale
  }

}