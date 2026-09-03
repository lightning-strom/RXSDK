import { ILogin } from '../types/ILogin';
import { LoginData, LoginMethod, LoginParams, RXError, RXErrorCode, RXResult } from '../types/Index';
import Objects from '../utils/Objects';
import { authentication } from '@kit.AccountKit';
import { Logger } from '../utils/Logger';
import { RXApi } from '../sdk/RXApi';
import { gamePlayer } from '@kit.GameServiceKit';

export class HmsLogin implements ILogin {
  async doLogin(params: Record<string, ESObject>): Promise<object> {
    // let p: LoginParams = Objects.assign(params.ext, { method: LoginMethod.Harmony })
    // p.ext = Objects.assign(p.ext, result.data)
    // if (result.needBinding && !result.boundPlayerInfo?.thirdOpenId) {
    //   let authInfo: authentication.AuthorizationWithHuaweiIDCredential = result?.data as authentication.AuthorizationWithHuaweiIDCredential
    //   let assoc: RXResult<object> = await RXApi.getInstance().passport().association<RXResult<object>>({
    //     code: authInfo.authorizationCode,
    //     scopes: authInfo.authorizedScopes
    //   })
    //   Logger.d(assoc)
    //   if (assoc.code == 0) {
    //     p.ext = Objects.assign(p.ext, assoc.data)
    //   } else {
    //     // callback?.(null, assoc as RXResult<LoginData>)
    //     return assoc as RXResult<LoginData>;
    //   }
    // }
    return Promise.resolve(Object);
  }
}