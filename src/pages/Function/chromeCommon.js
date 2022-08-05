//获取当前窗口下的tabs，除去自己
export async function getCurrentTabsNoActive() {
    let query = {
        windowId: chrome.windows.WINDOW_ID_CURRENT,
        active: false
    }
    let tabs = await chrome.tabs.query(query)
    return tabs
}

export function createUrls(urls) {
    for (const url of urls) {
        chrome.tabs.create({
            url: url
        });
    }
}

//######获取所有的缓存
export function getAllStorageData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.local.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}

export function updateAllStorageData(object) {
    if (object) {
        chrome.storage.local.set(object)
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


//######## textRecord
const newTabs_fragement_key = 'newTabs_fragement_key'

export function getStorage_fragement(callback) {
    chrome.storage.local.get([newTabs_fragement_key], result => {
        callback(result.newTabs_fragement_key)
    })
}

export function setStorage_fragement(value) {
    chrome.storage.local.set({newTabs_fragement_key: value})
}