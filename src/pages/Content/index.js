import {render} from "react-dom";
import React from "react";
import 'antd/dist/antd.css';

import NewTabRecord from "./modules/NewTabRecord";


//展示保存标签页
var showDialog

const modelBind =(show,cancel)=>{
    showDialog = show
}

window.onload = () => {
    //追加容器
    var dvObj = document.createElement('div');
    dvObj.id ="app-container"
    document.body.prepend(dvObj)

    render(<NewTabRecord bind={modelBind} />, window.document.querySelector('#app-container'));
}

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type == 'add-tabs') {
            showDialog();
        }
    }
);