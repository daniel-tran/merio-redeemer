import { Entity, collision, Body, Polygon, Vector2d, game, input, timer, level } from 'melonjs';
import { getHairHeight, getRightScaledValue, getLeftScaledValue, getPlayerMaxSpeedX, getPlayerMaxSpeedY, detectMerio, startMakeshiftFlashAnimation, resetFlashBlockData } from './entity-data.js';

class PlayerEntity extends Entity {

    /**
     * constructor
     */
    constructor(x, y, settings) {
        // Define the sprite here instead of in the tilemap
        settings.image = "MERIO";
        // call the parent constructor
        super(x, y , settings);

        // Add a new physic body
        this.body = new Body(this);
        // set a "player object" type
        this.body.collisionType = collision.types.PLAYER_OBJECT;
        // Add collision shapes which override the default shape in the tilemap
        // This collision box represents Merio's "hair" which he can use to climb ledges
        this.body.addShape(new Polygon(0, 0, [
            new Vector2d(0, 0), new Vector2d(this.width, 0), 
            new Vector2d(this.width, getHairHeight()), new Vector2d(0, getHairHeight())
        ]));
        // This is the collision box for Merio's body
        this.body.addShape(new Polygon(0, 0, [
            new Vector2d(getRightScaledValue(this.width), getHairHeight()), new Vector2d(getRightScaledValue(this.width), this.height),
            new Vector2d(0, this.height), new Vector2d(0, getHairHeight())
        ]));
        
        // Max walking speed
        this.body.setMaxVelocity(getPlayerMaxSpeedX(), getPlayerMaxSpeedY());

        // Max jumping speed
        this.body.setFriction(0.5, 0.5);

        // When riding the platform, activate logic which causes motion when idling
        this.body.ridingplatform = false;

        // Make the display follow the player around on all 2D dimensions
        game.viewport.follow(this, game.viewport.AXIS.BOTH, 0.1);
        
        // Update the player when outside the viewport
        this.alwaysUpdate = true;

        // Indicate the walking animation
        this.renderable.addAnimation("walk", [2, 0, 3, 0], 75);

        // Indicate which sprite is for idling
        this.renderable.addAnimation("stand", [0]);

        // Indicate which sprite is for jumping
        this.renderable.addAnimation("jump", [1]);

        // Default animation
        this.renderable.setCurrentAnimation("stand");

        // Indicates if Merio has lost a life
        this.alive = true;
    }

