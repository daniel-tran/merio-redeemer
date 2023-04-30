import { Entity, Body, Rect, game, collision, timer } from 'melonjs';
import { getEnemyMaxSpeedX, detectMerio } from './entity-data.js';

/**
 * Boss enemy entity
 */
class BossEntity extends Entity {
    constructor(x, y, settings) {
        // Define the sprite here instead of in the tilemap
        settings.image = "BEARS";

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
        this.body.gravityScale = 0.08;
        // Set friction
        this.body.setFriction(0.5, 0);
        // Enable physic collisions
        this.isKinematic = false;

        this.alwaysUpdate = true;

        // Use a different set of sprites based on the "type" of boss
        // The number multiplied is based on the number of base sprites that each "type" has available
        const spriteOffset = settings.type * 2;

        // Indicate which sprite is for idling
        this.renderable.addAnimation("stand", [0 + spriteOffset]);

        // Indicate which sprite is for jumping
        this.renderable.addAnimation("jump", [1 + spriteOffset]);

        // Default animation
        this.renderable.setCurrentAnimation("stand");

        // Indicate whether this enemy cannot be defeated
        this.undefeatable = true;

        // Indicate default state of the enemy
        this.alive = true;
        
        this.speedX = 3;
        // > 0 = right, < 0 = left - This is OPPOSITE for the initial move, since the first action assumes that a movement has been made previously
        // 0 = No horizontal movement (this is correct in all cases)
        this.directionX = settings.directionX;
        
        this.actionTimerMax = 200;
        this.actionTimer = this.actionTimerMax;
    }

    update(dt) {
        if (!this.alive) {
            game.data.score += 800;
            game.world.removeChild(this);
        }
        
        // Only move horizontally when airborne and it's time to move
        if (this.body.vel.y != 0 && this.actionTimer < this.actionTimerMax) {
            this.body.force.x = this.speedX * this.directionX;
        }
        this.actionTimer = (this.actionTimer + 1) % this.actionTimerMax;

        // Evaluates to true if the enemy moved or the update function was called
        return super.update(dt);
    }
    
    onCollision(response, other) {
        if (response.b.body.collisionType === collision.types.WORLD_SHAPE) {
            // Bouncing on a solid block results in pausing actions until it's time to move again
            if (response.overlapV.y > 0) {
                this.renderable.setCurrentAnimation("stand");
                if (this.actionTimer <= 0) {
                    this.body.vel.y = -this.body.maxVel.y * timer.tick;
                    this.directionX *= -1;
                    // Flip the sprite to match the direcction of movement.
                    // This assumes that the sprite's default direction is right.
                    this.renderable.flipX(this.directionX < 0);
                    this.renderable.setCurrentAnimation("jump");
                }
            }
            // Register a solid collision
            return true;
        }

        // All other objects are not solid
        return false;
    }
};

export default BossEntity;
