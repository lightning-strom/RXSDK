// @keepTs
// @ts-nocheck
export interface Message {
    type: string;
    funcName: string;
    args: ESObject;
    timeoutMs: number;
    userData: ESObject | undefined;
    modulePath: string | undefined;
    callback: ESObject | undefined;
    callbackFuncName: string | undefined;
}
export declare class MessageProcessor {
    name: string;
    m_builtinModules: Record<string, ESObject>;
    m_customModules: Record<string, ESObject> | undefined;
    m_customHandlers: Record<string, ESObject> | undefined;
    constructor(i: string);
    processMessage(v202: Message, w202?: boolean): void;
    processCustomMessage(t202: Message): Promise<void>;
    processHandler(p202: Message): void;
    InvokeAsync(e202: ESObject, f202: ESObject, g202: Array<ESObject>, h202: Message): void;
    InvokeSync(x201: ESObject, y201: ESObject, z201: Array<ESObject>, a202: Message): void;
    registerBuiltinModule(u201: ESObject): boolean;
    unregisterBuiltinModule(r201: ESObject): void;
    registerModule(o201: ESObject): boolean;
    unregisterModule(m201: string): void;
    loadModule(g201: string, h201: string): Promise<void>;
    unloadModule(f201: string): void;
    registerHandler(d201: string, e201: ESObject): void;
    unregisterHandler(b201: string): void;
}
export declare const kCustomHandler: string;
export declare enum MSG_RECEIVER {
    HOST_UI = 0,
    WORKER_TUANJIE = 1
}
export declare function REGISTER_BUILTIN_MODULE(z200: MSG_RECEIVER, a201: ESObject): void;
export declare function UNREGISTER_BUILTIN_MODULE(x200: MSG_RECEIVER, y200: ESObject): void;
export declare function REGISTER_MODULE(v200: MSG_RECEIVER, w200: ESObject): void;
export declare function UNREGISTER_MODULE(t200: MSG_RECEIVER, u200: string): Promise<void>;
export declare function LOAD_MODULE(q200: MSG_RECEIVER, r200: string, s200: string): Promise<void>;
export declare function UNLOAD_MODULE(o200: MSG_RECEIVER, p200: string): Promise<void>;
export declare function REGISTER_HANDLER(l200: MSG_RECEIVER, m200: string, n200: ESObject): void;
export declare function UNREGISTER_HANDLER(j200: MSG_RECEIVER, k200: string): void;
export declare function PROCESS_UI_BUILTIN_MESSAGE(i200: Message): void;
export declare function PROCESS_UI_MESSAGE(h200: Message): Promise<void>;
export declare function PROCESS_UI_HANDLER(g200: Message): void;
export declare function PROCESS_TUANJIE_BUILTIN_MESSAGE(f200: Message): void;
export declare function PROCESS_TUANJIE_MESSAGE(e200: Message): void;
export declare function PROCESS_TUANJIE_HANDLER(d200: Message): void;
