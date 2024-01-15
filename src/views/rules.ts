import { TweenMax } from "gsap";
import { LoadedView, ScrollContainer2, EAlign, Docking, DockingBounds, Resize } from "@gdk/core-pixi";
import type { Container } from "pixi.js";
import { Texture, mesh } from "pixi.js";
import type { Slide } from "@gdk/gamekit";
import { EVisualIdentityAction, Rules, TextSlide } from "@gdk/gamekit";
import i18n from "i18next";
import { Loader, SoundLayer } from "@gdk/core";

import type Game from "../index";
import { Templates } from "../components/basic/templates";
import { NineSliceButton } from "../components/basic/nineSliceButton";
import type { IResizable } from "../components/interfaces/iresizable";
import { ELockframe } from "../components/basic/enums";


export default class RulesView extends LoadedView implements IResizable {
  private rules: Rules = null;

  private game: Game;
  private okButton: NineSliceButton;
  private hideButton: NineSliceButton;
  private sfx: Howl;

  /**
   * Constructor
   * @param game: the express reference
   */
  public constructor(game: Game) {
    super();
    this.game = game;

    this.dockingBounds = new DockingBounds(this.game.parameters.width, this.game.parameters.height);
    this.docking = new Docking(Docking.topCenterHorizontal);
    this.resize = new Resize(Resize.contain);
  }

  /**
   * On load the view
   */
  public onLoad(): void {
    this.sfx = Loader.get<Howl>("sfx-button");
    SoundLayer.setSoundLayer(this.sfx, 2);

    this.rules = new Rules({
      popup: {
        // The popup texture or container
        backgroundTexture: Templates.frame.fill,
        // The popup close button or container
        closeButtonStyle: {
          idleTexture: Templates.closeButton.idleTexture,
          overTexture: Templates.closeButton.overTexture,
          clickedTexture: Templates.closeButton.clickedTexture
        }
      },
      // Style of the button 'next'
      nextButton: {
        idleTexture: Templates.nextButton.idleTexture,
        overTexture: Templates.nextButton.overTexture,
        clickedTexture: Templates.nextButton.clickedTexture
      },
      // Style of the button 'previous', can be the same as 'next' but set the scale.x = -1
      previousButton: {
        idleTexture: Templates.nextButton.idleTexture,
        overTexture: Templates.nextButton.overTexture,
        clickedTexture: Templates.nextButton.clickedTexture
      },
      // The texture names of bullet points
      bulletPoint: {
        idle: Templates.bullet.idleTexture,
        active: Templates.bullet.activeTexture
      }
    });

    this.rules.popup.isNineSlice = true;

    const RADIUS = 30;

    const popupBackground = this.rules.popup.background as mesh.NineSlicePlane;
    popupBackground.leftWidth = RADIUS;
    popupBackground.rightWidth = RADIUS;
    popupBackground.topHeight = RADIUS;
    popupBackground.bottomHeight = RADIUS;

    this.rules.popup.width = 900;
    this.rules.popup.height = 700;
    this.rules.dockingBounds.setBounds(900, 700);
    this.rules.popup.docking = new Docking(Docking.centerAll);

    this.rules.position.set(this.game.gameCenterPoint.x - this.rules.popup.width / 2, this.game.gameCenterPoint.y - this.rules.popup.height / 2);

    const border = new mesh.NineSlicePlane(Texture.fromImage(Templates.frame.outline));
    border.leftWidth = RADIUS;
    border.rightWidth = RADIUS;
    border.topHeight = RADIUS;
    border.bottomHeight = RADIUS;
    border.width = this.rules.popup.width;
    border.height = this.rules.popup.height;
    this.rules.popup.addChild(border);

    this.rules.nextButton.docking = new Docking(Docking.centerVerticalRight);
    this.rules.nextButton.docking.position.set(-40, 0);
    this.rules.nextButton.on("pointertap", () => {
      this.sfx.play();
    });

    this.rules.previousButton.docking = new Docking(Docking.centerVerticalLeft);
    this.rules.previousButton.docking.position.set(40, 0);
    this.rules.previousButton.on("pointertap", () => {
      this.sfx.play();
    });

    this.rules.popup.closeButton.docking.position.set(-40, 40);
    this.rules.popup.closeButton.visible = false;
    this.rules.popup.closeButton.interactive = false;

    this.addChild(this.rules);

    const slide1 = new TextSlide({
      layout: 2,
      title: {
        text: i18n.t("rules.slide1.title"),
        style: Templates.defaultTitleStyle,
        align: EAlign.Center,
        padding: {
          top: 60,
          right: 0,
          bottom: 80,
          left: 0
        }
      },
      text: {
        text: i18n.t("rules.slide1.text"),
        style: Templates.defaultTextStyle,
        align: EAlign.Left,
        padding: {
          top: 150,
          right: 80,
          bottom: 80,
          left: 80
        }
      },
      image: i18n.t("rules.slide1.image")
    });

    slide1.setName("rules:slide1");
    slide1.image.docking = new Docking(Docking.bottomCenterHorizontal);
    slide1.image.docking.position.set(0, -80);
    this.rules.addSlide(slide1);

    const slide2 = new TextSlide({
      layout: 2,
      title: {
        text: i18n.t("rules.slide2.title"),
        style: Templates.defaultTitleStyle,
        align: EAlign.Center,
        padding: {
          top: 60,
          right: 0,
          bottom: 80,
          left: 0
        }
      },
      // The text of the slide
      text: {
        text: i18n.t("rules.slide2.text"),
        style: Templates.defaultTextStyle,
        align: EAlign.Left,
        padding: {
          top: 150,
          right: 80,
          bottom: 80,
          left: 80
        }
      },
      image: i18n.t("rules.slide2.image")
    });
    slide2.setName("rules:slide2");
    slide2.image.docking = new Docking(Docking.bottomCenterHorizontal);
    slide2.image.docking.position.set(0, -80);
    this.rules.addSlide(slide2);

    this.okButton = new NineSliceButton(
      {
        idleTexture: Templates.primaryButton.idleTexture,
        overTexture: Templates.primaryButton.overTexture,
        clickedTexture: Templates.primaryButton.clickedTexture,
        disabledTexture: Templates.primaryButton.disabledTexture
      },
      i18n.t("rules.ok")
    );

    this.okButton.interactive = true;
    this.okButton.buttonMode = true;
    this.okButton.docking = new Docking(Docking.bottomLeft);
    this.okButton.docking.position.set(40, -40);
    this.rules.addChild(this.okButton);

    this.hideButton = new NineSliceButton(
      {
        idleTexture: Templates.secondaryButton.idleTexture,
        overTexture: Templates.secondaryButton.overTexture,
        clickedTexture: Templates.secondaryButton.clickedTexture,
        disabledTexture: Templates.secondaryButton.disabledTexture
      },
      i18n.t("rules.hide")
    );

    this.hideButton.interactive = true;
    this.hideButton.buttonMode = true;
    this.hideButton.docking = new Docking(Docking.bottomRight);
    this.hideButton.docking.position.set(-40, -40);
    this.rules.addChild(this.hideButton);

    this.rules.popup.closeButton.backgroundSprite.anchor.set(0, 0);

    this.rules.onChangeSlide = this.updateRulesBySlide;
  }

