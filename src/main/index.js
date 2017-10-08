import { app, BrowserWindow, fs} from 'electron' // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const isMacOS = process.platform === 'darwin';
const isDevBuild = process.env.NODE_ENV === 'development';
const winURL = isDevBuild
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;
const menuTpl = {};
global.isMacOS = isMacOS;

function createWindow() {
  /**
   * Initial window options
   */
    mainWindow = new BrowserWindow({
        height: 720,
        useContentSize: true,
        width: 1280,
        transparent: true,
        frame: !isDevBuild,
    });

    if (!isMacOS && !isDevBuild) {
        mainWindow.setMenuBarVisibility(false);
    }

    if (isMacOS) {
        mainWindow.setMenu(menuTpl);
    }

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
