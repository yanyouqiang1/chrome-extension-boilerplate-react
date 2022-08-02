import {Button, Modal, Select} from 'antd';
import React, {useState} from 'react';
import {Option} from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import {
    getCurrentTabsNoActive,
    getStorage_newTabs_tags,
    getStorage_record_key,
    setStorage_record_key
} from "./ChromeCommon";

const NewDialog = () => {
    //######render data
    //select
    //tab
    const [tabOptions, setTabOptions] = useState([])
    var currentTabs = []
    getCurrentTabsNoActive().then(tabs => {
        currentTabs = tabs
        setTabOptions(tabs.map(tab => <Option key={tab.index}>{tab.title}</Option>))
    })
    //remark
    const [remark, setRemark] = useState([])
    const remarkChange = (e) => {
        setRemark(e.target.value)
    }
    //tag
    const [tagOptions, setTagOptions] = useState([])
    getStorage_newTabs_tags(tagsOfSaved => {
            setTagOptions(tagsOfSaved.map(tag => <Option key={tag}>{tag}</Option>))
        }
    )

    //model
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    //##submit
    var selectedTabs = {}
    const tabsSelected = (key) => {
        console.log("tabs: " + key)
        selectedTabs = currentTabs[key]
    }


    var tagInput = []
    const tagsChange = (key) => {
        console.log("tags: " + key)
        tagInput =[]
        tagInput.push(key.split(','))
    }

    const handleOk = () => {
        setIsModalVisible(false);
        getStorage_record_key(records => {
            records = records ? records : []
            let record = {
                name: selectedTabs.title,
                address: selectedTabs.url,
                remark: remark,
                tags: tagInput
            }

            records.unshift(record)

            setStorage_record_key(records)
        })


    };


    return (
        <>
            <Button type="primary" onClick={showModal}>
                新建URL
            </Button>
            <Modal title="新建标签" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    选择一个标签：
                    <Select
                        style={{
                            width: '100%',
                        }}
                        onSelect={tabsSelected}
                    >
                        {tabOptions}
                    </Select>
                </p>
                <p>
                    备注：<TextArea rows={8} value={remark} onChange={remarkChange}/>
                </p>
                <p>
                    选择一些标签:
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        placeholder="Tags Mode"
                        onChange={tagsChange}
                    >
                        {tagOptions}
                    </Select>
                </p>
            </Modal>
        </>
    );
};

export default NewDialog;