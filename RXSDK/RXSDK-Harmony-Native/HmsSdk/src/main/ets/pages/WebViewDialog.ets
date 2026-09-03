import { JsObject, RCallback, RXCallback, RXResult  } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { webViewBuilder, WebViewParams } from './WebViewBuilder';

let Instance: WebViewDialog;

type JsCallback = (data: JsObject) => string | boolean | void

export class WebViewDialog extends BaseDialog<WebViewParams> {
  private _url: string;
  title?: string;
  webParams: Record<string, string> = {}
  private navVisible: boolean = true;
  private backVisible: boolean = false;
  private closeVisible: boolean = true;
  onJavaScriptCallback?: JsCallback;

  setOnJavaScriptCallback(callback?: JsCallback) {
    this.onJavaScriptCallback = callback
    return this
  }

  constructor(uiContext: UIContext, url: string) {
    super(uiContext);
    this._url = url;
  }

  public setUrl(value: string) {
    this._url = value;
    return this
  }

  public setWebParams(value?: Record<string, string>) {
    if (value) {
      this.webParams = value;
    }
    return this
  }

  public setTitle(value?: string) {
    this.title = value;
    return this
  }

  setNaviBarVisible(visible: boolean) {
    this.navVisible = visible
    return this
  }

  setBackVisible(visible: boolean) {
    this.backVisible = visible
    return this
  }

  setCloseVisible(visible: boolean) {
    this.closeVisible = visible
    return this
  }


  public static getInstance(uiContext: UIContext, url: string, newW: boolean = true) {
    if (Instance == null || newW) {
      Instance = new WebViewDialog(uiContext, url);
    } else {
      Instance.setUrl(url)
    }
    return Instance;
  }


  show(callback?: RCallback) {
    let args = new WebViewParams(this._url, () => {
      this.close()
    }).setNaviBarVisible(this.navVisible)
      .setBackVisible(this.backVisible)
      .setCloseVisible(this.closeVisible)

    args.onJavaScriptCallback = this.onJavaScriptCallback || ((data: JsObject) => {
      return this.onCallback?.(data as object as RXResult)
    });
    args.setTitle(this.title)
    args.setWebParams(this.webParams)

    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(webViewBuilder), args);
    }
    this._show(this.contentNode)
    return this
  }
}