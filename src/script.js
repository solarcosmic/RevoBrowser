/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/
import { utils, tabs, elements } from "library/packman";

// Variables
const lowcatcher = document.getElementById("lowcatcher");
const catcher = document.getElementById("catcher");
const navcatcher = document.getElementById("nav-area");
const shiftPanel = document.getElementById("shift-panel");

const topbar = document.getElementById("topbar");
const appbar = document.getElementById("appbar");
const navigations = document.getElementById("navigations");

var focusedTabId = 1;
var tabInc = 0;
var appbarHideTimer = null;

function showAppbar() {
    clearTimeout(appbarHideTimer);
    appbar.style.display = "flex";
};

function delayAppbar() {
    clearTimeout(appbarHideTimer);
    appbarHideTimer = setTimeout(() => {
        appbar.style.display = "none";
    }, 100);
};

lowcatcher.addEventListener("mouseenter", showAppbar);
lowcatcher.addEventListener("mouseleave", delayAppbar);
appbar.addEventListener("mouseenter", showAppbar);
appbar.addEventListener("mouseleave", delayAppbar);

// URL Bar: Mouse Enter and Leave
catcher.addEventListener("mousemove", (event) => {
    topbar.style.display = "flex";
});
catcher.addEventListener("mouseleave", (event) => {
    topbar.style.display = "none";
});

// App Drawer: Mouse Enter and Leave
lowcatcher.addEventListener("mousemove", (event) => {
    appbar.style.display = "flex";
});
lowcatcher.addEventListener("mouseleave", (event) => {
    appbar.style.display = "none";
});

// Navigation: Mouse Enter and Leave
navcatcher.addEventListener("mousemove", (event) => {
    navigations.style.display = "flex";
});
navcatcher.addEventListener("mouseleave", (event) => {
    navigations.style.display = "none";
});

document.getElementById("new-tab-button").addEventListener("click", () => {
    const tab = tabs.createTab("https://google.com");
    requestAnimationFrame(() => { // Adds delay to make sure the tab has been made before focusing it
        tabs.focusTab(tab);
    });
});

/* https://stackoverflow.com/a/53637828 */
function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
};

document.getElementById("topbar").addEventListener("click", () => {
    document.getElementById("url-text").focus();
});

catcher.addEventListener("click", (evt) => {
    evt.stopPropagation();
    document.getElementById("genuine-omnibox").style.display = "block";
});

document.addEventListener("click", (evt) => {
    const isClickInside = document.getElementById("genuine-omnibox").contains(evt.target);
    if (!isClickInside) {
        document.getElementById("genuine-omnibox").style.display = "none";
    }
});

// Back, Forward, and Refresh Navigation
document.getElementById("nav-back").addEventListener("click", () => {
    const focusedTab = tabs.getActiveTab();
    if (!focusedTab?.view) return; // If the WebView doesn't exist, don't continue

    if (focusedTab.view.canGoBack()) focusedTab.view.goBack();
});

document.getElementById("nav-forward").addEventListener("click", () => {
    const focusedTab = tabs.getActiveTab();
    if (!focusedTab?.view) return; // If the WebView doesn't exist, don't continue

    if (focusedTab.view.canGoForward()) focusedTab.view.goForward();
});

document.getElementById("nav-refresh").addEventListener("click", () => {
    const focusedTab = tabs.getActiveTab();
    if (!focusedTab?.view) return; // If the WebView doesn't exist, don't continue

    focusedTab.view.reload(); // Reloads the WebView
});

// IPC Handlers
window.revoAPI.openNewTab((url) => {
    tabs.createTab(url);
});

window.revoAPI.onToggleShift((val) => {
    shiftPanel.style.display = val ? "none" : "block"; // If true, display = none, otherwise display = block
});

// TODO: add support for maximise resize
window.revoAPI.onWindowResized(() => {
    console.log("Window resized");
    utils.renderCatcherWidth();
});

window.revoAPI.onMouseClick((x, y) => {
    const omnibox = elements.id("genuine-omnibox");
    const element = document.elementFromPoint(x, y);

    // Checks to make sure the user is not clicking on the omnibox
    if (element.parentElement.id == "omnibox-suggestions" ||
        element.id == "genuine-omnibox" ||
        element.closest("#input-box") ||
        element.id == "input-box")
    return;

    // If the omnibox is visible, set its display to none
    if (omnibox.style.display == "block") omnibox.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    tabs.loadSavedTabs();
    localStorage.setItem("revo:clean_exit", false);
});

window.addEventListener("beforeunload", () => {
    tabs.saveTabs();
    localStorage.setItem("revo:clean_exit", true);
})