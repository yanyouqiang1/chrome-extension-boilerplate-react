import { render } from "react-dom";
import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Button, Card, Checkbox, Col, List, Row, Typography } from "antd";
import dayjs from "dayjs";
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getStorage_todolist, setStorage_todolist } from "../../chromeCommon";
import randomstring from "rdm-str";

const STATUS_FINISH = "finish";
const STATUS_NEW = "new";

const TodoList = () => {
  const initData = [
    {
      key: "aaaaaa",
      content: "todotodododo",
      status: "finish",
      createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
      finishTime: ""
    }
  ];
  const [datasource, setDataSource] = useState([]);
  const [newDatasource, setNewDataSource] = useState([]);
  const [finishDatasource, setFinishDatasource] = useState([]);

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    getStorage_todolist(datas => {
      datas = datas ? datas : [];
      debugger
      setNewDataSource(datas.filter(it => it.status == STATUS_NEW));
      setFinishDatasource(datas.filter(it => it.status == STATUS_FINISH));

    });
  }, [datasource]);
  const textChange = (e) => {
    setInputText(e.target.value);
  };
  const newRecord = () => {
    const record =
      {
        key: randomstring(7),
        content: inputText,
        status: "new",
        createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
        finishTime: ""
      };
    let assign = Object.assign([], datasource);
    assign.unshift(record);

    saveAndFresh(assign);
  };
  const deleteRecord = (item) => {
    if (!confirm("确认删除吗？")) {
      return;
    }

    let assign = Object.assign([], datasource);
    assign.forEach((it, index) => {
      if (it.key == item.key) {
        assign.splice(index, 1);
      }
    });
    saveAndFresh(assign);
  };
  const finishRecord = (item) => {
    let assign = Object.assign([], datasource);
    assign.forEach((it, index) => {
      if (it.key == item.key) {
        assign[index].status = STATUS_FINISH;
      }
    });
    saveAndFresh(assign);
  };
  const saveAndFresh = (datasource) => {
    setInputText("");
    setStorage_todolist(datasource);
    setDataSource(datasource);
  };

  return (
    <Row>
      <Col span={10}>
        <List
          header={<div><ClockCircleOutlined style={{ color: "red" }} /> TODO</div>}
          footer={<div>新建：<input value={inputText} onChange={textChange} /> <Button onClick={newRecord}>确认</Button>
          </div>}
          itemLayout="horizontal"
          dataSource={newDatasource}
          renderItem={(item) => (
            <List.Item>
              <div>
                <Typography.Text mark>[ITEM]</Typography.Text>
                {item.content}
                <Button onClick={() => finishRecord(item)}>done</Button>
                <Button onClick={() => deleteRecord(item)}>delete</Button>
              </div>
            </List.Item>
          )}
        />

      </Col>
      <Col span={10}>
        <List
          header={<div><CheckCircleOutlined style={{ color: "green" }} /> FINISH</div>}
          footer={<></>}
          itemLayout="horizontal"
          dataSource={finishDatasource}
          renderItem={(item) => (
            <List.Item>
              <div>
                <Typography.Text mark>[ITEM]</Typography.Text>
                {item.content}
                <Button onClick={() => finishRecord(item)}>done</Button>
                <Button onClick={() => deleteRecord(item)}>delete</Button>
              </div>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};


render(<TodoList />, window.document.querySelector("#app-container"));