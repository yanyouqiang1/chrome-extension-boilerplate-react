import {PlusOutlined} from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import React, {useState} from "react";
// @ts-ignore
import MonacoEditor from "../MonacoEditor";
// @ts-ignore
import jsonFormat from "json-format";


const ModalJsonEdit = (props: any) => {
    const {
        title = "新建表单",
        trigger = (<Button type="primary">
            <PlusOutlined/>
            新建表单
        </Button>),
        value,
        onFinish = (result: any) => console.log(result)
    }
        = props
    const [jsonStr, setJsonStr] = useState(jsonFormat(value))

    const jsonChange = (value: any) => {
        console.log(value)
        setJsonStr(value)
    }
    return (
        <ModalForm<{
            name: string;
            company: string;
        }>
            title={title}
            trigger={trigger}
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}
            onFinish={async (values) => {
                try {
                    let result = JSON.parse(jsonStr);
                    onFinish(result)
                    message.success('提交成功');
                    return true
                } catch (e) {
                    message.error('格式错误，提交失败');
                    return false
                }
            }}
        >
            <MonacoEditor onChange={jsonChange} value={jsonStr}/>
        </ModalForm>
    );
};

export default ModalJsonEdit;