import { Sprite, Body, Rect, collision } from 'melonjs';
import { getEnemyMaxSpeedY } from './entity-data.js';

/**
 * Grey dust guy entity
 */
class DustGuyEntity extends Sprite {
    constructor(x, y, settings) {
        // Get the area size that was defined in the tilemap
        let height = settings.height;
        
        // Define the sprite here instead of in the tilemap
        settings.image = "DUSTGUY";
        
        // Call parent constructor to apply the custom changes
        super(x, y , settings);
        
        // Add a new physic body
        this.body = new Body(this);
        this.body.collisionType = collision.types.ENEMY_OBJECT;
        // Add a collision shape
        this.body.addShape(new Rect(0, 0, this.width, this.height));
        // Set max speed
        this.body.setMaxVelocity(0, getEnemyMaxSpeedY());
        // Enable physic collisions
        this.isKinematic = false;
        // Update the player when outside the viewport
        this.alwaysUpdate = true;
        
        // Positioning
        y = this.pos.y;
        this.startY = y;
        this.pos.y = y + height - this.height;
        this.endY = this.pos.y;
        
        // Indicate default walking direction
        this.walkUp = true;
        
        // Indicate whether this enemy cannot be defeated
        this.undefeatable = true;
    }

    update(dt) {
        // Enemy moves up and down
        if (!this.walkUp) {
            this.body.force.y = this.body.maxVel.y;

            // Flip direction at th end of the movement boundary
            if (this.pos.y >= this.endY) {
                this.walkUp = true;
            }
        } else if (this.walkUp) {
            this.body.force.y = -this.body.maxVel.y;

            // Flip direction at th end of the movement boundary
            if (this.pos.y <= this.startY) {
                this.walkUp = false;
            }
        }
        
        // Evaluates to true if the enemy moved or the update function was called
        return this.body.update(dt);
    }
};

export default DustGuyEntity;
