/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/

import { utils } from "library/packman";

export var tabs = []; // Where all the tab objects are stored
var focusedTabId;

const views = document.getElementById("webviews");
const tabButtons = document.getElementById("tabs");

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
    createTabButton(tab); // Creates a tab button that appears in the app drawer
    views.appendChild(tab.view); // Adds the WebView object to the DOM

    registerTabListeners(tab); // Registers all relevant events (e.g. favicon changes)
    if (focus) focusTab(tab); // Sets the newly created tab to be the one in focus
    return tab;
}

/*
 * Creates a tab button in the App Drawer.
 * Also serves as a function that updates the favicon of an existing tab button via tab object.
*/
export function createTabButton(tab, favicon) {
    const tabId = tab.id;
    if (!tabId) { throw Error("No tab ID found!"); return; }

    const buttonId = "favbtn-tabid-" + tabId;
    const imageId = "favimg-tabid-" + tabId;
    const relevantButton = document.getElementById(buttonId);

    if (relevantButton) {
        const faviconImage = document.getElementById(imageId);
        if (favicon) faviconImage.src = favicon;
        console.log("Favicon trigger: " + favicon);
        return relevantButton;
    }

    const button = document.createElement("button");
    const faviconImage = document.createElement("img");

    faviconImage.setAttribute("id", imageId);
    faviconImage.style.width = "32px";
    faviconImage.style.height = "32px";
    faviconImage.src = favicon || "";

    button.appendChild(faviconImage);
    button.setAttribute("id", buttonId);
    tabButtons.appendChild(button);

    button.addEventListener("click", () => {
        focusTab(tab);
    })
    return button;
}

/*
 * Registers all events for tabs, including when to change icons, titles, etc.
 * REQUIRES: Tab object
*/
export function registerTabListeners(tab) {
    var isFaviconUpdated = false;
    /* Page Title Updated */
    tab.view.addEventListener("page-title-updated", (e) => {
        if (focusedTabId == tab.id) utils.updateMetadata(tab); // Updates titles IF the focused tab is the tab itself
    });
    /* DOM Ready */
    tab.view.addEventListener("dom-ready", (e) => {
        tab.states.hasLoaded = true; // Set the tab state to indicate the tab has loaded
        if (focusedTabId == tab.id) utils.updateMetadata(tab); // Updates titles IF the focused tab is the tab itself
    });
    /* Navigation Started */
    tab.view.addEventListener("did-start-navigation", (e) => {
        if (!e.isMainFrame) return; // prevents IFrames from triggering this event
        createTabButton(tab, "../assets/loading2.gif"); // Does not remake button, but changes favicon
        isFaviconUpdated = false;
    });
    /* Page Finished Loading */
    tab.view.addEventListener("did-finish-load", (e) => {
        if (!isFaviconUpdated) {
            // The below code retrieves the favicon of a webpage using Google's API.
            // This is primarily used as a fallback, in case page-favicon-updated doesn't work properly.
            const googleApi = `https://www.google.com/s2/favicons?domain=${tab.view.getURL()}`;
            createTabButton(tab, googleApi);
        }
    });
    /* Page Favicon Updated */
    tab.view.addEventListener("page-favicon-updated", (e) => {
        if (isFaviconUpdated) return; // If the favicon has already updated, continue no further
        const favicon = e.favicons[0]; // Get the first favicon in the favicon list
        if (favicon) {
            createTabButton(tab, favicon); // Calls createTabButton, which updates the favicon rather than creating a button
            isFaviconUpdated = true; // A check to stop future updates
        }
    });
    return tab;
}

/*
 * Focuses a tab (requires tab object).
*/
export function focusTab(tab) {
    focusedTabId = tab.id;
    hideAllTabs();
    if (tab.states.hasLoaded) utils.updateMetadata(tab);
    tab.view.style.display = "flex";
}

/*
 * Loops through all tabs and hides them.
*/
export function hideAllTabs() {
    const views = document.getElementById("webviews");
    for (const item of views.children) {
        item.style.display = "none";
    }
}

/*
 * Retrieves a tab object by its ID (UUID).
*/
export function getTabObjectById(tabId) {
    for (const item of tabs) {
        if (item.id == tabId) return item;
    }
    return null;
}