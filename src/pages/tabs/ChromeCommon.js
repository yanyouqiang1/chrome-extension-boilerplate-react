//获取当前窗口下的tabs，除去自己
export async function getCurrentTabsNoActive() {
    let query = {
        windowId: chrome.windows.WINDOW_ID_CURRENT,
        active: false
    }
    let tabs = await chrome.tabs.query(query)
    return tabs
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