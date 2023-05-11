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
        case "level-final": expectedBGM = "theme-final"; break;
        case "_startmenu": expectedBGM = "theme-startmenu"; break;
        case "gameover":
        case "gameover-alternate": audio.stopTrack(); break;
    }

    // Only play the music if isn't already playing, otherwises the music will reset to the beginning
    if (expectedBGM && currentBGM !== expectedBGM) {
        audio.stopTrack();
        audio.playTrack(expectedBGM);
    }
}

// Makes the screen flash briefly with white
export function startMakeshiftFlashAnimation() {
    game.viewport.fadeIn("#fff", 300, function(){
        game.viewport.fadeOut("#fff", 150);
    });
}

// Checks to see if the current room is a level that is part of the actual game.
export function isGameLevel() {
    return level.getCurrentLevel().name.startsWith("level");
}

// Uses existing properties in game.data to create a fresh game (properties found in index.js)
export function resetScoreAndLives() {
    if (!game.data.useAltMode) {
        game.data.lives = game.data.initialLives;
        hardResetScore();
    } else {
        // In Alt Mode, score penalties should carry over from each previous replay, so score shouldn't be reset here
        game.data.lives = game.data.initialAltModeLives;
    }
}

// Forcefully resets the score. Intended to be used on the start menu or on the final game over screen.
export function hardResetScore() {
    game.data.score = !game.data.useAltMode ? game.data.initialScore : game.data.initialAltModeScore;
}

// Resets all the Alt Mode specific settings that can be modified when dying
export function resetAltModeSettings() {
    game.data.altModeGameOverScreen = game.data.initialAltModeGameOverScreen;
    game.data.altModePenaltyScore = game.data.initialAltModePenaltyScore;
    game.data.altModePenaltyTimer = game.data.initialAltModePenaltyTimer;
    game.data.altModePenaltyTimerMax = game.data.initialAltModePenaltyTimerMax;
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

        ["Whee! Getting shot out of a cannon never gets old. Anyway, this place has naturally occurring fairy floss that makes platforms briefly appear for some reason when eaten."],
        ["So, overrunning that burning city from one of the previous games wasn't enough for these donut delinquents, eh? Jump on them before they take over another place that people sort of care about."],
        ["Okay, Merio, this is the game plan: You rush these donuts, open the gate, jump over to the other fairy floss and KEEP EATING until you see a good opening to get past those dust guys. You can thank me later, but your liver and other vital organs certainly won't."],
        ["Honestly, that last cannon was an absolute dud. But I've got a good feeling about this one because it smells like pork rinds."],

        ["Looks like those lazy lumberjacks I hired left all their equipment lying around AGAIN. That's it, I want to see their manager right now!",
         "While that's happening, you can move the boxes containing their stuff by repeatedly tapping the LEFT or RIGHT key while facing it to push it a little bit."],
        ["Don't push that box all the way! You'll need it to give you extra height and make the jump over that chasm ahead."],
        ["Alright, it's that point in the game where you really get to abuse the physics engine and violate the laws of motion, so listen up.",
         "When you eat that fairy floss, the box of axes is going to briefly jump up. If you can get it to land on your hair at a particular angle, it'll get kicked right over there so you can climb the wall. But once it's in place, you only have one chance to get over it, so make it count! See you on the other side...that is if you can make it there."],
        ["Whoowee! I totally didn't question your ability to get to this point, so good on you!",
         "To get to the last cannon, you'll have to pass by these pudgy looking bears. They've got a weird thing going, so I suggest watching them for a bit to find a good way to get past them without being jumped on."],

        ["There he is, just standing there menacingly. Press the DOWN key to talk to him when you get close enough."],
        ["Merio: Hopefully it was worth being shot out of a cannon 3 times to hear what you have to say...",
         "RIGHTO, I WILL KEEP THIS CONCISE BECAUSE I KNOW YOU HAVE A TERRIBLE ATTENTION SPAN.",
         "VEhJUyBNSUdIVCBCRSBUSEUgTEFTVCBHQU1FIFlPVSBXSUxMIEVWRVIgU1RBUiBJTiwgQlVUIFlPVSBXRVJFIEEgR1JFQVQg\nSEVSTyBBTkQgV0lMTCBJTlNQSVJFIFRIRSBORVhUIEdFTkVSQVRJT04gVE8gRE8gRVZFTiBNT1JFIEhBSVItVEFDVUxBUiBGRUFUUy4=",
         "Merio: Wait, what?",
         "YES, I UNDERSTAND THIS CAN BE DIFFICULT TO PROCESS, BUT IN DUE TIME YOU WILL COME TO TERMS WITH IT.",
         "AND NO, I WILL NOT REPEAT IT BECAUSE I AM A HUGE JERK.",
         "Merio: Well, that was a gigantic waste of time. Got anything else to disappoint me with?",
         "I ALSO NEED A FEW THOUSAND DOLLARS ONCE AGAIN.",
         "Merio: Look, you can take these weird Brownie Points I've been picking up. You could probably cash them in for, like, a can of soda or an old boot.",
         "THANK YOU MERIO, I KNEW I COULD ALWAYS TRUST IN YOU.",
         "Merio: Now to get back to the start menu and goof around until I find something better to do with my life."],
    ];
}

// An external interface to call BoxGuyEntity.nextMessage() from entities.js
export function manualMessageUpdate() {
    // Note: me.game.world.getChildByName() is computationally expensive, so try not to do this all the time.
    let boxguys = game.world.getChildByName("BoxGuyEntity");
    boxguys.push(...game.world.getChildByName("NpcWerioEntity"));

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
