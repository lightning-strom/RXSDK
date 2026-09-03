// @keepTs
// @ts-nocheck
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { POST_MESSAGE } from "@normalized:N&&&hmssdk/src/main/ets/workers/WorkerProxy&4.0.0";
export interface Message {
    type: string;
    funcName: string;
    args: any;
    timeoutMs: number;
    userData: any | undefined;
    modulePath: string | undefined;
    callback: any | undefined;
    callbackFuncName: string | undefined;
}
;
export class MessageProcessor {
    name: string;
    m_builtinModules: Record<string, any> = {};
    m_customModules: Record<string, any> | undefined = undefined;
    m_customHandlers: Record<string, any> | undefined = undefined;
    constructor(b203: string) {
        this.name = b203;
    }
    processMessage(v202: Message, w202: boolean = true) {
        const x202: any = v202.funcName.split(".");
        let y202: any = undefined;
        if (w202) {
            y202 = this.m_builtinModules[x202[0]];
        }
        else if (!!this.m_customModules) {
            y202 = this.m_customModules[x202[0]];
        }
        if (!y202) {
            Logger.error('%{public}s', "No module with name=" + x202[0]);
            return;
        }
        const z202: any = y202[x202[1]];
        if (!z202) {
            Logger.error('%{public}s', "No funcname with name=" + v202.funcName);
            return;
        }
        let a203: Array<any> = v202.args;
        if (v202.timeoutMs >= 0) {
            this.InvokeAsync(y202, z202, a203, v202);
        }
        else {
            this.InvokeSync(y202, z202, a203, v202);
        }
    }
    async processCustomMessage(t202: Message) {
        if (!!t202.modulePath) {
            const u202: any = t202.funcName.split(".")[0];
            await this.loadModule(u202, t202.modulePath);
        }
        this.processMessage(t202, false);
    }
    processHandler(p202: Message) {
        if (!this.m_customHandlers) {
            return;
        }
        try {
            let r202: any = this.m_customHandlers[p202.funcName];
            if (!!r202) {
                let s202: Array<any> = p202.args;
                r202(...s202);
            }
            else {
                Logger.warn("No callback with name=%{public}s", p202.funcName);
            }
        }
        catch (q202) {
            Logger.error('Error occurred while calling callback=%{public}s, err=%{public}s', p202.funcName, q202);
        }
    }
    InvokeAsync(e202: any, f202: any, g202: Array<any>, h202: Message) {
        let i202: Promise<number> = new Promise((n202, o202) => {
            setTimeout(() => {
                o202(new Error("Async call timeout"));
            }, h202.timeoutMs);
        });
        let j202: any = f202.apply(e202, g202);
        Promise.race([j202, i202]).then((m202: any) => {
            if (!!h202.callbackFuncName) {
                POST_MESSAGE({ 'type': kCustomHandler, 'funcName': h202.callbackFuncName, 'args': m202 });
            }
            else {
            }
        }).catch((k202: any) => {
            let l202 = JSON.stringify(k202) ?? "unknown error";
            l202 = "Error calling " + h202.funcName + "err=" + l202;
            Logger.error('%{public}s', l202);
        });
    }
    InvokeSync(x201: any, y201: any, z201: Array<any>, a202: Message) {
        try {
            let d202: any = y201.apply(x201, z201);
            if (!!a202.callbackFuncName) {
                Logger.info('Call user extra module function : ' + a202.callbackFuncName + ' success');
                POST_MESSAGE({ 'type': kCustomHandler, 'funcName': a202.callbackFuncName, 'args': d202 });
            }
            else {
            }
        }
        catch (b202) {
            let c202 = JSON.stringify(b202) ?? "unknown error";
            c202 = "Error calling " + a202.funcName + "err=" + c202;
            Logger.error('%{public}s', c202);
        }
    }
    registerBuiltinModule(u201: any): boolean {
        let v201: string = u201.name || u201.constructor.name;
        const w201: any = this.m_builtinModules[v201];
        if (!!w201) {
            Logger.error('Duplicated message=%{public}s handler', v201);
            return false;
        }
        this.m_builtinModules[v201] = u201;
        return true;
    }
    unregisterBuiltinModule(r201: any) {
        let s201: string = r201.name || r201.constructor.name;
        const t201: any = this.m_builtinModules[s201];
        if (!!t201) {
            this.m_builtinModules.deleteKey(s201);
        }
    }
    registerModule(o201: any): boolean {
        if (!this.m_customModules) {
            this.m_customModules = {};
        }
        let p201: string = o201.name || o201.constructor.name;
        const q201: any = this.m_customModules[p201];
        if (!!q201) {
            Logger.error('Duplicated message=%{public}s handler', p201);
            return false;
        }
        this.m_customModules[p201] = o201;
        return true;
    }
    unregisterModule(m201: string) {
        if (!!this.m_customModules) {
            const n201: any = this.m_customModules[m201];
            if (!!n201) {
                this.m_customModules.deleteKey(m201);
            }
        }
    }
    async loadModule(g201: string, h201: string) {
        if (!this.m_customModules) {
            this.m_customModules = {};
        }
        const i201: any = this.m_customModules[g201];
        if (!!i201) {
            Logger.info(`Message=${g201} handler/module already exists.`);
        }
        const j201 = this;
        await import(h201).then((l201: any) => {
            Logger.info(`Load module ${g201} Successfully.`);
            if (!!j201.m_customModules)
                j201.m_customModules[g201] = l201[g201];
        }).catch((k201: any) => {
            Logger.error(`Failed to load user extra module=${g201}`);
        });
    }
    unloadModule(f201: string) {
        this.unregisterModule(f201);
    }
    registerHandler(d201: string, e201: any) {
        if (!this.m_customHandlers) {
            this.m_customHandlers = {};
        }
        this.m_customHandlers[d201] = e201;
    }
    unregisterHandler(b201: string) {
        if (!!this.m_customHandlers) {
            const c201: any = this.m_customHandlers[b201];
            if (!!c201) {
                this.m_customHandlers.deleteKey(b201);
            }
        }
    }
}
export const kCustomHandler: string = "CustomHandler";
export enum MSG_RECEIVER {
    HOST_UI = 0,
    WORKER_TUANJIE = 1
}
;
const gMsgProcessors: Array<MessageProcessor> = [
    new MessageProcessor("Host.UI"),
    new MessageProcessor("Worker.Tuanjie"),
];
export function REGISTER_BUILTIN_MODULE(z200: MSG_RECEIVER, a201: any) {
    if (z200 >= gMsgProcessors.length)
        Logger.error(`REGISTER_BUILTIN_MODULE| Unknown message receiver=%{public}d`, z200);
    else
        gMsgProcessors[z200].registerBuiltinModule(a201);
}
export function UNREGISTER_BUILTIN_MODULE(x200: MSG_RECEIVER, y200: any) {
    if (x200 >= gMsgProcessors.length)
        Logger.error(`UNREGISTER_BUILTIN_MODULE| Unknown message receiver=%{public}d`, x200);
    else
        gMsgProcessors[x200].unregisterBuiltinModule(y200);
}
export function REGISTER_MODULE(v200: MSG_RECEIVER, w200: any) {
    if (v200 >= gMsgProcessors.length)
        Logger.error(`REGISTER_MODULE| Unknown message receiver=%{public}d`, v200);
    else
        gMsgProcessors[v200].registerModule(w200);
}
export async function UNREGISTER_MODULE(t200: MSG_RECEIVER, u200: string) {
    if (t200 >= gMsgProcessors.length)
        Logger.error(`UNREGISTER_MODULE| Unknown message receiver=%{public}d`, t200);
    else
        gMsgProcessors[t200].unregisterModule(u200);
}
export async function LOAD_MODULE(q200: MSG_RECEIVER, r200: string, s200: string) {
    if (q200 >= gMsgProcessors.length)
        Logger.error(`LOAD_MODULE| Unknown message receiver=%{public}d`, q200);
    else
        gMsgProcessors[q200].loadModule(r200, s200);
}
export async function UNLOAD_MODULE(o200: MSG_RECEIVER, p200: string) {
    if (o200 >= gMsgProcessors.length)
        Logger.error(`UNLOAD_MODULE| Unknown message receiver=%{public}d`, o200);
    else
        gMsgProcessors[o200].unloadModule(p200);
}
export function REGISTER_HANDLER(l200: MSG_RECEIVER, m200: string, n200: any) {
    if (l200 >= gMsgProcessors.length)
        Logger.error(`REGISTER_HANDLER| Unknown message receiver=%{public}d`, l200);
    else
        gMsgProcessors[l200].registerHandler(m200, n200);
}
export function UNREGISTER_HANDLER(j200: MSG_RECEIVER, k200: string) {
    if (j200 >= gMsgProcessors.length)
        Logger.error(`UNREGISTER_HANDLER| Unknown message receiver=%{public}d`, j200);
    else
        gMsgProcessors[j200].unregisterHandler(k200);
}
export function PROCESS_UI_BUILTIN_MESSAGE(i200: Message) {
    gMsgProcessors[MSG_RECEIVER.HOST_UI].processMessage(i200, true);
}
export async function PROCESS_UI_MESSAGE(h200: Message) {
    gMsgProcessors[MSG_RECEIVER.HOST_UI].processCustomMessage(h200);
}
export function PROCESS_UI_HANDLER(g200: Message) {
    gMsgProcessors[MSG_RECEIVER.HOST_UI].processHandler(g200);
}
export function PROCESS_TUANJIE_BUILTIN_MESSAGE(f200: Message) {
    gMsgProcessors[MSG_RECEIVER.WORKER_TUANJIE].processMessage(f200, true);
}
export function PROCESS_TUANJIE_MESSAGE(e200: Message) {
    gMsgProcessors[MSG_RECEIVER.WORKER_TUANJIE].processCustomMessage(e200);
}
export function PROCESS_TUANJIE_HANDLER(d200: Message) {
    gMsgProcessors[MSG_RECEIVER.WORKER_TUANJIE].processHandler(d200);
}
