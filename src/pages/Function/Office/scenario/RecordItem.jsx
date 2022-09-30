import {Button, Card, Col, Collapse, Input, List, Popover} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, {useEffect, useState} from "react";
import {createUrls} from "../../chromeCommon";


const RecordItem = (props) => {
    const {dataSource, saveRecord, deleteRecord, linkDelete} = props
    // const [data, setData] = useState({})

    const [rData, setRData] = useState(dataSource)


    const remarkChange = (e) => {
        let assign = Object.assign({},rData);
        assign.remark = e.target.value
        setRData(assign)
    }
    const nameChange = (e) => {
        let assign = Object.assign({},rData);
        assign.title = e.target.value
        setRData(assign)
    }

    const save = () => {
        saveRecord(rData);
    }

    const rdelete = () => {
        deleteRecord(dataSource.key)
    }

    const openall = () => {
        let urls = dataSource.links.map(link => link.url);
        createUrls(urls)
    }

    const rlinkDelete = (index) => {
        if (confirm("确认删除吗？")) {
            linkDelete(dataSource.key, index)
        }
    }
    return (
        <Col span={24} style={{marginBottom: 5}}>
            <Card style={{borderColor: "green"}}
                  title={
                      <Popover content={dataSource.createTime} trigger="hover">
                          <Input bordered={false} value={rData.title}
                                 onChange={nameChange}/>
                      </Popover>}
                  extra={
                      <>
                          <Button danger type="text" onClick={rdelete}>删除</Button>
                          <Button type="link" onClick={save}>保存</Button>
                          <Button type="link" onClick={openall}>打开全部</Button>
                      </>
                  }>
                <List
                    dataSource={rData.links}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div>
                                <Popover content={item.url} trigger="hover">
                                    <a href={item.url} style={{fontSize: "xx-small"}}>{item.name}</a>
                                </Popover>
                                <Button type="link" danger onClick={() => rlinkDelete(index)}>删除</Button>
                            </div>
                        </List.Item>
                    )}
                />
                <TextArea value={rData.remark} onChange={remarkChange} rows={8}/>

            </Card>
        </Col>
    )
}


export default RecordItem