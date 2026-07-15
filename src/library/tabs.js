
export var tabs = []; // Where all the tab objects are stored

const views = document.getElementById("webviews");

/*
 * Creates a tab, opening a URL; namely its object and the WebView itself.
 * Includes a tab button via createTabButton().
 * 
 * url: The URL to automatically go to when the tab is created (default: "https://hackclub.com")
 * focus: Whether the tab should automatically be in focus (default: true)
 * 
 * Tab objects contain the following:
 * - id: Random UUID (e.g. 48316277-2f3b-48c0-bc66-3d758f895c1c)
 * - view: WebView object (main browser object)
 * - states:
 *   - isLoading: Set to true when the view is currently navigating (default: false),
 *   - hasLoaded: Set to true when the page has completed loading (default: false),
 *   - pinned: Set to true when the tab is pinned (default: false),
 *   - faviconLoaded: Set to true when the page has loaded enough for a favicon to load (default: false)
*/
export function createTab(url = "https://hackclub.com", focus = true) {
    const tabId = crypto.randomUUID(); // Random UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const tabIdString = "tab_" + tabId; // Used in the DOM (tab_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

    const tab = {
        id: tabId,
        view: document.createElement("webview"),
        states: {
            isLoading: false,
            hasLoaded: false,
            pinned: false,
            faviconLoaded: false
        }
    }

    tab.view.src = url; // Changes the URL of the tab to what was given
    tab.view.setAttribute("id", tabIdString); // Updates the DOM ID so we can reference it in the future

    tabs.push(tab); // Pushes the tab object to the tabs array
    createTabButton(tabId); // Creates a tab button that appears in the app drawer
    views.appendChild(tab.view); // Adds the WebView object to the DOM

    registerTabListeners(tab); // Registers all relevant events (e.g. favicon changes)
    if (focus) focusTab(tab); // Sets the newly created tab to be the one in focus
    return tab;
}

/*
 * Registers all events for tabs, including when to change icons, titles, etc.
 * REQUIRES: Tab object
*/
export function registerTabListeners(tab) {
    var isFaviconUpdated = false;
    tab.view.addEventListener("page-title-updated", (e) => {
        if (focusedTabId == tab.id) updateMetadata(tab); // Updates titles IF the focused tab is the tab itself
    });
    tab.view.addEventListener("dom-ready", (e) => {
        tab.states.hasLoaded = true;
        if (focusedTabId == tab.id) updateMetadata(tab); // Updates titles IF the focused tab is the tab itself
    });
    tab.view.addEventListener("did-start-navigation", (e) => {
        if (!e.isMainFrame) return; // prevents IFrames from triggering this event
        createTabButton(tab.id, "../assets/loading2.gif"); // Does not remake button, but changes favicon
        isFaviconUpdated = false;
    });
    tab.view.addEventListener("did-finish-load", (e) => {
        if (!isFaviconUpdated) {
            // fallback
            const googleApi = `https://www.google.com/s2/favicons?domain=${tab.view.getURL()}`;
            createTabButton(tab.id, googleApi);
        }
    });
    tab.view.addEventListener("page-favicon-updated", (e) => {
        console.log("focused tab - favicon has changed");
        if (isFaviconUpdated) {
            console.log("tab already has favicon, returning");
            return;
        }
        const favicon = e.favicons[0];
        if (favicon) {
            console.log("create button: favicon thing " + favicon);
            createTabButton(tabId, favicon);
            isFaviconUpdated = true;
        }
    });
    focusTab(tab.id);
    return tab;
}