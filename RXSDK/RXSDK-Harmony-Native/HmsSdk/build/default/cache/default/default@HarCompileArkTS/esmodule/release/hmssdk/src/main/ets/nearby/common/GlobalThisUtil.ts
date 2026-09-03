export function SetToGlobalThis(b50: string, c50: unknown): void {
    globalThis[b50] = c50;
}
export function GetFromGlobalThis(a50: string) {
    return globalThis[a50];
}
export function InitGlobalThisContext(w49, x49, y49, z49) {
    globalThis.context = w49;
    globalThis.context.PlayerPrefs = x49;
    globalThis.context.TuanjieInternet = y49;
    globalThis.context.TuanjiePermissions = z49;
}
export function SetToGlobalThisContext(u49, v49) {
    globalThis.context[u49] = v49;
}
export function GetFromGlobalThisContext(t49) {
    return globalThis.context[t49];
}
