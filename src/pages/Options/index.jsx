import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';
import {Button, Input, message, Upload} from "antd";
import 'antd/dist/antd.css';
import {UploadOutlined} from "@ant-design/icons";
import {
    getAllStorageData,
    getConfig,
    getStorage_record_key,
    setConfig_key,
    updateAllStorageData
} from "../Function/chromeCommon";

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
        getAllStorageData().then(datas => {
            if (datas) {
                download("yyq-weapon.json", JSON.stringify(datas))
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

    const [beidouPath, setBeidouPath] = useState('')
    const [cmdbPath, setCmdbPath] = useState('')

    useEffect(()=>{
        getConfig(config=>{
            config = config||{}
            setBeidouPath(config['beidou'])
            setCmdbPath(config['cmdb'])
        })
    },[])

    const btnBeidouSet = () => {
        getConfig(config => {
            config = config || {}
            config['beidou'] = beidouPath;
            setConfig_key(config)
            message.success("设置成功")
        })
    }

    const btnCmdbSet = () => {
        getConfig(config => {
            config = config || {}
            config['cmdb'] = cmdbPath;
            setConfig_key(config)
            message.success("设置成功")
        })
    }

    return (
        <>
            <Upload {...props}>
                <Button style={{width: 100, height: 100}} icon={<UploadOutlined/>}>导入</Button>
            </Upload>

            <Button style={{width: 100, height: 100}} onClick={exportConfig}>导出</Button>

            <Input value={beidouPath} onChange={e => {
                setBeidouPath(e.target.value)
            }}/>
            <Button onClick={btnBeidouSet}>设置北斗搜索路径</Button>

            <Input value={cmdbPath} onChange={e => {
                setCmdbPath(e.target.value)
            }}/>
            <Button onClick={btnCmdbSet}>设置CMDB搜索路径</Button>
        </>
    )
}


render(
    <Options/>,
    window.document.querySelector('#app-container')
);

