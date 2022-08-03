import { Button, Modal ,Checkbox, Form, Input} from 'antd';
import React, { useState } from 'react';
import {getStorage_newTabs_tags, setStorage_newTabs_tags} from "../util/ChromeCommon";


const App = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputTag,setInputTag] = useState('')



    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);

        getStorage_newTabs_tags(tags=>{
            tags = tags?tags:[]
            tags.unshift(inputTag)
            setStorage_newTabs_tags(tags)

            if (props.refresh){
                props.refresh()
            }
        })

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onchange = (event) => {
      setInputTag(event.target.value)
    }
    return (
        <>
            <Button type="link" onClick={showModal}>
                新建Tag
            </Button>
            <Modal title="新建tag" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input placeholder="please input an tag" value={inputTag} onChange={onchange} />
            </Modal>
        </>
    );
};

export default App;