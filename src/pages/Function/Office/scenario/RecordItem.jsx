import {Button, Card, Col, Collapse, Input, List} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, {useEffect, useState} from "react";
import Panel from "../../../Panel/Panel";
import {createUrls} from "../../chromeCommon";


const RecordItem = (props) => {
    const {dataSource, saveRecord, deleteRecord} = props
    // const [data, setData] = useState({})


    const [rTitle, setRTitle] = useState('')
    const [rRemark, setRremark] = useState('')
    const [rData, setRData] = useState('')

    useEffect(() => {
        setRTitle(dataSource.title)
        setRremark(dataSource.remark)
        setRData(dataSource)
    }, [])

    const remarkChange = (e) => {
        setRremark(e.target.value)
    }
    const nameChange = (e) => {
        setRTitle(e.target.value)
    }

    const save = () => {
        saveRecord(dataSource.key, rTitle, rRemark);
    }

    const rdelete = () => {
        deleteRecord(dataSource.key)
    }

    const openall = () => {
        let urls = dataSource.links.map(link=>link.url);
        createUrls(urls)
    }
    return (
        <Col span={8} style={{marginBottom: 5}}>
            <Card style={{borderColor: "green"}}
                  title={(<Input bordered={false} value={rTitle}
                                 onChange={nameChange}/>)}
                  extra={
                      <>
                          <Button danger type="text" onClick={rdelete}>删除</Button>
                          <Button type="link" onClick={save}>保存</Button>
                          <Button type="link" onClick={openall}>打开全部</Button>
                      </>
                  }>
                <span>{dataSource.createTime}</span>
                <List
                    dataSource={rData.links}
                    renderItem={(item) => (
                        <List.Item>
                            <div>
                                <a href={item.url}>{item.name}
                                    <span style={{
                                        fontSize: "smaller",
                                        marginLeft: 10,
                                        color: "gray"
                                    }}>{item.url.substr(0, 50)}</span>
                                </a>
                                <Button type="link" danger>删除</Button>
                            </div>
                        </List.Item>
                    )}
                />

                <TextArea value={rRemark} onChange={remarkChange} rows={8}/>

            </Card>
        </Col>
    )
}


export default RecordItem