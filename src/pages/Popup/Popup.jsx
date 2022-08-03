import 'antd/dist/antd.css';
import {render} from "react-dom";

import {AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import React, {useState} from 'react';

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
    getItem('常用功能', 'sub1', <MailOutlined/>, [
        getItem('YAML/JSON工具', 'yml.html'),
        getItem('BASE64加密', 'base64.html'),
        getItem('Option 3', '3'),
        getItem('Option 4', '4'),
    ]),
    getItem('办公便捷', 'sub2', <AppstoreOutlined/>, [
        getItem('标签管理', 'tabs.html'),
        getItem('场景管理', 'scenario.html'),
        getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('Navigation Three', 'sub4', <SettingOutlined/>, [
        getItem('Option 9', '9'),
        getItem('Option 10', '10'),
        getItem('Option 11', '11'),
        getItem('Option 12', '12'),
    ]),
]; // submenu keys of first level

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

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
        <Menu
            mode="inline"
            openKeys={openKeys}
            onSelect={onSelect}
            onOpenChange={onOpenChange}
            style={{
                width: 256,
            }}
            items={items}
        />
    );
};

render(<App/>, window.document.querySelector('#app-container'));
