import {render} from "react-dom";
import React, {useState} from "react";
import 'antd/dist/antd.css';
import {Col, Row} from "antd";

const HttpStr = () => {
    const [htmlText, setHtmlText] = useState('')
    const [result, setResult] = useState('')

    const inputChange = (e) => {
        setHtmlText(e.target.value)
        setResult(e.target.value)
    }

    return (
        <>
            <Row>
                <Col span={12}>
                    <h2>需要渲染的内容</h2>
                    <textarea style={{width:'100%'}} rows={80} value={htmlText} onChange={inputChange}></textarea>
                </Col>

                <Col span={12}>
                    <h2>渲染结果</h2>
                    <html dangerouslySetInnerHTML={{__html: result}} style={{marginLeft:10}}></html>
                </Col>
            </Row>
        </>
    )
}


render(<HttpStr/>, window.document.querySelector('#app-container'));