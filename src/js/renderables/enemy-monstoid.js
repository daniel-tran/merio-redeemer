import { Sprite, Body, Rect, collision } from 'melonjs';
import { getEnemyMaxSpeedX } from './entity-data.js';

/**
 * Orange monstoid entity
 */
class MonstoidEntity extends Sprite {
    constructor(x, y, settings) {
        // Get the area size that was defined in the tilemap
        let width = settings.width;
        
        // Define the sprite here instead of in the tilemap
        settings.image = "MONSTOID";
        
        // Call parent constructor to apply the custom changes
        super(x, y , settings);
        
        // Add a new physic body
        this.body = new Body(this);
        this.body.collisionType = collision.types.ENEMY_OBJECT;
        // Add a collision shape
        this.body.addShape(new Rect(0, 0, this.width, this.height));
        // Set max speed
        this.body.setMaxVelocity(getEnemyMaxSpeedX(), 0);
        // Enable physic collisions
        this.isKinematic = false;
        // Update the player when outside the viewport
        this.alwaysUpdate = true;
        
        // Positioning
        x = this.pos.x;
        this.startX = x;
        this.pos.x = x + width - this.width;
        this.endX = this.pos.x;
        
        // Indicate default walking direction
        this.walkLeft = false;
        
        // Indicate whether this enemy cannot be defeated
        this.undefeatable = true;
    }

    update(dt) {
        // Enemy moves side to side
        if (this.walkLeft && this.pos.x <= this.startX) {
            this.walkLeft = false;
            this.body.force.x = this.body.maxVel.x;
        } else if (!this.walkLeft && this.pos.x >= this.endX) {
            this.walkLeft = true;
            this.body.force.x = -this.body.maxVel.x;
        }
        
        // Evaluates to true if the enemy moved or the update function was called
        return this.body.update(dt);
    }
};

export default MonstoidEntity;
