import { Stage, game, ColorLayer, BitmapText, level, audio } from 'melonjs';
import { resetScoreAndLives, resetFlashBlockData, playBGM } from '../renderables/entity-data.js';
import UIContainer from './HUD.js';

class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        // Initial level to load
        // Since levels can be restarted, the loaded level needs to vary 
        // based on which tile set this callback is called in.
        // As a side effect, the first level loaded is based on the first
        // listed file in the src\data\map directory
        // For debug purposes, you can also load a static level by providing a fixed level name
        //level.load("level1");
        level.load(level.getCurrentLevel().name);

        if (game.data.lives <= 0) {
            resetScoreAndLives();
            resetFlashBlockData();
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
