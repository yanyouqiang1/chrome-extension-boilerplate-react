import type { ProColumns } from "@ant-design/pro-components";
import { EditableProTable} from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import "@ant-design/pro-components/dist/components.css";
import dayjs from "dayjs";
import { Button, message, Switch } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";


const { getStorage_notify,setStorage_notify,waitTime } = require('../../chromeCommon')
const {isToday,freshNotify} = require('../../alarmNotify')

type DataSourceType = {
  id: React.Key;
  status: boolean
  title: string;
  message?: string;
  everyday?: boolean; //是否每日提醒
  lastNotified?: string; //最近提醒日期
  at_time?: string;
  createTime?: string;

};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: "准备下班",
    message: "要准备准备下班",
    everyday: false,
    lastNotified: "2020-05-26",
    at_time: "2020-05-26T08:19:22Z",
    createTime: "2020-05-26T08:19:22Z",
    status: true
  }
];



export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);


  useEffect(() => {
    getStorage_notify((datas: any) => {
      datas = datas ? datas : defaultData;
      setDataSource(datas);
    });
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "启用闹钟",
      dataIndex: "status",
      tooltip: "启用闹钟",
      readonly: false,
      valueType: "switch",
      render: (text, record, _, action) => (
        <>
          <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.status} disabled />
        </>
      ),
      width: "10%"
    },
    {
      title: "通知标题",
      dataIndex: "title",
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > 1 ? [{ required: true, message: "此项为必填项" }] : []
        };
      },
      // 第一行不允许编辑
      editable: (text, record, index) => {
        return index !== 0;
      },
      width: "15%"
    },
    {
      title: "消息内容",
      dataIndex: "message",
      tooltip: "提醒消息的内容",
      readonly: false,
      width: "40%"
    },
    {
      title: "每天提醒",
      key: "everyday",
      dataIndex: "everyday",
      valueType: "switch",
      render: (text, record, _, action) => (
        <>
          {
            isToday(record.lastNotified) ?
              (<CheckCircleOutlined style={{color: "green",width:20}}/>) :""
              // (<AlertOutlined style={{color: "red",width:20}}/>)
          }
          <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.everyday} disabled />
        </>
      )
    },
    {
      title: "提醒时间",
      dataIndex: "at_time",
      valueType: "dateTime"
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      readonly: true
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
    setStorage_notify(filter);

  };
  const onChange = (datasource: any) => {
    setStorage_notify(datasource);
    setDataSource(datasource);
  };

  return (
    <>
      <EditableProTable<DataSourceType>
        toolBarRender={() => [
          <Button type={"primary"} onClick={freshNotify}>刷新闹钟</Button>
        ]}
        rowKey="id"
        headerTitle="你的通知闹钟"
        // maxLength={5}
        scroll={{
          x: 960
        }}
        recordCreatorProps={
          {
            position: "bottom",
            record: () => ({
              id: (Math.random() * 1000000).toFixed(0),
              title: "",
              createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              status: true
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
            waitTime(200).then(()=> freshNotify())

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