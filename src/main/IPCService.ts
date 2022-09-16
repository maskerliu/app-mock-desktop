import { app, dialog, ipcMain, IpcMainEvent } from "electron";
import { mainWindow } from "./";
// import AsarUpdateService from "./AsarUpdateService";
import LocalServer from "./LocalServer";
import ProxyService from "./ProxyService";


ipcMain.handle("getAppDir", async (event: IpcMainEvent, args?: any) => {
  return app.getPath("userData");
})

ipcMain.on("on-app-maximize", (event: IpcMainEvent, args?: any) => {
  if (mainWindow == null) return;

  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("on-app-minus", (event: IpcMainEvent, args?: any) => {
  if (mainWindow == null) return;

  if (!mainWindow.isMinimized()) {
    mainWindow.minimize();
  }
});

ipcMain.on("on-app-quit", (event: IpcMainEvent, args?: any) => {
  app.quit();
});

ipcMain.handle("get-local-server-config", async (event: IpcMainEvent) => {
  return LocalServer.getLocalServerConfig();
});

ipcMain.on("on-open-folder", (event: IpcMainEvent, args?: any) => {
  dialog
    .showOpenDialog(mainWindow, {
      title: "选择序列化插件",
      properties: ["openFile", "multiSelections", "showHiddenFiles"],
      filters: [{ name: "Script", extensions: ["js", "ts", "proto"] }],
    })
    .then((result) => {
      if (result.canceled) return;
      ProxyService.setProtoFiles(result.filePaths);
      event.sender.send("on-selected-files", { files: result.filePaths });
    });
});