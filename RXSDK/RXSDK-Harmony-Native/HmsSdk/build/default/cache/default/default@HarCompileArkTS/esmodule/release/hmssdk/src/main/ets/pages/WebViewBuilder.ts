// @keepTs
// @ts-nocheck
import type { JsObject } from '../types/Index';
import { WebViewComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/WebViewComponent&4.0.0";
export class WebViewParams {
    naviBarVisible: boolean = true;
    closeVisible: boolean = true;
    backVisible: boolean = false;
    url: string;
    title?: ResourceStr;
    webParams: Record<string, string> = {};
    onCloseClick?: (event?: ClickEvent) => void;
    onJavaScriptCallback?: (data: JsObject) => string | boolean | void;
    constructor(t146: string, u146?: (event?: ClickEvent) => void) {
        this.onCloseClick = u146;
        this.url = t146;
        this.title = AppStorage.get<ResourceStr>("rx_logo");
    }
    setWebParams(s146?: Record<string, string>) {
        if (s146) {
            this.webParams = s146;
        }
        return this;
    }
    setTitle(r146?: ResourceStr) {
        if (r146) {
            this.title = r146;
        }
        return this;
    }
    setNaviBarVisible(q146: boolean) {
        this.naviBarVisible = q146;
        return this;
    }
    setBackVisible(p146: boolean) {
        this.backVisible = p146;
        return this;
    }
    setCloseVisible(o146: boolean) {
        this.closeVisible = o146;
        return this;
    }
    setOnJavaScriptCallback(n146: (data: JsObject) => string | boolean | undefined) {
        this.onJavaScriptCallback = n146;
        return this;
    }
}
export function webViewBuilder(f146: WebViewParams, g146 = null) {
    const h146 = f146;
    {
        (g146 ? g146 : this).observeComponentCreation2((i146, j146, k146 = h146) => {
            if (j146) {
                let l146 = new WebViewComponent(g146 ? g146 : this, {
                    naviBarVisible: k146.naviBarVisible,
                    backVisible: k146.backVisible,
                    closeVisible: k146.closeVisible,
                    webParams: k146.webParams,
                    url: k146.url,
                    title: k146.title,
                    onJavaScriptCallback: k146.onJavaScriptCallback,
                    onCloseClick: k146.onCloseClick
                }, undefined, i146, () => { }, { page: "HmsSdk/src/main/ets/pages/WebViewBuilder.ets", line: 57, col: 3 });
                ViewPU.create(l146);
                let m146 = () => {
                    return {
                        naviBarVisible: k146.naviBarVisible,
                        backVisible: k146.backVisible,
                        closeVisible: k146.closeVisible,
                        webParams: k146.webParams,
                        url: k146.url,
                        title: k146.title,
                        onJavaScriptCallback: k146.onJavaScriptCallback,
                        onCloseClick: k146.onCloseClick
                    };
                };
                l146.paramsGenerator_ = m146;
            }
            else {
                (g146 ? g146 : this).updateStateVarsOfChildByElmtId(i146, {
                    title: k146.title
                });
            }
        }, { name: "WebViewComponent" });
    }
}
