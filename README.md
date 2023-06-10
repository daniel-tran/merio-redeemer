![MERIO Redeemer](https://github.com/daniel-tran/merio-redeemer/blob/main/src/data/img/gui/LOGO.png)

Join Merio on yet another (possibly final?) hair-raising thrill-ride of vaguely quantifiable proportions!

Made using melonJS 13.4.0

## Play from the Internet

For the first time, you don't have to download some sketchy executable file to play the game! With a working Internet connection, you can play the game using the following link:

https://daniel-tran.github.io/merio-redeemer/

## Usage

After installing Node.js 18 or higher:

- `npm install` to download depdendencies listed in package.json
- `npm run dev` to start the dev server on watch mode at `localhost:8080`.
- `npm run build` to generate a minified, production-ready build, in the `docs` folder

## Folder structure

```none
src
├── data
│    ├── bgm
│    ├── fnt
│    ├── img
│    ├── map
│    └── sfx
├── js
│    ├── renderables
│    └── stage
├── index.js
├── index.css
├── index.html
├── manifest.js
docs
├── data
├── bundle.js
└── index.html
```

- `src`
  - This is the root folder for the game source code
  - The entry file is [index.js](src/index.js).
  - [index.css](src/index.css) and [index.html](src/index.html) are default templates that can be customized
  - [manifest.js](src/manifest.js) is a list of assets to be preloaded by melonJS (these won't be automatically imported and bundled by webpack)
- `src/js`
  - The source classes are here
- `src/data`
  - The game assets are here
- `docs`
  - where the production-ready build files will be copied/generated when using `npm run build`

## Why is this game built on melonJS 13.4.0 instead of the current latest version?

Starting from 14.0.0, melonJS has changed the way that checks are done against all the collision boxes and their interactions with the environment. This results in some strange behaviour where Merio will always drop down from a block after hanging onto an edge and moving into the adjacent wall.

## Legal Info

"MERIO Redeemer" is built using the [melonJS ES6 boilerplate](https://github.com/melonjs/es6-boilerplate), which is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
