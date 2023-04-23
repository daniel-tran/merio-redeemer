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
       // Since this extends from Entity, ensure that it remains unaffected by gravity & other external forces
       this.body.setMaxVelocity(0, 0);

       // Set friction
       this.body.setFriction(0.5, 0);
       // Register the object as standard block
       this.body.collisionType = collision.types.NO_OBJECT;
    }

    update(dt) {
       if (game.data.flashBlockTimer < game.data.flashBlockTimerMax) {
           this.body.collisionType = collision.types.WORLD_SHAPE;
           // Opacity decreases while the timer is active
           this.renderable.setOpacity((game.data.flashBlockTimerMax - game.data.flashBlockTimer) / game.data.flashBlockTimerMax);
       } else {
           this.body.collisionType = collision.types.NO_OBJECT;
           this.renderable.setOpacity(0);
       }
       // Evaluates to true if this moved or the update function was called
       return super.update(dt);
    }
};

export default FlashBlockEntity;
