import type {ProColumns} from "@ant-design/pro-components";
import {EditableProTable} from "@ant-design/pro-components";
import React, {useEffect, useState} from "react";
import "@ant-design/pro-components/dist/components.css";
import dayjs from "dayjs";
import {message} from "antd";
// @ts-ignore
import randomstring from "rdm-str";

const {getCurrentTabsNoActive, getStorage_scenario, setStorage_scenario} = require('../../chromeCommon')


type DataSourceType = {
    id: React.Key;
    title: string;
    createTime?: string;
    remark: string;
    link: string;
};

const defaultData: DataSourceType[] = [
    {
        id: 624748504,
        createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
        title: "title",
        remark: "content",
        link: "[\n" +
            "            {\n" +
            "                \"name\": \"测试\",\n" +
            "                \"url\": \"www.baidu.com\"\n" +
            "            }\n" +
            "        ]"
    }
];


export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);


    useEffect(() => {
        getStorage_scenario((datas: any) => {
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
            title: "备注",
            dataIndex: "remark",
            valueType: "textarea",
            width: "20%",
            render: text => (
                <pre style={{width: "100%"}}>{text}</pre>
            )
        },
        {
            title: "链接",
            dataIndex: "link",
            valueType: "textarea",
            width: "50%",
            render: (text: any) => {
                try {
                    let links = JSON.parse(text)
                    return (
                        <ul>
                            {
                                links.map((link: any) => (
                                    <li>
                                        <a href={link.url}>{link.name}</a>
                                    </li>
                                ))
                            }
                        </ul>
                    )
                } catch (e: any) {
                    return (<div color="red">{e.message}</div>)
                }

            }
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
        setStorage_scenario(filter);
        message.success("删除成功！")
    };
    const onChange = (datasource: any) => {
        setStorage_scenario(datasource);
        setDataSource(datasource);
        message.success("更新成功！")
    };

    function getLinks() {
        return getCurrentTabsNoActive().then((tabs: any) => {
            let links = tabs.map((tab: any) => (
                {
                    name: tab.title,
                    url: tab.url
                }
            ))
            return Promise.resolve(JSON.stringify(links));
        });
    }

    return (
        <>
            <EditableProTable<DataSourceType>
                rowKey="id"
                headerTitle="场景管理"
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
                            remark: "",
                            link: getLinks(),
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