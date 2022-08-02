import {Button, Form, Modal, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {Option} from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import {
    getCurrentTabsNoActive,
    getStorage_newTabs_tags,
    getStorage_record_key,
    setStorage_record_key
} from "./ChromeCommon";

const NewModel = () => {
    const [form] =Form.useForm()
    //######render data
    //select
    //tab
    const [tabOptions, setTabOptions] = useState([])
    //tag
    const [tagOptions, setTagOptions] = useState([])


    useEffect(()=>{
        getCurrentTabsNoActive().then(tabs => {
            setTabOptions(tabs);
        })

        getStorage_newTabs_tags(tagsOfSaved => {
            setTagOptions(tagsOfSaved)
            }
        )
    },[])

    //model
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        let formValue = form.getFieldsValue()
        const record={
            name: tabOptions[formValue.tab].title,
            address: tabOptions[formValue.tab].url,
            remark: formValue.remark,
            tags: formValue.tags

        }
        //save
        getStorage_record_key(records => {
            records = records ? records : []
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
                <Form layout="horizontal" form={form}>
                    <Form.Item label="选择一个URL" name="tab">
                        <Select>
                            {tabOptions.map(tab =>
                                <Select.Option value={tab.index}>{tab.title}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label="备注" name="remark">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="选择标签" name="tags">
                        <Select
                            mode="tags"
                            style={{
                                width: '100%',
                            }}
                        >
                            {tagOptions.map(tag => <Select.Option key={tag}>{tag}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default NewModel;