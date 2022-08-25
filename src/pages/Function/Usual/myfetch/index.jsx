import { render } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
import { getStorage_fetch, setStorage_fetch } from "../../chromeCommon";
import { Button, Col, Collapse, message, Modal, Row } from "antd";
import ReactJson from "react-json-view";
import JSONInput from "react-json-editor-ajrm";
import "./index.css";


const { Panel } = Collapse;

const FetchList = () => {
  const [fetchList, setFetchList] = useState([]);
  const [fetchResult, setFetchResult] = useState([]);
  const [inputFields, setInputFields] = useState({});

  useEffect(() => {
    getStorage_fetch(data => {
      let newData = data ? data : [];


      let fileds = {}
      newData.forEach((it,index)=>{
        fileds[it.key] = {
          host: it.host,
          name: it.name
        }
      })
      setInputFields(fileds)
      setFetchList(newData);


    });

  }, []);


  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const itemDelete = (item) => {
    if (!confirm("确认删除？")) {
      return;
    }
    let assign = Object.assign([], fetchList);

    assign = assign.filter(data => data.key != item.key);
    setStorage_fetch(assign);
    setFetchList(assign);

    message.success("删除成功！", 3);
  };

  const itemSave = (item) => {
    let newHost = inputFields[item.key].host
    let newName = inputFields[item.key].name

    let assign = Object.assign([], fetchList);
    assign.forEach((it, index) => {
      if (it.key == item.key) {
        assign[index].name = newName;
        assign[index].host = newHost;
      }
    });

    setStorage_fetch(assign);
    setFetchList(assign);

    message.success("保存成功！", 3);

  };
  const doTry = (item) => {
    //替换URL
    let { url } = item.request;
    let newHost = inputFields[item.key].host
    url = replaceHost(url, newHost);


    //headers
    const headers = {};
    item.request.headers.forEach((it, index) => {
      let name = it.name.replace(":", "");
      headers[name] = it.value;
    });
    //cookies


    let responsePromise = fetch(url, {
      headers: headers,
      method: item.request.method,
      body: item.request.body
    });

    responsePromise.then(response => response.text()).then(text => {
      console.log(text);
      setFetchResult(JSON.parse(text));
      setIsModalVisible(true);
    });

  };

  const replaceHost = (url, newHost) => {
    if (newHost) {
      let originHost = url.match(/(.*)\/\/(\S*?)\/(.*)/)[2];
      return url.replace(originHost, newHost);
    }
    return url;
  };

  const nameChange = (e,item) => {
    let assign = Object.assign({},inputFields);
    assign[item.key].name = e.target.value;

    setInputFields(assign)
  };
  const hostChange = (e,item) => {
    let assign = Object.assign({},inputFields);
    assign[item.key].host = e.target.value;

    setInputFields(assign)
  };
  return (
    <>
      <Modal title="结果展示" visible={isModalVisible} onOk={handleCancel} onCancel={handleCancel}>
        <ReactJson src={fetchResult} />
      </Modal>

      <Row>
        {
          fetchList.map(item =>
            <Col span={24} key={item.key}>
              <Collapse>
                <Panel header={item.name} key="1" extra={<>
                  <Button onClick={(e) => {
                    itemDelete(item);
                    e.stopPropagation();
                  }} danger type={"link"}>delete</Button>
                  <Button onClick={(e) => {
                    itemSave(item);
                    e.stopPropagation();
                  }} type={"link"}>save</Button>

                </>}>
                  <Row className="row">
                    <Col span={2} className="left">名称:</Col>
                    <Col span={20}><input className="inputText" type="text" value={inputFields[item.key].name}
                                          onChange={(e) => nameChange(e,item)} /></Col>
                  </Row>
                  <Row className="row">
                    <Col span={2} className="left">url:</Col>
                    <Col span={20}><input className="inputText" type="text" value={inputFields[item.key].host? inputFields[item.key].host : ""}
                                          onChange={(e) => hostChange(e,item)}  /></Col>
                  </Row>
                  <Row className="row">
                    <Col span={2} className="left">headers:</Col>
                    <Col span={20}><JSONInput width="100%" placeholder={item.request} id="jsonInput" /></Col>
                  </Row>
                  <Row>
                    <Col span={22}>
                      <Button onClick={() => doTry(item)} type={"primary"}>Try</Button>
                    </Col>
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