    /**
     * update the entity
     */
    update(dt) {
        // change body force based on inputs
        
        // Actions for when if Merio has died. This cannot be done in the onCollision callback,
        // as Merio actually collides with enemies multiple times, triggering these more than once per life.
        if (!this.alive) {
            // Reduce the life count and score
            game.data.lives--;
            game.data.score -= 100;
            // Revert flash blocks to their initial state
            resetFlashBlockData();
            if (game.data.lives <= 0) {
                // GAME IS OVER
                // Keep lives at 0, so that it doesn't spike into the negative values
                game.data.lives = 0;
                // Go to a screen where it's more obvious that a GAME OVER has occurred.
                startMakeshiftFlashAnimation();

                if (!game.data.useAltMode) {
                    level.load("gameover");
                } else {
                    game.data.score -= game.data.altModePenaltyScore;
                    game.data.altModePenaltyScore *= game.data.initialAltModePenaltyScoreScale;
                    game.data.altModePenaltyTimer = 0;
                    game.data.altModePenaltyTimerMax *= game.data.initialAltModePenaltyTimerScale;
                    game.data.currentGameLevel = level.getCurrentLevel().name;
                    level.load(game.data.altModeGameOverScreen);
                }
            } else {
                // Player still has lives remaining
                level.reload();
                // In-built flash animation
                startMakeshiftFlashAnimation();
            }
            return false;
        }

        // Default speed settings when not riding on a platform,
        // ensuring such motion changes aren't always applied.
        if (!this.body.ridingplatform){
            this.body.maxVel.x = getPlayerMaxSpeedX();
        } else {
            // Naively, this is also applied to vertical moving platforms.
            this.body.maxVel.x = getMovingPlatformMaxSpeedX();
        }

        if (input.isKeyPressed("left")) {
            // Flip the sprite on X axis
            this.renderable.flipX(true);
            // Apply moving platform speed boost
            if (this.body.ridingplatform) {
                this.body.maxVel.x = getPlayerExtendedMaxSpeedX();
            }
            // Move the player by inverting their X axis force
            this.body.force.x = -this.body.maxVel.x;
            // Adjust the collision box so that you can cling onto edges
            this.body.getShape(1).points[0].x = this.width;
            this.body.getShape(1).points[1].x = this.width;
            this.body.getShape(1).points[2].x = getLeftScaledValue(this.width);
            this.body.getShape(1).points[3].x = getLeftScaledValue(this.width);
            this.body.ridingplatform = false;

            // Set the actual walking animation only when the player is physically grounded
            if ((this.body.vel.y === 0 || this.body.ridingplatform) && !this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (input.isKeyPressed("right")) {
             // Since the default direction is right, remove X axis flip changes
            this.renderable.flipX(false);
            // Apply moving platform speed boost
            if (this.body.ridingplatform) {
                this.body.maxVel.x = getPlayerExtendedMaxSpeedX();
            }
            // Move the player by using their X axis force
            this.body.force.x = this.body.maxVel.x;
            // Adjust the collision box so that you can cling onto edges
            this.body.getShape(1).points[0].x = getRightScaledValue(this.width);
            this.body.getShape(1).points[1].x = getRightScaledValue(this.width);
            this.body.getShape(1).points[2].x = 0;
            this.body.getShape(1).points[3].x = 0;
            this.body.ridingplatform = false;

            // Set the actual walking animation only when the player is physically grounded
            if ((this.body.vel.y === 0 || this.body.ridingplatform) && !this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            // Player is currently idling
            if (!this.body.ridingplatform){
                // When not on a moving platform, no motion is active.
                this.body.force.x = 0;
            }
            // Use the standing animation when the player is physically grounded
            if (this.body.vel.y === 0 || this.body.ridingplatform) {
                this.renderable.setCurrentAnimation("stand");
            }
        }

        if (input.keyStatus("jump")) {
            // Can't jump while in mid-air
            if (!this.body.jumping && !this.body.falling) {
                // Push the player up according to their Y axis force
                // and rely on in-built gravity to make the player fall
                //    this.body.force.y = -this.body.maxVel.y;
                // Push the player up with some initial acceleration
                this.body.vel.y = -this.body.maxVel.y * timer.tick;
                this.body.jumping = true;
            }
        }

        // Use the jump animation while airborne
        if (this.body.jumping || this.body.falling){
            this.renderable.setCurrentAnimation("jump");
            // When airborne, the player is physically not riding the platform
            this.body.ridingplatform = false;
        }
        
        //....
        // call the parent method
        return super.update(dt);
    }

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision(response, other) {
        // Different reactions for colliding with different object types
        switch (response.b.body.collisionType) {
            case collision.types.WORLD_SHAPE:
                // Nothing special when colliding with walls and such
                break;
            case collision.types.ENEMY_OBJECT:
            case collision.types.PHYSICS_BOUND_ENEMY_OBJECT:
                // If the enemy cannot be defeated, Merio will always lose to them.
                if (other.undefeatable) {
                    this.alive = false;
                    return true;
                }
                // Action for when the player jumps on a known enemy object
                if ((response.overlapV.y > 0) && !this.body.jumping) {
                    // Force a mini jump when they have been defeated
                    /*this.body.falling = false;
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    this.body.jumping = true;*/

                    // Jumping is a OHKO for all defeatable enemies
                    other.alive = false;
                } else if (!detectMerio(other.name)) {
                    // Player got hurt by colliding with the enemy
                    //this.renderable.flicker(750);
                    this.alive = false;
                }
                // Player is free to pass through in any case
                return false;
            default:
                // Gravity zones cause strange behaviour when colliding with moving platforms.
                // These are manual speed fix-ups that try to alleviate scenarios such as:
                // - Jumping in the gravity zone from a moving platform while hanging on with your hair
                // - Jumping in the gravity zone and colliding with the moving platform while in mid-air
                if (other.name === "GravityEntity" && this.body.vel.y < 0) {
                    this.body.force.x = 0;
                    /** WARNING! THIS WILL PLAY THE JUMP ANIMATION WHEN HANGING FROM Y-AXIS MOVING PLATFORMS IN THE GRAVITY ZONE! **/
                    this.renderable.setCurrentAnimation("jump");
                }
                // Player is free to pass through in any case
                return false;
        }
        
        // Make all other objects solid
        return true;
    }
};

export default PlayerEntity;
