import {render} from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import Myfetch from "./Myfetch";
import 'antd/dist/antd.css';
import {getStorage_fetch, setStorage_fetch} from "../../chromeCommon";
import {Button, Col, message, Modal, Row} from "antd";
import ReactJson from 'react-json-view'
import randomstring from "rdm-str";

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
    const [fetchResult, setFetchResult] = useState([])

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
            key: randomstring(7),
            title: "New",
            override: {
                hostSwitch: false,
                host: ""
            },
            content: ""
        }

        assign.unshift(newItem)
        setStorage_fetch(assign)
        setFetchList(assign)
        message.success("新建",3)
    }
    const toeval = (evalstr) => {
        let ff = iframeRef.current
        let postData = {
            identify: identify,
            evalStr: evalstr
        }
        ff.contentWindow.postMessage(postData, '*');

    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const dotry = () => {
        setIsModalVisible(true);
    }

    const itemDelete = (key) => {
        let assign = Object.assign([], fetchList);

        assign = assign.filter(data => data.key != key);
        setStorage_fetch(assign)
        setFetchList(assign)

        message.success("删除成功！", 3)
    }
    return (
        <>
            <Modal title="结果展示" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <ReactJson src={fetchResult}/>
            </Modal>

            <Row>
                <Col span={24} style={{textAlign: "right"}}>
                    <Button type="link" onClick={showModal}>
                        结果展示面板
                    </Button>

                    <Button type={"primary"} onClick={newitem}>New</Button>
                </Col>
            </Row>

            {
                fetchList.map(data =>
                    <Myfetch key={data.key} data={data} save={itemSave} toeval={toeval} dotry={dotry}
                             delete={itemDelete}/>
                )
            }
            <iframe src="sandbox.html" id="sandbox" ref={iframeRef} style={{display: "none"}}/>
        </>
    )
}

render(<FetchList/>, window.document.querySelector('#app-container'));