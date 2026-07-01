const tabs = []
const focusedTabId = 1;

function createTab(url = "https://hackclub.com") {
    /* Tab object */
    const tab = {
        id: 1,
        view: document.createElement("webview"),
        states: {
            isLoading: false,
            hasLoaded: false,
            pinned: false,
            faviconLoaded: false
        }
    }
    tab.view.src = url;
    tabs.push(tab);
    document.getElementById("webviews").appendChild(tab.view);
    tab.view.addEventListener("page-title-updated", (e) => {
        if (focusedTabId == tab.id) {
            /* currently focused */
            console.log("focused tab - title has changed");
            document.getElementById("url-text-drawer").textContent = tab.view.getTitle();
            document.getElementById("url-text").textContent = new URL(tab.view.getURL()).hostname;
        } else {
            console.log("not focused");
        }
    })
    tab.view.addEventListener("page-favicon-updated", (e) => {
        if (focusedTabId == tab.id) {
            /* currently focused */
            console.log("focused tab - favicon has changed");
            const favicon = e.favicons[0];
            if (favicon) {
                //<img id="url-fav-drawer" style="width: 32px; height: 32px;"></img>
                if (!document.getElementById("favbtn-tabid-" + tab.id)) {
                    const btn = document.createElement("button");
                    const favimg = document.createElement("img");
                    favimg.id = "favimg-tabid-" + tab.id;
                    favimg.style.width = "32px";
                    favimg.style.height = "32px";
                    favimg.src = favicon;
                    btn.appendChild(favimg);
                    btn.id = "favbtn-tabid-" + tab.id;
                    document.getElementById("tabs").appendChild(btn);
                    btn.addEventListener("click", () => {
                        console.log("click!");

                    })
                } else {
                    document.getElementById("favimg-tabid-" + tab.id).src = favicon;
                }
            }
            //document.getElementById("url-fav-drawer").src = tab.view.getTitle();
        } else {
            console.log("not focused (favicon)");
        }
    })
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