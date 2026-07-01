const { app, BrowserWindow, session } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    transparent: false,
    backgroundColor: "#00000000",
    webPreferences: {
        webviewTag: true
    }
  })

  win.setMenu(null);
  win.loadFile('index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  const mainSession = session.defaultSession;
  const originalAgent = mainSession.getUserAgent();
  const electronPatch = originalAgent.replace(/ Electron\/[^\s]+/, '');
  const revoPatch = electronPatch.replace(/ revobrowser\/[^\s]+/, ` Revo/${app.getVersion() || "1.0.0"}`);
  mainSession.setUserAgent(revoPatch);
  createWindow();
});