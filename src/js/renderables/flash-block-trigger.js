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

       // Inherit any custom properties defined in the tile map
       this.settings = settings;

       // Update the entity when outside the viewport
       this.alwaysUpdate = true;

       // Indicates whether this specific instance was responsible for the flash transition
       this.isSourceOfTrigger = false;

       // Specify the time increment when activated, which can shorten the overall duration.
       // If defined, larger values result in a shorter duration.
       // If undefined, this will default to 1 (i.e. duration is normal and ticks down at the standard rate)
       this.timerStep = this.settings.timerStep ?? 1;
    }

    onCollision(response, other) {
       if (detectMerio(other.name) && game.data.flashBlockTimer >= game.data.flashBlockTimerMax) {
           this.setOpacity(0);
           game.data.flashBlockTimer = 0;
           this.isSourceOfTrigger = true;
           game.data.flashBlockTriggerInstance = this;
       }
       return false;
    }

    update(dt) {
       if (game.data.flashBlockTimer < game.data.flashBlockTimerMax) {
           if (this.isSourceOfTrigger) {
               // Only one instance can increment the timer, otherwise the interval gets progressively shorter with more instances
               game.data.flashBlockTimer += this.timerStep;
           }
           // Opacity increases while the timer is active
           this.setOpacity(game.data.flashBlockTimer / game.data.flashBlockTimerMax);
       } else {
           this.setOpacity(1);
           this.isSourceOfTrigger = false;
           // In reality, flash block triggers can be reactivated without a proper reset and results in stacked timer steps.
           // This ensures that the exact source is deactivated in addition to this trigger to avoid such a fate.
           if (game.data.flashBlockTriggerInstance) {
               game.data.flashBlockTriggerInstance.isSourceOfTrigger = false;
           }
       }

       // Evaluates to true if this moved or the update function was called
       return false;
    }
};

export default FlashBlockTriggerEntity;
