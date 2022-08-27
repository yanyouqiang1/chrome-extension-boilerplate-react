import React from "react";
import Editor,{loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";

loader.config({ monaco });

const JsonEditor = (props) => {
    const {
        language='json',
        value,
        height,
        onMount=null,
        onChange=null,
        onValidate=null
    } = props
    return (
        <Editor
            height={height}
            onChange={onChange}
            defaultLanguage={language}
            value={value}
            defaultValue=""
        />
    );
}

export default JsonEditor