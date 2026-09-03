import worker from '@ohos.worker';
import RXWebViewJsBridge from './RXWebViewJsBridge';
import webview from '@ohos.web.webview';

export class RXWebViewMainThreadWorker {
  static MessageInitialized: Boolean = false;

  static InitMessageBind(worker: worker.ThreadWorker) {
    if (RXWebViewMainThreadWorker.MessageInitialized == true) {
      return;
    }

    worker.addEventListener("message", async (e) => {
      let msg: ESObject = JSON.parse(JSON.stringify(e));
      if (msg.data.type !== 'RXWebViewControl') {
        return;
      }

      switch (msg.data.funcName) {
        case "Close":
          AppStorage.set("RXWebViewVisible", false);
          break;
        case "OpenUrl": {
          RXWebViewJsBridge.getInstance().setInitParam(msg.data.initParam)
          // AppStorage.set("RXWebViewController", new webview.WebviewController());

          globalThis.RXWebViewLayout?.setLight(msg.data.isLight);
          let title: ESObject = msg.data.title
          if (title) {
            globalThis.RXWebViewLayout?.setNaviBarVisible(true);
            globalThis.RXWebViewLayout?.setNaviBackVisible(false);
            globalThis.RXWebViewLayout?.setNaviTitle(title);
            globalThis.RXWebViewLayout?.setCloseBtnVisible(false);
          } else {
            globalThis.RXWebViewLayout?.setNaviBarVisible(false);
            globalThis.RXWebViewLayout?.setCloseBtnVisible(true);

          }
          AppStorage.set("RXWebViewURL", msg.data.url);
          AppStorage.set("RXWebViewVisible", true);
        }
          break;
        case "RunJavaScript": {
          RXWebViewJsBridge.getInstance().runJavaScript(msg.data.script)
        }
      }
    });

    RXWebViewMainThreadWorker.MessageInitialized = true;
  }
}