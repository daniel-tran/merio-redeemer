import { Entity, Body, game, collision } from 'melonjs';
import { getPlayerMaxSpeedX } from './entity-data.js';

/**
 * Movable block that can be pushed
 * 
 */
class MoveBlockEntity extends Entity {
    constructor(x, y, settings) {
       // Define the sprite here instead of in the tilemap
       settings.image = "MOVEBLOCK";

       // Call parent constructor to apply the custom changes
       super(x, y , settings);

       // This is a solid interactable element
       this.body.collisionType = collision.types.WORLD_SHAPE;

       // Set friction
       this.body.setFriction(0.25, 0);
       
       // Update the entity when outside the viewport
       this.alwaysUpdate = true;
       
       this.body.setCollisionMask(
           collision.types.WORLD_SHAPE |
           collision.types.PLAYER_OBJECT |
           collision.types.PHYSICS_BOUND_ENEMY_OBJECT
       );
    }
    
    /**
     * update the entity
     */
    /*update(dt) {
        return super.update(dt);
    }*/
    
    onCollision(response, other) {
        // Different reactions for colliding with different object types
        switch (response.b.body.collisionType) {
            case collision.types.PHYSICS_BOUND_ENEMY_OBJECT:
            case collision.types.PLAYER_OBJECT:
                // Block can be pushed in a horizontal direction, but can also be moved vertically using the in-built physics.
                // For the PHYSICS_BOUND_ENEMY_OBJECT, they will only bounce off the block and move it with minimal effect.
                if (response.overlapV.y === 0) {
                    if (response.overlapV.x < 0) {
                        this.body.force.x = -getPlayerMaxSpeedX();
                    } else if (response.overlapV.x > 0) {
                        this.body.force.x = getPlayerMaxSpeedX();
                    }
                }
            case collision.types.WORLD_SHAPE:
                //console.log(other.name);
                // Nothing special when colliding with walls and such
                break;
            default:
                // Entity is free to pass through in any case
                return false;
        }
        
        // Make all other objects solid
        return true;
    }
};

export default MoveBlockEntity;
