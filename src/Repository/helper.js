export class ObjectUtil {
    static isEmpty(obj) {
        if (JSON.stringify(obj) === '{}') {
            return false
        }
        return true
    }
}