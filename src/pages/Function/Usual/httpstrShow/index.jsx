import {render} from "react-dom";
import React, {useState} from "react";
import 'antd/dist/antd.css';
import {Col, Row} from "antd";

const HtmlContainer = (props) => (
    <div>
        {props.children}
    </div>
)

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
                    <textarea rows={80} value={htmlText} onChange={inputChange}></textarea>
                </Col>

                <Col span={12}>
                    <div dangerouslySetInnerHTML={result}></div>
                    <HtmlContainer>{result}</HtmlContainer>
                </Col>
            </Row>
        </>
    )
}


render(<HttpStr/>, window.document.querySelector('#app-container'));