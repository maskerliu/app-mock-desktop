import {app, BrowserWindow, Menu} from 'electron'

if (process.env.NODE_ENV === 'development') {
    const {fork} = require('child_process');
    const ps = fork(`${__dirname}/LocalServer`);
} else {
    require('./LocalServer');
}


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

function createWindow() {
    if (process.platform === 'darwin') {
        const template = [
            {
                label: "Application",
                submenu: [
                    { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
                ]
            },
            {
                label: "Edit",
                submenu: [
                    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                ]
            }
        ];
        Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    } else {
        Menu.setApplicationMenu(null)
    }

    mainWindow = new BrowserWindow({
        height: 700,
        useContentSize: true,
        width: 1020,
        transparent: false,
        frame: true,
        resizable: true
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.disableHardwareAcceleration();

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

/*
import {autoUpdater} from 'electron-updater'

autoUpdater.autoInstallOnAppQuit = false;

function sendUpdateMessage(message, data) {
    mainWindow.webContents.send('update-message', {message, data});
}

autoUpdater.on('error', data => {
    sendUpdateMessage('error', data);
});

app.on('ready', () => {
    if (process.env.NODE_ENV === 'production')
        autoUpdater.checkForUpdatesAndNotify();
});

// 有可用更新
autoUpdater.on('update-available', data => {
    sendUpdateMessage('update-available', data);
});

// 已经最新
autoUpdater.on('update-not-available', data => {
    sendUpdateMessage('update-not-available', data);
});

// 更新下载进度事件
autoUpdater.on('download-progress', data => {
    sendUpdateMessage('download-progress', data);
});

// 更新下载完成事件
autoUpdater.on('update-downloaded', () => {
    sendUpdateMessage('update-downloaded', {});
    ipcMain.once('update-now', () => {
        autoUpdater.quitAndInstall();
    });
});
*/
