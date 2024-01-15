import { Point } from "pixi.js";

import type Game from "../..";
import type { IResizable } from "../interfaces/iresizable";
import MonsterAnimation from "./monsterAnimation";
import ScratchAreaBase from "./scratchAreaBase";
import { ProtectionOverlay } from "./protectionOverlay";
import { EEventQueue } from "../basic/enums";
import GameEvent from "../basic/gameEvent";

export default class Monster extends ScratchAreaBase implements IResizable {
  public constructor(game: Game, x: number, y: number, scratchIndex: number) {
    super(game, x, y, scratchIndex);

    this.zoomOutTo = 3;

    this.animation = new MonsterAnimation();

    // Funky shaped hitarea
    const shape = [
      new Point(17, 7),
      new Point(33, 30),
      new Point(65, 0),
      new Point(208, 0),
      new Point(243, 30),
      new Point(256, 7),
      new Point(273, 60),
      new Point(245, 120),
      new Point(255, 195),
      new Point(180, 247),
      new Point(160, 225),
      new Point(113, 225),
      new Point(93, 247),
      new Point(18, 195),
      new Point(28, 120),
      new Point(0, 60)
    ];

    // Square shaped hitarea
    // const shape = [
    //   new Point(0, 0),
    //   new Point(this.scratch.width, 0),
    //   new Point(this.scratch.width, this.scratch.height),
    //   new Point(0, this.scratch.height)
    // ];

    this.protectionOverlay = new ProtectionOverlay(shape, () => {
      const gameEvent = new GameEvent(`Bring to front ${this.scratchIndex}`, async () => {
        await this.bringToFront();
      });

      this.game.vi.emit(EEventQueue.Add, gameEvent);
    });

    this.addChild(this.protectionOverlay);
  }
  public onResize(): void {}
}
