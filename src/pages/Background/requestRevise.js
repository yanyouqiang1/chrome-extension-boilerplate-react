import {getStorage_requestRevise} from "../Function/chromeCommon";
function requestRevise() {
    chrome.runtime.onMessage.addListener((request, sender, res) => {
        /*
        request = {
            type: "freshWebRevise",
            data: ""
        }*/
        if (request.type == 'freshWebRevise') {
            freshRequestRule();
            console.log("刷新URL拦截规则")
        }
    })

    function freshRequestRule() {
        /* customRules
        *
            [
              {
                "data": "{'hello': 'good'}",
                "from": "www.baidu.com",
                "id": 624748505,
                "isUseData": true,
                "title": "活动名称而",
                "to": "www.bing.com"
              } ...
            ]
        * */
        getStorage_requestRevise(customRules=>{
            console.log(customRules)
            let ruleMapList = customRules.map((rule, index)=>{
                if (rule.isUseData){
                    return {
                        'id': index+1,
                        'priority': 1,
                        'action': {
                            'type': 'redirect',
                            'redirect': {
                                url: 'data:application/json;charset=utf-8,'+rule.data
                            }
                        },
                        'condition': {
                            'urlFilter': rule.from,
                            'resourceTypes': [
                                'csp_report', 'font', 'image', 'main_frame', 'media', 'object', 'other', 'ping', 'script',
                                'stylesheet', 'sub_frame', 'webbundle', 'websocket', 'webtransport', 'xmlhttprequest'
                            ]
                        }
                    }
                }else{
                    return {
                        'id': index+1,
                        'priority': 1,
                        'action': {
                            'type': 'redirect',
                            'redirect': {
                                url: rule.to
                            }
                        },
                        'condition': {
                            'urlFilter': rule.from,
                            'resourceTypes': [
                                'csp_report', 'font', 'image', 'main_frame', 'media', 'object', 'other', 'ping', 'script',
                                'stylesheet', 'sub_frame', 'webbundle', 'websocket', 'webtransport', 'xmlhttprequest'
                            ]
                        }
                    }
                }
            });
            console.log(ruleMapList)
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: ruleMapList,
                removeRuleIds: Array.from({length:ruleMapList.length},(item, index)=> index+1)
            })

        })



    }


}


export {requestRevise}