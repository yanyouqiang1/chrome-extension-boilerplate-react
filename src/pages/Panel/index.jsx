import React, { useEffect, useState } from "react";
import { render } from "react-dom";

import "./index.css";
import { Button } from "antd";

const allData = {};

const handleData = (tempRequest) => {
  const { _resourceType, response, request } = tempRequest;
  const { url } = request;
  const { content } = response;
  const [type, mineType] = content.mimeType.split("/"); // image/gif
  const tempVal = {
    type,
    url,
    mineType,
    tempRequest
  };
  allData[_resourceType]
    ? allData[_resourceType].push(tempVal)
    : (allData[_resourceType] = [tempVal]);
};

chrome.devtools.network.onRequestFinished.addListener(function(request) {
  handleData(request);
});

const MyPanel = () => {
  const [result, setResult] = useState("");

  function log(str) {
    chrome.devtools.inspectedWindow.eval(
      `console.log(${str})`
    );
  }

  useEffect(() => {
    setResult(JSON.stringify(allData));
  }, []);

  const test = () => {
    chrome.devtools.network.getHAR(datas => {
        // log(JSON.stringify(datas));
        let filter = datas.entries.filter(ll => ll._resourceType == "xhr");
        setResult(JSON.stringify(filter));
      }
    );
  };
  return (
    <>
      <Button onClick={test}>刷新43</Button>
      <textarea value={result}></textarea>
    </>

  );
};


render(<MyPanel />, window.document.querySelector("#app-container"));
