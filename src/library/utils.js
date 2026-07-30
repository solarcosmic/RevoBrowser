/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/

import { tabs } from "library/packman";

const navBack = document.getElementById("nav-back");
const navForward = document.getElementById("nav-forward");

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