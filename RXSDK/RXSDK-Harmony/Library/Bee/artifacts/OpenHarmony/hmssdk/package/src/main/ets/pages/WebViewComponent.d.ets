// @keepTs
// @ts-nocheck
import display from "@ohos.display";
import { JsObject } from '../types/Index';
export interface WebApiParams {
    cpid: string;
    productid: string;
    channelid: string;
    platformid: number;
    version: string;
    devicecode: string;
    language: string;
    tzoffset: string;
    domain: string;
    country_code: string;
}
export interface DeviceParams {
    naviBarHeight: number;
    isPad: boolean;
}
export interface WebParams {
    api_params: string;
    custom_params?: string;
    methods?: string;
    login_data: string;
    init_data: string;
    device?: string;
    request_headers?: string;
    passwordStrength?: string;
    setSyncInfoEnable?: boolean;
    protocol?: string;
}
interface JsHandler {
    bindPhone: (dat: JsObject) => void;
    bindEmail: (dat: JsObject) => void;
    real_auth: (dat: JsObject) => void;
    deregister: (dat: JsObject) => void;
    underegister: (dat: JsObject) => void;
    reset_password: (dat: JsObject) => void;
    close_webview: (dat: JsObject) => void;
    logBackIn: (dat: JsObject) => void;
    callback: (dat: JsObject) => void;
}
export interface WebFuncs {
    openWebView: (url: string) => void;
    openSystemWebView: (url: string) => void;
    openIIFAAAuth: (json: string) => void;
    minimized: (json: string) => void;
    closeWebView: (json: string) => void;
    reportUserLog: (json: string) => void;
    setTitle: (json: string) => void;
    trackUserAction: (json: string) => void;
    invokeNativeCallback: (json: string) => void;
    setNaviBarVisible: (json: boolean) => void;
    doClose: (json: string) => void;
    getInitParams: () => void;
    openChatService: (json: string) => void;
    resetpwdSuccess: (json: string) => void;
    refreshAccessToken: (json: string) => void;
    setCloseVisible: (json: boolean) => void;
    setBackVisible: (json: boolean) => void;
}
/**
 * Login page component.
 */
@Component
export declare struct WebViewComponent {
    @Prop
    title: ResourceStr;
    @State
    url: string;
    @State
    naviBarVisible: boolean;
    @State
    closeVisible: boolean;
    @State
    backVisible: boolean;
    @State
    divVisible: boolean;
    @State
    orientation: display.Orientation;
    @State
    isLoading: boolean;
    @State
    horizontalPadding: number;
    webParams: Record<string, string>;
    private webController;
    onCloseClick?: (event?: ClickEvent) => void;
    onJavaScriptCallback?: (data: JsObject) => string | boolean | void;
    webFunc: WebFuncs;
    invokeHandler(a149: string): void;
    jsHandler: JsHandler;
    private startIIFAAAuth;
    private registerIIFAAAutoValidate;
    private sendIIFAAResultToJs;
    private jsIIFAAResultFunc;
    jsRefreshAccessTokenFunc(j148: string): string;
    injectionCode(): string;
    onNavVisibleChanged(h148: string): void;
    aboutToAppear(): void;
    close(): void;
    build(): void;
    @Builder
    WebView(): void;
}
export {};
