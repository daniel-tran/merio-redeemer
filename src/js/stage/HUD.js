import { Container, game, event, Renderable, Vector2d, BitmapText, loader, level, GUI_Object, input, device } from 'melonjs';
import { getDefaultFontSettings, isGameLevel, playBGM, resetFlashBlockData, resetScoreAndLives, resetAltModeSettings, hardResetScore } from './../renderables/entity-data.js';

/**
 * a basic HUD item for mobile devices to simulate arrow keys
 */
class OnScreenControlButton extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y, keyBind) {
        const spriteWidth = 128;
        const spriteHeight = 128;
        super(x, y, {
            image: "ONSCREENCONTROLS",
            framewidth: spriteWidth,
            frameheight: spriteHeight,
            width: spriteWidth,
            height: spriteHeight,
        });
        this.key = keyBind;

        this.opacityOff = 0.5;
        this.opacityOn = 0.75;
        this.setOpacity(this.opacityOff);
        this.anchorPoint.set(0, 0);

        // Default sprites are based on the left button
        // Otherwise, select the sprites based on the key binding
        let spriteIndexOff = 0;
        let spriteIndexOn = 1;
        if (keyBind === input.KEY.RIGHT) {
            spriteIndexOff = 2;
            spriteIndexOn = 3;
        } else if (keyBind === input.KEY.UP) {
            spriteIndexOff = 4;
            spriteIndexOn = 5;
        }
        this.addAnimation("off", [spriteIndexOff]);
        this.addAnimation("on", [spriteIndexOn]);
        this.setCurrentAnimation("off");
    }

    /**
     * function called when the object is clicked on
     */
    onClick(event) {
        this.setOpacity(this.opacityOn);
        input.triggerKeyEvent(this.key, true);
        this.setCurrentAnimation("on");
        return false;
    }

    /**
     * function called when the object is clicked off
     */
    onRelease(event) {
        this.setOpacity(this.opacityOff);
        input.triggerKeyEvent(this.key, false);
        this.setCurrentAnimation("off");
        return false;
    }
};

/**
 * a basic HUD item to display score
 */
 class ScoreItem extends BitmapText {
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
                textAlign : "left",
                textBaseline : "top",
                text : ""
            }
        );

        this.relative = new Vector2d(x, y);

        // Score label needs to be persistent between levels, so it is manually set up and drawn as needed
        this.scoreLabel = new BitmapText(x, y, getDefaultFontSettings());

        // recalculate the object position if the canvas is resize
        event.on(event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(w, h, 0).add(this.relative);
        }).bind(this));
    }

    /**
     * update function
     */
    update( dt ) {
        // This is present in all screens, so it can be used to determine the background music.
        playBGM();

        if (!isGameLevel()) {
            // Hide the score when on a splash screen or similar place
            this.setText("");
            // This is to ensure a second play loads a new game cleanly
            resetFlashBlockData();
            resetScoreAndLives();

            // Reaching the final game over screen means it's safe to reset the Alt Mode settings for a fresh game
            if (level.getCurrentLevel().name === "gameover") {
                resetAltModeSettings();
                hardResetScore();
            }
        } else {
            this.setText(`Brownie Points: ${game.data.score}`);
        }

        // Update high score only when the game has "finished"
        if (level.getCurrentLevel().name === "level-final" && game.data.score > game.data.highScore) {
            game.data.highScore = game.data.score;
        }

        return super.update(dt);
    }
};
/**
 * a basic HUD item to display lives
 */
 class LifeItem extends Renderable {
    /**
     * constructor
     */
    constructor(x, y) {
        // call the super constructor
        super(x, y);
        this.lifeImage = loader.getImage("LIFES");

        // Lives are essentially drawn adjacent to a single location
        this.x = x;
        this.y = y;
    }
    
    /**
     * draw the lives
     */
    draw(context) {
        if (isGameLevel()) {
            // Print the score display, which should not be drawn on non-levels such as the main menu
            // Draw remaining lives as a series of images
            for (let i = 0; i < game.data.lives; i++) {
                // The X position calculation draws the images from right to left, ensuring that lives are depleted from left to right.
                context.drawImage(this.lifeImage, this.x * 0.90 - (this.lifeImage.width * i), this.y, this.lifeImage.width, this.lifeImage.height);
            }
        }
    }
};

/**
 * a HUD container and child items
 */
class UIContainer extends Container {

    constructor() {
        // call the constructor
        super();

        // persistent across level change
        this.isPersistent = true;

        // Use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        this.addChild(new ScoreItem(0, 0));
        this.addChild(new LifeItem(game.viewport.width, 8));
        if (device.isMobile) {
            const onScreenControlButtonY = game.viewport.height - 130;
            const leftButtonX = 30;
            const rightButtonX = leftButtonX + 140;
            this.addChild(new OnScreenControlButton(
                game.viewport.width - 125,
                onScreenControlButtonY,
                input.KEY.UP
            ));
            this.addChild(new OnScreenControlButton(
                leftButtonX,
                onScreenControlButtonY,
                input.KEY.LEFT
            ));
            this.addChild(new OnScreenControlButton(
                rightButtonX,
                onScreenControlButtonY,
                input.KEY.RIGHT
            ));
        }
    }
};

export default UIContainer;
