/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/

import { tabs } from "library/packman";

const navBack = document.getElementById("nav-back");
const navForward = document.getElementById("nav-forward");
const appbar = document.getElementById("appbar");
const lowcatcher = document.getElementById("lowcatcher");
const appbarHitbox = document.getElementById("appbar-insert");

export function testing() {
    console.log("testing!");
}

export function updateMetadata(tab) {
    document.getElementById("url-text-drawer").textContent = truncateString(tab.view.getTitle(), 75);
    document.getElementById("url-text").value = truncateString(new URL(tab.view.getURL()).hostname, 75);
}

/* https://stackoverflow.com/a/53637828 */
export function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

export function createElementWithClass(type = "div", className) {
    const element = document.createElement(type);
    if (className) element.classList.add(className);
    return element;
}

export function createElementWithId(type = "div", id) {
    const element = document.createElement(type);
    if (id) element.setAttribute("id", id);
    return element;
}

export function navigationColourCheck(tab = tabs.getActiveTab()) {
    if (!tab?.view) return;
    if (!tab.states.hasLoaded) return;
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