import { Button, Collapse, List, Modal, message } from 'antd';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import Search from 'antd/es/input/Search';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import store from 'store';

const initData = [
  {
    name: 'xxxST',
    links: [
      {
        title: '百度',
        url: 'www.baidu.com',
      },
      {
        title: '百度',
        url: 'www.baidu.com',
      },
    ],
  },
  {
    name: 'xxxUAT',
    links: [
      {
        title: '百度',
        url: 'www.baidu.com',
      },
      {
        title: '百度',
        url: 'www.baidu.com',
      },
    ],
  },
];

const saveKey = 'tab-tasks';

const Popup = () => {
  const [data, setData] = useState(initData);

  useEffect(() => {
    const saveData = store.get(saveKey) || initData;
    setData(saveData);
  }, []);

  function freshData() {
    return Object.assign(data);
  }

  function saveData(data) {
    store.set(saveKey, data);
  }
  const createRecord = (value) => {
    function onRecordSuccess() {
      Modal.confirm({
        title: '记录成功',
        content: '关闭所有标签页',
        onOk() {
          chrome.tabs.query({ currentWindow: true }, function (tabs) {
            // 关闭当前所有标签页
            for (var i = 0; i < tabs.length; i++) {
              chrome.tabs.remove(tabs[i].id);
            }

            // 新建一个标签页
            chrome.tabs.create({});
          });
        },
      });
    }
    //校验重复name
    const result = _.some(data, { name: value });
    if (result) {
      message.error('名称重复！');
      return;
    }

    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      var links = tabs.map(function (tab) {
        return {
          title: tab.title,
          url: tab.url,
        };
      });

      const record = {
        name: value,
        links,
      };
      const freshObj = freshData();
      freshObj.push(record);
      setData(freshObj);
      saveData(freshObj);
      onRecordSuccess();
    });
  };
  function openAll(item) {
    const { links } = item;
    for (var i = 0; i < links.length; i++) {
      chrome.tabs.create({ url: links[i].url });
    }
  }
  function deleteRecord(name) {
    Modal.confirm({
      title: '确认删除',
      onOk() {
        const newObj = _.remove(freshData(), (item) => item.name !== name);
        setData(newObj);
        saveData(newObj);
      },
    });
  }

  function showRecord(item) {
    Modal.info({
      title: item.name,
      content: (
        <>
          <List
            dataSource={item.links}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={<a href={item.url}>{item.title}</a>}
                  description={_.truncate(item.url, {
                    length: 20,
                    omission: '...',
                  })}
                />
              </List.Item>
            )}
          />
        </>
      ),
      maskClosable: true,
      okButtonProps: { style: { display: 'none' } },
    });
  }

  return (
    <List
      size="small"
      header={
        <>
          <Search
            placeholder="添加记录"
            allowClear
            enterButton="记录"
            size="large"
            onSearch={createRecord}
          />
        </>
      }
      bordered
      dataSource={data}
      pagination={{ defaultPageSize: 10, total: data.size }}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button type="primary" onClick={() => openAll(item)}>
              打开全部
            </Button>,
            <Button danger type="links" onClick={() => deleteRecord(item.name)}>
              删除
            </Button>,
          ]}
        >
          <span onClick={() => showRecord(item)}>{item.name}</span>
        </List.Item>
      )}
    />
  );
};

export default Popup;
