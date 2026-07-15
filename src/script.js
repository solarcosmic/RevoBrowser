var focusedTabId = 1;
var tabInc = 0;
import { utils, tabs } from "library/packman";
utils.testing();



function createTabButton(tabId, favicon) {
    if (document.getElementById("favbtn-tabid-" + tabId)) {
        const found = document.getElementById("favimg-tabid-" + tabId);
        if (favicon) found.src = favicon;
        console.log("Favicon trigger: " + favicon);
        return found;
    }
    const btn = document.createElement("button");
    const favimg = document.createElement("img");
    favimg.id = "favimg-tabid-" + tabId;
    favimg.style.width = "32px";
    favimg.style.height = "32px";
    favimg.src = favicon || "";
    btn.appendChild(favimg);
    btn.id = "favbtn-tabid-" + tabId;
    document.getElementById("tabs").appendChild(btn);
    btn.addEventListener("click", () => {
        console.log("click!");
        focusTab(tabId);
    })
    return btn;
}

function focusTab(tabId) {
    const tab = getTabObjectById(tabId);
    focusedTabId = tab.id;
    hideAllTabs();
    if (tab.states.hasLoaded) updateMetadata(tab);
    tab.view.style.display = "flex";
}

function updateMetadata(tab) {
    document.getElementById("url-text-drawer").textContent = truncateString(tab.view.getTitle(), 75);
    document.getElementById("url-text").textContent = truncateString(new URL(tab.view.getURL()).hostname, 75);
}

function hideAllTabs() {
    const views = document.getElementById("webviews");
    for (const item of views.children) {
        item.style.display = "none";
    }
}

function getTabObjectById(tabId) {
    for (const item of tabs) {
        if (item.id == tabId) return item;
    }
    return null;
}

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
        /*catcher.style.pointerEvents = "none";*/
    })
    catcher.addEventListener("mouseleave", (event) => {
        document.getElementById("topbar").style.display = "none";
        /*catcher.style.pointerEvents = "auto";*/
    })
    lowcatcher.addEventListener("mousemove", (event) => {
        document.getElementById("appbar").style.display = "flex";

        /*catcher.style.pointerEvents = "none";*/
    })
    lowcatcher.addEventListener("mouseleave", (event) => {
        document.getElementById("appbar").style.display = "none";
        /*catcher.style.pointerEvents = "auto";*/
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
        focusTab(tab.id);
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