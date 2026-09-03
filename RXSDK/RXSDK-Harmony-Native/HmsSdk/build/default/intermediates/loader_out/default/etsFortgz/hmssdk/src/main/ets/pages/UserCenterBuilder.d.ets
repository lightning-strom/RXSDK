// @keepTs
// @ts-nocheck
import { HelperCenterArgs, JsObject, UserCenterArgs } from '../types/Index';
export declare class UserCenterParams {
    nickName?: string;
    avatar?: string;
    private _config_params?;
    private _custom_params?;
    onCloseClick?: (event?: ClickEvent) => void;
    private _onJavaScriptCallback?;
    onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;
    set onJavaScriptCallback(f144: ((data: JsObject) => string | boolean | undefined) | undefined);
    get onJavaScriptCallback(): ((data: JsObject) => string | boolean | undefined) | undefined;
    setConfigParams(e144: UserCenterArgs): void;
    setCustomParams(d144: HelperCenterArgs): void;
    getConfigParams(): Record<string, string>;
    constructor(a144: string, b144?: (event?: ClickEvent) => void);
}
@Builder
export declare function userCenterBuilder(s143: UserCenterParams): void;
