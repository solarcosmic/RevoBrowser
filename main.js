const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    transparent: true,
    backgroundColor: "#00000000",
    webPreferences: {
        webviewTag: true
    }
  })

  win.setMenu(null)
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})