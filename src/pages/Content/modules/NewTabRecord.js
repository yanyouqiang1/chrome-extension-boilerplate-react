import {Button, Form, message} from "antd";
import React, {useState} from "react";
import randomstring from "rdm-str";
import {getStorage_record_key, setStorage_record_key} from "../../Function/chromeCommon";
import './NewTabRecord.css'
import $ from 'jquery'


const NewTabRecord = (props) => {

    let {bind} = props;
    const showModal = () => {
        var show = $(".NTR_dialog").css("display");
        $(".NTR_dialog").css("display", show == "none" ? "block" : "none");
    };
    const handleCancel = () => {
        var show = $(".NTR_dialog").css("display");
        $(".NTR_dialog").css("display", show == "none" ? "block" : "none");
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
        <>
            <style>
        </style>
            <div>
                <div className="NTR_dialog">
                    <div className="NTR_content">
                        <div className="NTR_aNTR_close">
                            <span>保存标签</span>
                            <a className="NTR_close" onClick={handleCancel}>&times;</a>
                        </div>
                        <div className="NTR_contain">
                            <div>title:{document.title}</div>
                            <div>url:{window.location.href}</div>
                            <div>remark:<textarea /></div>
                            <div>tag:<input /></div>
                            <button onClick={handleOk}>确认</button>
                        </div>
                    </div>

                </div>
            </div>
            {/* <Modal title="保存标签" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
            </Modal>*/}
        </>

    )
}


export default NewTabRecord


