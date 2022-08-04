import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import {Card, List, Col, Divider, Input, Row, Button} from 'antd';
import 'antd/dist/antd.css';
import {getCurrentTabsNoActive, getStorage_scenario, setStorage_scenario} from "../../chromeCommon";
import TextArea from "antd/es/input/TextArea";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import randomstring from "rdm-str";
import RecordItem from "./RecordItem";


const Scenario = () => {
    const [datas, setDatas] = useState([])

    const initDatas = [{
        key: "aaaaa",
        title: "test",
        createTime: "2022-2-2",
        remark: "这是一个remark",
        links: [
            {
                name: "测试",
                url: "www.baidu.com"
            }
        ]
    }]

    useEffect(() => {
        getStorage_scenario(result => {
            result = result ? result : initDatas;
            console.log(result)
            let newDatas = Object.assign([], result)
            setDatas(newDatas)
        })
    }, [])

    const record = () => {
        //找到活动标签
        getCurrentTabsNoActive().then(tabs => {
            let links = tabs.map((tab) => (
                {
                    name: tab.title,
                    url: tab.url
                }
            ))
            let newRecord = {
                key: randomstring(7),
                title: "new",
                createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
                remark: "",
                links: links
            }

            getStorage_scenario((records) => {
                records = records ? records : []
                records.unshift(newRecord)

                setStorage_scenario(records);
                setDatas(records)
            })

        })
    }
    const saveRecord = (key, title, remark) => {
        console.log(title)
    }
    const deleteRecord = (key) => {
        getStorage_scenario((records) => {
            let newRecord = records.filter(re => re.key != key)
            setStorage_scenario(newRecord)
            setDatas(newRecord)
        })
    }
    const onSearch = () => {

    }
    return (
        <div className="site-card-wrapper" style={{width: '80%', margin: "auto"}}>
            <Row gutter={24}>
                <Col span={24}>
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        style={{marginTop: 10, marginBottom: 20}}
                    />
                </Col>
                <Col span={24} style={{textAlign: "right", marginBottom: 5}}>
                    <Button type="primary" onClick={record}>RECORD</Button>
                </Col>
                {
                    datas.map(data =>
                        <RecordItem key={data.key} dataSource={data} saveRecord={saveRecord} deleteRecord={deleteRecord}/>
                    )
                }

            </Row>
        </div>
    )
}


render(<Scenario/>, window.document.querySelector('#app-container'));