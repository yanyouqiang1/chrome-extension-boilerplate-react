import type { ProColumns } from "@ant-design/pro-components";
import { EditableProTable, ProCard, ProFormField, ProFormRadio } from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import "@ant-design/pro-components/dist/components.css";
import dayjs from "dayjs";
import { Button } from "antd";

const notify_key = "notify_key";

function getStorage_notify(callback: (result: any) => void) {
  chrome.storage.local.get([notify_key], result => {
    callback(result.notify_key);
  });
}

function setStorage_notify(value: any) {
  chrome.storage.local.set({ notify_key: value });
}


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  title: string;
  message?: string;
  everyday?: boolean;
  at_time?: string;
  createTime?: string;
  status?: string //finish open
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: "准备下班",
    message: "要准备准备下班",
    everyday: false,
    at_time: "2020-05-26T08:19:22Z",
    createTime: "2020-05-26T08:19:22Z",
    status: "finish" //finish open
  }
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);


  useEffect(() => {
    getStorage_notify(datas => {
      datas = datas ? datas : defaultData;
      setDataSource(datas);
    });
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "通知名称",
      dataIndex: "title",
      tooltip: "只读，使用form.getFieldValue获取不到值",
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
      width: "50%"
    },
    {
      title: "每天提醒",
      key: "everyday",
      dataIndex: "everyday",
      valueType: "switch"
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

  const onSave = (data: DataSourceType) => {
    let assign = Object.assign([], dataSource);
    assign.push(data);
    setStorage_notify(assign);
    setDataSource(assign);
  };
  const freshNotify = () => {

    let data = {
      id: 740768,
      title: "准备下班",
      message: "要准备准备下班",
      everyday: false,
      at_time: "2022-08-20 20:32:05",
      createTime: "2020-05-26T08:19:22Z",
      status: "finish" //finish open
    };
    createAlarm(data);
  };
  //创建闹钟
  const createAlarm = (record: DataSourceType) => {
    chrome.alarms.create(record.id + "", {
      when: Date.parse(record.at_time + "")
    });
  };

  chrome.alarms.onAlarm.addListener(alarm => {
    getStorage_notify(datas => {
      let record = datas.filter((item: { id: string; }) => (item.id + "") == alarm.name);
      debugger
      createNotify(record)
    });
  });


  //创建提醒
  const createNotify = (record: DataSourceType) => {
    chrome.notifications.create(record.id + "", {
      iconUrl: chrome.runtime.getURL("logo.png"),
      title: record.title,
      type: "basic",
      message: record.message + "",
      buttons: [{ title: "Learn More" }],
      priority: 2
    }, function(notificationId) {
      console.log(notificationId);
    });
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
              createTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
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
            onSave(data);
            console.log(data);
          },
          onChange: setEditableRowKeys
        }}
      />
      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
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
      </ProCard>
    </>
  );
};