import { app, BrowserWindow, Menu, nativeImage, shell, Tray, dialog } from "electron"
import path from "path"
import LocalServer from "./LocalServer"

require("./IPCService")

import AsarUpdateService from "./AsarUpdateService"

if (process.env.NODE_ENV !== "development") {
  (<any>global).__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\");
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

export let mainWindow: BrowserWindow = null;

let appTray: Tray = null;

const winURL: string =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;
const trayFloder: string =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../../static")
    : path.join(__dirname, "./static");

function createMainWindow(): void {
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
      offscreen: false,
    },
  });

  mainWindow.loadURL(winURL);
  mainWindow.webContents.frameRate = 30;

  mainWindow.webContents.on("paint", (event, dirty, image) => { });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createAppMenu(): void {
  Menu.setApplicationMenu(null)
}

function createTrayMenu(): void {
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
        shell.openExternal("https://github.com/maskerliu/app-mock-desktop");
      },
    },
    {
      label: "退出",
      click: () => {
        app.quit();
        app.quit();
      },
    },
  ];
  if (process.platform === "darwin") {
    appTray = new Tray(path.join(trayFloder, "icon_tray.png"));
  } else {
    appTray = new Tray(path.join(trayFloder, "icon.ico"));
  }
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  appTray.setToolTip("AppMock");
  appTray.setContextMenu(contextMenu);
  appTray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    mainWindow.isVisible()
      ? mainWindow.setSkipTaskbar(false)
      : mainWindow.setSkipTaskbar(true);
  });
}

if (process.platform === "win32") {
  app.disableHardwareAcceleration();
}

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.disableHardwareAcceleration();
// app.commandLine.appendSwitch("disable-gpu");
// app.commandLine.appendSwitch("disable-software-rasterizer");

app.on("ready", () => {
  createMainWindow();
  createAppMenu();
  createTrayMenu();
  AsarUpdateService.setParentWindow(mainWindow);
  AsarUpdateService.check();
  LocalServer.startProxyHttpServer();
  LocalServer.startLocalPushServer();
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
