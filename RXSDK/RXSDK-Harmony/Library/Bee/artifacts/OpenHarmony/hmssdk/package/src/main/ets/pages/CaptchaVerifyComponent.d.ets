// @keepTs
// @ts-nocheck
import display from "@ohos.display";
import { JsObject } from '../types/Index';
export interface WebFuncs {
    sliderCaptcha: (ret: string) => void;
    invokeNativeCallback: (json: string) => void;
    doClose: (json: string) => void;
    onPageStarted: (json: string) => void;
    onPageFinished: (json: string) => void;
}
/**
 * Login page component.
 */
@Component
export declare struct CaptchaVerifyComponent {
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
    onSliderCaptchaCallback?: (data: JsObject) => void;
    webFunc: WebFuncs;
    invokeHandler(y71: string): void;
    aboutToAppear(): void;
    close(): void;
    build(): void;
    @Builder
    WebView(): void;
}
