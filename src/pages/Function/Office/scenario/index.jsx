import {render} from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import {Card, List, Col, Divider, Input, Row, Button, message, Image} from 'antd';
import 'antd/dist/antd.css';
import {getCurrentTabsNoActive, getStorage_scenario, setStorage_scenario} from "../../chromeCommon";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import randomstring from "rdm-str";
import RecordItem from "./RecordItem";
import {similarity2} from "../../similarity";


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
            console.log(result)
            result = result ? result : initDatas;
            setDatas(result)
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
                message.success("新建", 3)
            })

        })
    }
    const saveRecord = (item) => {
        let {key, title, remark, links} = item

        let assign = Object.assign([], datas);

        assign.map((data, index) => {
            if (data.key == key) {
                assign[index].links = links
                assign[index].title = title
                assign[index].remark = remark
            }
        })
        setDatas(assign)
        setStorage_scenario(assign)
        message.success('保存成功', 3);

    }
    const deleteRecord = (key) => {
        let assign = Object.assign([], datas);

        if (confirm("确认删除吗？")) {
            let current = datas;
            assign.map((data, index) => {
                if (data.key == key) {
                    assign.splice(index, 1)
                }
            })

            setDatas(assign)
            setStorage_scenario(assign)
            message.success('删除成功', 3);
        }
    }
    const onSearch = (value) => {
        let assign = Object.assign([], datas);
        debugger
        if (value) {
            let sort = assign.map(record => {
                record.count = similarity2(record.title, value)
                return record
            })
                .filter(a => a.count > 0)
                .sort((a, b) => b.count - a.count);
            setDatas(sort)
        } else {
            setDatas(assign)
        }
    }
    const linkDelete = (key, linkIndex) => {
        let assign = Object.assign([], datas);
        assign.map((data, index) => {
            if (data.key == key) {
                assign[index].links.splice(linkIndex, 1)
            }
        })

        setDatas(assign)
        setStorage_scenario(assign)
        message.success('删除成功', 3);
    }

    const linkadd = (key, link) => {
        datas.map(it=>{
            if (it.key==key){
                let add={
                    name: link.title,
                    url: link.url
                }
                it.links.unshift(add)
            }
        })
        setDatas(datas)
        setStorage_scenario(datas)
        message.success("suc")
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
                        <RecordItem key={data.key} dataSource={data} saveRecord={saveRecord}
                                    deleteRecord={deleteRecord} linkDelete={linkDelete} linkadd={linkadd}/>
                    )
                }

            </Row>
        </div>
    )
}


render(<Scenario/>, window.document.querySelector('#app-container'));