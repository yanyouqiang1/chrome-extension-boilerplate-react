import {Button, Form, Modal, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {Option} from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import randomstring from 'rdm-str'
import {
    getCurrentTabsNoActive,
    getStorage_newTabs_tags,
    getStorage_record_key,
    setStorage_record_key
} from "../../chromeCommon";
import TagSelect from "./TagSelect";

const EditModel = (props) => {
    const {recordkey,name,remark,tags} =  props
    const [form] =Form.useForm()
    //######render data
    //select
    //tab
    const [tabOptions, setTabOptions] = useState([])

    useEffect(()=>{
        getCurrentTabsNoActive().then(tabs => {
            setTabOptions(tabs);
        })

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
            name: formValue.name,
            remark: formValue.remark,
            tags: formValue.tags
        }
        //save
        getStorage_record_key(records => {
            let newRecords = Object.assign([],records)
            let findRecord = newRecords.find(r=>r.key ==recordkey)

            findRecord.name = record.name
            findRecord.remark = record.remark
            findRecord.tags = record.tags

            setStorage_record_key(newRecords)
            //刷新主界面
            props.superRefresh()
        })

    };


    return (
        <>
            <Button type="link" onClick={showModal}>
                Edit
            </Button>
            <Modal title="修改记录" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="horizontal" form={form}>
                    <Form.Item label="名称" name="name" initialValue={name}  rules={[
                        {
                            required: true,
                            message: 'Please input title!',
                        },
                    ]}>
                        <input  style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label="备注" name="remark" initialValue={remark}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="选择标签" name="tags" initialValue={tags}>
                        <TagSelect />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditModel;