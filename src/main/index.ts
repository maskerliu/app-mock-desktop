import { app, BrowserWindow, ipcMain, Menu, nativeImage } from 'electron';
import path from 'path';

const platform = require('os').platform();

// const {autoUpdater} = require("electron-updater");

// if (process.env.NODE_ENV === 'development') {
//     const {fork} = require('child_process');
//     const ps = fork(`${__dirname}/LocalServer`);
// } else {
//
// }

require('./LocalServer');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    (<any>global).__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow: BrowserWindow = null;
let appTray = null;

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;
const trayFloder = process.env.NODE_ENV === 'development' ? path.join(__dirname, '../../static') : path.join(__dirname, './static');


function createWindow() {
    let icon = nativeImage.createFromPath(path.join(trayFloder, 'icon_tray.png'));

    if (process.platform === 'darwin') {
        const template = [
            {
                label: "AppMock",
                submenu: [
                    {
                        label: '关于',
                        role: 'about'
                    },
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
                    { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                    { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                ]
            },
            {
                label: "Settings",
            }
        ];
        Menu.setApplicationMenu(null)
    } else {
        Menu.setApplicationMenu(null)
    }

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        useContentSize: true,
        
        transparent: false,
        frame: false,
        resizable: true,
        icon: icon,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            offscreen: false
        }
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    handleUpdate();
}

// app.disableHardwareAcceleration();

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

ipcMain.on('port-setting-save', (event: any, args: any) => {
    app.relaunch();
    app.exit(0);
});

function setLocalServerPort() {
    mainWindow.webContents.send('open-port-setting');
}

const UPDATE_MSG = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '已是最新版本，暂无更新',
};

function handleUpdate() {
    // autoUpdater.autoDownload = false;
    // autoUpdater.on('error', function (error) {
    //     mainWindow.webContents.send('update-check', UPDATE_MSG.error);
    // });
    // autoUpdater.on('checking-for-update', function () {
    //     mainWindow.webContents.send('update-check', UPDATE_MSG.checking);
    // });
    // autoUpdater.on('update-available', function (info) {
    //     console.log(info);
    //     mainWindow.webContents.send('update-available', info);
    // });
    // autoUpdater.on('update-not-available', function (info) {
    //     mainWindow.webContents.send('update-not-available', UPDATE_MSG.updateNotAva);
    // });
    // autoUpdater.on('download-progress', function (progress) {
    //     console.log(progress);
    //     mainWindow.webContents.send('download-progress', progress);
    // });
    // autoUpdater.on('update-downloaded', function (info) {
    //     mainWindow.webContents.send('update-now');
    // });

    // ipcMain.on('download-update', (event, args) => {
    //     autoUpdater.downloadUpdate();
    // });
    // ipcMain.on('update-now', ()=>{
    //     autoUpdater.quitAndInstall();
    // });

    // ipcMain.on("check-update", () => {
    //     //执行自动更新检查
    //     autoUpdater.checkForUpdates();
    // })
}
