import "antd/dist/antd.css";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";

function TextEditor(props) {
  // editor 实例
  const [editor, setEditor] = useState(null);                   // JS 语法

  const { value, onChange, height = 1000 } = props;

  // 工具栏配置
  // const toolbarConfig: Partial<IToolbarConfig> = { }  // TS 语法
  const toolbarConfig = {};                        // JS 语法

  // 编辑器配置
  // const editorConfig: Partial<IEditorConfig> = {    // TS 语法
  const editorConfig = {              // JS 语法
    placeholder: "请输入内容...",
    isFullScreen: true

  };
  const editorChange = (editor)=>{
    onChange(editor.getHtml())
  }
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={editorChange}
          mode="default"
          style={{ height: height, overflowY: "hidden" }}
        />
      </div>

    </>
  );
}

export default TextEditor;