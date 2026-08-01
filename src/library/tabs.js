/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/
import { utils, elements } from "library/packman";

export var tabs = []; // Where all the tab objects are stored
export var focusedTabId;

const views = elements.id("webviews");
const tabButtons = elements.id("tabs");
const urlBox = elements.id("omnibox-input-text");
const omniboxSuggestions = elements.id("omnibox-suggestions");
const appbar = elements.id("appbar");
const lowcatcher = elements.id("lowcatcher");
const appbarHitbox = elements.id("appbar-insert");

/*
 * Creates a tab, opening a URL; namely its object and the WebView itself.
 * Includes a tab button via createTabButton().
 * 
 * url: The URL to automatically go to when the tab is created (default: "https://google.com")
 * focus: Whether the tab should automatically be in focus (default: true)
 * forceId: Whether you want a UUID to be automatically applied instead of randomly generated
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
export function createTab(url = "https://google.com", focus = true, forceId) {
    if (tabs.length >= 10) return; // Maximum of 10 tabs only

    const tabId = crypto.randomUUID(); // Random UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const tabIdString = "tab_" + tabId; // Used in the DOM (tab_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

    const tab = {
        id: forceId || tabId,
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
    tab["button"] = createTabButton(tab); // Creates a tab button that appears in the app drawer
    views.appendChild(tab.view); // Adds the WebView object to the DOM

    registerTabListeners(tab); // Registers all relevant events (e.g. favicon changes)
    if (focus) focusTab(tab); // Sets the newly created tab to be the one in focus

    utils.renderCatcherWidth();
    return tab;
}



/*
 * Creates a tab button in the App Drawer.
 * Also serves as a function that updates the favicon of an existing tab button via tab object.
 * 
 * tab: Tab object (see createTab for more details)
 * favicon: If provided, the existing button will update its favicon
*/
export function createTabButton(tab, favicon) {
    const tabId = tab.id;
    if (!tabId) {
        throw Error("No tab ID found!");
        return;
    }

    const buttonId = "favbtn-tabid-" + tabId;
    const imageId = "favimg-tabid-" + tabId;
    const relevantButton = elements.id(buttonId);

    if (relevantButton) { // If the button already exists
        const faviconImage = elements.id(imageId);
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
 * Closes a tab and cleans it up (e.g. removes button, its tab object)
 * 
 * tab: Tab object (see createTab for more details)
*/
export function closeTab(tab) {
    if (tabs.length <= 1) return;
    const index = tabs.indexOf(tab);
    const button = getTabButtonById(tab.id);
    if (button) button.remove();

    if (tab.view) tab.view.remove();
    tabs.splice(index, 1);

    if (focusedTabId == tab.id) { // If the currently focused tab is the tab closed
        const tabNext = tabs[index] || tabs[index-1] || null;
        if (tabNext) focusTab(tabNext);
    }
    utils.renderCatcherWidth();
}

/*
 * Gets a tab's button by its ID.
 *
 * id: The tab ID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
*/
export function getTabButtonById(id) {
    const button = elements.id("favbtn-tabid-" + id);
    if (button) return button;
    return null;
}

window.revoAPI.onCloseActiveTab(() => {
    const active = getActiveTab();
    if (active) closeTab(active);
})

/*
 * Registers all events for tabs, including when to change icons, titles, etc.
 * REQUIRES: Tab object
*/
export function registerTabListeners(tab) {
    var isFaviconUpdated = false;
    var faviconTimeout;
    /* Page Title Updated */
    tab.view.addEventListener("page-title-updated", (e) => {
        if (focusedTabId == tab.id) utils.updateMetadata(tab); // Updates titles IF the focused tab is the tab itself
        utils.navigationColourCheck();
    });
    /* DOM Ready */
    tab.view.addEventListener("dom-ready", (e) => {
        tab.states.hasLoaded = true; // Set the tab state to indicate the tab has loaded
        if (focusedTabId == tab.id) utils.updateMetadata(tab); // Updates titles IF the focused tab is the tab itself
        utils.navigationColourCheck();
    });
    tab.view.addEventListener("did-start-navigation", (e) => {
        if (!e.isMainFrame || e.isInPlace) return; // prevents IFrames from triggering this event & ignores #hashes
        isFaviconUpdated = false;
        clearTimeout(faviconTimeout);
        console.log("NAVIGATION STARTED");
        createTabButton(tab, "../assets/Rolling@1x-1.0s-200px-200px-thick.gif"); // Does not remake button, but changes favicon
        utils.navigationColourCheck();

        faviconTimeout = setTimeout(() => {
            if (!isFaviconUpdated) {
                const googleApi = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(tab.view.getURL()).hostname}`;
                createTabButton(tab, googleApi);
                isFaviconUpdated = true;
                console.log("RELAY: Page took too long to load, relaying to fallback favicon loader");
            }
        }, 10000);
    });
    /* Navigation Started */
    tab.view.addEventListener("did-start-loading", (e) => {
        if (!tab.view) return;
        if (isFaviconUpdated) return;
        console.log("STARTED LOADING");
        //
        utils.navigationColourCheck();
        // If the favicon has already updated, continue no further
    });
    /* Page Finished Loading */
    tab.view.addEventListener("did-finish-load", (e) => {
        if (!isFaviconUpdated && !tab.view.isLoading()) {
            // The below code retrieves the favicon of a webpage using Google's API.
            // This is primarily used as a fallback, in case page-favicon-updated doesn't work properly.
            const googleApi = `https://www.google.com/s2/favicons?sz=64&domain=${tab.view.getURL()}`;
            createTabButton(tab, googleApi);
            isFaviconUpdated = true;
            console.log("USED BACKUP FAVICON");
            utils.navigationColourCheck();
        }
    });
    tab.view.addEventListener("did-fail-load", (e) => {
        console.log("Uh oh! Tab failed to load");
    });
    tab.view.addEventListener("render-process-gone", (evt, details) => {
        console.log(`Render process gone! Reason: ${details.reason} with exit code ${details.exitCode}`);
    })
    /* Page Favicon Updated */
    tab.view.addEventListener("page-favicon-updated", (e) => {
        //if (isFaviconUpdated) return; // If the favicon has already updated, continue no further
        //tab.states.isLoading = tab.view.isLoading();
        clearTimeout(faviconTimeout);
        const favicon = e.favicons[0]; // Get the first favicon in the favicon list
        console.log("ALERT: NEW FAVICON - " + favicon);
        if (favicon) {
            createTabButton(tab, favicon); // Calls createTabButton, which updates the favicon rather than creating a button
            isFaviconUpdated = true; // A check to stop future updates
            console.log("loaded favicon: " + favicon);
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
    utils.navigationColourCheck(tab);
    tab.view.style.display = "flex";
}

/*
 * Loops through all tabs and hides them.
*/
export function hideAllTabs() {
    const views = elements.id("webviews");
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

export async function suggestSearch() {
    if (urlBox.value.trim() == "") {  // Avoids nothing and whitespace from continuing further
        clearSuggestionButtons();
        return;
    };

    await fetch("https://google.com/complete/search?output=toolbar&q=" + urlBox.value).then(res => {
        if (!res.ok) throw new Error("Suggestion error: " + res.status);
        return res.text();
    }).then(data => {
        handleSearchXml(data);
    })
}

/*
 * A simple helper function to help with converting Google Suggestions API's XML into a JS object.
*/
async function handleSearchXml(data) {
    const thing = await window.revoLibrary.parseXml(data);
    const parsed = JSON.parse(thing);
    const suggestions = parsed.toplevel.CompleteSuggestion;
    if (!suggestions) return;
    createSuggestionButtons(suggestions);
}

/*
 * A simple helper function to clear the suggestion buttons on the omnibox.
*/
async function clearSuggestionButtons() {
    omniboxSuggestions.innerHTML = "";
}

async function createSuggestionButtons(suggestions) {
    clearSuggestionButtons();
    for (const item of suggestions.slice(0, 5)) { // Loop through result, slice to get only first 5 entries
        const suggestion = item.suggestion[0]["$"].data;
        const omniboxItem = utils.createElementWithClass("div", "omnibox-item");
        omniboxItem.textContent = suggestion;
        omniboxSuggestions.appendChild(omniboxItem);

        omniboxItem.addEventListener("click", () => {
            createTab(`https://google.com/search?q=${suggestion}`);
            urlBox.value = "";
            clearSuggestionButtons();
            elements.id("genuine-omnibox").style.display = "none";
        });
        //suggestion[0]["$"].data
    }
}

/*
 * Returns the tab that is currently active.
*/
export function getActiveTab() {
    const tab = getTabObjectById(focusedTabId);
    if (tab) {
        return tab;
    } else {
        return null;
    }
}

export async function saveTabs() {
    var queuedTabs = [];
    for (const tab of tabs) {
        const cachedObject = {
            id: tab.id || crypto.randomUUID(),
            url: tab.view?.getURL() || "https://google.com",
            focus: (tab.id == focusedTabId)
        }
        queuedTabs.push(cachedObject);
    }
    await window.revoStore.set("saved_tabs", queuedTabs);
    //localStorage.setItem("revo:saved_tabs", JSON.stringify(queuedTabs));
};

export async function loadSavedTabs() {
    const queuedTabs = await window.revoStore.get("saved_tabs");
    if (!queuedTabs) return;
    console.log(queuedTabs);

    //const queuedTabs = JSON.parse(queuedTabs);
    if (queuedTabs.length < 1) {
        createTab("https://google.com");
        return;
    }
    for (const item of queuedTabs) {
        createTab(item.url, item.focus, item.id);
    }
}

var typeTime;
const debounceInterval = 500;

urlBox.addEventListener("keyup", () => {
    clearTimeout(typeTime);
    typeTime = setTimeout(suggestSearch, debounceInterval);
})

urlBox.addEventListener("keydown", (e) => {
    clearTimeout(typeTime);
    if (e.key == "Enter" && urlBox.value.trim() != "") {
        if (utils.isValidURL(urlBox.value.trim())) {
            createTab(urlBox.value.trim());
        } else {
            createTab(`https://google.com/search?q=${urlBox.value.trim()}`);
        }
        urlBox.value = "";
        clearSuggestionButtons();
        elements.id("genuine-omnibox").style.display = "none";
    }
});