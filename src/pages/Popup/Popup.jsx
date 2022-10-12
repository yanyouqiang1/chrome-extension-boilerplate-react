import 'antd/dist/antd.css';
import {render} from "react-dom";
import {Tabs} from 'antd';
import { ApiOutlined, ClockCircleOutlined, FunctionOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import {Menu} from 'antd';
import React, {useState} from 'react';
import ToDoPart from "../Function/Office/todolist/todoPart";

const {TabPane} = Tabs;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem('办公便捷', 'sub1', <MailOutlined/>, [
        getItem('链接管理', 'tabs.html'),
        getItem('场景管理', 'scenario.html'),
        getItem('ToDo列表', 'todolist.html'),
        getItem('通知列表', 'notify.html'),
        getItem('代码区域', 'codeArea.html'),
    ]),
    getItem('记录工具', 'sub2', <ClockCircleOutlined />, [
        getItem('Fetch管理', 'myfetch.html'),
        getItem('片段管理', 'fragement.html'),
        getItem('长文本记录', 'notebook.html'),
        getItem('响应修改', 'webRequest.html'),
    ]),
    getItem('常用功能', 'sub3', <FunctionOutlined />, [
        getItem('YAML/JSON工具', 'yml.html'),
        getItem('BASE64加密', 'base64.html'),
        getItem('文件比对', 'filediff.html'),
        getItem('html渲染', 'httpstrShow.html'),
        getItem('单行文本处理', 'awk.html'),
    ]),
    getItem('三方集成', 'sub4', <ApiOutlined />, [
        getItem('谷歌翻译', 'https://translate.google.cn/'),
        getItem('有道翻译', 'https://fanyi.youdao.com/'),
    ]),
]; // submenu keys of first level

const rootSubmenuKeys = ['sub1', 'sub2','sub3', 'sub4'];

const App = () => {
    const [openKeys, setOpenKeys] = useState(['sub1']);

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    const onSelect = (item, key, keyPath, selectedKeys, domEvent) => {
        const w = window.open('about:blank');
        w.location.href = item.key
    }
    return (
        <div style={{marginLeft: 10}}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="待办事项" key="1">
                    <div style={{width: 450}}>
                        <ToDoPart/>
                    </div>
                </TabPane>
                <TabPane tab="相关工具" key="2">
                    <Menu
                        mode="inline"
                        openKeys={openKeys}
                        onSelect={onSelect}
                        onOpenChange={onOpenChange}
                        style={{
                            width: 450,
                        }}
                        items={items}
                    />
                </TabPane>
                <TabPane tab="立竿见影" key="3">
                    <div style={{
                        width: 450,
                    }}>

                    </div>
                </TabPane>

            </Tabs>
        </div>

    );
};

render(<App/>, window.document.querySelector('#app-container'));
