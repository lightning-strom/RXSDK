// @keepTs
// @ts-nocheck
import { JsObject, UserCenterConfig, RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { UserCenterParams } from './UserCenterBuilder';
export declare class UserCenterDialog extends BaseDialog<UserCenterParams> {
    private ucConfig?;
    private _onSwitchAccount?;
    private _onJavaScriptCallback?;
    setConfigParams(e146?: UserCenterConfig): this;
    set onSwitchAccount(d146: ((event?: ClickEvent) => void) | undefined);
    get onSwitchAccount(): ((event?: ClickEvent) => void) | undefined;
    set onJavaScriptCallback(c146: ((data: JsObject) => string | boolean | undefined) | undefined);
    get onJavaScriptCallback(): ((data: JsObject) => string | boolean | undefined) | undefined;
    static getInstance(b146: UIContext): UserCenterDialog;
    show(t145?: RCallback | undefined): Promise<this>;
}
