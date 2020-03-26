import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray, IpcMainEvent, dialog, NativeImage } from "electron"
import path from "path"
import os from "os"

import LocalServer from "./LocalServer"

require("./IPCService")


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
    (<any>global).__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\")
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

export let mainWindow: BrowserWindow = null;

let appTray: Tray = null;

const winURL: string = process.env.NODE_ENV === "development" ? `http://localhost:9080` : `file://${__dirname}/index.html`;
const trayFloder: string = process.env.NODE_ENV === "development" ? path.join(__dirname, "../../static") : path.join(__dirname, "./static");

if (process.platform === "win32") {
    app.disableHardwareAcceleration();
}

function createMainWindow() {
    let icon = nativeImage.createFromPath(path.join(trayFloder, "icon_tray.png"));
    Menu.setApplicationMenu(null);
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

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function createTrayMenu() {
    //系统托盘右键菜单
    let trayMenuTemplate = [
        {
            label: "设置",
            click: () => { }, //打开相应页面
        },
        {
            label: "帮助",
            click: () => { },
        },
        {
            label: "关于",
            click: () => {
                shell.openExternal("https://www.hibixin.com/")
            },
        },
        {
            label: "退出",
            click: () => {
                app.quit()
                app.quit()
            },
        },
    ]
    if (process.platform === "darwin") {
        appTray = new Tray(path.join(trayFloder, "icon_tray.png")) // app.ico是app目录下的ico文件
    } else {
        appTray = new Tray(path.join(trayFloder, "icon.ico")) // app.ico是app目录下的ico文件
    }
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setToolTip("AppMock");
    appTray.setContextMenu(contextMenu);
    appTray.on("click", () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        mainWindow.isVisible()
            ? mainWindow.setSkipTaskbar(false)
            : mainWindow.setSkipTaskbar(true)
    });
}

app.on("ready", () => {
    createMainWindow();
    createTrayMenu();
    LocalServer.startLocalServer();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});
