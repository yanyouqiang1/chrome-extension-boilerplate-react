import type {ProColumns} from '@ant-design/pro-components';
import {EditableProTable, ProCard, ProFormField, ProFormRadio} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {message, Switch} from "antd";
const {getStorage_requestRevise, setStorage_requestRevise} = require('../Function/chromeCommon')

type DataSourceType = {
    id: React.Key;
    title: string;
    from: string;
    to: string;
    isUseData?: boolean;
    data?: string;
};

const defaultData: DataSourceType[] = [
    {
        id: 624748504,
        title: '活动名称一',
        from: 'www.baidu.com',
        to: 'www.bing.com'
    },
    {
        id: 624748505,
        title: '活动名称而',
        from: 'www.baidu.com',
        to: 'www.bing.com',
        isUseData: true,
        data: "{'hello': 'good'}"
    }
];

export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '名称',
            dataIndex: 'title',
        },
        {
            title: 'from',
            dataIndex: 'from',
            tooltip: '待转发地址',
        },
        {
            title: 'to',
            dataIndex: 'to',
            tooltip: '转发地址',
        },
        {
            title: '是否自定义数据返回',
            dataIndex: 'isUseData',
            tooltip: '是否自定义数据返回',
            render: (text,record) => {
                return <Switch checked={record.isUseData||false} />
            }
        },
        {
            title: '返回数据',
            dataIndex: 'data',
            tooltip: '返回数据',
            valueType: 'jsonCode'
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        onDelete(record)
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    useEffect(()=>{
        getStorage_requestRevise((data:any)=>{
            setDataSource(data||defaultData)
        })

    },[])

    const onDelete = (record: any) => {
        let filter = dataSource.filter((item) => item.id !== record.id);
        setDataSource(filter);
        setStorage_requestRevise(filter);
        message.success("删除成功！")
    };
    const onChange = (datasource: any) => {
        setStorage_requestRevise(datasource);
        setDataSource(datasource);
        message.success("更新成功！")
    };


    return (
        <>
            <EditableProTable<DataSourceType>
                rowKey="id"
                headerTitle=""
                maxLength={5}
                scroll={{
                    x: 960,
                }}
                recordCreatorProps={
                    {
                        position: 'top',
                        record: () => (
                            {
                                id: (Math.random() * 1000000).toFixed(0),
                                title: '名称',
                                from: 'www.baidu.com',
                                to: 'www.bing.com',
                                isUseData: false,
                            })
                    }

                }
                loading={false}
                columns={columns}
                value={dataSource}
                onChange={onChange}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        console.log(rowKey, data, row);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
            <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
                <ProFormField
                    ignoreFormItem
                    fieldProps={{
                        style: {
                            width: '100%',
                        },
                    }}
                    mode="read"
                    valueType="jsonCode"
                    text={JSON.stringify(dataSource)}
                />
            </ProCard>
        </>
    );
};