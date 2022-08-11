import {render} from "react-dom";
import React, {useState} from "react";
import {Button, Col, Row} from "antd";
import 'antd/dist/antd.css';
import {diffChars, diffLines} from "diff";

const Filediff = () => {
    const [textLeft, setTextLeft] = useState('')
    const [textRight, setTextRight] = useState('')
    const [textDiff, setTextDiff] = useState('')


    const leftChange = (e) => {
        setTextLeft(e.target.value)
    }
    const rightChange = (e) => {
        setTextRight(e.target.value)
    }


    const compareChars = () => {
        let diffs = diffChars(textLeft, textRight);

        let diffContent = diffs.map(part => {
            let color = part.added ? 'green' :
                part.removed ? 'red' : 'grey';
            // return part.value.includes('\n') ?
            //     (<>
            //         <span style={{color: color}}>{part.value.replace('\n', '')}</span><br/>
            //     </>)
            //     : (
            //         <span style={{color: color}}>{part.value}</span>
            //     )
            return (<font style={{color: color}}>{part.value}</font>)
        });
        setTextDiff(diffContent)

    }
    const compareLine = () => {
        let diffs = diffLines(textLeft, textRight);
        let diffContent = diffs.map(part => {
            let color = part.added ? 'green' :
                part.removed ? 'red' : 'grey';
            return (
                <div style={{color: color}}>{part.value}</div>
            )
        });
        setTextDiff(diffContent)
    }

    return (
        <>
            <Row gutter={24}>
                <Col span={24}>
                    <Button onClick={compareChars}>compareChars</Button>
                    <Button onClick={compareLine}>compareLine</Button>
                    {/*<Button onClick={compare}>compareChars</Button>*/}
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <textarea style={{width: '100%'}} value={textLeft} onChange={leftChange} rows={30}></textarea>
                </Col>
                <Col span={8}>
                    <textarea style={{width: '100%'}} value={textRight} onChange={rightChange} rows={30}></textarea>
                </Col>
                <Col span={8}>
                    <textarea rows={30} value={textDiff}></textarea>
                </Col>
            </Row>
        </>

    )
}

render(<Filediff/>, window.document.querySelector('#app-container'));