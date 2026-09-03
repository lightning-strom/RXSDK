// @keepTs
// @ts-nocheck
import type { ILogin } from '../types/ILogin';
import { RXError, RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { WXApi } from "@normalized:N&&&hmssdk/src/main/ets/wx/WXApi&4.0.0";
interface WXResp {
    code: string;
    openId: string;
    lang: string;
}
export class WXLogin implements ILogin {
    async doLogin(f205: Record<string, any>): Promise<object> {
        let g205 = await WXApi.getInstance(f205["wx_appid"]).login(f205);
        if (g205.errCode == 0) {
            return {
                code: g205.code,
                openId: g205.openId,
                lang: g205.lang
            } as WXResp;
        }
        else {
            throw new RXError(g205.errStr, RXErrorCode.THIRD_LOGIN_ERROR, g205.errCode);
        }
    }
}
