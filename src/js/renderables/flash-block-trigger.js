import { Collectable, game, collision } from 'melonjs';
import { detectMerio } from './entity-data.js';

/**
 * Flash block trigger entity - causes flash blocks to appear for a few seconds
 */
class FlashBlockTriggerEntity extends Collectable {
    constructor(x, y, settings) {
       // Define the sprite here instead of in the tilemap
       settings.image = "FLASHBLOCKTRIGGER";

       // Call parent constructor to apply the custom changes
       super(x, y , settings);
    }
    
    onCollision(response, other) {
       if (detectMerio(other.name) && game.data.flashBlockTimer >= game.data.flashBlockTimerMax) {
           this.setOpacity(0);
           game.data.flashBlockTimer = 0;
       }
       return false;
    }

    update(dt) {
       if (game.data.flashBlockTimer < game.data.flashBlockTimerMax) {
           game.data.flashBlockTimer++;
           // Opacity increases while the timer is active
           this.setOpacity(game.data.flashBlockTimer / game.data.flashBlockTimerMax);
       } else {
           this.setOpacity(1);
       }

       // Evaluates to true if this moved or the update function was called
       return false;
    }
};

export default FlashBlockTriggerEntity;
