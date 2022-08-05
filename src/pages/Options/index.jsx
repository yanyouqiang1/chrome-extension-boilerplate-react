import React from 'react';
import {render} from 'react-dom';
import {Button, Upload} from "antd";
import 'antd/dist/antd.css';
import {UploadOutlined} from "@ant-design/icons";
import {getAllStorageData, getStorage_record_key, updateAllStorageData} from "../Function/chromeCommon";

const Options = () => {

    const props = {
        name: 'file',
        action: '#',
        headers: {
            authorization: 'authorization-text',
        },

        beforeUpload: (file, fileList) => {
            // 创建FileReader 对象读取
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                console.log(reader.result)
                updateAllStorageData(JSON.parse(reader.result));
            };
        },

    };

    const exportConfig = () => {
        getAllStorageData().then(datas=>{
            if (datas){
                download("yyq-weapon.json",JSON.stringify(datas))
            }
        })
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    return (
        <>
            <Upload {...props}>
                <Button style={{width: 100, height: 100}} icon={<UploadOutlined />}>导入</Button>
            </Upload>

            <Button style={{width: 100, height: 100}} onClick={exportConfig}>导出</Button>
        </>
    )
}


render(
    <Options/>,
    window.document.querySelector('#app-container')
);

