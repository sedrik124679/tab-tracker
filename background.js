let visitedTabs = [];
let tabs = [];
let currentTab;
let openedWindows = [];
let domainName;
let issueKey;
chrome.runtime.onMessage.addListener( function (url, sender, onSuccess) {
    if (url.message) {
        return true
    }
    if (url.domainName && url.issueKey) {
        domainName = url.domainName;
        issueKey = url.issueKey;
        return true
    }
    // if(url.domainName && url.issueKey) {
    //
    //     const bodyData = {
    //         "body": {
    //             "type": "doc",
    //             "version": 1,
    //             "content": [
    //                 {
    //                     "type": "paragraph",
    //                     "content": [
    //                         {
    //                             "text": JSON.stringify(tabs),
    //                             "type": "text"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     }
    //
    //     fetch(`https://${url.domainName}.atlassian.net/rest/api/3/issue/${url.issueKey}/comment`, {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(bodyData)
    //     })
    //
    //     return true
    // }
    return true
})
function updateSummaryTime() {
    setInterval(backgroundCheck, 3000);
}


let timer;

async function getDataFromChromeStorage(key) {
    const data = await chrome.storage.sync.get(key)
    return data
}

async function backgroundCheck() {
    clearTimeout(timer);

    chrome.windows.getAll((e) => {
        openedWindows = e.map(w => {
            return {id: w.id, focused: w.focused}
        })
    })

    if (openedWindows) {
        tabs = []
        chrome.storage.sync.clear()

        visitedTabs.forEach(visitedTab => {
            if (visitedTab.focused && visitedTab.active) {
                visitedTab.spendTimeOnPage += 3
            }
        })

        for (const w of openedWindows) {
            const contents = await chrome.windows.get(w.id, {populate: true})
            contents.tabs.forEach(t => {
                if (visitedTabs?.find(tab => tab.id === t.id)){
                    console.log('present')
                } else {
                    visitedTabs.push({id: t.id, title: t.title, active: t.active, url: t.url, focused: w.focused, visitedTime: new Date().toISOString(), spendTimeOnPage: 0})
                }
                tabs.push({id: t.id, title: t.title, active: t.active, url: t.url, focused: w.focused})
            })
        }
        console.log(visitedTabs, 'visitedTabs')
        chrome.storage.sync.set({'tabs': tabs})
    }
    timer = setTimeout(backgroundCheck, 3000);
}

setInterval(() => {
    if (domainName && issueKey) {
        addCommentToJira(domainName, issueKey, tabs)
    }
}, 7000)

function addCommentToJira(domainName, issueKey, tabs) {
    const bodyData = {
        "body": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "text": JSON.stringify(tabs),
                            "type": "text"
                        }
                    ]
                }
            ]
        }
    }

    fetch(`https://${domainName}.atlassian.net/rest/api/3/issue/${issueKey}/comment`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
}

backgroundCheck()
updateSummaryTime();