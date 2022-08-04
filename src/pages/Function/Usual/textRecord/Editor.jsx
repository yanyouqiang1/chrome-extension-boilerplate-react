import 'antd/dist/antd.css';
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, {useState, useEffect} from 'react'
import {Editor, Toolbar} from '@wangeditor/editor-for-react'
import {Button, message} from "antd";
import {getStorage_textRecord, setStorage_textRecord} from "../../chromeCommon";

function MyEditor() {
    // editor 实例
    const [editor, setEditor] = useState(null)                   // JS 语法

    // 编辑器内容
    const [html, setHtml] = useState('<p>hello</p>')

    // 模拟 ajax 请求，异步设置 html
    useEffect(() => {
        getStorage_textRecord(data => {
            setHtml(data)
        })
    }, [])

    // 工具栏配置
    // const toolbarConfig: Partial<IToolbarConfig> = { }  // TS 语法
    const toolbarConfig = {}                        // JS 语法

    // 编辑器配置
    // const editorConfig: Partial<IEditorConfig> = {    // TS 语法
    const editorConfig = {              // JS 语法
        placeholder: '请输入内容...',
        isFullScreen: true

    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])
    const save = () => {
        setStorage_textRecord(html);
        message.success("保存成功！",3)
    }
    return (
        <>
            <Button type="primary" style={{float: "right"}} onClick={save}>save</Button>
            <div style={{border: '1px solid #ccc', zIndex: 100}}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{borderBottom: '1px solid #ccc'}}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => setHtml(editor.getHtml())}
                    mode="default"
                    style={{height: '1000px', overflowY: 'hidden'}}
                />
            </div>
            {/*<div style={{ marginTop: '15px' }}>*/}
            {/*    {html}*/}
            {/*</div>*/}
        </>
    )
}

export default MyEditor