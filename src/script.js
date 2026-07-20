/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/

var focusedTabId = 1;
var tabInc = 0;
import { utils, tabs } from "library/packman";
utils.testing();

let appbarHideTimer = null;

function showAppbar() {
    clearTimeout(appbarHideTimer);
    document.getElementById("appbar").style.display = "flex";
}

function delayAppbar() {
    clearTimeout(appbarHideTimer);
    appbarHideTimer = setTimeout(() => {
        document.getElementById("appbar").style.display = "none";
    }, 100);
}

const lowcatcher = document.getElementById("lowcatcher");
const appbar = document.getElementById("appbar");
const catcher = document.getElementById("catcher");

lowcatcher.addEventListener("mouseenter", showAppbar);
lowcatcher.addEventListener("mouseleave", delayAppbar);
appbar.addEventListener("mouseenter", showAppbar);
appbar.addEventListener("mouseleave", delayAppbar);

    catcher.addEventListener("mousemove", (event) => {
        document.getElementById("topbar").style.display = "flex";
        //catcher.style.pointerEvents = "none";
    })
    catcher.addEventListener("mouseleave", (event) => {
        document.getElementById("topbar").style.display = "none";
        //catcher.style.pointerEvents = "auto";
    })
    lowcatcher.addEventListener("mousemove", (event) => {
        document.getElementById("appbar").style.display = "flex";

        //catcher.style.pointerEvents = "none";
    })
    lowcatcher.addEventListener("mouseleave", (event) => {
        document.getElementById("appbar").style.display = "none";
        //catcher.style.pointerEvents = "auto";
    })
    /*        const checkTop16 = event.clientY <= window.innerHeight / 16;
        if (checkTop16) {
            document.getElementById("topbar").style.display = "block";
        } else {
            document.getElementById("topbar").style.display = "none";
        }*/

tabs.createTab("https://google.com")

document.getElementById("new-tab-button").addEventListener("click", () => {
    const tab = tabs.createTab("https://google.com")
    requestAnimationFrame(() => {
        tabs.focusTab(tab);
    })
})

/* https://stackoverflow.com/a/53637828 */
function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

window.revoAPI.openNewTab((url) => {
    tabs.createTab(url || "https://google.com");
})