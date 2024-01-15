import { Docking, DockingBounds, EAlign, Popup, Resize, TextField } from "@gdk/core-pixi";
import { mesh, Sprite, Texture } from "pixi.js";

import { Templates } from "./templates";
import { NineSliceButton } from "./nineSliceButton";
import type Game from "../..";
import { DanskeSpil } from "./helper";
import { ELockframe } from "./enums";
import type { IResizable } from "../interfaces/iresizable";
import { SfxButton } from "./sfxButton";

export class ThreeButtonPopup extends Sprite implements IResizable {
  public leftButton: NineSliceButton = null;
  public rightButton: NineSliceButton = null;
  public centerButton: NineSliceButton = null;
  protected game: Game;
  private popup: Popup;
  private usingLock: boolean;
  private popupHeight: number;

  public constructor(game: Game, popupHeight: number = 500) {
    super(Texture.fromImage("vi/blank"));

    this.game = game;
    this.popupHeight = popupHeight;

    this.scale.set(this.game.parameters.width, this.game.parameters.height);

    this.popup = new Popup({
      backgroundTexture: Templates.frame.fill
    });

    this.popup.position.set(0, this.game.gameCenterPoint.y - this.popupHeight / 2);

    this.addChild(this.popup);

    this.dockingBounds = new DockingBounds(this.game.parameters.width, this.game.parameters.height);
    this.docking = new Docking(Docking.topCenterHorizontal);
    this.resize = new Resize(Resize.contain);

    this.popup.isNineSlice = true;
    this.visible = false;

    const RADIUS = 40;

    const background = this.popup.background as mesh.NineSlicePlane;
    background.leftWidth = RADIUS;
    background.rightWidth = RADIUS;
    background.topHeight = RADIUS;
    background.bottomHeight = RADIUS;

    this.popup.width = 800;
    this.popup.height = this.popupHeight;

    this.popup.dockingBounds.setBounds(this.popup.width, this.popup.height);
    this.popup.docking = new Docking(Docking.centerHorizontal);

    const border = new mesh.NineSlicePlane(Texture.fromImage(Templates.frame.outline));
    border.leftWidth = RADIUS;
    border.rightWidth = RADIUS;
    border.topHeight = RADIUS;
    border.bottomHeight = RADIUS;
    border.width = this.popup.width;
    border.height = this.popup.height;
    this.popup.addChild(border);
  }

  public show(lock: boolean = false): void {
    this.usingLock = lock;
    this.visible = true;

    if (lock) {
      this.game.vi.emit(ELockframe.Lock);
    }
  }

  public hide(): void {
    this.visible = false;
    if (this.usingLock) {
      this.game.vi.emit(ELockframe.Unlock);
    }
  }

  public addTitle(value: string): void {
    let title = new TextField(value, Templates.defaultTitleStyle);
    title.docking = new Docking(Docking.topCenterHorizontal);
    title.docking.position.set(0, 40);
    this.popup.addChild(title);
  }

  public addText(value: string): void {
    let text = new TextField(value, Templates.defaultTextStyle);
    text.docking = new Docking(Docking.topCenterHorizontal);
    text.docking.position.set(0, 110);
    text.wordWrap = true;
    text.width = this.popup.width - 50;
    text.align = EAlign.Center;
    this.popup.addChild(text);
  }

  public addCloseButton(action: any): void {
    this.popup.closeButton = new SfxButton(Templates.closeButton);

    this.popup.closeButton.docking = new Docking(Docking.topRight);
    this.popup.closeButton.docking.position.set(-22, 25);

    this.popup.closeButton.interactive = true;
    this.popup.closeButton.buttonMode = true;
    this.popup.closeButton.visible = true;
    this.popup.addChild(this.popup.closeButton);

    this.popup.closeButton.on("pointertap", async (): Promise<void> => {
      await action();
    });
  }

  public addRightButton(label: string, action: any, primary?: boolean, shine?: boolean): void {
    const buttonStyle = primary ? Templates.primaryButton : Templates.secondaryButton;

    this.rightButton = new NineSliceButton(
      {
        idleTexture: buttonStyle.idleTexture,
        overTexture: buttonStyle.overTexture,
        clickedTexture: buttonStyle.clickedTexture,
        disabledTexture: buttonStyle.disabledTexture
      },
      label,
      DanskeSpil.camelize(label),
      shine
    );

    this.rightButton.docking = new Docking(Docking.bottomRight);
    this.rightButton.docking.position.set(-40, -40);

    this.rightButton.interactive = true;
    this.rightButton.buttonMode = true;
    this.popup.addChild(this.rightButton);

    this.rightButton.on("pointertap", async (): Promise<void> => {
      await action();
    });
  }

  public addLeftButton(label: string, action: any, primary?: boolean, shine?: boolean): void {
    const buttonStyle = primary ? Templates.primaryButton : Templates.secondaryButton;

    this.leftButton = new NineSliceButton(
      {
        idleTexture: buttonStyle.idleTexture,
        overTexture: buttonStyle.overTexture,
        clickedTexture: buttonStyle.clickedTexture,
        disabledTexture: buttonStyle.disabledTexture
      },
      label,
      DanskeSpil.camelize(label),
      shine
    );

    this.leftButton.docking = new Docking(Docking.bottomLeft);
    this.leftButton.docking.position.set(40, -40);

    this.leftButton.interactive = true;
    this.leftButton.buttonMode = true;
    this.popup.addChild(this.leftButton);

    this.leftButton.on("pointertap", async (): Promise<void> => {
      await action();
    });
  }

  public addCenterButton(label: string, action: any, primary?: boolean, shine?: boolean): void {
    const buttonStyle = primary ? Templates.primaryButton : Templates.secondaryButton;

    this.centerButton = new NineSliceButton(
      {
        idleTexture: buttonStyle.idleTexture,
        overTexture: buttonStyle.overTexture,
        clickedTexture: buttonStyle.clickedTexture,
        disabledTexture: buttonStyle.disabledTexture
      },
      label,
      DanskeSpil.camelize(label),
      shine
    );

    this.centerButton.docking = new Docking(Docking.bottomCenterHorizontal);
    this.centerButton.docking.position.set(0, -40);

    this.centerButton.interactive = true;
    this.centerButton.buttonMode = true;
    this.popup.addChild(this.centerButton);

    this.centerButton.on("pointertap", async (): Promise<void> => {
      await action();
    });
  }

  public updateRightLabel(value: string): void {
    this.rightButton.updateLabel(value);
  }

  public updateLeftLabel(value: string): void {
    this.leftButton.updateLabel(value);
  }

  public updateCenterLabel(value: string): void {
    this.centerButton.updateLabel(value);
  }

  public updateCloseButton(visible: boolean): void {
    this.popup.closeButton.visible = visible;
  }

  public onResize(): void {
    this.popup.position.set(0, this.game.gameCenterPoint.y - this.popupHeight / 2);
  }
}
