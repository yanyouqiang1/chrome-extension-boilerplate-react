/**
 * 从字符串中挑选出JSON
 * @param str
 */
export function pickJsonFromText(str) {
    var re = /\{.*\}/
    let regExpMatchArray = str.match(re);
    if (regExpMatchArray) {
        return regExpMatchArray[0]
    } else {
        return null
    }
}




