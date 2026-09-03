// @keepTs
// @ts-nocheck
import { JsObject } from '../types/Index';
export declare class WebViewParams {
    naviBarVisible: boolean;
    closeVisible: boolean;
    backVisible: boolean;
    url: string;
    title?: ResourceStr;
    webParams: Record<string, string>;
    onCloseClick?: (event?: ClickEvent) => void;
    onJavaScriptCallback?: (data: JsObject) => string | boolean | void;
    constructor(g: string, h?: (event?: ClickEvent) => void);
    setWebParams(s146?: Record<string, string>): this;
    setTitle(r146?: ResourceStr): this;
    setNaviBarVisible(q146: boolean): this;
    setBackVisible(p146: boolean): this;
    setCloseVisible(o146: boolean): this;
    setOnJavaScriptCallback(n146: (data: JsObject) => string | boolean | undefined): this;
}
@Builder
export declare function webViewBuilder(f146: WebViewParams): void;
