import { Singleton } from "../types/Types";
import { Logger } from "../utils/Logger";
import { Obj } from "./RXIndex";
import { worker } from "@kit.ArkTS";

type NativeCallback = (type: string, status: string, data: string) => void

export class TuanjieBridge extends Singleton<TuanjieBridge> {

  InitMessageBind(worker: worker.ThreadWorker) {

    // if (SDKManager.MessageInitialized == true) {
    //   return;
    // }
    // SDKManager.threadWorker = worker;

    let postMessage = (type: Obj, data: Obj) => {
      Logger.info('postMessageToWorker: type:' + type + " ,data:" + data);
      // 向worker线程发送消息
      worker.postMessage({
        'type': "syncHMSSDKResult",
        'data_type': type,
        'data': data
      });
    }
    worker.addEventListener("message", async (e) => {
      let msg: Obj = JSON.parse(JSON.stringify(e));
      const data: Obj = msg["data"];
      let type: string = data["type"];
      const paramData: string = data["data"];

      let param: ESObject = paramData ? JSON.parse(paramData) : {};
      let uiContext: UIContext = globalThis.UIContext;
      try {
        // let result: string = await SDKHandler.Invoke?.[type]?.(param)
        // if (result) {
        //   postMessage(SDKHandler.Invoke?.[type]?.name, result)
        // } else {
        //   let ret: string
        //
        // }
      } catch (e) {
        Logger.e(e)
        postMessage(type, JSON.stringify(e))
      }
    });

  }
}