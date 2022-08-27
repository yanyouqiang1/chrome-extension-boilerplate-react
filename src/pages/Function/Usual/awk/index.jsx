import {render} from "react-dom";
import React, {useState} from "react";
import {Button, Card, Col, Row} from "antd";
import TextArea from "antd/es/input/TextArea";
import JsonEditor from "../../../component/JsonEditor";
import 'antd/dist/antd.css';
import './index.css'


const Awk = () => {
    const [evalStr, setEvalStr] = useState(`
    //str 每行
    //index 下标
    //size 总行数
    function handleString(str,index,{size}){
    }`
    );
    const [data, setData] = useState('');
    const [result, setResult] = useState('');

    //监听eval回调
    window.addEventListener('message', (event) => {
        if (event.data.identify=='awkResult'){
            console.log('awkResult', event.data);
            setResult(event.data.data.join('\n'))
        }

    });
    //发送消息，进行eval计算
    const sendToEval = (lines,func) => {
        const iframe = document.querySelector('#sandbox');
        let message = {
            identify: "evalAWK",
            data: {
                lines: lines,
                func: func
            }
        }
        iframe.contentWindow.postMessage(message, '*');
    }

    const evalStrChange = (value) => {
        setEvalStr(value)
    }

    const dataChange = (e) => {
        setData(e.target.value)
    }
    const doCalc = () => {
        // console.log(parseEvalStr())
        sendToEval(data,evalStr);
    }

    function parseEvalStr() {
        return `
        function calculate(){
            ${evalStr};
          
            
            let strings = "${data}".split('\n');
            let strInfo={
                size: strings.length
            };
            let result = [];
            strings.forEach((str,index)=>{
                result.push(handleString(str,index,strInfo))
            });
            return result;
        };
        calculate();
        `
    }

    return (
        <>
            <Row justify={"center"}>
                <Col span={22}>
                    <Card title="输入你的处理程序" extra={
                        <>
                            <Button type={"link"}>保存为模版</Button>
                            <Button type={"primary"} onClick={doCalc}>计算</Button>
                        </>
                    }>
                        <Row>
                            <Col span={20}>
                                <JsonEditor height="40vh" language="javascript" value={evalStr}
                                            onChange={evalStrChange}/>
                            </Col>
                            <Col span={4} className="templateCol">
                                <Card.Grid className="cardGrid">Content</Card.Grid>
                                <Card.Grid className="cardGrid">Content</Card.Grid>
                                <Card.Grid className="cardGrid">Content</Card.Grid>
                                <Card.Grid className="cardGrid">Content</Card.Grid>
                                <Card.Grid className="cardGrid">Content</Card.Grid>
                                <Card.Grid className="cardGrid">Content</Card.Grid>
                                <Card.Grid className="cardGrid">Content</Card.Grid>
                            </Col>
                        </Row>

                    </Card>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col span={11}>
                    <Card title="Data">
                        <TextArea className="inputData" rows={20} value={data} onChange={dataChange}/>
                    </Card>
                </Col>
                <Col span={11}>
                    <Card title="Result">
                        <TextArea className="outPutData" rows={20} value={result}/>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

render(<Awk/>, window.document.querySelector('#app-container'));