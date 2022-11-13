//链接仓库
import {ObjectUtil} from "./helper";
import randomstring from "rdm-str";

const example =
    [
        {
            key: "nnnnnnn",
            type: "search",
            links: [
                {
                    name: "baidu",
                    remark: "这是一个网址",
                    url: "www.baidu.com"
                },
                {
                    name: "baidu",
                    remark: "这是一个网址",
                    url: "www.baidu.com"
                }
            ]
        },
        {
            key: "yyyy",
            type: "test",
            links: [
                {
                    name: "baidu",
                    remark: "这是一个网址",
                    url: "www.baidu.com"
                },
                {
                    name: "baidu",
                    remark: "这是一个网址",
                    url: "www.baidu.com"
                }
            ]
        }
    ]



export class LinkRepo {
    static get NAME() {
        return "linkRepo"
    }

    constructor() {
    }

    // 从数据库拿数据
    getDataFromRepository(callback) {
        chrome.storage.local.get([LinkRepo.NAME], result => {
            let data
            if (ObjectUtil.isEmpty(result)) {
                data = result[LinkRepo.NAME]
            } else {
                data = example
            }
            callback(data)
        });
    }

    // 保存数据库
    saveDataToRepository(value) {
        let setValue = {}
        setValue[LinkRepo.NAME] = value
        chrome.storage.local.set(setValue);
    }


    //删除链接
    deleteTypeLink(datasource, currentEditType, index) {
        //todo
        let splice = datasource[currentEditType].splice(index, 1);
        return splice;
    }

    //增加链接
    addLink(datasource, data, link) {
        let map = datasource.map(it=>{
            if (it.key==data.key){
                it.links.unshift(link)
            }
            return it
        });

        this.saveDataToRepository(map)
        return map
    }

    //删除类别
    deleteType(datasource,key) {
        let newData = datasource.filter(data=>data.key!=key);
        this.saveDataToRepository(newData)
        return newData;
    }

    // 获取类型
    getTypes(data) {
        try {
            return data.flatMap(it=>it.type)
        }catch (e) {
            return []
        }


    }

    // 添加类别
    addType(datasource,typeName) {
        let add={
            key: randomstring(7),
            type: typeName,
            links: [
                {
                    name: "这是一个示例",
                    remark: "这是一个网址",
                    url: "www.baidu.com"
                },
            ]
        }

        datasource.unshift(add);
        this.saveDataToRepository(datasource)
        return datasource
    }

    dataEdit(datasource,data, modalResult) {
        let indexOf = datasource.indexOf(data);
        datasource.splice(indexOf,1)
        datasource.unshift(modalResult)

        this.saveDataToRepository(datasource)
        return datasource
    }
}



