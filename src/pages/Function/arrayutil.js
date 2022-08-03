// #####fucniton
export function arrayInclude(arr1,arr2){
    let temp = []
    for (const item of arr2) {
        // eslint-disable-next-line no-unused-expressions
        arr1.findIndex(i => i === item) !== -1 ? temp.push(item) : ''
    }
    return temp.length ? true : false
}