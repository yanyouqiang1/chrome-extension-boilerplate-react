import { render } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
import { getStorage_fetch, setStorage_fetch } from "../../chromeCommon";
import { Button, Col, Collapse, message, Modal, Row } from "antd";
import ReactJson from "react-json-view";

import JSONInput from "react-json-editor-ajrm";
import './index.css'


const { Panel } = Collapse;

const FetchList = () => {
  const [fetchList, setFetchList] = useState([]);
  const [fetchResult, setFetchResult] = useState([]);

  useEffect(() => {
    getStorage_fetch(data => {
      setFetchList(data ? data : []);
    });

  }, []);


  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    let fetchListElement = fetchList[0];
    let responsePromise = fetch(fetchListElement.request.url, Object.entries(fetchListElement.request));
    console.log(responsePromise);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const itemDelete = (key) => {
    let assign = Object.assign([], fetchList);

    assign = assign.filter(data => data.key != key);
    setStorage_fetch(assign);
    setFetchList(assign);

    message.success("删除成功！", 3);
  };
  return (
    <>
      <Modal title="结果展示" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <ReactJson src={fetchResult} />
      </Modal>

      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="link" onClick={showModal}>
            结果展示面板
          </Button>
        </Col>
        {
          fetchList.map(item =>
            <Col span={24}>
              <Collapse>
                <Panel header={item.name} key="1" extra={<>
                  <Button>Try</Button>
                </>}>
                  <Row>
                    <Col span={2} className="left">名称:</Col>
                    <Col span={20}><input className="inputText" type="text" value={item.name} /></Col>
                  </Row>
                  <Row>
                    <Col span={2} className="left">url:</Col>
                    <Col span={20}><input className="inputText"  type="text" value={item.request.url} /></Col>
                  </Row>
                  <Row>
                    <Col span={2} className="left">Method:</Col>
                    <Col span={20}><input className="inputText"  type="text" value={item.request.method} /></Col>
                  </Row>
                  <Row>
                    <Col span={2} className="left">headers:</Col>
                    <Col span={20}><JSONInput width="100%" placeholder={item.request} id="jsonInput" /></Col>
                  </Row>
                  <Row>
                    <Col span={2} className="left">result:</Col>
                    <Col span={20}><ReactJson src={fetchResult}/> </Col>
                  </Row>
                </Panel>
              </Collapse>

            </Col>
          )
        }
      </Row>


    </>
  );
};

render(<FetchList />, window.document.querySelector("#app-container"));