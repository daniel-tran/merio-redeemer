import { Container, game, event, Renderable, Vector2d, BitmapText, loader } from 'melonjs';
import { getDefaultFontSettings, isGameLevel } from './../renderables/entity-data.js';

/**
 * a basic control to toggle fullscreen on/off
 */
//class FSControl extends GUI_Object {
//    /**
//     * constructor
//     */
//    constructor(x, y) {
//        super(x, y, {
//            image: game.texture,
//            region : "shadedDark30.png"
//        });
//        this.setOpacity(0.5);
//    }
//
//    /**
//     * function called when the pointer is over the object
//     */
//    onOver(/* event */) {
//        this.setOpacity(1.0);
//    }
//
//    /**
//     * function called when the pointer is leaving the object area
//     */
//    onOut(/* event */) {
//        this.setOpacity(0.5);
//    }
//
//    /**
//     * function called when the object is clicked on
//     */
//    onClick(/* event */) {
//        if (!device.isFullscreen()) {
//            device.requestFullscreen();
//        } else {
//            device.exitFullscreen();
//        }
//        return false;
//    }
//};

/**
 * a basic control to toggle fullscreen on/off
 */
//class AudioControl extends me.GUI_Object {
//    /**
//     * constructor
//     */
//    constructor(x, y) {
//        super(x, y, {
//            image: game.texture,
//            region : "shadedDark13.png" // ON by default
//        });
//        this.setOpacity(0.5);
//        this.isMute = false;
//    }
//
//    /**
//     * function called when the pointer is over the object
//     */
//    onOver(/* event */) {
//        this.setOpacity(1.0);
//    }
//
//    /**
//     * function called when the pointer is leaving the object area
//     */
//    onOut(/* event */) {
//        this.setOpacity(0.5);
//    }
//
//    /**
//     * function called when the object is clicked on
//     */
//    onClick(/* event */) {
//        if (this.isMute) {
//            me.audio.unmuteAll();
//            this.setRegion(game.texture.getRegion("shadedDark13.png"));
//            this.isMute = false;
//        } else {
//            me.audio.muteAll();
//            this.setRegion(game.texture.getRegion("shadedDark15.png"));
//            this.isMute = true;
//        }
//        return false;
//    }
//};

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

        // local copy of the global score
        this.score = -1;

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
        if (!isGameLevel()) {
            // Hide the score when on a splash screen or similar place
            this.setText("");
        } else if (this.score !== game.data.score) {
            this.score = game.data.score;
            this.setText(`Brownie Points: ${this.score}`);
            this.isDirty = true;
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

        // add our audio control object
        //this.addChild(new AudioControl(36, 56));

        //if (!device.isMobile) {
        //    // add our fullscreen control object
        //    this.addChild(new FSControl(36 + 10 + 48, 56));
        //}
    }
};

export default UIContainer;
