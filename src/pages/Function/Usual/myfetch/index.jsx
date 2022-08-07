import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import Myfetch from "./Myfetch";
import 'antd/dist/antd.css';
import {getStorage_fetch, setStorage_fetch} from "../../chromeCommon";
import {Button} from "antd";

const iframe = document.getElementById('sandbox');

window.addEventListener('message', (event) => {
    console.log('EVAL output', event.data);
});

const sendToEval = (str) => {
    iframe.contentWindow.postMessage('10 + 20', '*');
}




const FetchList = () => {
    const [fetchList, setFetchList] = useState([])

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
        let newItem={
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
    return (
        <>
            <Button type={"primary"} onClick={newitem}>New</Button>
            {
                fetchList.map(data =>
                    <Myfetch key={data.key} data={data} save={itemSave} />
                )
            }
        </>
    )
}

render(<FetchList/>, window.document.querySelector('#app-container'));