import {render} from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Collapse, message, Row, Switch} from "antd";
import './Myfetch.css'

const {Panel} = Collapse;

//sandbox to eval


const Myfetch = (props) => {



    const initData = {
        key: "zxcvas",
        title: "这是一个title",
        override: {
            hostSwitch: false,
            host: "www.baidu.com"
        },
        content: "fetch(\"https://www.bing.com/rb/3x/cj,nj/jReG-C8VYNXsV78si6ivI6XTChQ.js?bu=A68Gygi0Bg\", {\n" +
            "  \"method\": \"GET\"\n" +
            "});"
    }

    // const {data} = props

    const [data, setData] = useState(props.data ? props.data : initData)
    const [fetchResult, setFetchResult] = useState('')

    useEffect(() => {
        setData(props.data)
    }, [])

    const switchChange = (checked) => {
        let assign = Object.assign({}, data);
        assign.override.hostSwitch = checked

        setData(assign)
    };

    const titleChange = (e) => {
        let assign = Object.assign({}, data);
        assign.title = e.target.value

        setData(assign)
    }
    const hostChange = (e) => {
        let assign = Object.assign({}, data);
        assign.override.host = e.target.value

        setData(assign)

    }
    const contentChange = (e) => {
        let assign = Object.assign({}, data);
        assign.content = e.target.value

        setData(assign)

    }

    const save = () => {
        props.save(data)
        message.success("保存成功", 3)
    }
    const dotry = () => {
       /* let newFetch = replaceHost()
        let result = eval(newFetch)
        console.log(result)
        result.then(data => {
            setFetchResult(JSON.stringify(data))
        })*/
        sendToEval("123")
    }

    const replaceHost = () => {
        let content = data.content
        if (data.override.hostSwitch) {
            //匹配 www.bing.com'
            let url = content.match(/(.*)\/\/(\S*?)\/(.*)/)[2]
            content = content.replace(url, data.override.host)
        }
        return content
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <Collapse defaultActiveKey={['1']} collapsible={false}>
                        <Panel key='1' header={data.title}>
                            <Row className="row">
                                <Col span={4} className="labelCol"><label>title:</label></Col>
                                <Col span={20}><input value={data.title} onChange={titleChange} className="inputTitle"/></Col>
                            </Row>
                            <Row className="row">
                                <Col span={4} className="labelCol"><label>host switch:</label></Col>
                                <Col span={20}><Switch checked={data.override.hostSwitch}
                                                       onChange={switchChange}/></Col>
                            </Row>
                            {
                                data.override.hostSwitch ?
                                    <Row className="row">
                                        <Col span={4}><label>replace host:</label></Col>
                                        <Col span={20}><input value={data.override.host} className="hostInput"
                                                              onChange={hostChange}/></Col>
                                    </Row>
                                    : <></>
                            }

                            <Row className="row">
                                <Col span={4}><label>fetch content:</label></Col>
                                <Col span={20}><textarea className="fetchContent" value={data.content}
                                                         onChange={contentChange}/></Col>
                            </Row>
                            <Row className="row">
                                <Col span={24} style={{textAlign: "right"}}>
                                    <Button type={"primary"} onClick={save} className="saveBtn">save</Button>
                                    <Button type={"primary"} className="tryBtn" onClick={dotry}>try</Button>
                                </Col>
                            </Row>
                            <Row className="row">
                                <Col span={4}><label>fetch result:</label></Col>
                                <Col span={20}><textarea readOnly value={fetchResult} className="fetchContent"/></Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        </>
    )
}


export default Myfetch