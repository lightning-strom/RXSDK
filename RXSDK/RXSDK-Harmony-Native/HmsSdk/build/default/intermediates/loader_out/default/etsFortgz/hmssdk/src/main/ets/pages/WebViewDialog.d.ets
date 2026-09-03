// @keepTs
// @ts-nocheck
import { JsObject, RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { WebViewParams } from './WebViewBuilder';
type JsCallback = (data: JsObject) => string | boolean | void;
export declare class WebViewDialog extends BaseDialog<WebViewParams> {
    private _url;
    title?: string;
    webParams: Record<string, string>;
    private navVisible;
    private backVisible;
    private closeVisible;
    onJavaScriptCallback?: JsCallback;
    setOnJavaScriptCallback(r151?: JsCallback): this;
    constructor(d: UIContext, e: string);
    setUrl(o151: string): this;
    setWebParams(n151?: Record<string, string>): this;
    setTitle(m151?: string): this;
    setNaviBarVisible(l151: boolean): this;
    setBackVisible(k151: boolean): this;
    setCloseVisible(j151: boolean): this;
    static getInstance(g151: UIContext, h151: string, i151?: boolean): WebViewDialog;
    show(d151?: RCallback): this;
}
export {};
