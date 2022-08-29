import {
    getCurrentTab, getStorage_requestRevise,
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


// freshRequestRule();



