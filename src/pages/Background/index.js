import {
    getCurrentTab,
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
});

chrome.runtime.onStartup.addListener(() => {
    freshNotify();
    console.log("iiiiiiiiii");
})
// //开启闹钟
// freshNotify();
// console.log("open notify");
