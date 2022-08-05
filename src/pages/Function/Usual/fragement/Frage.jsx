import {Button, Card, Col, Input, message, Row} from 'antd';
import React, {useEffect, useState} from 'react';
import {render} from "react-dom";
import 'antd/dist/antd.css';


const Frage = (props) => {
    const [data, setData] = useState(props.data)


    const titleChage = (e) => {
        let assign = Object.assign({}, data);
        assign.title = e.target.value

        setData(assign)
    }

    const contentChage = (e) => {
        let assign = Object.assign({}, data);
        assign.content = e.target.value

        setData(assign)
    }

    const ondelete = () => {
        if (confirm("确认吗？")) {
            props.ondelete(data.key)
        }
    }

    const save = () => {
        props.save(data)
        message.success("保存成功",3)
    }

    return (
        <>
            <Col span={8}>
                <Card title={data.createTime} bordered={true} style={{margin:5}} hoverable
                      extra={
                          <>
                              <Button type="link" danger onClick={ondelete}>刪除</Button>
                              <Button type="link" onClick={save}>保存</Button>
                          </>
                      }
                >
                    标题：<input value={data.title} onChange={titleChage} style={{width:"100%",marginBottom:5}}/>
                    内容：<textarea value={data.content} onChange={contentChage} rows={8} style={{width:"100%"}}/>
                </Card>
            </Col>
        </>

    )
}

export default Frage