import type {ProColumns} from "@ant-design/pro-components";
import {EditableProTable} from "@ant-design/pro-components";
import React, {useEffect, useState} from "react";
import "@ant-design/pro-components/dist/components.css";
import {Button, message, Switch} from "antd";

const {getStorage_requestRevise, setStorage_requestRevise} = require('../../chromeCommon')

type DataSourceType = {
    id: React.Key;
    status: boolean
    url: string
    content?: string

};

const defaultData: DataSourceType[] = [
    {
        id: 624748504,
        status: false,
        url: "www.baidu.com",
        content:"123"
    }
];


export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);


    useEffect(() => {
        getStorage_requestRevise((datas: any) => {
            datas = datas ? datas : defaultData;
            setDataSource(datas);
        });
    }, []);

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: "启用规则",
            dataIndex: "status",
            tooltip: "启用闹钟",
            readonly: false,
            valueType: "switch",
            render: (text, record, _, action) => (
                <>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.status} disabled/>
                </>
            ),
            width: "10%"
        },
        {
            title: "URL地址",
            dataIndex: "url",
            formItemProps: (form, {rowIndex}) => {
                return {
                    rules: rowIndex > 1 ? [{required: true, message: "此项为必填项"}] : []
                };
            },
            width: "15%"
        },
        {
            title: "返回内容",
            dataIndex: "content",
            tooltip: "需要返回的内容",
            width: "40%"
        },
        {
            title: "操作",
            valueType: "option",
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
        setStorage_requestRevise(filter);
        message.success("删除成功")
    };
    const onChange = (datasource: any) => {
        setStorage_requestRevise(datasource);
        setDataSource(datasource);
    };

    const freshRule = () => {
        chrome.runtime.sendMessage({
            type: "requestRuleFresh",
            data:  null
        },()=>console.log("请求成功！"))
      message.success("刷新成功！")
    }
    return (
        <>
            <EditableProTable<DataSourceType>
                toolBarRender={() => [
                    <Button type={"primary"} onClick={freshRule}>刷新规则</Button>
                ]}
                rowKey="id"
                headerTitle="请求更新规则"
                // maxLength={5}
                scroll={{
                    x: 960
                }}
                recordCreatorProps={
                    {
                        position: "bottom",
                        record: () => ({
                            id: (Math.random() * 1000000).toFixed(0),
                            status: true,
                            url: "",
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
            {/*  <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: "100%"
            }
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>*/}

        </>
    );
};