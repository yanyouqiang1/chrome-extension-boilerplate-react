import {render} from "react-dom";
import React, {useState} from "react";
import {Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Switch, Tooltip} from "antd";
import "antd/dist/antd.css";
import {diffChars, diffJson, diffLines, diffSentences} from "diff";
import {QuestionCircleOutlined} from "@ant-design/icons";
import generate from 'generate-password'
const PassGenerate = () => {
    const [result,setResult] = useState('')


    const onFinish = (values) => {
        console.log(values)

        var password = generate(values);

        setResult(password)
    }
    return (
        <>
            <Form
                labelCol={{span: 4,}} wrapperCol={{span: 14,}}
                layout="horizontal"
                onFinish={onFinish}
            >
                <Form.Item name="numbers" label={"是否包含数字"} valuePropName="checked" >
                    <Switch />
                </Form.Item>

                <Form.Item name="symbols" label={"是否特殊字符"}  >
                    <Switch />
                </Form.Item>
                <Form.Item name="lowercase" label={"全小写"}  >
                    <Switch />
                </Form.Item>
                <Form.Item name="uppercase" label={"全大写"}  >
                    <Switch />
                </Form.Item>
                <Form.Item name="length" label={"长度"} initialValue={5} >
                    <InputNumber />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>

            <Input value={result} />
        </>
    );
}


render(<PassGenerate/>, window.document.querySelector("#app-container"));