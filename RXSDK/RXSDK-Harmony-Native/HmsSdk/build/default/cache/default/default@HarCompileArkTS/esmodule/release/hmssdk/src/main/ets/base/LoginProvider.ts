// @keepTs
// @ts-nocheck
import type { ILogin } from '../types/ILogin';
import { LoginMethod } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { WXLogin } from "@normalized:N&&&hmssdk/src/main/ets/wx/WXLogin&4.0.0";
import { HmsLogin } from "@normalized:N&&&hmssdk/src/main/ets/base/HmsLogin&4.0.0";
class LoginDefault implements ILogin {
    doLogin(q15: Record<string, any>): Promise<object> {
        return Promise.resolve(new Object);
    }
}
let defaultLogin = new LoginDefault();
class LoginProvider implements ILogin {
    private loginMap: Record<LoginMethod, ILogin> = {
        [LoginMethod.Guest]: defaultLogin,
        [LoginMethod.Harmony]: new HmsLogin,
        [LoginMethod.Hwjos]: new HmsLogin,
        [LoginMethod.UserName]: defaultLogin,
        [LoginMethod.CaptchaCode]: defaultLogin,
        [LoginMethod.Wechat]: new WXLogin
    };
    async doLogin(n15: Record<string, any>): Promise<object> {
        const o15 = n15.method as LoginMethod;
        const p15 = this.loginMap[o15];
        if (p15) {
            return p15.doLogin(n15);
        }
        else {
            Logger.w(`Login method not supported: ${o15}`);
            return Object;
        }
    }
}
export default new LoginProvider();
