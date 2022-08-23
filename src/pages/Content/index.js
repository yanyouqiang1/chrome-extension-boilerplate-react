import {render} from "react-dom";
import React from "react";
import 'antd/dist/antd.css';

import NewTabRecord from "./modules/NewTabRecord";


//展示保存标签页
var showDialog

const modelBind = (show, cancel) => {
    showDialog = show
}

//onload 添加事件
function addLoadEvent(func) {
    const oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func
    } else {
        window.οnlοad = function () {
            oldonload();
            func();
        }
    }

}

const renderNewRecord = () => {
    console.log("injected")
    //追加容器
    var dvObj = document.createElement('div');
    dvObj.id = "app-container"
    document.body.append(dvObj)

    render(<NewTabRecord bind={modelBind}/>, window.document.querySelector('#app-container'));
}

addLoadEvent(renderNewRecord)

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type == 'add-tabs') {
            showDialog();
        }

        if (message.type == 'injectEdit') {
            document.body.contentEditable='true'
            alert('inject success')
        }
    }
);