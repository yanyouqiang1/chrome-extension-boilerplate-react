import 'antd/dist/antd.css';
import {render} from "react-dom";

import {Space, Table, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import Search from "antd/es/input/Search";
import NewModel from "./NewModel";
import {getStorage_record_key, setStorage_record_key} from "../util/ChromeCommon";
import {arrayInclude} from '../util/arrayutil'
import TextArea from "antd/es/input/TextArea";
import TabSearch from "./TabSearch";
import NewTag from "./NewTag";
import EditModel from "./EditModel";
import './tabs.css'
import {similarity2} from "../util/similarity";

const TAB = () => {
    const [datasource, setDatasource] = useState([])
    const [fresh, setFresh] = useState(false)

    useEffect(() => {
        getStorage_record_key(result => {
            console.log("tabsRecord: ", result)
            result = result ? result : []

            setDatasource(result.slice(0,5))
        })
    }, [fresh])

    const deleteRecord = (record) => {
        if (confirm("确认删除吗?")){
            let newSource = Object.assign([],datasource)
            newSource = newSource.filter(s=>s.key!=record.key)

            setDatasource(newSource)

            setStorage_record_key(newSource)
        }
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            render: (text) => <a href={text}>{text.substring(0,30)}</a>
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            // render: (_, {remark}) => (
            //     <TextArea value={remark} onChange={}></TextArea>
            // )
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tags}) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';

                        if (tag === 'loser') {
                            color = 'volcano';
                        }

                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditModel superRefresh={refresh} recordkey={record.key} name={record.name} address={record.address} remark={record.remark} tags={record.tags}/>
                    <a onClick={() => deleteRecord(record)}>Delete</a>
                </Space>
            ),
        },
    ];

    //刷新
    const refresh = () => {
        const refresh = !fresh;
        setFresh(refresh);
    }

    //搜索
    const search = ({sname,stags}) => {
        getStorage_record_key(datasource=>{
            let ss = Object.assign([],datasource)
            if (stags){
                ss = ss.filter(datasource=>arrayInclude(datasource.tags,stags))
            }
            if (sname){
                //相似度计算并排序
                let result = ss.map(data=>{
                    let val = similarity2(data.name,sname)
                    if (val>0){
                        return {
                            similar: val,
                            data: data
                        }
                    }
                }).filter(a=>a)
                ss = result.sort((a,b)=>b.similar-a.similar).map(r=>r.data)
            }
            setDatasource(ss)
        })
    }




    return (
        <>
            <div className="container">
                <div className="search">
                    <TabSearch search={search} />
                </div>
                <div className="operation">
                    <NewModel superRefresh={refresh}/>
                    <NewTag />
                </div>
                <div className="table">
                    <Table columns={columns} dataSource={datasource} pagination={false}/>
                </div>
            </div>
        </>
    )
}

render(<TAB/>, window.document.querySelector('#app-container'));