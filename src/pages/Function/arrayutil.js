// #####fucniton
export function arrayInclude(arr1,arr2){
    let contain = true
    for (const item of arr2) {
        if (!arr1.includes(item)){
            contain = false
        }
    }
    return contain
}