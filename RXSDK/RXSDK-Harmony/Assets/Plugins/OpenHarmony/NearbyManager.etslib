import { NativeCallback, NearbyHandler } from "./RXInterface";
import { POST_MESSAGE_TO_HOST, MSG_RECEIVER, REGISTER_MODULE } from 'classesLib';

export class NearbyManager {
  public static getInstance(): NearbyManager {
    return new NearbyManager();
  }

 
  public async Create(initStr?: string, event?: NativeCallback) {
    try {
      console.log("rxsdk-> NearbyHandler.Create send ")
      const param: Array<ESObject> = [initStr]
      let msg: ESObject = {
        funcName: "NearbyHandler.Create",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("Create", "failed", JSON.stringify(e))
    }
  }


  public RegisterCallback(event?: NativeCallback) {
    try {
      console.log("rxsdk-> NearbyHandler.RegisterCallback")
      const param: Array<ESObject> = []
      let msg: ESObject = {
        funcName: "NearbyHandler.RegisterCallback",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("RegisterCallback", "failed", JSON.stringify(e))
    }
  }


  public UnregisterCallback() {
    try {
      console.log("rxsdk-> NearbyHandler.UnregisterCallback")

      const param: Array<ESObject> = []
      let msg: ESObject = {
        funcName: "NearbyHandler.UnregisterCallback",
        args: param,

        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }

  public async PublishNearbyGame(event?: NativeCallback): Promise<void> {
    try {
      console.log("rxsdk-> NearbyHandler.PublishNearbyGame")

      const param: Array<ESObject> = []
      let msg: ESObject = {
        funcName: "NearbyHandler.PublishNearbyGame",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("publishNearbyGame", "failed", JSON.stringify(e))
    }
  }


  public async AutoBindNearbyGame(event?: NativeCallback): Promise<void> {
    try {
      console.log("rxsdk-> NearbyHandler.AutoBindNearbyGame")

      const param: Array<ESObject> = []
      let msg: ESObject = {
        funcName: "NearbyHandler.AutoBindNearbyGame",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("autoBindNearbyGame", "failed", JSON.stringify(e))
    }
  }


  public async Discovery(event?: NativeCallback): Promise<void> {
    try {
      console.log("rxsdk-> NearbyHandler.Discovery")

      const param: Array<ESObject> = []
      let msg: ESObject = {
        funcName: "NearbyHandler.Discovery",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("discovery", "failed", JSON.stringify(e))
    }
  }


  public async BindNearbyGame(p: string, event?: NativeCallback): Promise<void> {
    try {
      console.log("rxsdk-> NearbyHandler.BindNearbyGame")

      const param: Array<ESObject> = [p]
      let msg: ESObject = {
        funcName: "NearbyHandler.BindNearbyGame",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("bindNearbyGame", "failed", JSON.stringify(e))
    }
  }



  public SendPackageInfo(p: string, event?: NativeCallback): void {
    try {
      console.log("rxsdk-> NearbyHandler.SendPackageInfo")

      const param: Array<ESObject> = [p]
      let msg: ESObject = {
        funcName: "NearbyHandler.SendPackageInfo",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("sendPackageInfo", "failed", JSON.stringify(e))
    }
  }

  public async ReplyPackageInfoResult(p: string, event?: NativeCallback) {
    try {
      console.log("rxsdk-> NearbyHandler.ReplyPackageInfoResult")

      const param: Array<ESObject> = [p]
      let msg: ESObject = {
        funcName: "NearbyHandler.ReplyPackageInfoResult",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("replyPackageInfoResult", "failed", JSON.stringify(e))
    }
  }


  public TransferPackageData(p: string, event?: NativeCallback) {
    try {
      console.log("rxsdk-> NearbyHandler.TransferPackageData")

      const param: Array<ESObject> = [p]
      let msg: ESObject = {
        funcName: "NearbyHandler.TransferPackageData",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("transferPackageData", "failed", JSON.stringify(e))
    }
  }

  public async Destroy(event?: NativeCallback): Promise<void> {
    try {
      console.log("rxsdk-> NearbyHandler.Destroy")

      const param: Array<ESObject> = []
      let msg: ESObject = {
        funcName: "NearbyHandler.Destroy",
        args: param,
        callback: event,
        timeoutMs: 100000,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      event?.("destroy", "failed", JSON.stringify(e))
    }
  }
}


export function RegisterNearbyManager() {
  let register: Record<string, ESObject> = {};
  register["NearbyManager"] = NearbyManager;
  return register;

}