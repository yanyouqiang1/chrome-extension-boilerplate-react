import {Button, Form, Input, Radio, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {getCurrentTabsNoActive, getStorage_newTabs_tags} from "../util/ChromeCommon";
import TagSelect from "./TagSelect";

const TabSearch = (props) => {
    const [form] = Form.useForm();

    const search = () => {
        props.search(form.getFieldsValue())
    }

    return (

        <Form
            layout="inline"
            form={form}
        >
            <Form.Item label="名称" name="sname">
                <Input placeholder="input placeholder" autoFocus={true} />
            </Form.Item>
            <Form.Item label="标签" name="stags">
                <TagSelect />
            </Form.Item>
            <Form.Item >
                <Button type="primary" onClick={search}>搜索</Button>
            </Form.Item>
        </Form>
    );
};

export default TabSearch