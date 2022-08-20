import { render } from "react-dom";
import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Button, Col, Row } from "antd";
import Notity from './Notity'

const MyNotify = () => {
  const initData = [
    {
      key: "aaaaaa",
      title: "准备下班",
      message: "要准备准备下班",
      everyday: false,
      time: 1231123123,
      status: "finish" //finish open
    }
  ];
  const [datasources, setDatasources] = useState([]);

  useEffect(() => {
    setDatasources(initData);
  });

  return <>
    <Row justify="center">
      {datasources.map(datasource => <>
        <Col span={20}>

        </Col>
      </>)}

    </Row>

  </>;

};


render(<Notity />, window.document.querySelector("#app-container"));