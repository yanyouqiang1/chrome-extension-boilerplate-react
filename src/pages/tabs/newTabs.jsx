import React, {useState} from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Cascader,
    DatePicker,
} from 'antd';

const {RangePicker} = DatePicker;
const {TextArea} = Input;

const NewTabs = (props) => {


    return (
        <>
            <Form
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                submit={""}
            >
                <Form.Item label="Select">
                    <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Cascader">
                    <Cascader
                        options={[
                            {
                                value: 'zhejiang',
                                label: 'Zhejiang',
                                children: [
                                    {
                                        value: 'hangzhou',
                                        label: 'Hangzhou',
                                    },
                                ],
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="TextArea">
                    <TextArea rows={4}/>
                </Form.Item>
                <Form.Item label="Button">
                    <Button type="submit">提交</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default NewTabs;
