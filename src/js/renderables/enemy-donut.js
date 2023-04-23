import { Entity, Body, Rect, game, collision, timer } from 'melonjs';
import { getEnemyMaxSpeedX, detectMerio } from './entity-data.js';

/**
 * Dangerous donut entity
 */
class DonutEntity extends Entity {
    constructor(x, y, settings) {
        // Define the sprite here instead of in the tilemap
        settings.image = "DONUT";

        // Call parent constructor to apply the custom changes
        super(x, y , settings);

        // Add a new physic body
        this.body = new Body(this);
        
        // Use a custom collision type because donuts cannot pass through walls like some other enemies
        this.body.collisionType = collision.types.PHYSICS_BOUND_ENEMY_OBJECT;
        // Add a collision shape
        this.body.addShape(new Rect(0, 0, this.width, this.height));

        // Set max speed
        // X-axis velocity MUST be 1 or higher to enable X-axis movements, and is primarily controlled using this.body.force.x
        // Y-axis velocity is used to control the height of bouncing
        //
        // Why then is Y-axis motion controlled by this.body.vel.y rather than this.body.force.y?
        // Currently, using Y-axis velocity provides a better end result, and is consistent with the existing player jumping implementation.
        this.body.setMaxVelocity(getEnemyMaxSpeedX(), 6);
        // Gravity effectively controls the speed of bouncing - higher gravity = faster & lower bounces
        this.body.gravityScale = 0.24;
        // Set friction
        this.body.setFriction(0.5, 0);
        // Enable physic collisions
        this.isKinematic = false;

        this.alwaysUpdate = true;

        // Indicate whether this enemy cannot be defeated
        this.undefeatable = false;

        // Indicate default state of the enemy
        this.alive = true;
        
        this.speedX = 3;
        // < 0 = left, > 1 = right - This can also double as a scale factor when bouncing off a wall
        this.directionX = 1;
    }

    update(dt) {
        if (!this.alive) {
            game.data.score += 800;
            game.world.removeChild(this);
        }
        
        // X axis movement is constant, Y axis movement varies with time and is affected by terrain
        this.body.force.x = this.speedX * this.directionX;

        // Evaluates to true if the enemy moved or the update function was called
        return super.update(dt);
    }
    
    onCollision(response, other) {
        if (response.b.body.collisionType === collision.types.WORLD_SHAPE) {
            // Bouncing on a solid block results in a jumping motion
            if ((response.overlapV.y > 0)) {
                this.body.vel.y = -this.body.maxVel.y * timer.tick;
            }
            // Bouncing off a wall results in bouncing back in the opposite X-axis direction
            if ((response.overlapV.x !== 0)) {
                this.directionX *= -1;
            }
            // Register a solid collision
            return true;
        }

        // All other objects are not solid
        return false;
    }
};

export default DonutEntity;
