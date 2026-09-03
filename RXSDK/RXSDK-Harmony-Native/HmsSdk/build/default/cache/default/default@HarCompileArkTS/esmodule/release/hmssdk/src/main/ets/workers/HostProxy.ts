// @keepTs
// @ts-nocheck
import worker from "@ohos:worker";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { kCustomHandler, MSG_RECEIVER, PROCESS_TUANJIE_BUILTIN_MESSAGE, PROCESS_TUANJIE_HANDLER, PROCESS_TUANJIE_MESSAGE, REGISTER_HANDLER } from "@normalized:N&&&hmssdk/src/main/ets/workers/MessageHandler&4.0.0";
import type { Message } from "@normalized:N&&&hmssdk/src/main/ets/workers/MessageHandler&4.0.0";
export class HostProxy {
    Loop(c200: any) {
        console.log("message from main thread received!");
    }
}
let gHostProxy = new HostProxy();
export function GetHostProxy(): HostProxy {
    return gHostProxy;
}
export function PROCESS_WORKER_MESSAGE(z199: Message): number {
    let a200: any = GetHostProxy();
    const b200: any = a200[z199.type];
    if (z199.type == "SetGlobalThisContext") {
        a200.SetGlobalThisContext(z199);
        return 0;
    }
    if (!!b200) {
        b200.apply(a200, [z199]);
        return 0;
    }
    else if (z199.type == "RUN_ON_TUANJIEMAIN_THREAD_JS") {
        PROCESS_TUANJIE_BUILTIN_MESSAGE(z199);
    }
    else if (z199.type == "RUN_ON_TUANJIEMAIN_THREAD_USER_EVENT") {
        PROCESS_TUANJIE_MESSAGE(z199);
    }
    else if (z199.type == kCustomHandler) {
        PROCESS_TUANJIE_HANDLER(z199);
    }
    else {
        Logger.warn("Unknown message type=%{public}s", z199.type);
    }
    return -1;
}
export function POST_MESSAGE(y199: any) {
    POST_MESSAGE_TO_HOST(y199);
}
export function POST_MESSAGE_TO_HOST(x199: any) {
    if (!x199.type)
        x199.type = "RUN_ON_UI_THREAD_USER_EVENT";
    if (!!x199.callback) {
        if (!x199.callbackFuncName)
            x199.callbackFuncName = x199.funcName;
        REGISTER_HANDLER(MSG_RECEIVER.WORKER_TUANJIE, x199.callbackFuncName, x199.callback);
        x199.callback = undefined;
    }
    worker.workerPort.postMessage(x199);
}
