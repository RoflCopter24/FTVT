import Vue from 'vue';
import Vuetify from 'vuetify';
import Konva from 'konva';
import Electron from 'electron';

import App from './App';
import EventBus from './components/helpers/EventBus.js';
import PlayerObject from './components/objects/PlayerObject';
import TextObject from './components/objects/TextObject';
import RectangleObject from './components/objects/RectangleObject';
import CircleObject from './components/objects/EllipseObject';

Vue.use(Vuetify);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

Electron.webFrame.setVisualZoomLevelLimits(1, 1);
Electron.webFrame.setLayoutZoomLevelLimits(0, 0);

const appData = {
    active: '',
    isMacOS: Electron.remote.getGlobal('isMacOS'),
    documents: [],
    settings: {},
    currDoc: function currDoc() {
      for (let i = 0; i < appData.documents.length; i++) {
          if (appData.documents[i].id === appData.active) {
              return appData.documents[i];
          }
      }
      return appData.documents[0];
    },
};

let docCounter = 1; // Counter for new document ids and names

/**
 * Creates a new empty document
 */
function newDoc() {
    docCounter++;
    const newDoc = {
        id: 'doc-' + docCounter,
        title: 'Untitled ' + docCounter,
        newPlayerCount: 0,
        newTextCount: 0,
        newRectCount: 0,
        newCircleCount: 0,
        selectedObject: null,
        stage: new Konva.Stage(),
        objects: new Konva.Layer({ id: 'objects', name: 'Objekte' }),
        background: new Konva.Layer({ id: 'bg', name: 'Hintergrund', listening: 'false' }),
        author: '',
        wasLoaded: false,
    };
    appData.documents.push(newDoc);
    appData.active = newDoc.id;
}

function closeDoc() {
    for (let i = 0; i < appData.documents.length; i++) {
        if (appData.documents[i].id === appData.active) {
            appData.documents.splice(i, 1);
        }
    }
}

/**
 * Creates a document save object from the active document
 * @returns {object}
 */
function currDocSaveObj() {
    const currDoc = appData.currDoc();

    if (currDoc.selectedObject !== null) {
        currDoc.selectedObject.setNotSelected();
    }

    return {
        title: currDoc.title,
        newPlayerCount: currDoc.newPlayerCount,
        newTextCount: currDoc.newTextCount,
        objects: currDoc.objects.toJSON(),
        background: currDoc.background.toJSON(),
        author: currDoc.author,
    };
}

/**
 * Stringifies the current document
 * and saves it to local storage
 */
function exitSave() {
    const saveObj = currDocSaveObj();
    window.localStorage.setItem('exitSave', JSON.stringify(saveObj));
}

/**
 * Called when the saving process is done
 * @param err The error object if one occurred
 */
function onSaveResult(err) {
    if (err) {
        EventBus.$emit('app:saveFailed', err.message);
    }

    EventBus.$emit('app:saveSuccess');
}

/**
 * Saves the current document to a file in the
 * specified path
 * @param filePath The path to save the document to
 */
function saveToFile(filePath) {
    const saveObj   = currDocSaveObj();
    const fs        = Electron.remote.require('fs');
    const path      = Electron.remote.require('path');

    saveObj.title = path.win32.basename(filePath, '.ftv');
    appData.currDoc().title = saveObj.title;

    fs.writeFile(filePath, JSON.stringify(saveObj), onSaveResult);
}

/**
 * Asks the user for a new file path and saves the current
 * document if a choice was made.
 */
function saveDocAs() {
    const opts = {
        title: 'Visualisierung speichern',
        buttonLabel: 'Speichern',
        filters: [
            { name: 'FT Visualisierung', extensions: ['ftv'] },
        ],
    };
    Electron.remote.dialog.showSaveDialog(Electron.remote.getCurrentWindow(), opts, (filePath) => {
        saveToFile(filePath);
    });
}

function saveDoc() {
    const currDoc = appData.currDoc();
    if (currDoc.filePath) {
        saveToFile(currDoc.filePath);
        return;
    }
    saveDocAs();
}

function objectLayerFromObject(json) {
    const childObjects = JSON.parse(json).children;
    const fakeData = JSON.parse(json);
    fakeData.children = [];
    const layer = Konva.Node.create(fakeData);

    for (let i = 0; i < childObjects.length; i++) {
        switch (childObjects[i].attrs.name) {
            case 'PlayerObject': {
                const pO = PlayerObject.FromObject(childObjects[i]);
                layer.add(pO);
                break;
            }
            case 'TextObject': {
                const tO = TextObject.FromObject(childObjects[i]);
                layer.add(tO);
                break;
            }
            case 'RectangleObject': {
                const rO = RectangleObject.FromObject(childObjects[i]);
                layer.add(rO);
                break;
            }
            case 'CircleObject': {
                const cO = CircleObject.FromObject(childObjects[i]);
                layer.add(cO);
                break;
            }
            default:
        }
    }

    return layer;
}

