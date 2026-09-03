import { RCallback, RXResult } from "../types/Index";
import { Context } from "@ohos.abilityAccessCtrl";
interface UserAttributionParams {
    device: Record<string, any>;
    distinct_id?: string;
    user_attrs?: Record<string, any>;
    user_source?: Record<string, any>;
    source_ad?: Record<string, any>;
    activate?: {
        result: any;
    };
}
declare class UserActivate {
    private ipv4;
    private activateResult;
    private isLoginSuccess;
    private userActivatedReTryCount;
    getDevice(): Promise<Record<string, any>>;
    onLoginSuccess(): void;
    getAttributionData(s26?: Context): Promise<UserAttributionParams>;
    getIp(): Promise<string>;
    init(l26: Context, m26?: Record<string, any>, n26?: RCallback): Promise<RXResult<object>>;
    activate(e26: Record<string, any>, f26: Context, g26?: number): Promise<RXResult<object>>;
}
declare const _default: UserActivate;
export default _default;
