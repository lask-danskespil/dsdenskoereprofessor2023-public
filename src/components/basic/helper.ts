import type Game from "../..";
import { EFullscreen } from "./enums";
import { SpriteDimensions } from "./spritedimensions";

export class DanskeSpil {
  public static randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  public static randomBoolean = (): boolean => {
    return this.randomBetween(0, 1) === 1;
  };

  public static camelize = (text: string): string => {
    //@ts-ignore
    return text.replace(/\W+(.)/g, (match, chr) => {
      return chr.toUpperCase();
    });
  };

  public static toRad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  public static isMobile = (): boolean => {
    if (window.location.search.toLowerCase().includes("lotterychannel=mobile")) {
      return true;
    }

    if (window.location.search.toLowerCase().includes("lotterychannel=web")) {
      return false;
    }

    // Experimental
    //@ts-ignore
    if (navigator.userAgentData && navigator.userAgentData.mobile) {
      return true;
    }

    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      return true;
    }

    if (window.outerWidth > 0 && window.outerHeight > 0 && window.outerWidth / window.outerHeight < 1) {
      return true;
    }

    return false;
  };

  public static calculateWidth = (game: Game): number => {
    // 0.85 allows margin for iframe elements
    let width = Math.floor(game.window.outerWidth * 0.85);
    const height = Math.floor(game.window.outerHeight * 0.85);

    // Max allowed width on DS game launcher
    if (width > 1030) {
      width = 1030;
    }

    if (width / game.parameters.aspect > height) {
      return width;
    }

    return Math.floor(height * game.parameters.aspect);
  };

  public static IsColliding(sprite1: SpriteDimensions, sprite2: SpriteDimensions, margin?: number): boolean {
    const rect1 = new SpriteDimensions(sprite1.name, sprite1.id, sprite1.position, sprite1.width, sprite1.height);
    const rect2 = new SpriteDimensions(sprite2.name, sprite2.id, sprite2.position, sprite2.width, sprite2.height);
    
    if (margin) {
      rect1.height += margin * 2;
      rect1.width += margin * 2;
      rect2.height += margin * 2;
      rect2.width += margin * 2;
    }
    
    const collision = rect1.x < rect2.x + rect2.width &&
                      rect1.x + rect1.width > rect2.x &&
                      rect1.y < rect2.y + rect2.height &&
                      rect1.height + rect1.y > rect2.y;
    return collision;
  }

  public static toggleFullScreen = async (): Promise<EFullscreen> => {
    if (!document.fullscreenElement) {
      return new Promise(async (resolve) => {
        await document.documentElement
          .requestFullscreen()
          .then(() => {
            resolve(EFullscreen.IsFullscreen);
          })
          .catch(() => {
            resolve(EFullscreen.Unsupported);
          });
      });
    } else if (document.exitFullscreen) {
      return new Promise(async (resolve) => {
        await document.exitFullscreen();
        resolve(EFullscreen.IsNormal);
      });
    }
  };
}