function loadDoc() {
    const fs = Electron.remote.require('fs');

    const opts = {
        title: 'Visualisierung laden',
        buttonLabel: 'Laden',
        filters: [
            { name: 'FT Visualisierung', extensions: ['ftv'] },
        ],
    };

    Electron.remote.dialog.showOpenDialog(Electron.remote.getCurrentWindow(), opts, (filePaths) => {
        EventBus.$emit('app:loadStart');
        fs.readFile(filePaths[0], (err, data) => {
            if (err) {
                EventBus.$emit('app:loadError', err.message);
                return;
            }

            try {
                newDoc();
                const saveObj = JSON.parse(data);
                const currDoc = appData.currDoc();
                currDoc.title = saveObj.title;
                currDoc.newPlayerCount = saveObj.newPlayerCount;
                currDoc.newTextCount = saveObj.newTextCount;
                // currDoc.objects = Konva.Node.create(exitSave.objects);
                currDoc.objects = objectLayerFromObject(saveObj.objects);
                currDoc.background = Konva.Node.create(saveObj.background);
                currDoc.author = saveObj.author;
                currDoc.wasLoaded = true;
                currDoc.filePath = filePaths[0];
                EventBus.$emit('app:loadSuccess');
            } catch (e) {
                EventBus.$emit('app:loadError', e);
            }
        });
    });
}

/**
 * Tries to load an exitSave into the first document
 * @returns {boolean} Success of the operation
 */
function loadExitSave() { // eslint-disable-no-unused-vars
    const exitJSON = window.localStorage.getItem('exitSave');
    if (!exitJSON) {
        return false;
    }

    const exitSave = JSON.parse(exitJSON);

    if (!exitSave) {
        return false;
    }

    const currDoc = appData.currDoc();
    currDoc.title = exitSave.title;
    currDoc.newPlayerCount = exitSave.newPlayerCount;
    currDoc.newTextCount = exitSave.newTextCount;
    // currDoc.objects = Konva.Node.create(exitSave.objects);
    currDoc.objects = objectLayerFromObject(exitSave.objects);
    currDoc.background = Konva.Node.create(exitSave.background);
    currDoc.author = exitSave.author;
    currDoc.wasLoaded = true;
    return true;
}

function exportDoc() {
    const opts = {
        title: 'Visualisierung exportieren',
        buttonLabel: 'Exportieren',
        filters: [
            { name: 'JPEG Datei', extensions: ['jpg', 'jpeg'] },
        ],
    };
    Electron.remote.dialog.showSaveDialog(Electron.remote.getCurrentWindow(), opts, (filePath) => {
        EventBus.$emit('app:doExport', filePath);
    });
}

/**
 * Performs an exit save and quits
 * the app afterwards
 */
function appQuit() {
    exitSave();
    Electron.remote.app.quit();
}

// EventHooks for Win/Linux
EventBus.$on('doc:new', newDoc);
EventBus.$on('doc:export', exportDoc);
EventBus.$on('doc:open', loadDoc);
EventBus.$on('doc:save', saveDoc);
EventBus.$on('doc:saveAs', saveDocAs);
EventBus.$on('doc:close', closeDoc);
EventBus.$on('app:quit', appQuit);

// EventHooks for MacOS
Electron.ipcRenderer.on('doc:new', newDoc);
Electron.ipcRenderer.on('doc:export', exportDoc);
Electron.ipcRenderer.on('doc:open', loadDoc);
Electron.ipcRenderer.on('doc:save', saveDoc);
Electron.ipcRenderer.on('doc:saveAs', saveDocAs);
Electron.ipcRenderer.on('doc:close', closeDoc);
Electron.ipcRenderer.on('app:quit', appQuit);

/* eslint-disable no-new */
const vue = new Vue({
    data() {
        return appData;
    },
    components: { App },
    template: '<App v-bind:documents="documents" v-bind:active.sync="active" v-bind:settings="settings" :isMacOS="isMacOS"/>',
    beforeDestroy() {
        exitSave();
    },
}).$mount('#app');

window.onunload = exitSave;
newDoc();
vue.$nextTick();
loadExitSave();
