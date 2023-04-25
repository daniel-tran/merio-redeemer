import { state, game, device, level, audio } from 'melonjs';

// Used for when we need to recalculate Merio's body collision box when going right.
// By not applying this export function to the hair collision box, we effectively get a mechanism
// that allows Merio to hang onto ledges with better reliability than GamerMaker's collision masking.
export function getRightScaledValue(val) {
    return val * 0.75;
}

// Used for when we need to recalculate Merio's body collision box when going left.
// By not applying this export function to the hair collision box, we effectively get a mechanism
// that allows Merio to hang onto ledges with better reliability than GamerMaker's collision masking.
export function getLeftScaledValue(val) {
    return val * 0.25;
}

// Used to determine how tall Merio's hair collision box should be, in pixels.
export function getHairHeight() {
    return 20;
}

// Gets the maximum horizontal speed of Merio
export function getPlayerMaxSpeedX() {
    return 3.25;
}

// Gets the maximum vertical speed of Merio
export function getPlayerMaxSpeedY() {
    return 18;
}

// Gets the default gravity of Merio
export function getPlayerMaxGravityY() {
    return 0.48;
}

// Gets the maximum vertical speed of Merio while in the gravity zone
export function getPlayerSlowedSpeedY() {
    return getPlayerMaxSpeedY() / 4;
}

// Gets the lessened gravity of Merio while in the gravity zone
export function getPlayerSlowedGravityY() {
    return getPlayerMaxGravityY() / 10;
}

// When on a moving platform, we want to be able to move around on it.
// Use this value to make Merio slightly faster so he can move with the motion of the platform,
// while also promoting a slight speed boost when running against it
export function getPlayerExtendedMaxSpeedX() {
    return getMovingPlatformMaxSpeedX() * 1.5;
}

// Gets the maximum horizontal speed of a moving platform
export function getMovingPlatformMaxSpeedX() {
    return 2;
}

// Gets the maximum horizontal speed of a moving platform
export function getMovingPlatformMaxSpeedY() {
    return 2;
}

// Gets the maximum horizontal speed of moving enemies. Conventionally, they are usually slower than the player.
export function getEnemyMaxSpeedX() {
    return 1;
}

// Gets the maximum vertical speed of moving enemies. Conventionally, they deliberately move slow to make them avoidable.
export function getEnemyMaxSpeedY() {
    return 1;
}

// Gets the JSON object containing default font settings
export function getDefaultFontSettings() {
    return {font: "Verdana", size: 10};
}

// Used for inCollision callbacks for applying player-specific collision logic
export function detectMerio(entityName) {
    return entityName === "mainPlayer";
}

// Used to play the background music for various levels without needing to change game states
export function playBGM() {
    let currentLevel = level.getCurrentLevel().name;
    let currentBGM = audio.getCurrentTrack();
    let expectedBGM = currentBGM;

    // Play an overworld theme song
    switch (currentLevel) {
        case "level1": expectedBGM = "theme-town"; break;
        case "level2": expectedBGM = "theme-dessert-plains"; break;
        case "level3": expectedBGM = "theme-mist-forest"; break;
        case "level_final": expectedBGM = "theme-dessert-plains"; break;
        case "_startmenu": expectedBGM = audio.stopTrack(); break;
        case "gameover": audio.stopTrack(); break;
    }

    // Only play the music if isn't already playing, otherwises the music will reset to the beginning
    if (expectedBGM && currentBGM !== expectedBGM) {
        audio.stopTrack();
        audio.playTrack(expectedBGM);
    }
}

// To get the flash animation played, me.state needs to change to a new value.
// In index.js, two states are linked to the same GameScreen. So as long as the state
// is toggled between those two states, the transition effect will always play.
export function startMakeshiftFlashAnimation() {
    if (state.isCurrent(state.FLASH_ANIMATION)) {
        state.change(state.PLAY);
    } else {
        state.change(state.FLASH_ANIMATION);
    }
}

// Checks to see if the current room is a level that is part of the actual game.
export function isGameLevel() {
    return level.getCurrentLevel().name.startsWith("level");
}

// Uses existing properties in game.data to create a fresh game (properties found in index.js)
export function resetScoreAndLives() {
    game.data.lives = game.data.initialLives;
    game.data.score = game.data.initialScore;
}

// Uses existing properties in game.data to restore all flash blocks and their triggers to their original states (properties found in index.js)
export function resetFlashBlockData() {
    game.data.flashBlockTimer = game.data.initialFlashBlockTimer;
    game.data.flashBlockTimerMax = game.data.initialFlashBlockTimer;
}

// Shows/Hides the message modal from index.html and sets its main body of text
export function toggleMessage(message, isShown) {
    let textStatus = ["none", "block"];
    // Since true = 1 and false = 0, it can be multiplied with 1 to get an integer index
    document.getElementById("messageModal").style.display = textStatus[1 * isShown];
    document.getElementById("messageContents").innerText = message;
}

// Used to generalise pause/resume logic, often for message prompts
export function toggleResume(isResuming, message) {
    if (isResuming) {
        state.resume();
    } else {
        state.pause();
    }

    // Display a message upon pausing/resuming
    if (message) {
        toggleMessage(message, true);
    } else {
        // No message implies that the message prompt should be closed
        toggleMessage("", false);
    }
}

// Gets all possible messages + submessages that the Box guys can display. Mostly used in the BoxGuyEntity init callback.
export function getAllMessages() {
    return [
        ["Merio, my boy? Is that really you?! I almost didn't recognise you with your brand new walking animations and all. And to think that you were content with sliding around the floor like a troglodyte for the last 3 games. Well, I hope you've still got the moves and/or a working keyboard because I sure don't."],
        ["Enjoy the ability to hang onto edges with your hair while you can before male pattern baldness kicks in."],
        ["Did you know... YOU HAD A LONG LOST FAMILY RELATIVE?!", "Merio: Yep.", "Oh, okay. In any case, he's waiting for you in one of the later levels, probably to ask you for money again.", "Merio: Yeah, that sounds about right."],
    ];
}

// An external interface to call BoxGuyEntity.nextMessage() from entities.js
export function manualMessageUpdate() {
    // Note: me.game.world.getChildByName() is computationally expensive, so try not to do this all the time.
    let boxguys = game.world.getChildByName("BoxGuyEntity");

    // When no box guys are on the level, just treat the message as a one-message interaction
    if (boxguys.length <= 0) {
        // Hide the message modal and resume user activity
        toggleResume(true, "");
        return;
    }

    for (let i = 0; i < boxguys.length; i++){
        // The one major issue with doing an external function call this way is that there's no good way of
        // determining which specific instance of an entity is being interacted with.
        // The naive implementation is to just assume that only one instance is being interacted at any one
        // time and finding this current instance is just a matter of looping over the entities with the same names.
        if (boxguys[i].messageSubIndex >= 0) {
            boxguys[i].nextMessage();
            break;
        }
    }
}
