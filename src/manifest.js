// a melonJS data manifest
// note : this is note a webpack manifest
const DataManifest = [

    /* Bitmap Text */
    {
        name: "Verdana",
        type: "image",
        src:  "./data/fnt/verdana.png"
    },
    {
        name: "Verdana",
        type: "binary",
        src: "./data/fnt/verdana.fnt"
    },
    {   
        name: "startmenu",
        type: "tmx",
        src: "data/map/startmenu.tmx"
    },
    {   
        name: "level1",
        type: "tmx",
        src: "data/map/level1.tmx"
    },
    {   
        name: "level2",
        type: "tmx",
        src: "data/map/level2.tmx"
    },
    {
        name: "level3",
        type: "tmx",
        src: "data/map/level3.tmx"
    },
    {
        name: "level-final",
        type: "tmx",
        src: "data/map/level-final.tmx"
    },
    {
        name: "gameover",
        type: "tmx",
        src: "data/map/gameover.tmx"
    },
    {
        name: "gameover-alternate",
        type: "tmx",
        src: "data/map/gameover-alternate.tmx"
    },
    {   
        name: "all-tiles",
        type: "tsx",
        src: "data/map/all-tiles.json"
    },
    {   
        name: "all-tiles",
        type:"image",
        src: "data/img/all-tiles.png"
    },
    {
        name: "LOGO",
        type: "tsx",
        src: "data/map/LOGO.json"
    },
    {
        name: "LOGO",
        type:"image",
        src: "data/img/gui/LOGO.png"
    },
    /* Even though the dying image is just an Image Layer in the map, it still needs a corresponding tileset even though it's unused */
    {
        name: "STABBED",
        type: "tsx",
        src: "data/map/LOGO.json"
    },
    {
        name: "STABBED",
        type:"image",
        src: "data/img/gui/STABBED.png"
    },
    {   
        name: "foreground-large",
        type: "tsx",
        src: "data/map/foreground-large.json"
    },
    {   
        name: "foreground-large",
        type:"image",
        src: "data/img/backdrop/foreground-large.png"
    },
    {   
        name: "MERIO",
        type:"image",
        src: "data/img/sprites/MERIO.png"
    },
    {   
        name: "SECRET",
        type:"image",
        src: "data/img/sprites/SECRET.png"
    },
    {   
        name: "MONSTOID",
        type:"image",
        src: "data/img/sprites/MONSTOID.png"
    },
    {   
        name: "DUSTGUY",
        type:"image",
        src: "data/img/sprites/DUSTGUY.png"
    },
    {   
        name: "DONUT",
        type:"image",
        src: "data/img/sprites/DONUT.png"
    },
    {   
        name: "BEARS",
        type:"image",
        src: "data/img/sprites/BEARS.png"
    },
    {   
        name: "FLASHBLOCK",
        type:"image",
        src: "data/img/sprites/FLASHBLOCK.png"
    },
    {   
        name: "FLASHBLOCKTRIGGER",
        type:"image",
        src: "data/img/sprites/FLASHBLOCKTRIGGER.png"
    },
    {   
        name: "BOXGUY",
        type:"image",
        src: "data/img/sprites/BOXGUY.png"
    },
    {   
        name: "MOVEBLOCK",
        type:"image",
        src: "data/img/sprites/MOVEBLOCK.png"
    },
    {   
        name: "LIFES",
        type:"image",
        src: "data/img/sprites/LIFES.png"
    },
    {
        name: "WERIO",
        type:"image",
        src: "data/img/sprites/WERIO.png"
    },
    {
        name: "PORTAL",
        type:"image",
        src: "data/img/sprites/PORTAL.png"
    },
    {
        name: "backdrop-startmenu",
        type:"image",
        src: "data/img/backdrop/backdrop-startmenu.png"
    },
    {   
        name: "backdrop-town",
        type:"image",
        src: "data/img/backdrop/backdrop-town.png"
    },
    {   
        name: "backdrop-dessert-plains",
        type:"image",
        src: "data/img/backdrop/backdrop-dessert-plains.png"
    },
    {   
        name: "backdrop-mist-forest",
        type:"image",
        src: "data/img/backdrop/backdrop-mist-forest.png"
    },
    {
        name: "backdrop-final",
        type:"image",
        src: "data/img/backdrop/backdrop-final.png"
    },
    {
        name: "backdrop-gameover",
        type:"image",
        src: "data/img/backdrop/backdrop-gameover.png"
    },
    {
        name: "theme-startmenu",
        type: "audio",
        src: "data/bgm/"
    },
    {
        name: "theme-town",
        type: "audio",
        src: "data/bgm/"
    },
    {
        name: "theme-dessert-plains",
        type: "audio",
        src: "data/bgm/"
    },
    {
        name: "theme-mist-forest",
        type: "audio",
        src: "data/bgm/"
    },
    {
        name: "theme-final",
        type: "audio",
        src: "data/bgm/"
    },
    {
        name: "cannonshot",
        type: "audio",
        src: "data/sfx/"
    },
    {   
        name: "BUTTONS",
        type:"image",
        src: "data/img/gui/BUTTONS.png"
    },
    {
        name: "ONSCREENCONTROLS",
        type:"image",
        src: "data/img/gui/ONSCREENCONTROLS.png"
    },
];

export default DataManifest;
