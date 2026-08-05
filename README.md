<img width="1500" height="500" alt="revobanner" src="https://github.com/user-attachments/assets/456edd0c-02b5-48dc-b96e-46b58783921f" />
<br><br>
<b><p align="center">A simple browser designed to maximise efficiency. Get work done, fast.</p></b>

## What can Revo do?
All the basic things!
- Navigation (back/forward/reload)
- Shortcuts (Ctrl+T, Ctrl+W)
- Context Menus
- Saving Tabs
- Omnibox (search & URLs)
- and of course, tab creation and destruction!

## How can I install Revo?
Simply head over to the [Releases](https://github.com/solarcosmic/RevoBrowser/releases/tag/1.0.0) tab and download the Windows exe and run it to set it up.

## How can I build Revo from scratch?
*(These steps assume that you have Git and NodeJS pre-installed)*
Run these commands in a terminal:
```bash
git clone https://github.com/solarcosmic/RevoBrowser.git
cd RevoBrowser
npm i
npm run app:dist
```
You will then find the built executable (.exe) in the /dist folder.

## How does Revo work?
Revo uses Electron, an app-building framework, which runs Chromium. Revo then uses Electron's `WebView` element to draw new tabs.
