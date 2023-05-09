import { Collectable, game, collision, level } from 'melonjs';
import { detectMerio, startMakeshiftFlashAnimation, toggleResume } from './entity-data.js';

/**
 * Flash block trigger entity - causes flash blocks to appear for a few seconds
 */
class RevivalPortalEntity extends Collectable {
    constructor(x, y, settings) {
       // Define the sprite here instead of in the tilemap
       settings.image = "PORTAL";

       // Call parent constructor to apply the custom changes
       super(x, y , settings);
       
       this.ready = false;
    }

    onCollision(response, other) {
       if (detectMerio(other.name)) {
           if (!this.ready) {
               // Entering the portal before it's fully materialised means users don't have to wait for the
               // timer to finish, but they cannot respawn anymore.
               game.data.altModeGameOverScreen = "gameover";
           }
           startMakeshiftFlashAnimation();
           level.load(game.data.currentGameLevel);
       }
       return false;
    }

    update(dt) {
       if (game.data.altModePenaltyTimer < game.data.altModePenaltyTimerMax) {
           game.data.altModePenaltyTimer += game.data.altModePenaltyTimerStep;
       } else if (!this.ready) {
           this.ready = true;
           toggleResume(false, "A strange portal has fully materialised. Jumping into it will take you back to the land of the living.");
       }
       this.setOpacity(game.data.altModePenaltyTimer / game.data.altModePenaltyTimerMax);

       // Evaluates to true if this moved or the update function was called
       return false;
    }
};

export default RevivalPortalEntity;
