const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("revoAPI", {
    openNewTab: (callback) => ipcRenderer.on("open-new-tab", (_event, val) => callback(val)),
    onToggleShift: (callback) => ipcRenderer.on("toggle-shift", (_event, val) => callback(val)),
    onCloseActiveTab: (callback) => ipcRenderer.on("close-active-tab", (_event) => callback()),
    onWindowResized: (callback) => ipcRenderer.on("window-resized", (_event) => callback()), 
});

contextBridge.exposeInMainWorld("revoLibrary", {
    parseXml: (xml) => ipcRenderer.invoke('xml-to-json', xml)
});