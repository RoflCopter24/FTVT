# FTVT
[![Build Status](https://travis-ci.org/RoflCopter24/FTVT.svg?branch=master)](https://travis-ci.org/RoflCopter24/FTVT)

> A soccer tactics visualisation tool

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

---
```
This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[331f85f](https://github.com/SimulatedGREG/electron-vue/tree/331f85fd556cc0d60a30ad019a44a29baaed49f5) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

### Project Overview

#### Dependencies

* Application Framework: [Electron](https://electron.atom.io/)
* Component Framework: [Vue.js](https://vuejs.org/)
* Components: [Vuetify.js](https://vuetifyjs.com/)
* Canvas & Layer handling: [Konva.js](https://konvajs.github.io/)

#### Structure
The project consists of custom vue-components and custom ES6 classes all situated in
the <code>/src/renderer/components</code> folder.

The window layout consists of 4 main components:

* ApplicationBar
* ToolBar
* HierarchyView (should be renamed PropertyView I know...)
* DocumentView

Communication between components is handled via a dedicated Vue instance which 
is only used as a message bus. This instance is imported from <code>helpers/EventBus.js</code>.

Classes in the objects folder are not responsible for displaying anything themselves.
They are descendants of Konva.js Objects and used on the canvas for drawing by Konva.
Those objects represent everything that can be drawn by this application.

Drawing is handled in the DocumentView. Manipulations from HierarchyView or Toolbar are
passed using the before mentioned EventBus.