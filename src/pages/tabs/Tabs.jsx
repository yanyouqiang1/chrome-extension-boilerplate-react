import 'antd/dist/antd.css';
import {render} from "react-dom";

import {Space, Table, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import Search from "antd/es/input/Search";
import NewModel from "./NewModel";
import {getStorage_record_key} from "./ChromeCommon";
import TextArea from "antd/es/input/TextArea";



const onSearch = () => {

}


const TAB = () => {
    const [datasource, setDatasource] = useState([])
    const [fresh,setFresh] = useState(false)

    useEffect(() => {
        getStorage_record_key(result => {
            console.log("tabsRecord: " , result)
            result = result ? result : []
            setDatasource(result)
        })
    }, [fresh])

    const deleteRecord = (record) => {
        console.log('delete')
        // let newSource = datasource.filter(item=>item.title!=record.title)
        // setDatasource(newSource)
    }

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
                    <a>Edit</a>
                    <a onClick={()=>deleteRecord(record)}>Delete</a>
                </Space>
            ),
        },
    ];

    const refresh=()=>{
        const refresh = !fresh;
        setFresh(refresh);
    }
    return (
        <>
            <NewModel superRefresh={refresh}/>
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