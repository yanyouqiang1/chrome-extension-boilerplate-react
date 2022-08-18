import React, {useEffect, useState} from "react";
import {getStorage_todolist} from "../../chromeCommon";
import DatetimeMachine from "datetime-machine";
import dayjs from "dayjs";
import {Avatar, Col, Dropdown, List, Menu, Row, Space} from "antd";
import {CheckCircleOutlined, DownOutlined} from "@ant-design/icons";
import {STATUS_FINISH} from "./index";
import './index.css'

const FinishPart = () => {
    const [finishDatasource, setFinishDatasource] = useState([]);

    useEffect(() => {
        getStorage_todolist(datas => {
            datas = datas ? datas : [];
            setFinishDatasource(datas.filter(it => it.status == STATUS_FINISH));

        });
    }, []);

    const datetimeMachine = new DatetimeMachine()
    const menuItemClick = ({key}) => {
        let now = dayjs().format("YYYY-MM-DD HH:mm:ss");

        getStorage_todolist(datas => {
            if (datas){
                let filter = datas.filter(data => datetimeMachine.compute(data.finishTime, now).total.day < key);
                setFinishDatasource(filter)
            }else {
                setFinishDatasource([])
            }

        })
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
    )
}

export default FinishPart