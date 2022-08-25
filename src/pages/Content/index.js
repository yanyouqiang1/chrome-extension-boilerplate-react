import {newTabRecordTest} from "./modules/newTabRecord";

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type == 'add-tabs') {
            console.log("chufa")
            newTabRecordTest();
        }

        if (message.type == 'injectEdit') {
            document.body.contentEditable = 'true'
            alert('inject success')
        }

        if (message.type=='showCookies'){
            message.data.filter
            console.log(message.data)
        }
    }
);