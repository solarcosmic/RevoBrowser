/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/

export function testing() {
    console.log("testing!");
}

export function updateMetadata(tab) {
    document.getElementById("url-text-drawer").textContent = truncateString(tab.view.getTitle(), 75);
    document.getElementById("url-text").textContent = truncateString(new URL(tab.view.getURL()).hostname, 75);
}

/* https://stackoverflow.com/a/53637828 */
export function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}