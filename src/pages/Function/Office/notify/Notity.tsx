import type { ProColumns } from "@ant-design/pro-components";
import { EditableProTable, ProCard, ProFormField } from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import "@ant-design/pro-components/dist/components.css";
import dayjs from "dayjs";
import { Button, message, Switch } from "antd";
import { AlertOutlined, CheckCircleOutlined } from "@ant-design/icons";

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

// 是否今天
function isToday(date: any): boolean {
  let today = dayjs().format("YYYY-MM-DD");
  return today == date;
}


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

  const freshNotify = () => {
    //清空闹钟
    chrome.alarms.clearAll();

    getStorage_notify(datas => {
      //open闹钟
      let openData = datas
        .filter((item: { status: string; }) => item.status);

      //每日闹钟 除去已经提醒的
      let everyData = openData
        .filter((item: { everyday: any; }) => item.everyday)
        .filter((item: { lastNotified: any; }) => !isToday(item.lastNotified));
      //调整时间
      let justifyData = everyData.map((item: { at_time: string; }) => {
        let today = dayjs().format("YYYY-MM-DD");
        let newTime = today + item.at_time.substring(item.at_time.indexOf(" "));
        item.at_time = newTime;
        return item;
      });

      //普通闹钟
      let normalData = openData.filter((item: { everyday: any; }) => !item.everyday)
        .filter((item: { at_time: number; }) => Date.parse(String(item.at_time)) > Date.now());

      let concat = normalData.concat(justifyData);

      concat.forEach((item: DataSourceType) => {
        createAlarm(item);
      });

      //将每日闹钟更新
      everyData.forEach((item: { id: any; }) => {
        let today = dayjs().format("YYYY-MM-DD");
        let findIndex = datas.findIndex((data: { id: any; }) => data.id == item.id);
        datas[findIndex].lastNotified = today;
        setStorage_notify(datas);
      });

      const info = (
        <>
          <p>共有{concat.length}个提醒</p>
          <p>其中每日提醒{everyData.length}个</p>
          <p>普通提醒{concat.length}个</p>
        </>
      )
      message.info(info);
    });
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
      createNotify(record[0]);
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
            freshNotify();
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