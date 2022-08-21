import dayjs from "dayjs";
import { message } from "antd";
import React from "react";

const { getStorage_notify, setStorage_notify } = require("./chromeCommon");

// 是否今天
export const isToday = (date) => {
  let today = dayjs().format("YYYY-MM-DD");
  return today === date;
};


export const freshNotify = () => {
  //清空闹钟
  chrome.alarms.clearAll();

  getStorage_notify((datas) => {
    //open闹钟
    let openData = datas
      .filter((item) => item.status);

    //每日闹钟 除去已经提醒的
    let everyData = openData
      .filter((item) => item.everyday)
      .filter((item) => !isToday(item.lastNotified));
    //调整时间
    let justifyData = everyData.map((item) => {
      let today = dayjs().format("YYYY-MM-DD");
      let newTime = today + item.at_time.substring(item.at_time.indexOf(" "));
      item.at_time = newTime;
      return item;
    });

    //普通闹钟
    let normalData = openData.filter((item) => !item.everyday)
      .filter((item) => Date.parse(String(item.at_time)) > Date.now());

    let concat = normalData.concat(justifyData);

    concat.forEach((item) => {
      createAlarm(item);
    });

    //将每日闹钟更新
    everyData.forEach((item) => {
      let today = dayjs().format("YYYY-MM-DD");
      let findIndex = datas.findIndex((data) => data.id == item.id);
      datas[findIndex].lastNotified = today;
      setStorage_notify(datas);
    });

    const info = (
      <>
        <p>共有{concat.length}个提醒</p>
        <p>其中每日提醒{everyData.length}个</p>
        <p>普通提醒{concat.length}个</p>
      </>
    );
    message.info(info);
    console.log("create alarm:"+JSON.stringify(concat));
  });
};
//创建闹钟
const createAlarm = (record) => {
  chrome.alarms.create(record.id + "", {
    when: Date.parse(record.at_time + "")
  });
};

chrome.alarms.onAlarm.addListener(alarm => {
  getStorage_notify((datas) => {
    let record = datas.filter((item) => (item.id + "") === alarm.name);
    createNotify(record[0]);
  });
});


//创建提醒
const createNotify = (record) => {
  chrome.notifications.create(record.id + "", {
    iconUrl: chrome.runtime.getURL("logo.png"),
    title: record.title,
    type: "basic",
    message: record.message + "",
    buttons: [{ title: "OK" }],
    priority: 1
  }, function(notificationId) {
    console.log(notificationId);
  });
};