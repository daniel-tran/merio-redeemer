import { Collectable } from 'melonjs';
import { detectMerio } from './entity-data.js';

/**
 * General area that allows Merio to jump incredibly high.
 * For some reason, extending the height of this entity beyond 6 standard blocks doesn't register collisions anymore.
 * (this extends from Collectable for the sole reason that it ignores gravity)
 */
class SuperJumpEntity extends Collectable {
    constructor(x, y, settings) {
        // Since this extends from Collectable, a base sprite is required
        settings.image = "SECRET";

        // Call parent constructor to apply the custom changes
        super(x, y , settings);
        
        // As this is using a dummy sprite, manually hide the sprite
        this.setOpacity(0);
    }
    
    // Collision event
    onCollision(response, other) {
        if (detectMerio(other.name)) {
            other.body.falling = false;
            other.body.vel.y = -other.body.maxVel.y * 1000000;
            other.body.jumping = true;
        }
        return false;
    }
};

export default SuperJumpEntity;