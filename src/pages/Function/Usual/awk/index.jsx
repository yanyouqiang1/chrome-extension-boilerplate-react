import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import {Button, Card, Col, message, Row} from "antd";
import TextArea from "antd/es/input/TextArea";
import MonacoEditor from "../../../component/MonacoEditor";
import 'antd/dist/antd.css';
import './index.css'
import {AwkTemplateRepo} from "../../../../Repository/awkTemplateRepo";


class Awk extends React.Component {
    constructor(props) {
        super(props);
        this.awkRepoClient =new AwkTemplateRepo()

        this.state = {
            currentTemplate: AwkTemplateRepo.INIT_TEMPLATE,
            templateRepository: [],
            inputStr: '',
            evalResult: ''
        }
        this.initData()
    }

    setTemplateRepository(datasource) {
        this.setState({
            templateRepository: datasource
        })
    }

    setEvalResult(result) {
        this.setState({
            evalResult: result
        })
    }

    initData() {
        this.awkRepoClient.getDataFromRepository(data => {
            this.setTemplateRepository(data)
        })
        //监听eval回调
        window.addEventListener('message', (event) => {
            if (event.data.identify == 'awkResult') {
                console.log('awkResult', event.data);
                this.setEvalResult(event.data.data.join('\n'))
            }

        });
    }

    //发送消息，进行eval计算
    sendToEval(lines, func) {
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

    saveTemplate() {
        let name = prompt("请输入模版名称")
        if (name) {
            let addTemplate = this.awkRepoClient.addTemplate(this.state.templateRepository, name, this.state.currentTemplate);
            this.setTemplateRepository(addTemplate)
            message.success("保存成功!")
        }
    }
    setCurrentTemplate(value) {
        this.setState({
            currentTemplate: value
        })
    }
    doEval(){
        this.sendToEval(this.state.inputStr,this.state.currentTemplate)
    }

    setInputStr(value) {
        this.setState({
            inputStr: value
        })
    }

    templateApply(template){
        this.setCurrentTemplate(template.content)
    }

    templateDelete(template){
        let deleteTemplate = this.awkRepoClient.deleteTemplate(this.state.templateRepository,template.key);
        this.setTemplateRepository(deleteTemplate)
    }

    render() {
        return (
            <>
                <Row justify={"center"}>
                    <Col span={22}>
                        <Card title="输入你的处理程序" extra={
                            <>
                                <Button type={"link"} onClick={() => this.saveTemplate()}>保存为模版</Button>
                                <Button type={"primary"} onClick={()=>this.doEval()}>计算</Button>
                            </>
                        }>
                            <Row>
                                <Col span={18}>
                                    <MonacoEditor height="40vh" language="javascript" value={this.state.currentTemplate}
                                                  onChange={(value)=>this.setCurrentTemplate(value)}/>
                                </Col>
                                <Col span={6} className="templateCol">
                                    {this.state.templateRepository.map(template => <>
                                        <Card.Grid className="cardGrid">
                                            <b className="small-font">{template.name}</b>
                                            <Button type={"link"} className="small-font right" size={"small"}
                                                    onClick={() => this.templateApply(template)}>应用</Button>
                                            <Button type={"link"} danger className="small-font right"
                                                    onClick={() => this.templateDelete(template)} size={"small"}>删除</Button>
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
                            <TextArea className="inputData" rows={20} value={this.state.inputStr} onChange={(e)=>this.setInputStr(e.target.value)}/>
                        </Card>
                    </Col>
                    <Col span={11}>
                        <Card title="Result">
                            <TextArea className="outPutData" rows={20} value={this.state.evalResult}/>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }



}

render(<Awk/>, window.document.querySelector('#app-container'));