const { app, BrowserWindow, session } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    transparent: true,
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
  const cleanAgent = originalAgent.replace(/ Electron\/[^\s]+/, '').replace(/ revobrowser\/[^\s]+/, ` Revo/${app.getVersion() || "1.0.0"}`);
  mainSession.setUserAgent(cleanAgent);
  createWindow();
});