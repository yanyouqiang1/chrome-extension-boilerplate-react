import {Button, Card, Col, Input, Row} from 'antd';
import React, {useEffect, useState} from 'react';
import {render} from "react-dom";
import 'antd/dist/antd.css';
import dayjs from "dayjs";
import {getStorage_fragement, setStorage_fragement} from "../../chromeCommon";
import Frage from "./Frage";
import randomstring from "rdm-str";

const Fragement = () => {

    const initData = [
        {
            key: "zxcvbnm",
            createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
            title: "title",
            content: "content"
        }
    ]

    const [datas, setDatas] = useState([])

    // const [inputs,setInputs] = useState([])

    useEffect(() => {
        getStorage_fragement(result => {
            result = result ? result : initData
            setDatas(result)
        })
    }, [])


    const itemSave = (item) => {
        let assign = Object.assign([], datas);
        assign.map((data, index) => {
            if (data.key == item.key) {
                assign[index] = item
            }
        })

        setDatas(assign)
        setStorage_fragement(assign)
    }
    const itemDelete = (key) => {
        let assign = Object.assign([], datas);
        assign.map((data, index) => {
            if (data.key == key) {
                assign.splice(index, 1)
            }
        })

        setDatas(assign)
        setStorage_fragement(assign)
    }

    const newData = () => {
        let data = {
            key: randomstring(7),
            createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
            title: "new",
            content: "new"
        }
        let assign = Object.assign([], datas);
        assign.unshift(data)

        setDatas(assign)
        setStorage_fragement(assign)
    }
    return (
        <div className="site-card-wrapper" style={{width: "80%", margin: "auto"}}>
            <Button type={"primary"} style={{float: "right"}} onClick={newData}>NEW</Button>
            <Row gutter={24}>
                {
                    datas.map(data =>
                        <Frage key={data.key} save={itemSave} ondelete={itemDelete} data={data}/>
                    )
                }
            </Row>
        </div>
    );
}

render(<Fragement/>, window.document.querySelector('#app-container'));