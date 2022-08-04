//获取当前窗口下的tabs，除去自己
export async function getCurrentTabsNoActive() {
    let query = {
        windowId: chrome.windows.WINDOW_ID_CURRENT,
        active: false
    }
    let tabs = await chrome.tabs.query(query)
    return tabs
}

export function createUrls(urls){
    for (const url of urls) {
        chrome.tabs.create({
            url: url
        });
    }
}

//######## tabs
const newTabs_tags_key = 'newTabs_tags_key'

export function getStorage_newTabs_tags(callback) {
    chrome.storage.local.get([newTabs_tags_key], result => {
        callback(result.newTabs_tags_key)
    })
}

export function setStorage_newTabs_tags(value) {
    chrome.storage.local.set({newTabs_tags_key: value})
}


const newTabs_record_key = 'newTabs_record_key'

export function getStorage_record_key(callback) {
    chrome.storage.local.get([newTabs_record_key], result => {
        callback(result.newTabs_record_key)
    })
}

export function setStorage_record_key(value) {
    chrome.storage.local.set({newTabs_record_key: value})
}

//######## scenario
const newTabs_scenario_key = 'newTabs_scenario_key'

export function getStorage_scenario(callback) {
    chrome.storage.local.get([newTabs_scenario_key], result => {
        callback(result.newTabs_scenario_key)
    })
}

export function setStorage_scenario(value) {
    chrome.storage.local.set({newTabs_scenario_key: value})
}

//######## textRecord
const newTabs_textRecord_key = 'newTabs_textRecord_key'

export function getStorage_textRecord(callback) {
    chrome.storage.local.get([newTabs_textRecord_key], result => {
        callback(result.newTabs_textRecord_key)
    })
}

export function setStorage_textRecord(value) {
    chrome.storage.local.set({newTabs_textRecord_key: value})
}