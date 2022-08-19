import {
    getCurrentTab,
} from "../Function/chromeCommon";


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
});