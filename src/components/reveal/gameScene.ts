import { Graphics } from "pixi.js";
import { Sprite, Texture } from "pixi.js";
import { DanskeSpil } from "../basic/helper";
import { Linear, TweenMax } from "gsap";
import { Docking, DockingBounds, Resize, TextArea } from "@gdk/core-pixi";
import { SceneAnimations } from "./sceneAnimations";
import { Door } from "./door";
import { Cuckoo } from "./cuckoo";
import Game from "../..";
import { SceneContainer } from "./sceneContainer";
import { Templates } from "../basic/templates";

export class GameScene extends SceneContainer {
  private game: Game;
  
  private background: Sprite;
  private skyLeft: Sprite;
  private skyRight: Sprite;
  private cloudsLeft: Sprite[] = [];
  private cloudsRight: Sprite[] = [];
  private nightFilter: Graphics;
  private sceneAnimations: SceneAnimations;
  private door: Sprite;
  private shelfs: Sprite;
  private commode: Sprite;
  private closet: Sprite;
  private cabinet: Sprite;
  private box: Sprite;
  private cable: Sprite;
  private tripod: Sprite;
  private ladder: Sprite;
  private blackboard: Sprite;
  private globe: Sprite;
  private table: Sprite;
  private professor: Sprite;

  public constructor(game: Game, isNight: boolean) {
    super();

    this.game = game;

    this.dockingBounds = new DockingBounds(1920, 1200);
    this.docking = new Docking(Docking.topCenterHorizontal);
    this.resize = new Resize(Resize.contain);

    this.skyLeft = new Sprite(Texture.fromImage("outside/sky"));
    this.skyLeft.scale.set(1, 1);
    this.skyLeft.position.set(810, 400);
    this.addChild(this.skyLeft);

    this.skyRight = new Sprite(Texture.fromImage("outside/sky"));
    this.skyRight.scale.set(1, 2);
    this.skyRight.position.set(1730, 300);
    this.addChild(this.skyRight);

    this.cloudsLeft.push(this.createCloud(1, 500, 420));
    this.cloudsLeft.push(this.createCloud(2, 500, 450));
    this.cloudsLeft.push(this.createCloud(3, 500, 400));
    this.cloudsLeft.forEach(cloud => {
      this.addChild(cloud);
    });

    this.cloudsRight.push(this.createCloud(1, 1500, 350));
    this.cloudsRight.push(this.createCloud(3, 1500, 450));
    this.cloudsRight.push(this.createCloud(5, 1500, 400));
    
    this.cloudsRight.forEach(cloud => {
      this.addChild(cloud);
    });

    if (isNight) {
      this.nightFilter = new Graphics();

      this.nightFilter.beginFill(0x040f39, 0.65);
      this.nightFilter.drawRect(780, 260, 1100, 440);
      this.nightFilter.endFill();
      this.addChild(this.nightFilter);
    }

    this.background = new Sprite(Texture.fromImage("background"));
    this.background.anchor.set(0, 0);
    this.background.position.x = (1920 - 2500) / 2;
    this.addChild(this.background);

    this.addChild(new Cuckoo(1010, 450, this.game.sfx[2]));

    // Move to foreground like layer
    this.door = new Door();
    this.addChild(this.door);

    this.tripod = new Sprite(Texture.fromImage("furniture/tripod"));
    this.tripod.position.set(1620, 675);
    this.tripod.anchor.set(0.5, 0);
    this.addChild(this.tripod);

    this.box = new Sprite(Texture.fromImage("furniture/box"));
    this.box.position.set(1455, 830);
    this.box.anchor.set(0.5, 0);
    this.addChild(this.box);

    this.shelfs = new Sprite(Texture.fromImage("furniture/shelfs"));
    this.shelfs.position.set(876, 50);
    this.shelfs.anchor.set(0.5, 0);
    this.addChild(this.shelfs);

    this.blackboard = new Sprite(Texture.fromImage("furniture/blackboard"));
    this.blackboard.position.set(1220,525);
    this.blackboard.anchor.set(0.5, 0);
    this.addChild(this.blackboard);

    this.commode = new Sprite(Texture.fromImage("furniture/commode"));
    this.commode.position.set(935, 623)
    this.commode.anchor.set(0.5, 0);
    this.addChild(this.commode);

    this.cable = new Sprite(Texture.fromImage("furniture/cable"));
    this.cable.position.set(1146, 635);
    this.cable.anchor.set(0.5, 0);
    this.addChild(this.cable);

    this.ladder = new Sprite(Texture.fromImage("furniture/ladder"));
    this.ladder.position.set(690, 325);
    this.ladder.anchor.set(0.5, 0);
    this.addChild(this.ladder);

    this.professor = new Sprite(Texture.fromImage("professor"));
    this.professor.position.set(789, 700)
    this.professor.anchor.set(0.5, 0.5);
    this.professor.scale.set(0.95, 0.95);
    this.addChild(this.professor);

    this.table = new Sprite(Texture.fromImage("furniture/table"));
    this.table.position.set(1065, 780);
    this.table.anchor.set(0.5, 0);
    this.addChild(this.table);

    this.globe = new Sprite(Texture.fromImage("furniture/globe"));
    this.globe.position.set(1685, 675);
    this.globe.anchor.set(0.5, 0);
    this.addChild(this.globe);

    
    // Animation layer
    this.sceneAnimations = new SceneAnimations();
    this.addChild(this.sceneAnimations);

    this.sceneAnimations.playIdle();

    this.closet = new Sprite(Texture.fromImage("furniture/closet"));
    this.closet.position.set(200, 180)
    this.closet.anchor.set(0.5, 0);
    this.addChild(this.closet);

    this.cabinet = new Sprite(Texture.fromImage("furniture/cabinet"));
    this.cabinet.position.set(-30, 125)
    this.cabinet.anchor.set(0.5, 0);
    this.addChild(this.cabinet);

    const foreground = new Sprite(Texture.fromImage("foreground"));
    foreground.position.set(960,1200);
    foreground.anchor.set(0.5, 1);
    this.addChild(foreground);



    this.debug = new TextArea("Debug", Templates.debugTextStyle);
    this.debug.position.set(200, 20);
    this.addChild(this.debug);
  }

  private createCloud(index: number, x: number, y: number): Sprite {
    const cloud = new Sprite(Texture.fromImage("outside/cloud" + index));
    cloud.position.set(x, y);
    //cloud.alpha = 0.9;

    TweenMax.to(cloud, DanskeSpil.randomBetween(30, 40), {
      x: x + 500,
      repeat: -1,
      ease: Linear.easeNone,
      delay: DanskeSpil.randomBetween(0, 15)
    });

    return cloud;
  }
}