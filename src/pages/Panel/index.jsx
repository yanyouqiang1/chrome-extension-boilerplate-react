import React, {useEffect, useState} from "react";
import {render} from "react-dom";
import {Avatar, Button, Card, List, message, Tooltip, Typography} from "antd";
import 'antd/dist/antd.css';
import {getStorage_fetch, setStorage_fetch} from "../Function/chromeCommon";
import randomstring from "rdm-str";


function log(str) {
    chrome.devtools.inspectedWindow.eval(
        `console.log(${str})`
    );
}

const MyPanel = () => {
    const [entrys, setEntrys] = useState("");
    const [fresh, setFresh] = useState(false);

    useEffect(() => {
        chrome.devtools.network.getHAR(hars => {
            const {entries} = hars
            let filter = entries.filter(item =>
                item.response.content.mimeType.includes("json")
            );

            log(JSON.stringify((filter)))
            setEntrys(filter)
        })
    }, [fresh]);

    const onfresh = () => {
        setFresh(!fresh)
    };

    const saveRecord = (entry) => {

        const name = prompt("需要一个名字")
        const {request} =  entry

        getStorage_fetch(datas => {
            datas = datas ? datas : [];
            const newData = {
                key: randomstring(7),
                name: name,
                request
            }

            datas.unshift(newData)

            setStorage_fetch(datas)
            message.success("success！")
        })


    }

    return (
        <>
            <Card extra={<Button onClick={onfresh} type={"primary"}>Fresh</Button>}>
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={entrys}
                    renderItem={(entry, index) => (
                        <List.Item
                            actions={[
                                <Button type="link" onClick={() => saveRecord(entry)}>save</Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Typography.Text>{index + 1}</Typography.Text>}
                                title={entry.request.url.substring(0,80)}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </>

    );
};


render(<MyPanel/>, window.document.querySelector("#app-container"));
