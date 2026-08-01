/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/
import { utils, tabs, elements } from "library/packman";

// Variables
const lowcatcher = elements.id("lowcatcher");
const catcher = elements.id("catcher");
const navcatcher = elements.id("nav-area");
const shiftPanel = elements.id("shift-panel");

const topbar = elements.id("topbar");
const appbar = elements.id("appbar");
const navigations = elements.id("navigations");

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

elements.id("new-tab-button").addEventListener("click", () => {
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

elements.id("topbar").addEventListener("click", () => {
    elements.id("url-text").focus();
});

catcher.addEventListener("click", (evt) => {
    evt.stopPropagation();
    elements.id("genuine-omnibox").style.display = "block";
});

document.addEventListener("click", (evt) => {
    const isClickInside = elements.id("genuine-omnibox").contains(evt.target);
    if (!isClickInside) {
        elements.id("genuine-omnibox").style.display = "none";
    }
});

// Back, Forward, and Refresh Navigation
elements.id("nav-back").addEventListener("click", () => {
    const focusedTab = tabs.getActiveTab();
    if (!focusedTab?.view) return; // If the WebView doesn't exist, don't continue

    if (focusedTab.view.canGoBack()) focusedTab.view.goBack();
});

elements.id("nav-forward").addEventListener("click", () => {
    const focusedTab = tabs.getActiveTab();
    if (!focusedTab?.view) return; // If the WebView doesn't exist, don't continue

    if (focusedTab.view.canGoForward()) focusedTab.view.goForward();
});

elements.id("nav-refresh").addEventListener("click", () => {
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
    window.revoStore.set("clean_exit", false);
    //localStorage.setItem("revo:clean_exit", false);
});

window.addEventListener("beforeunload", () => {
    tabs.saveTabs();
    window.revoStore.set("clean_exit", true);
    //localStorage.setItem("revo:clean_exit", true);
})