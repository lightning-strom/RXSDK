import { NearbyHandler, RXApi } from "./RXInterface";
import { MSG_RECEIVER, REGISTER_MODULE, POST_MESSAGE_TO_HOST } from 'classesLib';

export class TuanjieBridge {
  Invoke(funcName: string, args?: ESObject, callback?: (...args: Array<ESObject>) => ESObject, timeoutMs?: number, modulePath?: string) {
    try {
      let msg: ESObject = {
        modulePath: modulePath,
        funcName: funcName,
        args: args != null ? (Array.isArray(args) ? args : [args]) : [],
        callback: callback,
        timeoutMs: timeoutMs,
      }
      POST_MESSAGE_TO_HOST(msg);
    } catch (e) {
      console.error(e);
      //打印 e 详情
      console.error(e.stack);
    }

  }

  Init(args: ESObject, callback: (...args: Array<ESObject>) => ESObject) {
    console.log("Init cs args ", args);
    let ret: string = callback({ result: "TestFunc" });
    console.log("TestFunc cs ret ", ret);
  }

  Login(args: ESObject, callback: (...args: Array<ESObject>) => ESObject) {
    console.log("Login cs args ", args);
    let ret: string = callback({ result: "TestFunc" });
    console.log("TestFunc cs ret ", ret);
  }

  TestFunc(args: ESObject, callback: (...args: Array<ESObject>) => ESObject) {
    console.log("TestFunc cs args ", args);
    let ret: string = callback(JSON.stringify({ result: "TestFunc" }));
    console.log("TestFunc cs ret ", ret);
  }

  public static getInstance() {
    return new TuanjieBridge();
  }
}

export function RegisterTuanjieBridge() {
  let register: Record<string, Object> = {};
  register["TuanjieBridge"] = TuanjieBridge;
  return register;
}

!!REGISTER_MODULE && REGISTER_MODULE(MSG_RECEIVER.HOST_UI, RXApi.getInstance());
!!REGISTER_MODULE && REGISTER_MODULE(MSG_RECEIVER.HOST_UI, TuanjieBridge.getInstance());
!!REGISTER_MODULE && REGISTER_MODULE(MSG_RECEIVER.HOST_UI, NearbyHandler.getInstance());