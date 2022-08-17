import { render } from "react-dom";
import React from "react";
import "antd/dist/antd.css";
import { Checkbox, Col, List, Row } from "antd";
import dayjs from "dayjs";
import { ExclamationCircleOutlined } from "@ant-design/icons";


const TodoList = () => {
  const initData = [
    {
      content:"todotodododo",
      createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
      finishTime: ''
    }
  ];


  return (
    <Row>
      <Col span={10}>

        <List
          itemLayout="horizontal"
          dataSource={initData}
          renderItem={(item) => (
            <List.Item>
              <Checkbox>Checkbox</Checkbox>
              <ExclamationCircleOutlined />
              <List.Item.Meta
                title={<a href="https://ant.design">{item.content}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        />


      </Col>
      <Col span={10}>

      </Col>
    </Row>
  );
};


render(<TodoList />, window.document.querySelector("#app-container"));