const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("revoAPI", {
    openNewTab: (callback) => ipcRenderer.on("open-new-tab", (_event, val) => callback(val)),
    toggleShift: (callback) => ipcRenderer.on("toggle-shift", (_event, val) => callback(val))
});

contextBridge.exposeInMainWorld("revoLibrary", {
    parseXml: (xml) => ipcRenderer.invoke('xml-to-json', xml)
});