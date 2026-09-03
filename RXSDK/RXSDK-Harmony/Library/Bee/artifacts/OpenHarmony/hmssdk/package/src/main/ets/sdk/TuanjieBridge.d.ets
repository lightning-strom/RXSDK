// @keepTs
// @ts-nocheck
import { Singleton } from "../types/Types";
import worker from "@ohos.worker";
export declare class TuanjieBridge extends Singleton<TuanjieBridge> {
    InitMessageBind(g168: worker.ThreadWorker): void;
}
