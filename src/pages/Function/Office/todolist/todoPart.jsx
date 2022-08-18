import React, {useEffect, useRef, useState} from "react";
import {getStorage_todolist, setStorage_todolist} from "../../chromeCommon";
import randomstring from "rdm-str";
import dayjs from "dayjs";
import {Avatar, Badge, Button, Col, List, message, Row} from "antd";
import {CheckOutlined, CloseCircleOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {STATUS_NEW} from "./index";



const ToDoPart = () => {
    const [newDatasource, setNewDatasource] = useState([]);

    const [inputText, setInputText] = useState("");

    useEffect(() => {
        getStorage_todolist(datas => {
            datas = datas ? datas : [];
            setNewDatasource(datas.filter(it => it.status == STATUS_NEW));

        });
    }, []);

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
        saveAndFreshItem(record)
    };
    const deleteRecord = (item) => {
        if (!confirm("确认删除吗？")) {
            return;
        }
        saveAndFreshItem(item, true)
    };
    const finishRecord = (item) => {
        item.status = STATUS_FINISH
        saveAndFreshItem(item);
        message.info('Congratulations on');
    };

    const saveAndFreshItem = (item, isdelete = false) => {
        setInputText("");
        getStorage_todolist(datas => {

            var exist = false
            datas.forEach((it, index) => {
                if (it.key == item.key) {
                    if (isdelete) {
                        datas.splice(index, 1);
                    } else {
                        datas[index] = item
                    }
                    exist = true
                }
            });
            if (!exist) {
                datas.unshift(item);
            }
            setStorage_todolist(datas)
            setNewDatasource(datas.filter(it => it.status == STATUS_NEW));
        })
    };


    return (

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
    )
}

export default ToDoPart

