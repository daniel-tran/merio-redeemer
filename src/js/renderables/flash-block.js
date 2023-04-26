import { Entity, Vector2d, game, collision } from 'melonjs';

/**
 * Flash block entity - Opacity decreases until it is invisible and cannot be collided with
 */
class FlashBlockEntity extends Entity {
    constructor(x, y, settings) {
       // Define the sprite here instead of in the tilemap
       settings.image = "FLASHBLOCK";
       // Specify the dimensions of frames for animated sprites
       // Potentially could be used as a haphazard way for repeating sprites?
       settings.framewidth = settings.width;
       settings.frameheight = settings.height;

       // Call parent constructor to apply the custom changes
       super(x, y , settings);

       // Inherit any custom properties defined in the tile map
       this.settings = settings;

       // Since this extends from Entity, ensure that it remains unaffected by gravity & other external forces
       this.body.setMaxVelocity(0, 0);

       // Set friction
       this.body.setFriction(0.5, 0);
       // Register the object as standard block
       this.body.collisionType = collision.types.NO_OBJECT;

       // Update the entity when outside the viewport
       this.alwaysUpdate = true;

       // this.settings.active is a variable defined for this in the tile map.
       // When undefined or set to false, the block starts off despawned and colliding with the trigger spawns it briefly
       // When defined and set to true, the block starts off spawned and colliding with the trigger despawns it briefly
       this.finalOpacity = this.settings.active ? 1 : 0;
       this.initialCollisionType = this.settings.active ? collision.types.WORLD_SHAPE : collision.types.NO_OBJECT;
       this.timerActiveCollisionType = this.settings.active ? collision.types.NO_OBJECT : collision.types.WORLD_SHAPE;
    }

    update(dt) {
       if (game.data.flashBlockTimer < game.data.flashBlockTimerMax) {
           this.body.collisionType = this.timerActiveCollisionType;
           // Opacity updates while the timer is active
           if (this.settings.active) {
               // Active blocks become empty and slowly fade back in
               this.renderable.setOpacity(game.data.flashBlockTimer / game.data.flashBlockTimerMax);
           } else {
               // Inactive blocks become solid and slowly fade out
               this.renderable.setOpacity((game.data.flashBlockTimerMax - game.data.flashBlockTimer) / game.data.flashBlockTimerMax);
           }
       } else {
           this.body.collisionType = this.initialCollisionType;
           this.renderable.setOpacity(this.finalOpacity);
       }
       // Evaluates to true if this moved or the update function was called
       return super.update(dt);
    }
};

export default FlashBlockEntity;
