interface Enum {
    [id: number]: string
}
export function GetEnumElements(e: Enum): Array<string> {
    return Object.keys(e).map(a => e[a]).filter(a => typeof a === 'string');
}
