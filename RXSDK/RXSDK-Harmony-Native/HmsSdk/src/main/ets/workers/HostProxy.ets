import worker from '@ohos.worker';
import { Logger } from '../utils/Logger';
import { kCustomHandler, Message, MSG_RECEIVER, PROCESS_TUANJIE_BUILTIN_MESSAGE, PROCESS_TUANJIE_HANDLER, PROCESS_TUANJIE_MESSAGE, REGISTER_HANDLER } from './MessageHandler';


export class HostProxy {

  Loop(msg: ESObject) {
    console.log("message from main thread received!");
  }


}

let gHostProxy = new HostProxy();
export function GetHostProxy(): HostProxy {
  return gHostProxy;
}

export function PROCESS_WORKER_MESSAGE(msg: Message): number {
  let handlers: ESObject = GetHostProxy();
  const func: ESObject = handlers[msg.type];
  if (msg.type == "SetGlobalThisContext") { // async 函数特殊处理
    handlers.SetGlobalThisContext(msg);
    return 0;
  }
  if (!!func) {
    func.apply(handlers,[msg]);
    return 0;
  } else if (msg.type == "RUN_ON_TUANJIEMAIN_THREAD_JS") {
    PROCESS_TUANJIE_BUILTIN_MESSAGE(msg); // 自动注册的处理函数
  } else if (msg.type == "RUN_ON_TUANJIEMAIN_THREAD_USER_EVENT") {
    PROCESS_TUANJIE_MESSAGE(msg);
  } else if (msg.type == kCustomHandler) {
    PROCESS_TUANJIE_HANDLER(msg);
  } else {
    Logger.warn("Unknown message type=%{public}s", msg.type);
  }
  return -1;
}

export function POST_MESSAGE(msg: ESObject) {
  POST_MESSAGE_TO_HOST(msg);
}

export function POST_MESSAGE_TO_HOST(msg: ESObject) {
  if (!msg.type)
    msg.type = "RUN_ON_UI_THREAD_USER_EVENT";
  if (!!msg.callback) {
    if (!msg.callbackFuncName)
      msg.callbackFuncName = msg.funcName;
    REGISTER_HANDLER(MSG_RECEIVER.WORKER_TUANJIE, msg.callbackFuncName, msg.callback);
    msg.callback = undefined;
  }
  worker.workerPort.postMessage(msg);
}