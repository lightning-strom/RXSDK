// @keepTs
// @ts-nocheck
import display from "@ohos.display";
import { JsObject } from '../types/Index';
/**
 * Login page component.
 */
@Component
export declare struct UserCenterComponent {
    @StorageProp("rx_logo")
    title: ResourceStr;
    @State
    avatar: ResourceStr;
    @State
    nickName: string;
    @State
    url: string;
    @State
    orientation: display.Orientation;
    webParams: Record<string, string>;
    onCloseClick?: (event?: ClickEvent) => void;
    onJavaScriptCallback?: (data: JsObject) => string | boolean | undefined;
    onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;
    aboutToAppear(): void;
    close(): void;
    build(): void;
}
