// Instructions:
// game.mover.setTarget("gameScene.ladder")
// Use arrow keys to move ladder

import { DisplayObject } from "pixi.js";
import Game from "../..";

export class Mover {
  private target: DisplayObject;
  private targetName: string;
  private game: Game;
  
  constructor(game: Game) {
    this.game = game;

    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  public setTarget(target: string): string {
    this.targetName = target;
    this.target = this.fetchFromObject(this.game, target);

    return "Target set to: " + this.targetName;
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.target) {
      console.log("Target not set");
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        this.target.position.x -= 1;
        break;

      case "ArrowUp":
        this.target.position.y -= 1;
        break;

      case "ArrowRight":
        this.target.position.x += 1;
        break;

      case "ArrowDown":
        this.target.position.y += 1;
        break;
    }

    console.log(this.targetName + ": " + this.target.position.x + " x " + this.target.position.y);
  }

  private fetchFromObject(obj, prop) {

    if(typeof obj === 'undefined') {
        return false;
    }

    var _index = prop.indexOf('.')
    if(_index > -1) {
        return this.fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
}
}