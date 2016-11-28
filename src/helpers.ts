interface Enum {
    [id: number]: string
}
export function GetEnumElements(e: Enum): Array<string> {
    return Object.keys(e).map(a => e[a]).filter(a => typeof a === 'string');
}

export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}