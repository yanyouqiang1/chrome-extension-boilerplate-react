import {render} from "react-dom";
import React, {useState} from "react";
import {Card, Col, Divider, Row} from 'antd';
import 'antd/dist/antd.css';

import {InboxOutlined} from '@ant-design/icons';
import {message, Upload} from 'antd';
import TextArea from "antd/es/input/TextArea";

const {Dragger} = Upload;


const Base64 = () => {
    const [content, setContent] = useState({})

    const props = {
        name: 'file',
        multiple: false,
        action: '#',

        onChange(info) {
            const {status} = info.file;
            debugger
            let fileReader = new FileReader();
            let content = fileReader.readAsText(info.file)


            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },

        beforeUpload(e) {
            debugger
            var data ='';
            let readerStream = e.stream()
            readerStream.on('data', function(chunk) {
                data += chunk;
            });

            readerStream.on('end',function(){
                console.log(data);
            });
            console.log(data)
        }
    };


    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>

            <TextArea rows={20} disabled={false} value={content}/>
        </>
    );
}


render(<Base64/>, window.document.querySelector('#app-container'));