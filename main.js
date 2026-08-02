import { app, BrowserWindow, ipcMain, session, globalShortcut, dialog } from 'electron';
import contextMenu from 'electron-context-menu';
import download from 'electron-dl';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import xml2js from 'xml2js';
import Store from 'electron-store';

/* Constants */
// prefaces for es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const store = new Store();

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
  //win.webContents.openDevTools();

  win.on("resized", () => {
    win.webContents.send("window-resized");
  })
}

app.on("web-contents-created", (evt, contents) => {
  if (contents.getType() == "webview") {
    contextMenu({
      window: contents,
      browserWindow: BrowserWindow.fromWebContents(contents),
      showInspectElement: true,
      showSearchWithGoogle: false,
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
  };
  contents.on("before-input-event", (evt, input) => {
      if (input.key.toLowerCase() == "shift") {
        if (input.type == "keyDown") {
          win.webContents.send("toggle-shift", true);
        } else if (input.type == "keyUp") {
          win.webContents.send("toggle-shift", false);
        }
      }
    });
  // https://github.com/solarcosmic/OrbBrowser/blob/4ffeb3c50ada6ceea2edd37bbb4ca15e0500d1ac/main.js#L213
  contents.on("before-mouse-event", (evt, mouse) => {
    if (mouse.type == "mouseDown") {
      if (win) win.webContents.send("mouse-click", mouse.x, mouse.y);
    }
  })
});

app.whenReady().then(() => {
  const mainSession = session.defaultSession;
  const originalAgent = mainSession.getUserAgent();
  const electronPatch = originalAgent.replace(/ Electron\/[^\s]+/, '');
  const revoPatch = electronPatch.replace(/ revobrowser\/[^\s]+/, ` Revo/${app.getVersion() || "1.0.0"}`);
  mainSession.setUserAgent(revoPatch);
  if (store.get("clean_exit") == false) { // false because on first startup this doesn't exist
    dialog.showMessageBoxSync(win, {
      type: "warning",
      message: "Incorrect Shutdown",
      title: "Revo - Error",
      buttons: ["Ok"],
      detail: `It seems that Revo may have shut down incorrectly, and tab data may not have been accurately saved.
      \n\n
      Revo will now attempt to open the latest record. If no record is present, Revo will create a single tab by default.`
    });
  };
  createWindow();
  registerShortcuts();
});

/* https://stackoverflow.com/a/53637828 */
function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

function registerShortcuts() {
  globalShortcut.register("CommandOrControl+T", () => {
      win.webContents.send("open-new-tab", `https://www.google.com`);
  });
  globalShortcut.register("CommandOrControl+W", () => {
      win.webContents.send("close-active-tab");
  });
}

ipcMain.handle("xml-to-json", async (evt, string) => {
  const result = await xml2js.parseStringPromise(string);
  return JSON.stringify(result);
});

ipcMain.handle("revo-store-get", (evt, key) => {
  return store.get(key);
});

ipcMain.handle("revo-store-set", (evt, key, val) => {
  store.set(key, val);
});

ipcMain.handle("revo-store-delete", (evt, key) => {
  store.delete(key);
});