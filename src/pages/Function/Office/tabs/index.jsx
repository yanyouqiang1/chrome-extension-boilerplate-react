import 'antd/dist/antd.css';
import {render} from "react-dom";
import {Button, Col, Row, Space, Table, Tag} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import NewModel from "./NewModel";
import {getStorage_newTabs_tags, getStorage_record_key, setStorage_record_key} from "../../chromeCommon";
import {arrayInclude} from '../../arrayutil'
import NewTag from "./NewTag";
import EditModel from "./EditModel";
import './tabs.css'
import {similarity2} from "../../similarity";
import Search from "antd/es/input/Search";

const {CheckableTag} = Tag;


const TAB = () => {
    const saveData = useRef()
    const [datasource, setDatasource] = useState([])
    const [fresh, setFresh] = useState(false)
    const [tags, setTags] = useState([])

    const [selectedTags, setSelectedTags] = useState([]);


    useEffect(() => {
        getStorage_record_key(result => {
            result = result ? result : []
            saveData.current = result
            setDatasource(result.slice(0, 10))
        })
        getStorage_newTabs_tags(result => {
            result = result ? result : []
            setTags(result)
        })
    }, [fresh])


    const deleteRecord = (record) => {
        if (confirm("确认删除吗?")) {
            let current = saveData.current;
            current = current.filter(s => s.key != record.key)

            saveData.current = current
            setDatasource(Object.assign([], current))
            setStorage_record_key(current)
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
            render: (_, record) => {
                return <div style={{maxWidth: '500px'}}>
                    <a href={record.address} style={{fontSize: "small"}}>
                        <span style={{color: "black",}}>{record.title}</span>
                        <br/>
                        {record.address}
                    </a>
                </div>
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tags}) => {
                tags = tags ? tags : []
                return (
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
                )
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditModel superRefresh={refresh} recordkey={record.key} name={record.name} address={record.address}
                               remark={record.remark} tags={record.tags}/>
                    <Button type="link" onClick={() => deleteRecord(record)} danger>Delelte</Button>
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
    const onSearch = (searchText) => {
        getStorage_record_key(originData => {
            let ss = Object.assign([], originData)
            if (selectedTags) {
                ss = ss.filter(datasource => arrayInclude(datasource.tags, selectedTags))
                ss.sort((a, b) => a.tags.length - b.tags.length)
            }
            if (searchText) {
                //相似度计算并排序
                let result = ss.map(data => {
                    let val = similarity2(data.name, searchText)
                    if (val > 0) {
                        return {
                            similar: val,
                            data: data
                        }
                    }
                }).filter(a => a)
                ss = result.sort((a, b) => b.similar - a.similar).map(r => r.data)
            }
            setDatasource(ss)
        })
    }

    const handleChange = (tag, checked) => {
        getStorage_record_key(originData => {
            const nextSelectedTags = checked
                ? [...selectedTags, tag]
                : selectedTags.filter((t) => t !== tag);
            console.log('选中tags ', nextSelectedTags);

            let ss = Object.assign([], originData)
            if (nextSelectedTags) {
                ss = ss.filter(datasource => arrayInclude(datasource.tags, nextSelectedTags))
                ss.sort((a, b) => a.tags.length - b.tags.length)
            }

            setSelectedTags(nextSelectedTags);
            setDatasource(ss)
        })

    };

    return (
        <>
            <div className="container">
                <div className="search">
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                    />
                </div>
                <div className="searchtag">
                    {tags.map((tag) => (
                        <CheckableTag
                            key={tag}
                            className="tag"
                            checked={selectedTags.indexOf(tag) > -1}
                            onChange={(checked) => handleChange(tag, checked)}
                        >
                            {tag}
                        </CheckableTag>
                    ))}

                </div>
                <div className="operation">
                    <NewModel superRefresh={refresh}/>
                    <NewTag/>
                </div>
                <div className="table">
                    <Table columns={columns} dataSource={datasource} pagination={false}/>
                </div>
            </div>
        </>
    )
}

render(<TAB/>, window.document.querySelector('#app-container'));