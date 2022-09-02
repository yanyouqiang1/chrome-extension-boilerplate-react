import { render } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";

import { Button, Card, Col, Collapse, List, message, Modal, notification, Row, Typography } from "antd";
import TextEditor from "../../../component/TextEditor";
import "./index.css";
import Search from "antd/es/input/Search";
import { getStorage_notebooks, setStorage_notebooks } from "../../chromeCommon";
import randomstring from "rdm-str";
import { ExclamationCircleOutlined, ExclamationOutlined } from "@ant-design/icons";

const { Panel } = Collapse;


const Notebook = () => {
  let initData = [
    {
      key: "aaaa",
      title: "标题",
      content: "内容"
    }
  ];

  const [notebooks, setNoteBooks] = useState([]);

  const [selectKey, setSelectKey] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getStorage_notebooks(datas => {
      datas = datas ? datas : initData;
      setNoteBooks(datas);

    });
  }, []);


  const saveItem = () => {
    let assign = Object.assign([], notebooks);
    assign.forEach((item, index) => {
      if (item.key == selectKey) {
        assign[index].title = title;
        assign[index].content = content;
      }
    });
    setStorage_notebooks(assign);
    setNoteBooks(assign);
    message.success("保存成功");

  };

  const selectItem = (item) => {
    setSelectKey(item.key);
    setTitle(item.title);
    setContent(item.content);
  };
  const itemDelete = (item) => {
    if (!confirm("确认删除吗？")){
      return
    }
    let assign = Object.assign([], notebooks);
    assign.forEach((item, index) => {
      if (item.key == item.key) {
        assign.splice(index, 1);
      }
    });
    setStorage_notebooks(assign);
    setNoteBooks(assign);
    message.success("删除成功");
  };
  const newItem = ()=>{
    let item =     {
      key: randomstring(7),
      title: "new",
      content: ""
    }
    let assign = Object.assign([], notebooks);
    assign.unshift(item)
    setStorage_notebooks(assign);
    setNoteBooks(assign);
    message.success("新建成功");

  };
  return (
    <>
      <Card extra={<>
        <Button onClick={newItem} type={"primary"}>新建</Button>
      </>}>
        <div className="notify"><ExclamationCircleOutlined className="notifyIco" />请注意随时保存</div>
        <Row gutter={10}>
          <Col span={6}>
            <List
              header={<Search />}
              bordered
              dataSource={notebooks}
              renderItem={(item, index) => (
                <List.Item extra={<Button onClick={() => itemDelete(item)}>删除</Button>}>
                  <a onClick={() => selectItem(item)}>
                    <Typography.Text mark>[{index}]</Typography.Text> {item.title}
                  </a>
                </List.Item>
              )}
            />
          </Col>
          <Col span={18}>
            <p>
              <b>Title :</b>
              <input type={"text"} className="inputTitle" value={title} onChange={(e) => {
                setTitle(e.target.value);
              }} />
              <Button className="saveBtn" type={"primary"} onClick={saveItem}>save</Button>
            </p>
            <TextEditor value={content} onChange={(html) => {
              setContent(html);
            }} />
          </Col>
        </Row>
      </Card>
    </>
  );
};

render(<Notebook />, window.document.querySelector("#app-container"));

