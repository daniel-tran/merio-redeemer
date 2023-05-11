import {
    audio,
    loader,
    state,
    device,
    video,
    utils,
    plugin,
    pool,
    input,
    game,
    collision
} from 'melonjs';

import 'index.css';

import PlayScreen from 'js/stage/play.js';
import PlayerEntity from 'js/renderables/player.js';
import SecretCollectableEntity from 'js/renderables/collectable.js';
import MonstoidEntity from 'js/renderables/enemy-monstoid.js';
import DustGuyEntity from 'js/renderables/enemy-dustguy.js';
import DonutEntity from 'js/renderables/enemy-donut.js';
import BossEntity from 'js/renderables/enemy-boss.js';
import ChasmEntity from 'js/renderables/enemy-chasm.js';
import FlashBlockEntity from 'js/renderables/flash-block.js';
import FlashBlockTriggerEntity from 'js/renderables/flash-block-trigger.js';
import BoxGuyEntity from 'js/renderables/blockguy.js';
import MoveBlockEntity from 'js/renderables/move-block.js';
import SuperJumpEntity from 'js/renderables/super-jump.js';
import NpcWerioEntity from 'js/renderables/npc-werio.js';
import RevivalPortalEntity from 'js/renderables/revival-portal.js';
import { MessageButtonEntity, HighScoreEntity, AltModeButtonEntity } from 'js/stage/GUI.js';
import { manualMessageUpdate } from 'js/renderables/entity-data.js';

import DataManifest from 'manifest.js';


device.onReady(() => {

    // initialize the display canvas once the device/browser is ready
    // Use the "fit" scale method to scale the viewport in both dimensions when the browser window changes.
    // "fill-max" works somewhat OK, but doesn't render the background correctly if the screen is resized too quickly.
    //
    // Any aspect ratio with 640 pixels wide is used, any other ratio tries seems to create visual stutter during player movement.
    // As a trade-off, there is screen padding if the browser window doesn't match the viewport ratio.
    if (!video.init(640, 480, {parent : "screen", scaleMethod : "fit", renderer : video.AUTO, preferWebGL1 : false, subPixel : false })) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // Globally accessible object to store game information
    game.data = {
        // initial values, referenced when the game needs to be reset.
        // Note that these are not made immutable, even though they are not to be modified.
        initialScore: 0,
        initialLives: 4,
        initialFlashBlockTimer: 500,
        initialAltModePenaltyTimer: 200,
        initialAltModePenaltyTimerMax: 200,
        initialAltModePenaltyScore: 250000,
        initialAltModePenaltyTimerScale: 2,
        initialAltModePenaltyScoreScale: 2,
        initialAltModeScore: 5000000,
        initialAltModeLives: 1,
        initialAltModeGameOverScreen: "gameover-alternate",
        altModePenaltyTimerStep: 1,
        // score and lives. These are set in play.js when it realises a new game is starting
        score : 0,
        lives : 0,
        highScore : 0,
        // Indicates if flash blocks are to be rendered as usable. These are set in play.js when it realises a new game is starting
        flashBlockTimer : 0,
        flashBlockTimerMax : 0,
        // Flag to specify if Alt Mode is active or not
        useAltMode : false,
        // Variable to remember which level to replay after respawning in Alt Mode
        currentGameLevel: "",
        // Alt Mode settings which are set initially in play.js
        altModePenaltyScore: 0,
        altModePenaltyTimer: 0,
        altModePenaltyTimerMax: 0,
        altModeGameOverScreen: "",
    };
    
    // User-defined collision types are defined using BITWISE LEFT-SHIFT:
    collision.types.PHYSICS_BOUND_ENEMY_OBJECT = collision.types.USER << 0;

    // Allow message prompt to be progressed through a HTML element, since attaching the onclick event in the HTML file is not possible
    document.getElementById("messageNextButton").onclick = manualMessageUpdate;

    // Initialize the audio.
    audio.init("mp3,wav");

    // allow cross-origin for image/texture loading
    loader.crossOrigin = "anonymous";

    // set and load all resources.
    loader.preload(DataManifest, function() {
        // set the user defined game stages
        const playScreenInstance = new PlayScreen();
        state.set(state.PLAY, playScreenInstance);
        
        // Global fading transition between state changes
        state.transition("fade", "#FFFFFF", 250);

        // add our player entity in the entity pool
        pool.register("mainPlayer", PlayerEntity);
        pool.register("SecretCollectableEntity", SecretCollectableEntity);
        pool.register("MonstoidEntity", MonstoidEntity);
        pool.register("DustGuyEntity", DustGuyEntity);
        pool.register("DonutEntity", DonutEntity);
        pool.register("BossEntity", BossEntity);
        pool.register("FlashBlockEntity", FlashBlockEntity);
        pool.register("FlashBlockTriggerEntity", FlashBlockTriggerEntity);
        pool.register("ChasmEntity", ChasmEntity);
        pool.register("BoxGuyEntity", BoxGuyEntity);
        pool.register("MoveBlockEntity", MoveBlockEntity);
        pool.register("SuperJumpEntity", SuperJumpEntity);
        pool.register("NpcWerioEntity", NpcWerioEntity);
        pool.register("RevivalPortalEntity", RevivalPortalEntity);
        pool.register("MessageButtonEntity", MessageButtonEntity);
        pool.register("HighScoreEntity", HighScoreEntity);
        pool.register("AltModeButtonEntity", AltModeButtonEntity);

        // Various key bindings for use in js\entities\entities.js
        input.bindKey(input.KEY.LEFT, "left");
        input.bindKey(input.KEY.RIGHT, "right");
        input.bindKey(input.KEY.UP, "jump", true);
        input.bindKey(input.KEY.SPACE, "space", true);
        input.bindKey(input.KEY.DOWN, "interact");

        // Start the game.
        state.change(state.PLAY);
    });
});