  /**
   * On the view will appear
   */
  public onWillAppear(done: () => void): void {
    this.rules.popup.closeButton.on("pointertap", () => {
      this.closeRules(false);
    });

    this.okButton.on("pointertap", () => {
      this.closeRules(true);
    });

    this.hideButton.on("pointertap", () => {
      this.noMoreRules();
      this.closeRules(true);
    });

    this.updateRulesBySlide();
    this.rules.reset();

    this.visible = true;

    TweenMax.to(this.rules, 1, {
      alpha: 1,
      onComplete: () => done()
    });
  }

  private closeRules(next: boolean = false): void {
    this.rules.popup.closeButton.interactive = false;
    this.okButton.interactive = false;
    this.hideButton.interactive = false;
    this.sfx.play();
    if (next) {
      this.game.state.next();
    }
  }

  /**
   * On the view did appear
   */
  public onDidAppear(): void {}

  /**
   * On the view will disappear
   * @param done callback when animation done
   */
  public onWillDisappear(done: () => void): void {
    // Animate rules alpha
    TweenMax.to(this, 0.5, {
      alpha: 0,
      onComplete: () => done()
    });
  }

  /**
   * On the view did disappear
   */
  public async onDidDisappear(): Promise<void> {
    this.visible = false;
  }

  private noMoreRules(): void {
    localStorage.setItem(this.game.gameConfig.lotteryGameCode + "-noMoreRules", "true");
  }

  /**
   * Show rules infos (mention, bullet, etc.) relative to the current
   * rules
   */
  protected updateRulesBySlide = (): void => {
    const slidesLength: number = this.rules.slides.length;

    this.rules.bullet.visible = slidesLength > 1;

    let containerToListen: Container = null;

    //Find scrollContainer to listen for swipe event
    if (this.rules.currentSlide) {
      for (const child of this.rules.currentSlide.children) {
        if (child instanceof ScrollContainer2) {
          containerToListen = child;
          break;
        }
      }
    }

    this.rules.addSwipeListenerToContainer(containerToListen);
  };

  /**
   * Add the common rules slides to the rules component
   */
  public addRules(): void {
    // Push les slides dans un tableau
    this.rules.slides.forEach((slide: Slide) => this.rules.addSlide(slide));

    this.rules.bullet.children.forEach((bullet: Container, index: number) => {
      bullet.interactive = true;

      bullet.on("pointertap", () => {
        this.rules.changeSlideByIndex(index);
      });
    });
  }

  /**
   * Only show the rules view which is in front of all
   * other views
   */
  public showRules(withButtons: boolean = true): void {
    console.log("Show rules");

    this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, false);
    this.game.vi.emit(ELockframe.Lock);

    this.updateRulesBySlide();

    this.visible = true;
    this.alpha = 1;
    this.rules.alpha = 1;
    this.rules.reset();

    if (withButtons) {
      this.rules.popup.closeButton.visible = false;
      this.rules.popup.closeButton.interactive = false;
    } else {
      this.okButton.visible = false;
      this.okButton.interactive = false;

      this.hideButton.visible = false;
      this.hideButton.interactive = false;

      this.rules.popup.closeButton.visible = true;
      this.rules.popup.closeButton.interactive = true;
    }

    this.rules.onClose = () => {
      this.game.vi.emit(EVisualIdentityAction.SettingsEnabled, true);
      this.game.vi.emit(ELockframe.Unlock);

      this.visible = false;
      this.game.onRulesQuit();
    };
  }

  public onResize() {
    this.rules.position.set(this.game.gameCenterPoint.x - this.rules.popup.width / 2, this.game.gameCenterPoint.y - this.rules.popup.height / 2);
  }
}
