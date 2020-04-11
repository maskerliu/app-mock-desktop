import { app, dialog, ipcMain, IpcMainEvent, NativeImage } from "electron";
import { mainWindow } from "./";
import LocalServer from "./LocalServer";
import ProxyService from "./ProxyService"

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

ipcMain.on("set-proxy-delay", (event: any, args?: any) => {
    try {
        ProxyService.setProxyDelay(args.delay);
    } catch (err) {

    }
});


ipcMain.on('get-local-server-config', (event: IpcMainEvent, args?: any) => {
    event.sender.send('get-local-server-config', LocalServer.getLocalServerConfig());
});

ipcMain.on('update-local-server-config', (event: IpcMainEvent, args?: any) => {
    try {
        LocalServer.updateLocalServerConfig(args);
    } catch (err) {

    }
    event.sender.send('get-local-server-config', LocalServer.getLocalServerConfig());
});

ipcMain.on("on-open-folder", (event: IpcMainEvent, args?: any) => {
    dialog.showOpenDialog(mainWindow,
        {
            title: "选择序列化插件",
            properties: ["openFile", "multiSelections", "showHiddenFiles"],
            filters: [{ name: 'Script', extensions: ["js", "ts", "proto"] },]
        })
        .then(result => {
            if (result.canceled) return;
            ProxyService.setProtoFiles(result.filePaths);
            event.sender.send("on-selected-files", { files: result.filePaths });
        });
});