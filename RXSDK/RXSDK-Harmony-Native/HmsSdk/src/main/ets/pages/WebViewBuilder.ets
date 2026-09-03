import { JsObject } from '../types/Index';
import { WebViewComponent } from './WebViewComponent';

export class WebViewParams {
  naviBarVisible: boolean = true;
  closeVisible: boolean = true;
  backVisible: boolean = false;
  url: string;
  title?: ResourceStr;
  webParams: Record<string, string> = {}
  onCloseClick?: (event?: ClickEvent) => void;
  onJavaScriptCallback?: (data: JsObject) => string | boolean | void;

  constructor(url: string, onCloseClick?: (event?: ClickEvent) => void) {
    this.onCloseClick = onCloseClick
    this.url = url
    this.title = AppStorage.get<ResourceStr>("rx_logo")
  }

  setWebParams(value?: Record<string, string>) {
    if (value) {
      this.webParams = value
    }
    return this
  }

  setTitle(value?: ResourceStr) {
    if (value) {
      this.title = value
    }
    return this
  }

  setNaviBarVisible(value: boolean) {
    this.naviBarVisible = value
    return this
  }

  setBackVisible(value: boolean) {
    this.backVisible = value
    return this
  }

  setCloseVisible(value: boolean) {
    this.closeVisible = value
    return this
  }

  setOnJavaScriptCallback(onJavaScriptCallback: (data: JsObject) => string | boolean | undefined) {
    this.onJavaScriptCallback = onJavaScriptCallback
    return this
  }
}

@Builder
export function webViewBuilder(params: WebViewParams) {
  WebViewComponent({
    naviBarVisible: params.naviBarVisible,
    backVisible: params.backVisible,
    closeVisible: params.closeVisible,
    webParams: params.webParams,
    url: params.url,
    title: params.title,
    onJavaScriptCallback: params.onJavaScriptCallback,
    onCloseClick: params.onCloseClick
  })
}