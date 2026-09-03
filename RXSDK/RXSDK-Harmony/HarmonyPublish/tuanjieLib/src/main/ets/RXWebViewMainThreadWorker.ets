import worker from '@ohos.worker';
import RXWebViewJsBridge from './RXWebViewJsBridge';
import webview from '@ohos.web.webview';
import { MSG_RECEIVER, REGISTER_MODULE } from 'classesLib';


class WebMessageHandler {
  Close() {
    AppStorage.set("RXWebViewVisible", false);
  }

  OpenUrl(data:ESObject) {
    RXWebViewJsBridge.getInstance().setInitParam(data.initParam)
    // AppStorage.set("RXWebViewController", new webview.WebviewController());

    globalThis.RXWebViewLayout?.setLight(data.isLight);
    let title: ESObject = data.title
    if (title) {
      globalThis.RXWebViewLayout?.setNaviBarVisible(true);
      globalThis.RXWebViewLayout?.setNaviBackVisible(false);
      globalThis.RXWebViewLayout?.setNaviTitle(title);
      globalThis.RXWebViewLayout?.setCloseBtnVisible(false);
    } else {
      globalThis.RXWebViewLayout?.setNaviBarVisible(false);
      globalThis.RXWebViewLayout?.setCloseBtnVisible(true);

    }
    AppStorage.set("RXWebViewURL", data.url);
    AppStorage.set("RXWebViewVisible", true);
  }
  RunJavaScript(data:ESObject){
    RXWebViewJsBridge.getInstance().runJavaScript( data.script)
  }
}

export class RXWebViewMainThreadWorker {
  static MessageInitialized: Boolean = false;

  static InitMessageBind(worker: worker.ThreadWorker) {
    if (RXWebViewMainThreadWorker.MessageInitialized == true) {
      return;
    }
    let webMessageHandler = new WebMessageHandler();
    worker.addEventListener("message", async (e) => {
      let msg: ESObject = JSON.parse(JSON.stringify(e));
      if (msg.data.type !== 'RXWebViewControl') {
        return;
      }
      switch (msg.data.funcName) {
        case "Close":
           webMessageHandler.Close();
          break;
        case "OpenUrl": {
          webMessageHandler.OpenUrl(msg.data);
          break;
        }
        case "RunJavaScript": {
          webMessageHandler.RunJavaScript(msg.data);
        }
      }
    });

    RXWebViewMainThreadWorker.MessageInitialized = true;
  }
}
REGISTER_MODULE(MSG_RECEIVER.HOST_UI, new WebMessageHandler());