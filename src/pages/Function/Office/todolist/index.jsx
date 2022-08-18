import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import "antd/dist/antd.css";

import ToDoPart from "./todoPart";
import FinishPart from "./finishPart";

export const STATUS_FINISH = "finish";
export const STATUS_NEW = "new";


const TodoList = () => {
    /*    const initData = [
            {
                key: "aaaaaa",
                content: "todotodododo",
                status: "finish",
                createTime: dayjs().format("YYYY-MM-DD h:mm:ss"),
                finishTime: ""
            }
        ];*/


    return (
        <>
            <ToDoPart/>
            <FinishPart/>
        </>
    );
};


render(<TodoList/>, window.document.querySelector("#app-container"));