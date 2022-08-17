import {
    getCurrentTab,
    getStorage_newTabs_tags,
    getStorage_record_key,
    setStorage_record_key
} from "../Function/chromeCommon";
import randomstring from "rdm-str";

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
            const key = randomstring(7);
            const record = {
                key: key,
                name: "请修改",
                title: tabs[0].title,
                address: tabs[0].url,
                remark: "",
                tags: []
            }
            //save
            getStorage_record_key(records => {
                records = records ? records : []
                records.unshift(record)
                setStorage_record_key(records)
            })

            //发送消息
            const message = {
                type: "remind",
                data: "success"
            }
            chrome.tabs.sendMessage(tabs[0].id, message);
        })
        console.log("process success")
    }

});