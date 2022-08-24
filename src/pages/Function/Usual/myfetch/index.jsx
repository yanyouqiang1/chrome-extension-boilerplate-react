import {render} from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import 'antd/dist/antd.css';
import {getStorage_fetch, setStorage_fetch} from "../../chromeCommon";
import {Button, Col, message, Modal, Row} from "antd";
import ReactJson from 'react-json-view'



const FetchList = () => {
    const [fetchList, setFetchList] = useState([])
    const [fetchResult, setFetchResult] = useState([])

    useEffect(() => {
        getStorage_fetch(data => {
            setFetchList(data ? data : [])
        })

    }, [])




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
                </Col>
                {
                    fetchList.map(item =>
                        <>
                            <div>姓名：<input type="text" value={item.name} /> </div>
                            <div>url：<input type="text" value={item.request.url} /> </div>
                            <div>Method：<input type="text" value={item.request.method} /> </div>
                        </>
                    )
                }
            </Row>


        </>
    )
}

render(<FetchList/>, window.document.querySelector('#app-container'));