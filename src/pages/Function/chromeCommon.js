//获取当前窗口下的tabs，除去自己
export async function getCurrentTabsNoActive() {
  let query = {
    windowId: chrome.windows.WINDOW_ID_CURRENT,
    active: false
  };
  let tabs = await chrome.tabs.query(query);
  return tabs;
}

//获取当前tab
export async function getCurrentTab() {
  let query = {
    windowId: chrome.windows.WINDOW_ID_CURRENT,
    active: true
  };
  let tabs = await chrome.tabs.query(query);
  return tabs;
}


export function createUrls(urls) {
  for (const url of urls) {
    chrome.tabs.create({
      url: url
    });
  }
}

// ########## 睡眠时间
export const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

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
    chrome.storage.local.set(object);
  }

}


//######## tabs
const newTabs_tags_key = "newTabs_tags_key";

export function getStorage_newTabs_tags(callback) {
  chrome.storage.local.get([newTabs_tags_key], result => {
    callback(result.newTabs_tags_key);
  });
}

export function setStorage_newTabs_tags(value) {
  chrome.storage.local.set({ newTabs_tags_key: value });
}

//######## record
const newTabs_record_key = "newTabs_record_key";

export function getStorage_record_key(callback) {
  chrome.storage.local.get([newTabs_record_key], result => {
    callback(result.newTabs_record_key);
  });
}

export function setStorage_record_key(value) {
  chrome.storage.local.set({ newTabs_record_key: value });
}

//######## scenario
const scenario_key = "scenario_key";

export function getStorage_scenario(callback) {
  chrome.storage.local.get([scenario_key], result => {
    callback(result.scenario_key);
  });
}

export function setStorage_scenario(value) {
  chrome.storage.local.set({ scenario_key: value });
}

//######## textRecord
const textRecord_key = "textRecord_key";

export function getStorage_textRecord(callback) {
  chrome.storage.local.get([textRecord_key], result => {
    callback(result.textRecord_key);
  });
}

export function setStorage_textRecord(value) {
  chrome.storage.local.set({ textRecord_key: value });
}


//######## textRecord
const fragement_key = "fragement_key";

export function getStorage_fragement(callback) {
  chrome.storage.local.get([fragement_key], result => {
    callback(result.fragement_key);
  });
}

export function setStorage_fragement(value) {
  chrome.storage.local.set({ fragement_key: value });
}


//######## fetchList
const fetch_key = "fetch_key";

export function getStorage_fetch(callback) {
  chrome.storage.local.get([fetch_key], result => {
    callback(result.fetch_key);
  });
}

export function setStorage_fetch(value) {
  chrome.storage.local.set({ fetch_key: value });
}

//######## todolist
const todolist_key = "todolist_key";

export function getStorage_todolist(callback) {
  chrome.storage.local.get([todolist_key], result => {
    callback(result.todolist_key);
  });
}

export function setStorage_todolist(value) {
  chrome.storage.local.set({ todolist_key: value });
}

//######## notify
const notify_key = "notify_key";

export function getStorage_notify(callback) {
  chrome.storage.local.get([notify_key], result => {
    callback(result.notify_key);
  });
}

export function setStorage_notify(value) {
  chrome.storage.local.set({ notify_key: value });
}

//######## notify
const awk_key = "awk_key";

export function getStorage_awk(callback) {
  chrome.storage.local.get([awk_key], result => {
    callback(result.awk_key);
  });
}

export function setStorage_awk(value) {
  chrome.storage.local.set({ awk_key: value });
}