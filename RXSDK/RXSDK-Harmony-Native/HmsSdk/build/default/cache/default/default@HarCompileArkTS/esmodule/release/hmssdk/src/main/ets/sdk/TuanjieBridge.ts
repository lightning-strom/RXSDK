// @keepTs
// @ts-nocheck
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type { Obj } from "./RXIndex";
import type worker from "@ohos:worker";
type NativeCallback = (type: string, status: string, data: string) => void;
export class TuanjieBridge extends Singleton<TuanjieBridge> {
    InitMessageBind(g168: worker.ThreadWorker) {
        let h168 = (q168: Obj, r168: Obj) => {
            Logger.info('postMessageToWorker: type:' + q168 + " ,data:" + r168);
            g168.postMessage({
                'type': "syncHMSSDKResult",
                'data_type': q168,
                'data': r168
            });
        };
        g168.addEventListener("message", async (i168) => {
            let j168: Obj = JSON.parse(JSON.stringify(i168));
            const k168: Obj = j168["data"];
            let l168: string = k168["type"];
            const m168: string = k168["data"];
            let n168: any = m168 ? JSON.parse(m168) : {};
            let o168: UIContext = globalThis.UIContext;
            try {
            }
            catch (p168) {
                Logger.e(p168);
                h168(l168, JSON.stringify(p168));
            }
        });
    }
}
