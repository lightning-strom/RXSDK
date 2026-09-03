// @keepTs
// @ts-nocheck
import { Account, LoginData, RXCallback, RXLoginConfig, RXResult } from '../types/Index';
import { LoginBuilderParams } from './LoginBuilder';
import { BaseDialog } from './BaseDialog';
import { LoginConfig } from '../types/InitConfig';
export declare class LoginDialog extends BaseDialog<LoginBuilderParams, LoginData> {
    private config?;
    private fromUnionLogin?;
    private account?;
    private loginMethods?;
    setLoginMethods(e109?: Array<LoginConfig>): this;
    setAccount(d109?: Account): this;
    setFromUnionLogin(): this;
    setConfig(c109?: RXLoginConfig): this;
    static getInstance(b109: UIContext): LoginDialog;
    show(h108?: RXCallback<RXResult<LoginData>>): this;
}
