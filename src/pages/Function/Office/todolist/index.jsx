import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import "antd/dist/antd.css";
import {Avatar, Badge, Button, Card, Checkbox, Col, Dropdown, List, Menu, message, Row, Space, Typography} from "antd";
import dayjs from "dayjs";
import {
    CheckCircleOutlined, CheckOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined, DownOutlined,
    ExclamationCircleOutlined, InfoCircleOutlined
} from "@ant-design/icons";
import {getStorage_todolist, setStorage_todolist} from "../../chromeCommon";
import randomstring from "rdm-str";
import './index.css'
import DatetimeMachine from "datetime-machine";

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

    const [freshFlag, setFreshFlag] = useState(false)


    const [inputText, setInputText] = useState("");

    useEffect(() => {
        getStorage_todolist(datas => {
            datas = datas ? datas : [];
            setDataSource(datas)
            setNewDataSource(datas.filter(it => it.status == STATUS_NEW));
            setFinishDatasource(datas.filter(it => it.status == STATUS_FINISH));

        });
    }, [freshFlag]);
    const textChange = (e) => {
        setInputText(e.target.value);
    };
    const newRecord = () => {
        const record =
            {
                key: randomstring(7),
                content: inputText,
                status: "new",
                createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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
                assign[index].finishTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
            }
        });
        saveAndFresh(assign);

        message.info('Congratulations on');
    };
    const saveAndFresh = (datasource) => {
        setInputText("");
        setStorage_todolist(datasource);
        setDataSource(datasource);
        setFreshFlag(!freshFlag)
    };

    const datetimeMachine = new DatetimeMachine()
    const menuItemClick = ({key}) => {
        let now = dayjs().format("YYYY-MM-DD HH:mm:ss");

        let assign = Object.assign([], datasource);
        let filter = assign.filter(data => datetimeMachine.compute(data.finishTime, now).total.day < key);

        setFinishDatasource(filter)
    };

    window.onload = () => {
        menuItemClick({key: 7})
    }

    const menu = (
        <Menu
            onClick={menuItemClick}
            items={[
                {
                    label: '最近7天',
                    key: '7',
                },
                {
                    label: '最近30天',
                    key: '30',
                },
                {
                    label: '最近三个月',
                    key: '90',
                },
                {
                    label: '最近半年',
                    key: '180',
                },
                {
                    label: '最近一年',
                    key: '365',
                },
            ]}
        />
    );

    return (
        <>
            <Row className="todoRow" justify="center" gutter={24}>
                <Col span={15} className="todoCol">
                    <Badge count={newDatasource.length} className="todoBadge">
                        <List
                            header={
                                <>
                                    <h4><InfoCircleOutlined style={{color: "red"}}/> 待办事项</h4>
                                </>
                            }
                            footer={<>
                                <input value={inputText} className="inputText" onChange={textChange}/>
                                <Button onClick={newRecord} className="subBtn" type="primary">submit</Button>
                            </>}
                            itemLayout="horizontal"
                            dataSource={newDatasource}
                            renderItem={(item, index) => (
                                <List.Item actions={[
                                    <CloseCircleOutlined onClick={() => deleteRecord(item)} style={{color: "red"}}/>,
                                    <CheckOutlined onClick={() => finishRecord(item)} style={{color: "green"}}/>,

                                ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar className="todoAvatar">{index + 1}</Avatar>}
                                        title={item.content}
                                        description={item.createTime}
                                    />

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
                            <Dropdown overlay={menu} className="historySelect">
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        选择时间
                                        <DownOutlined/>
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>}
                        footer={<></>}
                        itemLayout="horizontal"
                        dataSource={finishDatasource}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar className="finishAvatar">{index + 1}</Avatar>}
                                    title={item.content}
                                    description={<div>
                                        创建时间：{item.createTime   }
                                        完成时间：{item.finishTime}
                                    </div> }
                                ></List.Item.Meta>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};


render(<TodoList/>, window.document.querySelector("#app-container"));