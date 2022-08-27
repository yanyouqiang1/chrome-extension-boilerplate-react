import {render} from "react-dom";
import React, {useState} from "react";
import 'antd/dist/antd.css';

import {InboxOutlined} from '@ant-design/icons';
import {message, Upload} from 'antd';
import TextArea from "antd/es/input/TextArea";

const {Dragger} = Upload;


const Base64 = () => {
    const [content, setContent] = useState('')
    const [top, setTop] = useState('')

    const onImportExcel = (file) => {
        // 创建FileReader 对象读取
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // 获取文件内容存进tempFile
            let base64 = reader.result;

            let index = base64.indexOf('base64')+'base64'.length+1

            let top = base64.substr(0,index)
            let content = base64.substr(index)

            setTop(top)
            setContent(content);

        };
    };


    const uploadProps = {
        name: 'file',
        action: '',
        showUploadList: false,
        beforeUpload: (file, fileList) => {
            onImportExcel(file);
        },
    };



    return (
        <>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>

            <h2>BASE64头部</h2>
            <input type={"text"} value={top} disabled={true} style={{width:'100%'}}/>
            <h2>BASE64结果</h2>
            <TextArea rows={20} disabled={true} value={content} autoSize={true}/>
        </>
    );
}


render(<Base64/>, window.document.querySelector('#app-container'));