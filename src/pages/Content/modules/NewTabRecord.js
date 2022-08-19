import {Form, message, Modal, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import TagSelect from "../../Function/Office/tabs/TagSelect";
import React, {useState} from "react";
import randomstring from "rdm-str";
import {getStorage_record_key, setStorage_record_key} from "../../Function/chromeCommon";


const NewTabRecord = (props) => {
    const [form] = Form.useForm()
    //model
    const [isModalVisible, setIsModalVisible] = useState(false);

    let {bind} = props;
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    bind(showModal, handleCancel)

    const handleOk = () => {
        setIsModalVisible(false);
        let formValue = form.getFieldsValue()
        const key = randomstring(7);

        const record = {
            key: key,
            name: formValue.name,
            title: document.title,
            address: window.location.href,
            remark: formValue.remark,
            tags: formValue.tags
        }
        //save
        getStorage_record_key(records => {
            records = records ? records : []
            records.unshift(record)
            setStorage_record_key(records)
        })
        message.success("保存成功！")
    };

    return (
        <Modal title="保存标签" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form layout="horizontal" form={form}>
                <Form.Item label="名称" name="name" rules={[
                    {
                        required: true,
                        message: 'Please input title!',
                    },
                ]}>
                    <input style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item label="备注" name="remark">
                    <TextArea rows={4}/>
                </Form.Item>
                <Form.Item label="选择标签" name="tags">
                    <TagSelect/>
                </Form.Item>
            </Form>
        </Modal>
    )
}


export default NewTabRecord