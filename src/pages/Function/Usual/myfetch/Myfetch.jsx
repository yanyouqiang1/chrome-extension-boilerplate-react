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
        content: `fetch("https://ug.baidu.com/mcp/pc/pcsearch", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\\".Not/A)Brand\\";v=\\"99\\", \\"Google Chrome\\";v=\\"103\\", \\"Chromium\\";v=\\"103\\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\\"macOS\\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://www.baidu.com/s?wd=123&rsv_spt=1&rsv_iqid=0xdd814b2b000147f8&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&rsv_sug3=4&rsv_sug1=2&rsv_sug7=100&rsv_sug2=0&rsv_btype=i&inputT=6265&rsv_sug4=6327",
  "referrerPolicy": "unsafe-url",
  "body": "{\\"invoke_info\\":{\\"pos_1\\":[{}],\\"pos_2\\":[{}],\\"pos_3\\":[{}]}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});`
    }

    // const {data} = props

    const [data, setData] = useState(props.data ? props.data : initData)

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
        let newFetch = replaceHost()
        let result = props.toeval(newFetch)
        console.log(result)

        props.dotry()
        // sendToEval("123")
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

    const onDelete = () => {
        if (confirm("确认删除吗?")) {
            props.delete(data.key)
        }
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <Collapse collapsible={false}>
                        <Panel header={data.title} extra={<Button type={"link"} danger onClick={onDelete}>DEL</Button>}>
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
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        </>
    )
}


export default Myfetch