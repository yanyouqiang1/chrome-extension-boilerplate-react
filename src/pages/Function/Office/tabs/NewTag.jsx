import {Button, Modal, Checkbox, Form, Input, Tag, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {getStorage_newTabs_tags, setStorage_newTabs_tags} from "../../chromeCommon";

const tagColor = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

const App = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputTag, setInputTag] = useState('')
    const [tags, setTags] = useState([])


    useEffect(() => {
        getStorage_newTabs_tags(result => {
            result = result ? result : []
            setTags(result)
        })
    },[])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setInputTag("")
        setIsModalVisible(false);

        let assign = Object.assign([],tags);
        // let current = saveTag.current;

        //查重
        if (!assign.includes(inputTag)) {
            assign.unshift(inputTag)

            setTags(assign)
            setStorage_newTabs_tags(assign)

            message.success("添加成功", 3)
        } else {
            message.error("重复标签", 3)
        }


    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onchange = (event) => {
        setInputTag(event.target.value)
    }
    const close = (tag) => {
        if (confirm("确认吗？")) {
            let assign = Object.assign([],tags);
            assign = assign.filter(s => s != tag)

            setStorage_newTabs_tags(assign)
            setTags(assign)
            message.success("删除成功", 3)
        }
    }
    return (
        <>
            <Button type="link" onClick={showModal}>
                TAG管理
            </Button>
            <Modal title="TAG管理" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input placeholder="please input an tag" value={inputTag} onChange={onchange}/>
                <div>
                    {tags.map((tag, index) =>
                        <Tag key={tag} closable onClose={() => close(tag)} color={tagColor[index % tagColor.length]}
                             style={{marginTop: 10, marginLeft: 5}}>
                            {tag}
                        </Tag>)}
                </div>
            </Modal>
        </>
    );
};

export default App;