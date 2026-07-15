const tabs = []
var focusedTabId = 1;
var tabInc = 0;

function createTab(url = "https://hackclub.com") {
    /* Tab object */
    const tabId = tabInc + 1;
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
    tab.view.src = url;
    tab.view.id = "tab_" + tabId;
    tabInc = tabId;
    tabs.push(tab);
    createTabButton(tabId);
    document.getElementById("webviews").appendChild(tab.view);
    var isFaviconUpdated = false;
    tab.view.addEventListener("page-title-updated", (e) => {
        if (focusedTabId == tab.id) updateMetadata(tab);
    });
    tab.view.addEventListener("dom-ready", (e) => {
        tab.states.hasLoaded = true;
        if (focusedTabId == tab.id) updateMetadata(tab);
    });
    tab.view.addEventListener("did-start-navigation", (e) => {
        if (e.isMainFrame) {
            createTabButton(tab.id, "assets/loading2.gif"); // does not remake button, but changes favicon
            isFaviconUpdated = false;
        }
    });
    tab.view.addEventListener("did-finish-load", (e) => {
        if (!isFaviconUpdated) {
            // fallback
            const googleApi = `https://www.google.com/s2/favicons?domain=${tab.view.getURL()}`;
            createTabButton(tab.id, googleApi);
        }
    });
    tab.view.addEventListener("page-favicon-updated", (e) => {
        //if (focusedTabId == tab.id) {
            /* currently focused */
            console.log("focused tab - favicon has changed");
            if (isFaviconUpdated) {
                console.log("tab already has favicon, returning");
                return;
            }
            const favicon = e.favicons[0];
            if (favicon) {
                console.log("create button: favicon thing " + favicon);
                createTabButton(tabId, favicon);
                isFaviconUpdated = true;
                //<img id="url-fav-drawer" style="width: 32px; height: 32px;"></img>
                /*if (!document.getElementById("favbtn-tabid-" + tab.id)) {
                    /*const btn = document.createElement("button");
                    const favimg = document.createElement("img");
                    favimg.id = "favimg-tabid-" + tabId;
                    favimg.style.width = "32px";
                    favimg.style.height = "32px";
                    favimg.src = favicon;
                    btn.appendChild(favimg);
                    btn.id = "favbtn-tabid-" + tab.id;
                    document.getElementById("tabs").appendChild(btn);
                    btn.addEventListener("click", () => {
                        console.log("click!");
                    })
                   console.log("Create button init")
                } else {
                    document.getElementById("favimg-tabid-" + tab.id).src = favicon;
                }*/
            }
            //document.getElementById("url-fav-drawer").src = tab.view.getTitle();
       // } else {
            //console.log("not focused (favicon)");
        //}
    });
    focusTab(tab.id);
    return tab;
}

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

createTab("https://google.com")



document.getElementById("new-tab-button").addEventListener("click", () => {
    const tab = createTab("https://google.com")
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
    createTab(url || "https://google.com");
})