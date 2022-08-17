import {printLine} from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");


chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type == 'remind') {
            alert("tab 添加成功！")
        }
    }
);