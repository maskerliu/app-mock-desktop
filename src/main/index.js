import {app, BrowserWindow, ipcMain, Menu} from 'electron'

// if (process.env.NODE_ENV === 'development') {
//     const {fork} = require('child_process');
//     const ps = fork(`${__dirname}/LocalServer`);
// } else {
//
// }

const LocalServer = require('./LocalServer');

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
                label: "AppMock",
                submenu: [
                    {
                        label: "端口设置", accelerator: "Command+P", click: function () {
                            setLocalServerPort();
                        }
                    },
                    {
                        label: "退出", accelerator: "Command+Q", click: function () {
                            app.quit();
                        }
                    }
                ]
            },
            {
                label: "Edit",
                submenu: [
                    {label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:"},
                    {label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:"},
                ]
            },
            {
                label: "Settings",
            }
        ];
        Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    } else {
        Menu.setApplicationMenu(null)
    }

    mainWindow = new BrowserWindow({
        height: 800,
        useContentSize: true,
        width: 1200,
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

ipcMain.on('port-setting-save', (event, args) => {
    app.relaunch();
    app.exit(0);
});

function setLocalServerPort() {
    mainWindow.webContents.send('open-port-setting');
}

const {autoUpdater} = require("electron-updater");

let template = [];
if (process.platform === 'darwin') {
    // OS X
    const name = app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() {
                    app.quit();
                }
            },
        ]
    })
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});

function sendStatusToWindow(text) {
    mainWindow.webContents.send('message', text);
}

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
