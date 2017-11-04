import { app, BrowserWindow, fs, Menu} from 'electron' // eslint-disable-line

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
global.staticDir = isDevBuild ? '/static' : global.__static;
const menuTpl = [
    {
        label: 'Datei',
        submenu: [
            {
                label: 'Neu',
                click() { mainWindow.webContents.send('doc:new'); },
            },
            {
                label: 'Öffnen',
                click() { mainWindow.webContents.send('doc:open'); },
            },
            {
                label: 'Speichern',
                click() { mainWindow.webContents.send('doc:save'); },
            },
            {
                label: 'Speichern unter',
                click() { mainWindow.webContents.send('doc:saveAs'); },
            },
            {
                label: 'Schließen',
                click() { mainWindow.webContents.send('doc:close'); },
            },
            { type: 'separator' },
            {
                label: 'Exportieren',
                click() { mainWindow.webContents.send('doc:export'); },
            },
        ],
    },
    {
        label: 'Bearbeiten',
        submenu: [
            // { role: 'undo' },
            // { role: 'redo' },
            // { type: 'separator' },
            {
                role: 'delete',
                click() { mainWindow.webContents.send('edit:selDelete'); },
            },
            {
                label: 'Dokument-Einstellungen',
                click() { mainWindow.webContents.send('doc:settings'); },
            },
        ],
    },
    {
        label: 'Ansicht',
        submenu: [
            { role: 'resetzoom' },
        ],
    },
    {
        label: 'Fenster',
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' },
        ],
    },
    {
        label: 'Hilfe',
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { require('electron').shell.openExternal('https://electron.atom.io'); },
            },
        ],
    },
];

if (isDevBuild) {
    menuTpl.push({
        label: 'Developer',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
        ],
    });
}

if (isMacOS) {
    menuTpl.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    });

    // Window menu
    menuTpl[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { type: 'separator' },
        { role: 'front' },
    ];
}
global.isMacOS = isMacOS;
app.setName('FTVT');

function createWindow() {
  /**
   * Initial window options
   */
    mainWindow = new BrowserWindow({
        height: 720,
        useContentSize: true,
        width: 1280,
        transparent: true,
        frame: !isMacOS && isDevBuild,
    });

    const menu = Menu.buildFromTemplate(menuTpl);

    if (!isMacOS && !isDevBuild) {
        mainWindow.setMenuBarVisibility(false);
    }

    Menu.setApplicationMenu(menu);

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
