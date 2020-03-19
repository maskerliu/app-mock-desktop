import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray, IpcMainEvent } from 'electron';
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
let appTray: Tray = null;

const winURL: string = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;
const trayFloder: string = process.env.NODE_ENV === 'development' ? path.join(__dirname, '../../static') : path.join(__dirname, './static');


function createMainWindow() {
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
                            // setLocalServerPort();
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
    mainWindow.webContents.frameRate = 30;

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTrayMenu() {
    //系统托盘右键菜单
    let trayMenuTemplate = [
        {
            label: '设置',
            click: () => { }, //打开相应页面
        },
        {
            label: '帮助',
            click: () => { },
        },
        {
            label: '关于',
            click: () => {
                shell.openExternal('https://www.hibixin.com/')
            },
        },
        {
            label: '退出',
            click: () => {
                app.quit()
                app.quit()
            },
        },
    ]
    if (platform === 'darwin') {
        appTray = new Tray(path.join(trayFloder, 'icon_tray.png')) // app.ico是app目录下的ico文件
    } else {
        appTray = new Tray(path.join(trayFloder, 'icon.ico')) // app.ico是app目录下的ico文件
    }
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setToolTip('AppMock');
    appTray.setContextMenu(contextMenu);
    appTray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        mainWindow.isVisible()
            ? mainWindow.setSkipTaskbar(false)
            : mainWindow.setSkipTaskbar(true)
    });
}

ipcMain.on("onMaximize", (event: IpcMainEvent, args?: any) => {
    if (mainWindow == null) return;

    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on("onMinus", (event: IpcMainEvent, args?: any) => {
    if (mainWindow == null) return;

    if (!mainWindow.isMinimized()) {
        mainWindow.minimize();
    }
});

ipcMain.on("onQuit", (event: IpcMainEvent, args?: any) => {
    app.quit();
});


// app.disableHardwareAcceleration();

app.on('ready', () => {
    createMainWindow();
    createTrayMenu();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});
