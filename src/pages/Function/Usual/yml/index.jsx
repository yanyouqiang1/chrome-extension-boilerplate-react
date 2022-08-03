import {Input, Button} from 'antd';
import {render} from "react-dom";
import React, {useState} from 'react';
import 'antd/dist/antd.css';
import './index.css'
// import YAML from 'yamljs'
import YAML from 'yaml'

const {TextArea} = Input;

const App = () => {
    const [inputText, setInputText] = useState('')
    const [outputTest, setOutputText] = useState('')

    function changeInput(e) {
        setInputText(e.target.value);
    }

    function ymlToJson() {
        let result = YAML.parse(inputText)

        // if (result.error){
        //     setOutputText('error');
        // }else{
        //     setOutputText(JSON.stringify(result.data))
        // }
        setOutputText(JSON.stringify(result))
    }

    function jsonToYml() {
        let result = JSON.parse(inputText)
        // if (result.error){
        //     setOutputText('error');
        // }else {
        //     setOutputText(result.data)
        // }
        setOutputText(YAML.stringify(result))
    }
    return (
        <>
            <TextArea rows={20} allowClear value={inputText} onChange={e=>changeInput(e)}/>
            <br/>
            <Button  type="primary" className="btn" onClick={()=>ymlToJson()}>YAML转换JSON</Button>

            <Button type="dashed" className="btn" onClick={()=>jsonToYml()}>JSON转换YAML</Button>

            <br/>
            <TextArea rows={20} value={outputTest}/>
        </>
    )
};


render(<App/>, window.document.querySelector('#root'))



