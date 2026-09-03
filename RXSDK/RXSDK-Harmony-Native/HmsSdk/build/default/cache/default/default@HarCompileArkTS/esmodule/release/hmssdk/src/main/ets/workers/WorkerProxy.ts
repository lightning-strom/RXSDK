// @keepTs
// @ts-nocheck
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
export class WorkerProxy {
    private constructor() {
        Logger.debug('%{public}s', 'WorkerProxy.constructor');
    }
    public static postMessage(f203: any, g203: string | undefined) {
    }
}
export function POST_MESSAGE(e203: any) {
    POST_MESSAGE_TO_WORKER(e203, undefined);
}
export function POST_MESSAGE_TO_WORKER(c203: any, d203: string | undefined) {
    if (!c203.type)
        c203.type = "RUN_ON_UI_THREAD_USER_EVENT";
    WorkerProxy.postMessage(c203, d203);
}
