import {Button, Card, Col, Input, List} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, {useEffect, useState} from "react";


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
    },[])

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
    return (
        <Col span={24} style={{marginBottom: 5}}>
            <Card style={{borderColor: "green"}}
                  title={(<Input placeholder="Borderless" bordered={false} value={rTitle}
                                 onChange={nameChange}/>)}
                  extra={<>
                      <Button danger type="text" onClick={rdelete}>删除</Button>
                      <Button type="link" onClick={save}>保存</Button>
                      <Button type="link">打开全部</Button>
                  </>
                  }>

                <List
                    dataSource={rData.links}
                    renderItem={(item) => (
                        <List.Item>
                            <div>
                                <a href={item.url}>{item.name}<br/>
                                    {item.url.substr(0, 80)}
                                </a>
                                <button>删除</button>
                            </div>
                        </List.Item>
                    )}
                />
                <TextArea value={rRemark} style={{marginTop: 5}} onChange={remarkChange} rows={8}/>
            </Card>
        </Col>
    )
}


export default RecordItem