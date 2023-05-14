import { Stage, game, ColorLayer, BitmapText, level, audio } from 'melonjs';
import { resetScoreAndLives, resetFlashBlockData, resetAltModeSettings, playBGM } from '../renderables/entity-data.js';
import UIContainer from './HUD.js';

class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        // Initial level to load
        level.load("startmenu");

        if (game.data.lives <= 0) {
            resetScoreAndLives();
            resetFlashBlockData();
            resetAltModeSettings();
        }

        // add our HUD to the game world
        this.HUD = new UIContainer();
        game.world.addChild(this.HUD);

        // play some music
        playBGM();
    }
    
    /**
     *  action to perform on state change
     */
    onDestroyEvent() {

        // remove the HUD from the game world
        game.world.removeChild(this.HUD);

        // remove the joypad if initially added
        //if (this.virtualJoypad && game.world.hasChild(this.virtualJoypad)) {
        //    game.world.removeChild(this.virtualJoypad);
        //}
    }
};

export default PlayScreen;
