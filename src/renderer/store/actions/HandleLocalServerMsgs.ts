import { ipcRenderer } from "electron"


export function init({ commit, state, rootState }) :void {
    ipcRenderer.on("get-local-server-config", onGetLocalServerIP);
    ipcRenderer.send("get-local-server-config");
}

function onGetLocalServerIP(event: any, data: any) {
    
}