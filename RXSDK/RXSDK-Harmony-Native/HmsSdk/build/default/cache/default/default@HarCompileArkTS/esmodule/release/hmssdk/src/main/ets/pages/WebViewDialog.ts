// @keepTs
// @ts-nocheck
import type { JsObject, RCallback, RXResult } from '../types/Index';
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { webViewBuilder, WebViewParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/WebViewBuilder&4.0.0";
let Instance: WebViewDialog;
type JsCallback = (data: JsObject) => string | boolean | void;
export class WebViewDialog extends BaseDialog<WebViewParams> {
    private _url: string;
    title?: string;
    webParams: Record<string, string> = {};
    private navVisible: boolean = true;
    private backVisible: boolean = false;
    private closeVisible: boolean = true;
    onJavaScriptCallback?: JsCallback;
    setOnJavaScriptCallback(r151?: JsCallback) {
        this.onJavaScriptCallback = r151;
        return this;
    }
    constructor(p151: UIContext, q151: string) {
        super(p151);
        this._url = q151;
    }
    public setUrl(o151: string) {
        this._url = o151;
        return this;
    }
    public setWebParams(n151?: Record<string, string>) {
        if (n151) {
            this.webParams = n151;
        }
        return this;
    }
    public setTitle(m151?: string) {
        this.title = m151;
        return this;
    }
    setNaviBarVisible(l151: boolean) {
        this.navVisible = l151;
        return this;
    }
    setBackVisible(k151: boolean) {
        this.backVisible = k151;
        return this;
    }
    setCloseVisible(j151: boolean) {
        this.closeVisible = j151;
        return this;
    }
    public static getInstance(g151: UIContext, h151: string, i151: boolean = true) {
        if (Instance == null || i151) {
            Instance = new WebViewDialog(g151, h151);
        }
        else {
            Instance.setUrl(h151);
        }
        return Instance;
    }
    show(d151?: RCallback) {
        let e151 = new WebViewParams(this._url, () => {
            this.close();
        }).setNaviBarVisible(this.navVisible)
            .setBackVisible(this.backVisible)
            .setCloseVisible(this.closeVisible);
        e151.onJavaScriptCallback = this.onJavaScriptCallback || ((f151: JsObject) => {
            return this.onCallback?.(f151 as object as RXResult);
        });
        e151.setTitle(this.title);
        e151.setWebParams(this.webParams);
        if (this.contentNode) {
            this.contentNode.update(e151);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(webViewBuilder), e151);
        }
        this._show(this.contentNode);
        return this;
    }
}
