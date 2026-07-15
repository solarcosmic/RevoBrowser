import { app, BrowserWindow, session } from 'electron';
import contextMenu from 'electron-context-menu';
import download from 'electron-dl';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// prefaces for es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    transparent: false,
    backgroundColor: "#00000000",
    webPreferences: {
        webviewTag: true,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.setMenu(null);
  win.loadFile('src/index.html');
  win.webContents.openDevTools();
}

app.on("web-contents-created", (evt, contents) => {
  if (contents.getType() == "webview") {
    contextMenu({
      window: contents,
      browserWindow: BrowserWindow.fromWebContents(contents),
      showInspectElement: true,
      //showSaveImageAs: true,
      showCopyImageAddress: true,
      showCopyVideoAddress: true,
      prepend: (defaultActions, params, browseWindow) => [
        {
          label: "Save Image to Desktop",
          visible: params.mediaType == 'image',
          click: async () => {
            console.log(params.srcURL);
            console.log("downloading!");
            await download(win || BrowserWindow.getFocusedWindow(), params.srcURL);
          }
        },
        {
          label: `Search Google for ${truncateString(params.selectionText || "this selection", 24)}`,
          visible: params.selectionText.trim().length > 0,
          click: () => {
            win.webContents.send("open-new-tab", `https://www.google.com/search?q=${encodeURIComponent(params.selectionText)}`);
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

/* https://stackoverflow.com/a/53637828 */
function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}