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
        name: "_startmenu",
        type: "tmx",
        src: "data/map/_startmenu.tmx"
    },
    {   
        name: "level1",
        type: "tmx",
        src: "data/map/level1.tmx"
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
        name: "backdrop-town",
        type:"image",
        src: "data/img/backdrop/backdrop-town.png"
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
        name: "BUTTONS",
        type:"image",
        src: "data/img/gui/BUTTONS.png"
    },
];

export default DataManifest;
