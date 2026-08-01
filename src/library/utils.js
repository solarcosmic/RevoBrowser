/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/
import { tabs, elements } from "library/packman";

const navBack = elements.id("nav-back");
const navForward = elements.id("nav-forward");
const appbar = elements.id("appbar");
const lowcatcher = elements.id("lowcatcher");
const appbarHitbox = elements.id("appbar-insert");
const urlBoxText = elements.id("url-text");
const titleDrawerText = elements.id("url-text-drawer");

/*
 * Updates the URL text in the URL bar and the page title in the app drawer.
*/
export function updateMetadata(tab) {
    titleDrawerText.textContent = truncateString(tab.view.getTitle(), 75);
    urlBoxText.value = truncateString(new URL(tab.view.getURL()).hostname, 75);
}

/* https://stackoverflow.com/a/53637828 */
export function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

/*
 * A helper function that creates an element with a class and returns it.
*/
export function createElementWithClass(type = "div", className) {
    const element = document.createElement(type);
    if (className) element.classList.add(className);
    return element;
}

/*
 * A helper function that creates an element with an ID and returns it.
*/
export function createElementWithId(type = "div", id) {
    const element = document.createElement(type);
    if (id) element.setAttribute("id", id);
    return element;
}

/*
 * 'Enables' and 'disables' the back and forward buttons if not available in the active tab.
*/
export function navigationColourCheck(tab = tabs.getActiveTab()) {
    if (!tab?.view) return; // If the tab's view (WebView) does not exist, return
    if (!tab.states.hasLoaded) return; // If the tab has not loaded, return
    if (tab.view.canGoBack()) {
        navBack.classList.add("svg-white");
    } else {
        navBack.classList.remove("svg-white");
    }
    if (tab.view.canGoForward()) {
        navForward.classList.add("svg-white");
    } else {
        navForward.classList.remove("svg-white");
    }
}

/*
 * Updates the width of the app drawer's catcher (hitbox) to be the same as the app drawer.
*/
export function renderCatcherWidth() {
    const displayState = appbar.style.display; // Log the original display state of the appbar
    appbar.style.display = "flex"; // Make it visible briefly (hacky method)
    const width = appbarHitbox.offsetWidth || 500; // Capture the width of the appbar in pixels
    appbar.style.display = displayState; // Revert the appbar to its original display state

    lowcatcher.style.width = `${width}px`; // Set the appbar hitbox's width to the width of the appbar
}

/*
 * A simple helper function to detect if a given string is a valid URL.
 * Initial source: https://www.turing.com/kb/how-to-validate-urls-in-javascript
 * 
 * url: The URL as a string
*/
export function isValidURL(url) {
    try {
        return Boolean(new URL(url));
    } catch (e) {
        return false;
    }
};