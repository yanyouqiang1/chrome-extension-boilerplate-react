import {render} from "react-dom";
import React, {useState} from "react";
import "antd/dist/antd.css";
import {Button, Col, message, Row} from "antd";
import MonacoEditor from "../../../component/MonacoEditor";
import ReactJson from "react-json-view";
import {pickJsonFromText} from "../../JSONUtil";

const JSONShow = () => {
    chrome.runtime.onMessage.addListener(msg => {
        if (msg.type == "selectText") {
            let pickjson = pickJsonFromText(msg.data);
            if (!pickjson) {
                message.warn("json挑选失败")
                updateText(msg.data)
            } else {
                updateText(pickjson)
            }
        }
        if (msg.type=="appendText"){
            let newValue = text+"\n"+msg.data
            setText(newValue)
        }
    })
    const [text, setText] = useState('')
    const [obj, setObj] = useState({})

    const updateText = (str) => {
        setText(str);
        updateObj(str)
    }
    const updateObj = (str) => {
        let parseObj;
        try {
            parseObj = JSON.parse(str);
        } catch (e) {
        }
        setObj(parseObj)
    }
    const textOnChange = (value) => {
        updateObj(value)
    }

    const formatJson = ()=>{
        try{
            let parse = JSON.parse(text);
            setText(JSON.stringify(parse,null,4))
        }catch (e) {
            message.error("format error")
        }
    }
    return (
        <Row gutter={8} style={{paddingTop: "20px"}}>
            <Col span={12}>
                <Button onClick={formatJson} type={"link"}>JSON格式化</Button>
                <MonacoEditor value={text} onChange={textOnChange}  height="90vh"/>
            </Col>
            <Col span={12}>
                <ReactJson src={obj} theme={"summerfruit:inverted"} displayDataTypes={false} iconStyle={"square"} collapsed={false} displayObjectSize={false}/>
            </Col>
        </Row>)
}

render(<JSONShow/>, window.document.querySelector("#app-container"));