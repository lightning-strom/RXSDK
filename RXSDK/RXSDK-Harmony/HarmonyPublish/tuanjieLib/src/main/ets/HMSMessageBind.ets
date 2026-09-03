import worker from '@ohos.worker';
import { SDKManager } from './RXInterface';
import { RXWebViewMainThreadWorker } from './RXWebViewMainThreadWorker';

/** AppStorage key of classesLib WorkerProxy (Constants.APP_KEY_TUANJIE_MAIN_WORKER). */
const APP_KEY_TUANJIE_MAIN_WORKER = 'app_key_tuanjie_main_worker';

/**
 * Tuanjie 1.10+ Host glue: WorkerProxy is inside classesLib and no longer calls
 * SDKManager.InitMessageBind. Call once after WorkerProxy exists.
 * Message dispatch lives in hmssdk SDKManager.InitMessageBind (onmessage chain).
 */
export class HMSMessageBind {
  private static bound: boolean = false;

  static tryBind(): boolean {
    if (HMSMessageBind.bound) {
      return true;
    }
    let proxy: ESObject = AppStorage.get(APP_KEY_TUANJIE_MAIN_WORKER);
    if (!proxy || !proxy.threadWorker) {
      return false;
    }
    let threadWorker: worker.ThreadWorker = proxy.threadWorker as worker.ThreadWorker;
    SDKManager.InitMessageBind(threadWorker);
    RXWebViewMainThreadWorker.InitMessageBind(threadWorker);
    HMSMessageBind.bound = true;
    console.info('HMSMessageBind: SDKManager.InitMessageBind ok');
    return true;
  }

  static bindWithRetry(maxRetry: number = 50, intervalMs: number = 100): void {
    if (HMSMessageBind.tryBind()) {
      return;
    }
    if (maxRetry <= 0) {
      console.error('HMSMessageBind: WorkerProxy not ready');
      return;
    }
    setTimeout(() => {
      HMSMessageBind.bindWithRetry(maxRetry - 1, intervalMs);
    }, intervalMs);
  }
}
