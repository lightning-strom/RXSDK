
/**
 * @desc Run on UI/main thread, process message from worker thread and postMessage to worker thread
 */
import worker, { MessageEvents } from '@ohos.worker';


import { PROCESS_UI_BUILTIN_MESSAGE, PROCESS_UI_HANDLER, PROCESS_UI_MESSAGE, kCustomHandler } from './MessageHandler';
import { Logger } from '../utils/Logger';
import { Constants } from '../constants/Constants';


export class WorkerProxy {
  //  public mModules: Record<string, ESObject> = {
  // };
  //
  // public mUserExtraModules: Record<string, ESObject> = { };

  private constructor() {
    Logger.debug('%{public}s', 'WorkerProxy.constructor');

   }


  /**
   * post message to worker thread. For now we have only one worker - TuanjieMainWorker
   * @param msg
   */
  public static postMessage(msg: ESObject, targetWorker: string | undefined) {
    // if (targetWorker === undefined)
    //   WorkerProxy.Instance().threadWorker.postMessage(msg);
    // for now we have only worker
  }
}

export function POST_MESSAGE(msg: ESObject) {
  POST_MESSAGE_TO_WORKER(msg, undefined)
}

export function POST_MESSAGE_TO_WORKER(msg: ESObject, targetWorker: string | undefined) {
  if (!msg.type)
    msg.type = "RUN_ON_UI_THREAD_USER_EVENT";
  WorkerProxy.postMessage(msg, targetWorker);
}

