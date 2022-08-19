import { render } from "react-dom";
import React, { useState } from "react";
import { Button, Card, Col, Row, Tooltip } from "antd";
import "antd/dist/antd.css";
import { diffChars, diffJson, diffLines, diffSentences } from "diff";
import { QuestionCircleOutlined } from "@ant-design/icons";


const Filediff = () => {


  const compareChars = () => {
    const { left, right } = readCompareText();

    let diffs = diffChars(left, right);

    showResult(diffs);
  };

  const compareLine = () => {
    const { left, right } = readCompareText();
    let diffs = diffLines(left, right);
    showResult(diffs);
  };

  //展示结果
  function showResult(diffs) {
    const fragment = document.createDocumentFragment();
    diffs.forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts
      const color = part.added ? "green" :
        part.removed ? "red" : "grey";
      const span = document.createElement("span");
      span.style.color = color;
      span.appendChild(document
        .createTextNode(part.value));
      fragment.appendChild(span);
    });

    const display = document.getElementById("display");
    display.innerHTML = "";
    display.appendChild(fragment);
  }


  //读取文本
  function readCompareText() {
    let leftDom = document.getElementById("textLeft");
    let rightDom = document.getElementById("textRight");


    const left = leftDom.innerText;
    const right = rightDom.innerText;

    //去掉格式
    leftDom.innerText = left;
    rightDom.innerText = right;
    return { left, right };
  }

  return (
    <>
      <Card title={
        <>
          <Button onClick={compareChars} type={"primary"}>compareChars</Button>
          <Button onClick={compareLine} type={"primary"} style={{ marginLeft: 10 }}>compareLine</Button>

        </>
      }
            extra={
              <>
                <Button onClick={compareChars} type="dashed" danger>clear</Button>
                <Tooltip title={
                  <>
                    <p>左边 对比 右边 </p>
                    <p><font style={{ color: "green" }}>绿色</font>表示 左边 缺少</p>
                    <p><font style={{ color: "red" }}>红色</font>表示 左边 多余</p>
                    <p><font style={{ color: "gray" }}>灰色</font>表示两边相同</p>
                  </>
                }>
                  <QuestionCircleOutlined style={{ color: "green", width: 50, height: 50 }} />
                </Tooltip>

              </>
            }
            bordered={true}
      >
        <Row>
          <Col span={8}>
            <pre suppressContentEditableWarning contentEditable id="textLeft"
                 style={{
                   whiteSpace: "pre-wrap",
                   height: 1000,
                   borderColor: "black",
                   borderStyle: "solid",
                   fontSize: 20
                 }}></pre>
          </Col>
          <Col span={8}>
            <pre suppressContentEditableWarning contentEditable id="textRight"
                 style={{
                   whiteSpace: "pre-wrap",
                   height: 1000,
                   borderColor: "black",
                   borderStyle: "solid",
                   marginLeft: 10,
                   fontSize: 20
                 }}></pre>
          </Col>
          <Col span={8}>
            <pre id="display"
                 style={{
                   whiteSpace: "pre-wrap",
                   fontSize: 20,
                   marginLeft: 10
                 }}></pre>
          </Col>
        </Row>
      </Card>
    </>

  );
};

render(<Filediff />, window.document.querySelector("#app-container"));