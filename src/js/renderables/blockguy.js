import { Collectable, Body, Rect, collision, level, input } from 'melonjs';
import { getAllMessages, startMakeshiftFlashAnimation, toggleResume, detectMerio } from './entity-data.js';

/**
 * Red box entity
 */
class BoxGuyEntity extends Collectable {
    constructor(x, y, settings) {
        // Define the sprite here instead of in the tilemap
        settings.image = "BOXGUY";

        // Call parent constructor to apply the custom changes
        super(x, y , settings);
        // Inherit any custom properties defined in the tile map
        // Note that this can only be done when extending the Entity object
        this.settings = settings;

        // Add a new physic body
        /*this.body = new Body(this);
        // Add a collision shape
        this.body.addShape(new Rect(0, 0, this.width, this.height));
        // Set friction
        this.body.setFriction(0.5, 0);*/
        // Register the object as standard block
        this.body.collisionType = collision.types.WORLD_SHAPE;

        // Enable physic collisions
        this.isKinematic = false;

        // Allow this entity to continue updates when the game is paused
        this.updateWhenPaused = true;

        // Default message index if not defined in the tile map
        if (!this.settings.messageIndex) {
            this.settings.messageIndex = 0;
        }
        // Set the redirect property when the box guy is intended to transition the player to a new screen
        if (!this.settings.redirect) {
            this.settings.redirect = "";
        }

        // List of all possible messages the box guy can say.
        // Select a set of responses by defining the messageIndex custom property on a BoxGuyEntity in the tilemap.
        this.messages = getAllMessages();
        this.messageLength = this.messages[this.settings.messageIndex].length;
        // Use a subindex to detect which message in the individual sets to display
        this.messageSubIndex = -1;
        
        // A custom function that can be called to read the next message, triggered by
        // either a key press in entities.js or using an external call to this function in entity-data.js.
        this.nextMessage = function(){
            // Relying on the update function to be called on an interval basis to display the next message text
            this.messageSubIndex++;

            // Once all the messages have been read, resume the game and hide the dialog box
            if (this.messageSubIndex >= this.messageLength) {
                this.messageSubIndex = -1;
                toggleResume(true, "");

                // Transition to a new screen (if any) once all the messages have been read
                if (this.settings.redirect) {
                    startMakeshiftFlashAnimation();
                    level.load(this.settings.redirect);
                }
            }
        };
    }
    
    onCollision(response, other) {
        // Only react when the player jumps from below and hits the box guy
        if (detectMerio(other.name)) {
            if ((response.overlapV.y < 0) && other.body.vel.y <= 0){
                // Print out specific messages from the list of possible messages
                this.messageSubIndex = 0;
                // Force the player to fall down to prevent multiple message registrations
                other.body.vel.y = 0;
            }
        }
        return false;
    }

    update(dt) {
        // Perform message display actions when it needs to be displayed
        if (this.messageSubIndex >= 0 && this.messageSubIndex < this.messageLength) {
            // Pause the game to provide time to read the messages
            // Show the message using the dialog box defined in index.html
            toggleResume(false, this.messages[this.settings.messageIndex][this.messageSubIndex]);

            // Read the next message using the spacebar
            if (input.isKeyPressed("space")) {
                this.nextMessage();
            }
        }
        
        // Evaluates to true if the enemy moved or the update function was called
        return super.update(dt);
    }
};

export default BoxGuyEntity;
