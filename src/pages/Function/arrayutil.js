// #####fucniton
export function arrayInclude(arr1, arr2) {
    //比较对象为空，默认为 true
    if (!arr2 || arr2==false) {
        return true;
    }

    if (!arr1) {
        return false
    }
    let contain = true
    for (const item of arr2) {
        if (!arr1.includes(item)) {
            contain = false
        }
    }
    return contain
}