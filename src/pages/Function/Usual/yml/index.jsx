import {Input, Button, Col, Row} from 'antd';
import {render} from "react-dom";
import React, {useState} from 'react';
import 'antd/dist/antd.css';
import './index.css'
import YAML from 'yaml'

const {TextArea} = Input;

const App = () => {
    const [inputText, setInputText] = useState('')
    const [outputTest, setOutputText] = useState('')

    function changeInput(e) {
        setInputText(e.target.value);
    }

    function ymlToJson() {
        let result = YAML.parse(inputText)

        setOutputText(JSON.stringify(result))
    }

    function jsonToYml() {
        let result = JSON.parse(inputText)

        setOutputText(YAML.stringify(result))
    }
    return (
        <>
            <Row gutter={24} type="flex" style={{textAlign: "center"}} justify="center" align="middle">
                <Col span={9}>
                    <TextArea rows={30} allowClear value={inputText} onChange={e=>changeInput(e)}/>
                </Col>
                <Col span={4}>
                    <Button  type="primary" onClick={()=>ymlToJson()}>YAML转换JSON</Button>
                    <br/><br/><br/>
                    <Button type="dashed" onClick={()=>jsonToYml()}>JSON转换YAML</Button>
                </Col>
                <Col span={9}>
                    <TextArea rows={30} value={outputTest}/>
                </Col>
            </Row>

        </>
    )
};


render(<App/>, window.document.querySelector('#root'))



