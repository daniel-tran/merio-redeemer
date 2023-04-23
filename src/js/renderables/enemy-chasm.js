import { Collectable, Body, Rect, collision } from 'melonjs';

/**
 * Environmental chasm entity - when the player falls outside certain bounds of the map
 * (this extends from Collectable for the sole reason that it ignores gravity)
 */
class ChasmEntity extends Collectable {
    constructor(x, y, settings) {
        // Since this extends from Collectable, a base sprite is required
        settings.image = "SECRET";

        // Call parent constructor to apply the custom changes
        super(x, y , settings);
        
        // As this is using a dummy sprite, manually hide the sprite
        this.setOpacity(0);
        
        // Flag this as dangerous for the player
        this.body.collisionType = collision.types.ENEMY_OBJECT;

        // Indicate whether this enemy cannot be defeated
        this.undefeatable = true;
    }
};

export default ChasmEntity;
