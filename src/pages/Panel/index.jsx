import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';

import Panel from './Panel';
import './index.css';
import {Button} from "antd";

const allData = {};

const handleData = (tempRequest) => {
    const {_resourceType, response, request} = tempRequest;
    const {url} = request;
    const {content} = response;
    const [type, mineType] = content.mimeType.split("/"); // image/gif
    const tempVal = {
        type,
        url,
        mineType,
        tempRequest,
    };
    allData[_resourceType]
        ? allData[_resourceType].push(tempVal)
        : (allData[_resourceType] = [tempVal]);
};

chrome.devtools.network.onRequestFinished.addListener(function (request) {
    handleData(request);
    // chrome.runtime.sendMessage({
    //     source: "devtools",
    //     data: allData,
    // });
});

const MyPanel = () => {
    const [result, setResult] = useState('');

    function log(str) {
        chrome.devtools.inspectedWindow.eval(
            `console.log(${str})`
        );
    }
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //     setResult(JSON.stringify(message.data));
    // })
    useEffect(() => {
        setResult(JSON.stringify(allData));
    }, [])

    const test = () => {
        chrome.devtools.network.getHAR(log=>{
            setResult(JSON.stringify(allData));
        }
    )
        // log("send")
        // chrome.runtime.sendMessage({
        //     source: "refreash",
        // });
    }
    return (
        <>
            <Button onClick={test}>刷新</Button>
            <textarea value={result}></textarea>
        </>

    )
}


render(<MyPanel/>, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
