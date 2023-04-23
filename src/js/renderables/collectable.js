import { Collectable, collision, game } from 'melonjs';
import { detectMerio } from './entity-data.js';

class SecretCollectableEntity extends Collectable {
    // Base initialisation
    constructor(x, y, settings) {
        settings.image = "SECRET";
        super(x, y , settings);
    }

    // Collision event
    onCollision(response, other) {
        if (detectMerio(other.name)) {
            // Add various events to occur when this is collected
            game.data.score += 1000000;

            // Once collected, it should only register once
            this.body.setCollisionMask(collision.types.NO_OBJECT);

            // Garbage collection for a collected object
            game.world.removeChild(this);
        }

        return false;
    }
};

export default SecretCollectableEntity;
