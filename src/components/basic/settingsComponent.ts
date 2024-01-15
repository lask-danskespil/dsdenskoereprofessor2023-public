import { Container, Sprite, Texture, mesh } from 'pixi.js';
import { tracker, ButtonClick } from '@gdk/core';
import { AdaptativeVisualIdentity, EVisualIdentityAction, EVisualIdentityEvent } from '@gdk/gamekit';
import { NineSliceButton } from './nineSliceButton';
import { ISettingsComponent } from '../interfaces/isettingsComponent';
import { Button, TextField } from '@gdk/core-pixi';
import { Templates } from './templates';
import { DanskeSpil } from './helper';
import i18n from "i18next";

class SoundContainer extends Container {
  /**
   * Icon used to show sound state (from the editor)
   */
  icon: Sprite | null = null;
  /**
   * Toggle button to toogle sound state (from the editor)
   */
  button: Sprite | null = null;
}

export class SettingsComponent extends Container {
  /**
   * Fill nine slice used to draw popup's border (from editor)
   */
  fill: mesh.NineSlicePlane | null = null;
  /**
   * Title's textfield (from editor)
   */
  title: TextField | null = null;
  /**
   * Sound on container (from the editor)
   */
  muteButton: SoundContainer = new SoundContainer();
  /**
   * Sound off container (from the editor)
   */
  unmuteButton: SoundContainer = new SoundContainer();
  /**
   * Play instructions button used to show game's rules (from the editor)
   */
  instructionsButton: NineSliceButton | null = null;
  /**
   * About game button used to show the game's informations (from the editor)
   */
  aboutButton: NineSliceButton | null = null;
  /**
   * Winning table button used to show game's winning table (from the editor)
   */
  winningTableButton: NineSliceButton | null = null;
  /**
   * Rules button used to show the Quick rules (from the editor)
   */
  rulesButton: NineSliceButton | null = null;
  /**
   * Quit button (from the editor)
   */
  quitButton: NineSliceButton | null = null;

  closeButton: Button | null = null;

  backgroundNineSlice: mesh.NineSlicePlane;

  backgroundSprite: Texture;

  background: mesh.NineSlicePlane;

  /**
   * Constructor
   * @param vi: the adaptative visual identity reference
   */
  constructor(private vi: AdaptativeVisualIdentity) {
    super();
    this.vi = vi;


    this.instructionsButton = this.createButton("vi.menu.buttons.lotteryRules");
    this.aboutButton = this.createButton("vi.settingsButton");
    this.winningTableButton = this.createButton("vi.settingsButton");
    this.rulesButton = this.createButton("vi.menu.buttons.mainRulesButton");
    this.quitButton = this.createButton("vi.settingsButton");

  }

  private createButton(labelName: string) {
    const label = i18n.t(labelName);

    const buttonStyle = Templates.primaryButton;

    return new NineSliceButton(
        {
          idleTexture: buttonStyle.idleTexture,
          overTexture: buttonStyle.overTexture,
          clickedTexture: buttonStyle.clickedTexture,
          disabledTexture: buttonStyle.disabledTexture
        },
        label,
        DanskeSpil.camelize(label),
        false
      );
  }

  /**
   * Called by the project loader once the container has
   * been imported
   */
  onLoaded(): void {
    // Force unvisible
    this.visible = false;
    // Border always first
    this.addChildAt(this.fill, 0);
    // Buttons names
    this.closeButton.setName("settings:close");
    this.instructionsButton.setName("settings:rules");
    this.winningTableButton.setName("settings:winningTable");
    // Bind events
    this._bindEvents();
  }

  /**
   * Shows the settings component
   */
  show(): void {
    this.visible = true;
  }

  /**
   * Returns if the rules buttons are enabled
   */
  get rulesEnabled(): boolean {
    return this.instructionsButton.enabled;
  }

  /**
   * Sets if the rules buttons are enabled
   */
  set rulesEnabled(enabled: boolean) {
    this.instructionsButton.enabled = enabled;
    this.rulesButton.enabled = enabled;
    this.winningTableButton.enabled = enabled;
  }

  /**
   * Binds the events related to the buttons
   */
  _bindEvents(): void {
    this.closeButton.on("pointertap", () => {
      this.emit(EVisualIdentityEvent.HideSettings);
      this.visible = false;
    });

    this.instructionsButton.on("pointertap", () => {
      this.vi.emitter.emit(EVisualIdentityEvent.ShowRules);
      this.emit(EVisualIdentityEvent.HideSettings);
      this.visible = false;
    });

    this.winningTableButton.on("pointertap", () => {
      this.vi.emitter.emit(EVisualIdentityEvent.ShowWinningTable);
      this.emit(EVisualIdentityEvent.HideSettings);
      this.visible = false;
    });

    if (this.vi.parameters.soundButtonEnabled ?? true) {
      this.muteButton.button.on("pointertap", () => {
        this.vi.emitter.emit(EVisualIdentityAction.SoundEnabled, false);
        // the button is a sprite, so we have to manually track it
        tracker.track(new ButtonClick("settings:soundOff"));
      });

      this.unmuteButton.button.on("pointertap", () => {
        this.vi.emitter.emit(EVisualIdentityAction.SoundEnabled, true);
        // the button is a sprite, so we have to manually track it
        tracker.track(new ButtonClick("settings:sound"));
      });
    } else {
      this.muteButton.button.buttonMode = false;
      this.unmuteButton.button.buttonMode = false;
    }

    this.aboutButton.on("pointertap", () => {
      this.vi.emitter.emit(EVisualIdentityEvent.AboutGame);
      this.emit(EVisualIdentityEvent.HideSettings);
      this.vi.game.com.bridge.executeAction("GAME_RULES");
      this.visible = false;
    });

    this.rulesButton.on("pointertap", () => {
      this.vi.emitter.emit(EVisualIdentityEvent.ShowMainRules);
      this.emit(EVisualIdentityEvent.HideSettings);
      this.vi.game.com.bridge.executeAction("GLOBAL_RULES");
      this.visible = false;
    });

    this.quitButton.on("pointertap", () => {
      this.vi.emitter.emit(EVisualIdentityEvent.ConfirmQuitGame);
      this.visible = false;
    });

    this.vi.emitter.on(EVisualIdentityEvent.SoundStatusChanged, () => {
      this.muteButton.visible = this.vi.game.soundStatus;
      this.unmuteButton.visible = !this.vi.game.soundStatus;
    });
  }
}