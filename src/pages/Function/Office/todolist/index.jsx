import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import "antd/dist/antd.css";
import {Avatar, Badge, Button, Card, Checkbox, Col, List, Menu, Row, Typography} from "antd";
import dayjs from "dayjs";
import {
    CheckCircleOutlined, CheckOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import {getStorage_todolist, setStorage_todolist} from "../../chromeCommon";
import randomstring from "rdm-str";
import './index.css'

const STATUS_FINISH = "finish";
const STATUS_NEW = "new";

const TodoList = () => {
    const initData = [
        {
            key: "aaaaaa",
            content: "todotodododo",
            status: "finish",
            createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
            finishTime: ""
        }
    ];
    const [datasource, setDataSource] = useState([]);
    const [newDatasource, setNewDataSource] = useState([]);
    const [finishDatasource, setFinishDatasource] = useState([]);

    const [inputText, setInputText] = useState("");

    useEffect(() => {
        getStorage_todolist(datas => {
            datas = datas ? datas : [];
            setDataSource(datasource)
            setNewDataSource(datas.filter(it => it.status == STATUS_NEW));
            setFinishDatasource(datas.filter(it => it.status == STATUS_FINISH));

        });
    }, [datasource]);
    const textChange = (e) => {
        setInputText(e.target.value);
    };
    const newRecord = () => {
        const record =
            {
                key: randomstring(7),
                content: inputText,
                status: "new",
                createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
                finishTime: ""
            };
        let assign = Object.assign([], datasource);
        assign.unshift(record);

        saveAndFresh(assign);
    };
    const deleteRecord = (item) => {
        if (!confirm("确认删除吗？")) {
            return;
        }

        let assign = Object.assign([], datasource);
        assign.forEach((it, index) => {
            if (it.key == item.key) {
                assign.splice(index, 1);
            }
        });
        saveAndFresh(assign);
    };
    const finishRecord = (item) => {
        let assign = Object.assign([], datasource);
        assign.forEach((it, index) => {
            if (it.key == item.key) {
                assign[index].status = STATUS_FINISH;
            }
        });
        saveAndFresh(assign);
    };
    const saveAndFresh = (datasource) => {
        setInputText("");
        setStorage_todolist(datasource);
        setDataSource(datasource);
    };

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    type: 'group',
                    label: 'Group title',
                    children: [
                        {
                            key: '1-1',
                            label: '1st menu item',
                        },
                        {
                            key: '1-2',
                            label: '2nd menu item',
                        },
                    ],
                },
                {
                    key: '2',
                    label: 'sub menu',
                    children: [
                        {
                            key: '2-1',
                            label: '3rd menu item',
                        },
                        {
                            key: '2-2',
                            label: '4th menu item',
                        },
                    ],
                },
                {
                    key: '3',
                    label: 'disabled sub menu',
                    disabled: true,
                    children: [
                        {
                            key: '3-1',
                            label: '5d menu item',
                        },
                        {
                            key: '3-2',
                            label: '6th menu item',
                        },
                    ],
                },
            ]}
        />
    );

    return (
        <>
            <Row className="todoRow" justify="center" gutter={24}>
                <Col span={15} className="todoCol">
                    <Badge count={5} className="todoBadge">
                        <List
                            header={
                                <>
                                    <h2 className="todotitle">TODO</h2>
                                </>
                            }
                            footer={<>
                                <input value={inputText} className="inputText" onChange={textChange}/>
                                <Button onClick={newRecord} className="subBtn" type="primary">submit</Button>
                            </>}
                            itemLayout="horizontal"
                            dataSource={newDatasource}
                            renderItem={(item) => (
                                <List.Item actions={[
                                    <CloseCircleOutlined onClick={() => deleteRecord(item)} style={{color: "red"}}/>,
                                    <CheckOutlined onClick={() => finishRecord(item)} style={{color: "green"}}/>,

                                ]}
                                >
                                    <List.Item.Meta title={item.content} description={item.createTime}/>

                                </List.Item>
                            )}
                        />
                    </Badge>
                </Col>
            </Row>
            <Row justify="center" className="historyRow">
                <Col span={15}>
                    <List
                        header={<div>
                            <CheckCircleOutlined style={{color: "green"}}/>
                            完成历史
                            <select>
                                <option>最近30天</option>
                                <option>最近30天</option>
                                <option>最近30天</option>
                                <option>最近30天</option>
                            </select>
                        </div>}
                        footer={<></>}
                        itemLayout="horizontal"
                        dataSource={finishDatasource}
                        renderItem={(item) => (
                            <List.Item>
                                <div>
                                    <Typography.Text mark>[ITEM]</Typography.Text>
                                    {item.content}
                                    <Button onClick={() => finishRecord(item)}>done</Button>
                                    <Button onClick={() => deleteRecord(item)}>delete</Button>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};


render(<TodoList/>, window.document.querySelector("#app-container"));