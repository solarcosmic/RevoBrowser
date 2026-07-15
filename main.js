const { app, BrowserWindow, session } = require('electron');
const contextMenu = require('electron-context-menu').default;
const { download } = require('electron-dl').default;

var win;

const createWindow = () => {
  win = new BrowserWindow({
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

app.on("web-contents-created", (evt, contents) => {
  if (contents.getType() == "webview") {
    contextMenu({
      window: contents,
      browserWindow: BrowserWindow.fromWebContents(contents),
      showInspectElement: true,
      //showSaveImageAs: true,
      showSearchWithGoogle: true,
      showCopyImageAddress: true,
      showCopyVideoAddress: true,
      prepend: (defaultActions, params, browseWindow) => [
        {
          label: "Save Image to Desktop",
          visible: params.mediaType == 'image',
          click: () => {
            console.log(params.srcURL);
            download(win || BrowserWindow.getFocusedWindow(), params.srcURL);
          }
        }
      ]
    })
  }
})

app.whenReady().then(() => {
  const mainSession = session.defaultSession;
  const originalAgent = mainSession.getUserAgent();
  const electronPatch = originalAgent.replace(/ Electron\/[^\s]+/, '');
  const revoPatch = electronPatch.replace(/ revobrowser\/[^\s]+/, ` Revo/${app.getVersion() || "1.0.0"}`);
  mainSession.setUserAgent(revoPatch);
  createWindow();
});