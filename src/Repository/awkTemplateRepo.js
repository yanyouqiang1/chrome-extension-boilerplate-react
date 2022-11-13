//链接仓库
import randomstring from "rdm-str";

const example =
    [
        {
            key: "nnnnnnn",
            name: "初始模版",
            template: "search",
        }
    ]


export class AwkTemplateRepo {
    static get NAME() {
        return "awkTemplate"
    }

    static get INIT_TEMPLATE() {
        return `
    function handle(strs){
     let strings = strs.split('\\n');
            let strInfo={
                size: strings.length,
                originStr: strs
            };
            let result = [];
            strings.forEach((str,index)=>{
                result.push(handleString(str,index,strInfo))
            });
         return result;
    }
    
    //str 每行
    //index 下标
    //size 总行数
    //originStr 原始字符串
    function handleString(str,index,{size,originStr}){
    }
        `
    }

    // 从数据库拿数据
    getDataFromRepository(callback) {
        chrome.storage.local.get([AwkTemplateRepo.NAME], result => {
            let resultElement = result[AwkTemplateRepo.NAME]
            if (!resultElement || !resultElement instanceof Array) {
                callback([])
            } else {
                callback(resultElement)
            }
        });
    }

    // 保存数据库
    saveDataToRepository(value) {
        let setValue = {}
        setValue[AwkTemplateRepo.NAME] = value
        chrome.storage.local.set(setValue);
    }

    addTemplate(datasource, name, content) {
        let add = {
            key: randomstring(7),
            name,
            content
        }
        datasource.unshift(add)
        this.saveDataToRepository(datasource)
        return datasource
    }

    deleteTemplate(datasource, key) {
        let filter = datasource.filter(it => it.key != key);
        this.saveDataToRepository(filter)
        return filter
    }

    getTemplate(datasource, key) {
        let result = null
        datasource.forEach(it => {
            if (it.key == key) {
                result = it
            }
        })
        return result
    }

}



