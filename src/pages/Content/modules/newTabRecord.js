import {getStorage_record_key, setStorage_record_key} from "../../Function/chromeCommon";
import randomstring from "rdm-str";

export function newTabRecordTest() {

    getStorage_record_key(records => {
        const name = prompt("输入要保存标签的名称:")
        if (name == null) {
            console.log("cancel")
            return;
        }
        const key = randomstring(7);
        const record = {
            key: key,
            name: name,
            title: document.title,
            address: window.location.href,
            remark: '',
            tags: ''
        }
        records = records ? records : []
        records.unshift(record)
        setStorage_record_key(records)
        alert("保存成功！")
    })
}
