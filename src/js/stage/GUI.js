import { GUI_Object, game, input, BitmapText, state, level, Vector2d, event } from 'melonjs';
import { getDefaultFontSettings, startMakeshiftFlashAnimation, toggleResume, resetScoreAndLives, hardResetScore, resetAltModeSettings } from './../renderables/entity-data.js';

/**
 * Button entity with an attached label and optional room redirection
 */
export class MessageButtonEntity extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        settings.image = "BUTTONS";

        settings.framewidth = 32;
        settings.frameheight = 32;
        settings.width = settings.framewidth;
        settings.height = settings.frameheight;

        // call the super constructor
        super(x, y, settings);

        // Inherit any custom properties defined in the tile map
        this.settings = settings;

        // Default custom settings if not defined in the tile map
        this.settings.message ?? "Indubitably.";

        // redirect is a string indicating a level to load when the button is pressed
        this.settings.redirect ?? "";

        // label is the text displayed next to the button
        this.settings.label ?? "";

        // On clicking the button, the internal game state resets (score, lives, etc.)
        this.settings.resetGameStateOnClick ?? false;

        // Allow this entity to continue updates when the game is paused
        this.updateWhenPaused = true;

        // Set up animation states and the default animation
        this.addAnimation("off", [0]);
        this.addAnimation("on", [1]);
        this.setCurrentAnimation("off");

        // If there is no label, save rendering resources by not adding an extra object to the world, which would be invisible anyway
        const defaultFontSettings = getDefaultFontSettings();
        if (this.settings.label.length > 0) {
            const label = new BitmapText(x + ( settings.framewidth * 1.5 ), y + ( settings.frameheight * 0.5 ), {
                font: defaultFontSettings.font,
                textAlign : "left",
                textBaseline : "bottom",
                text: this.settings.label,
            });
            // Use second parameter to control Z axis priority. Most entities including tiles will have a value < 1
            game.world.addChild(label, 1);
        }
    }
    
    // Runs an action when the pointer enters the collision box
    onOver(event) {
        this.setCurrentAnimation("on");
        return super.update(event);
    }

    // Runs an action when the pointer exits the collision box
    onOut(event) {
        this.setCurrentAnimation("off");
        return super.update(event);
    }

    // Update callback which is called every interval
    update(dt) {
        // Allow the space bar to close the message prompt
        // Also close the message when focussing away from the window and returning to it
        // (this avoids a weird situation where the game can resume but the message doesn't close)
        if (input.isKeyPressed("space") || !state.isPaused()) {
            toggleResume(true, "");
        }
        return super.update(dt);
    }

    // Click event
    onClick(event) {
        if (this.settings.redirect) {
            if (this.settings.resetGameStateOnClick) {
                resetScoreAndLives();
                resetAltModeSettings();
                hardResetScore();
            }
            // Makes the game flash and then load the main game
            startMakeshiftFlashAnimation();
            level.load(this.settings.redirect);
            return false;
        }
        // Pause the game to provide time to read the messages
        toggleResume(false, this.settings.message);
        return false;
    }
};

/**
 * A label used to show the high score on the start menu
 */
export class HighScoreEntity extends BitmapText {
    /**
     * constructor
     */
    constructor(x, y) {
        // call the super constructor
        super(
            x,
            y,
            {
                font : "Verdana",
                textAlign : "center",
                textBaseline : "middle",
                text : `High Score: ${game.data.highScore}`
            }
        );

        this.relative = new Vector2d(x, y);

        // recalculate the object position if the canvas is resize
        event.on(event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(w, h, 0).add(this.relative);
        }).bind(this));
    }
};

/**
 * A button on the start menu that toggles Alt Mode/Pinicchio Mode
 */
export class AltModeButtonEntity extends MessageButtonEntity {
    constructor(x, y, settings) {
        // call the super constructor
        super(x, y, settings);
    }

    // Click event
    onClick(event) {
        game.data.useAltMode = !game.data.useAltMode;

        if (game.data.useAltMode) {
            this.settings.message = ["Pinocchio Mode is enabled.",
                                     "Start the game with a massive bonus score! Plus infinite lives!",
                                     "But each time you die, you lose more points and have to wait slightly longer to replay the level.",
                                    ].join("\n");
        } else {
            this.settings.message = "Pinocchio Mode has been disabled.";
        }
        // Need to reset the score here, because the initial score changes based on whether Alt Mode is enabled
        hardResetScore();
        // Pause the game to provide time to read the messages
        toggleResume(false, this.settings.message);
    }
};
