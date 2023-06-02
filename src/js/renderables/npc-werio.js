import { input } from 'melonjs';
import { detectMerio } from './entity-data.js';
import BoxGuyEntity from './blockguy.js';

/**
 * NPC entity for Werio. Basically just the BoxGuyEntity but triggered by a key press instead of just a collision check
 */
class NpcWerioEntity extends BoxGuyEntity {
    constructor(x, y, settings) {
        super(x, y , settings);
    }

    onCollision(response, other) {
        // Only react when the player is in range and interacts with this entity
        if (detectMerio(other.name)) {
            // Print out specific messages from the list of possible messages
            this.messageSubIndex = 0;
        }
        return false;
    }

    update(dt) {
        return super.update(dt);
    }
};

export default NpcWerioEntity;
