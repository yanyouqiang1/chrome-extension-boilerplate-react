import {render} from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import Myfetch from "./Myfetch";
import 'antd/dist/antd.css';
import {getStorage_fetch, setStorage_fetch} from "../../chromeCommon";
import {Button} from "antd";
import ReactJson from 'react-json-view'

const globalVar = {
    updateFetchState: null
}


const identify = 'fetch'
window.addEventListener('message', (event) => {
    if (event.data.identify == identify) {
        globalVar.updateFetchState(JSON.parse(event.data.evalResult))
    }
});


const FetchList = () => {
    const [fetchList, setFetchList] = useState([])
    const [fetchResult,setFetchResult] = useState([])
    globalVar.updateFetchState = (result) => {
        setFetchResult(result)
    }

    const iframeRef = useRef(null)



    useEffect(() => {
        getStorage_fetch(data => {
            setFetchList(data ? data : [])
        })

    }, [])

    const itemSave = (item) => {
        let assign = Object.assign([], fetchList);

        assign.map((data, index) => {
            if (data.key == item.key) {
                assign[index] = item
            }
        })

        setStorage_fetch(assign)
        setFetchList(assign)
    }

    const newitem = () => {
        let assign = Object.assign([], fetchList);
        let newItem = {
            key: "zxcvas",
            title: "这是一个title11",
            override: {
                hostSwitch: false,
                host: "www.baidu.com"
            },
            content: "fetch(\"https://www.bing.com/rb/3x/cj,nj/jReG-C8VYNXsV78si6ivI6XTChQ.js?bu=A68Gygi0Bg\", {\n" +
                "  \"method\": \"GET\"\n" +
                "});"
        }

        assign.unshift(newItem)
        setStorage_fetch(assign)
        setFetchList(assign)
    }
    const toeval = (evalstr) => {
        let ff = iframeRef.current
        let postData = {
            identify: identify,
            evalStr: evalstr
        }
        ff.contentWindow.postMessage(postData, '*');

    }
    return (
        <>

            <ReactJson src={fetchResult} />

            <iframe src="sandbox.html" id="sandbox" ref={iframeRef} style={{display: "none"}}/>

            <Button type={"primary"} onClick={newitem}>New</Button>
            {
                fetchList.map(data =>
                    <Myfetch key={data.key} data={data} save={itemSave} toeval={toeval}/>
                )
            }
        </>
    )
}

render(<FetchList/>, window.document.querySelector('#app-container'));