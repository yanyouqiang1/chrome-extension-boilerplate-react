import YAML from 'yaml'
import yaml from 'js-yaml'

// jsonStr 为字符串形式的json数据
export const json2yaml = (jsonStr) => {
    try {
        return {
            data: yaml.dump(JSON.parse(jsonStr)),
            error: false
        }
    } catch (err) {
        return {
            data: '',
            error: true
        }
    }
}


// yamlStr 为字符串形式的yaml数据
// returnString 是否返回字符串格式的json数据
export const yaml2json = (yamlStr, returnString) => {
    try {
        return {
            data: returnString ? JSON.stringify(YAML.parse(yamlStr), null, 2) : YAML.parse(yamlStr),
            error: false
        }
    } catch (err) {
        return {
            data: '',
            error: true
        }
    }
}
