const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("revoAPI", {
    openNewTab: (callback) => ipcRenderer.on("open-new-tab", (_event, val) => callback(val))
});