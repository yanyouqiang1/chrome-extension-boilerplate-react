import {Select} from "antd";
import React, {useEffect, useState} from "react";
import {getStorage_newTabs_tags} from "../../chromeCommon";


const TagSelect = (props) => {
    //数据绑定的关键
    const {value, onChange} = props
    //tag
    const [tagOptions, setTagOptions] = useState([])

    useEffect(() => {
        getStorage_newTabs_tags(tagsOfSaved => {
                tagsOfSaved = tagsOfSaved ? tagsOfSaved : []
                setTagOptions(tagsOfSaved)
            }
        )
    }, [])


    return (
        <Select
            mode="tags"
            style={{
                width: '250px',
            }}
            onChange={onChange}
            value={value}
        >
            {tagOptions.map(tag => <Select.Option key={tag}>{tag}</Select.Option>)}
        </Select>
    )

}


export default TagSelect

