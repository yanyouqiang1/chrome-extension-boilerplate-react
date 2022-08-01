import 'antd/dist/antd.css';
import {render} from "react-dom";

import {Space, Table, Tag} from 'antd';
import React, {useState} from 'react';
import Search from "antd/es/input/Search";
import NewTabs from "./newTabs";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
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
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        address: 32,
        remark: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '1',
        name: 'John Brown',
        address: 32,
        remark: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '1',
        name: 'John Brown',
        address: 32,
        remark: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },

];

const onSearch=()=>{

}

const tabStoryKey ='tabsRepository'

const TAB = () => {
    const [datasource,setDatasource] = useState([])

    chrome.storage.local.get([tabStoryKey],result=>{
        console.log(result.tabStoryKey)
        if (result.tabStoryKey){
            setDatasource(result.tabStoryKey)
        }else{
            setDatasource(data)
        }
    })

    return (
        <>
            <NewTabs />
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
            />
            <br/>
            <Table columns={columns} dataSource={datasource}/>
        </>
    )
}

render(<TAB/>, window.document.querySelector('#app-container'));