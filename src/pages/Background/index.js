import {
    createUrls,
    getConfig,
    getCurrentTab, getCurrentTabsNoActive, getStorage_requestRevise,
} from "../Function/chromeCommon";
import {freshNotify} from "../Function/alarmNotify";

//消息格式
/*const messageFormat = {
    type: "remind",
    data: {}
}*/

chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`);
    if (command == 'add-tabs') {
        //添加标签页
        getCurrentTab().then(tabs => {
            //发送消息
            const message = {
                type: "add-tabs",
                data: "success"
            }
            chrome.tabs.sendMessage(tabs[0].id, message);
        })
    }
    if (command == 'injectEdit') {
        getCurrentTab().then(tabs => {
            //发送消息
            const message = {
                type: "injectEdit",
                data: "success"
            }
            chrome.tabs.sendMessage(tabs[0].id, message);
        })
    }
    if (command == 'showCookies') {
        getCurrentTab().then(tabs => {
            //发送消息
            chrome.cookies.getAll({}, cookies => {
                const message = {
                    type: "showCookies",
                    data: cookies
                }
                chrome.tabs.sendMessage(tabs[0].id, message);
            })

        })
    }
});


chrome.runtime.onStartup.addListener(() => {
    freshNotify();
    console.log("开启闹钟");
})


chrome.runtime.onMessage.addListener((request, sender, res) => {
    /*
    request = {
        type: "",
        data: ""
    }*/
    if (request.type == 'requestRuleFresh') {
        freshRequestRule();
        console.log("刷新规则")
    }
})

function freshRequestRule(){
    getStorage_requestRevise(datas=>{
        console.log("webRequest启动")
        datas = datas || []
        datas.forEach(item=>{
            chrome.webRequest.onCompleted.addListener((_) => {
                console.log("触发了",item.url)
                return item.data
            }, item.url)
        })

    })
}
const PICK_JSON='pick_json'
const APPEND_TEXT='append_text'
const BEIDOU='BEIDOU'
const CMDB='CMDB'
chrome.contextMenus.create({
    type: 'normal',
    title: '挑选JSON',
    id: PICK_JSON,
    contexts: ['all'],
}, function () {
    console.log('contextMenus are create.');
});
chrome.contextMenus.create({
    type: 'normal',
    title: '追加文本',
    id: APPEND_TEXT,
    contexts: ['all'],
}, function () {
    console.log('contextMenus are create.');
});
chrome.contextMenus.create({
    type: 'normal',
    title: '北斗搜索',
    id: BEIDOU,
    contexts: ['all'],
}, function () {
    console.log('contextMenus are create.');
});
chrome.contextMenus.create({
    type: 'normal',
    title: 'CMDB搜索',
    id: CMDB,
    contexts: ['all'],
}, function () {
    console.log('contextMenus are create.');
});

var lastAppendJsonShow;

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case PICK_JSON:
            const message = {
                type: "selectText",
                data: info.selectionText
            }
            //创建tab
            chrome.tabs.create({
                url: "jsonshow.html"
            }).then(tab=>{
                //延迟1秒发送
                setTimeout(function() {
                    chrome.tabs.sendMessage(tab.id, message);
                }, 1* 1000);

            })
            break
        case APPEND_TEXT:
            //查找打开的标签页中是否有无jsonshow页面
            //如果有，以上次保存的lastJsonShow的为准。没有则创建
            getCurrentTabsNoActive().then(tabs=>{
                //将要发送数据
                //查找打开的标签页中是否有无jsonshow页面
                let filter = tabs.map(tab=>tab.url).filter(url=>url.includes("jsonshow.html?append=1"));
                if (filter.length>0){
                    //存在
                    const message = {
                        type: "appendText",
                        data: info.selectionText
                    }
                    chrome.tabs.sendMessage(lastAppendJsonShow.id, message);
                }else{
                    //不存在
                    const message = {
                        type: "appendText",
                        data: info.selectionText
                    }
                    //创建tab
                    chrome.tabs.create({
                        url: "jsonshow.html?append=1"
                    }).then(tab=>{
                        //延迟1秒发送
                        setTimeout(function() {
                            lastAppendJsonShow = tab
                            chrome.tabs.sendMessage(tab.id, message);
                        }, 1* 1000);

                    })
                }

            })
            break
        case BEIDOU:
            getConfig(config=>{
                let url = `${config['beidou']}?append=${info.selectionText}`
                createUrls([url])
            })
            break

        case CMDB:
            getConfig(config=>{
                let url = config['cmdb'].replace('{keyword}',info.selectionText)
                createUrls([url])
            })
            break
    }
})

// freshRequestRule();



