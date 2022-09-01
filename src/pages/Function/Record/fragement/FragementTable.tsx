import type {ProColumns} from "@ant-design/pro-components";
import {EditableProTable} from "@ant-design/pro-components";
import React, {useEffect, useState} from "react";
import "@ant-design/pro-components/dist/components.css";
import dayjs from "dayjs";
import {message} from "antd";

const {getStorage_fragement, setStorage_fragement} = require('../../chromeCommon')

type DataSourceType = {
    id: React.Key;
    title: string;
    content: string
    createTime?: string;

};

const defaultData: DataSourceType[] = [
    {
        id: 624748504,
        createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
        title: "title",
        content: "content"
    }
];


export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);


    useEffect(() => {
        getStorage_fragement((datas: any) => {
            datas = datas ? datas : defaultData;
            setDataSource(datas);
        });
    }, []);

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: "标题",
            dataIndex: "title",
            tooltip: "",
            readonly: false,
            valueType: "text",
            width: "10%"
        },
        {
            title: "内容",
            dataIndex: "content",
            valueType: "textarea",
            width: "60%"
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            valueType: "dateTime",
            readonly: true,
            width: "10%"
        },
        {
            title: "操作",
            valueType: "option",
            width: "10%",
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
                    onClick={() => onDelete(record)}
                >
                    删除
                </a>
            ]
        }
    ];
    const onDelete = (record: any) => {
        let filter = dataSource.filter((item) => item.id !== record.id);
        setDataSource(filter);
        setStorage_fragement(filter);
        message.success("删除成功！")
    };
    const onChange = (datasource: any) => {
        setStorage_fragement(datasource);
        setDataSource(datasource);
        message.success("更新成功！")
    };

    return (
        <>
            <EditableProTable<DataSourceType>
                rowKey="id"
                headerTitle="片段列表"
                // maxLength={5}
                scroll={{
                    x: 960
                }}
                recordCreatorProps={
                    {
                        position: "top",
                        record: () => ({
                            id: (Math.random() * 1000000).toFixed(0),
                            title: "",
                            content: "",
                            createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        })
                    }
                }
                loading={false}
                columns={columns}
                value={dataSource}
                onChange={onChange}
                editable={{
                    type: "multiple",
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        // onSave(data);
                    },
                    onChange: setEditableRowKeys
                }}
            />

        </>
    );
};