import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import {Button, Card, Col, message, Row} from "antd";
import TextArea from "antd/es/input/TextArea";
import JsonEditor from "../../../component/JsonEditor";
import 'antd/dist/antd.css';
import './index.css'
import {getStorage_awk, setStorage_awk} from "../../chromeCommon";
import randomstring from "rdm-str";


const Awk = () => {
    const [evalStr, setEvalStr] = useState(`
    function handle(strs){
     let strings = strs.split('\\n');
            let strInfo={
                size: strings.length,
                originStr: strs
            };
            let result = [];
            strings.forEach((str,index)=>{
                result.push(handleString(str,index,strInfo))
            });
         return result;
    }
    
    //str 每行
    //index 下标
    //size 总行数
    //originStr 原始字符串
    function handleString(str,index,{size,originStr}){
    }`
    );
    const [data, setData] = useState('');
    const [result, setResult] = useState('');

    const [awkTemplates, setAwkTemplates] = useState([])

    useEffect(() => {
        getStorage_awk(templates => {
            templates = templates ? templates : []
            setAwkTemplates(templates)
        })
    }, [])

    //监听eval回调
    window.addEventListener('message', (event) => {
        if (event.data.identify == 'awkResult') {
            console.log('awkResult', event.data);
            setResult(event.data.data.join('\n'))
        }

    });
    //发送消息，进行eval计算
    const sendToEval = (lines, func) => {
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
        sendToEval(data, evalStr);
    }

    const saveTempalte = () => {
        let name = prompt("保存模板名为：");
        if (!name) {
            return
        }
        let temp = {
            key: randomstring(7),
            name: name,
            content: evalStr
        }
        getStorage_awk(templates => {
            templates = templates ? templates : []
            templates.unshift(temp)

            setStorage_awk(templates)
            setAwkTemplates(templates)
            message.success("保存成功")
        })
    }
    const templateDelete = (template) => {
        getStorage_awk(templates=>{
            templates.forEach((it,index)=>{
                if (it.key=template.key){
                    templates.splice(index,1)
                }
            })

            setStorage_awk(templates)
            setAwkTemplates(templates)
            message.success("删除成功")
        })
    }

    const templateApply = (template) => {
        setEvalStr(template.content);
        message.success("应用成功")
    }
    return (
        <>
            <Row justify={"center"}>
                <Col span={22}>
                    <Card title="输入你的处理程序" extra={
                        <>
                            <Button type={"link"} onClick={saveTempalte}>保存为模版</Button>
                            <Button type={"primary"} onClick={doCalc}>计算</Button>
                        </>
                    }>
                        <Row>
                            <Col span={18}>
                                <JsonEditor height="40vh" language="javascript" value={evalStr}
                                            onChange={evalStrChange}/>
                            </Col>
                            <Col span={6} className="templateCol">
                                {awkTemplates.map(template => <>
                                    <Card.Grid className="cardGrid">
                                        <b className="small-font">{template.name}</b>
                                        <Button type={"link"} className="small-font right" size={"small"} onClick={()=>templateApply(template)}>应用</Button>
                                        <Button type={"link"} danger className="small-font right"
                                                onClick={()=>templateDelete(template)} size={"small"}>删除</Button>
                                    </Card.Grid>
                                </>)}
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