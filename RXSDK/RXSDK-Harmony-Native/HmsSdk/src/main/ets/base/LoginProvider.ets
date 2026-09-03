import { ILogin } from '../types/ILogin';
import { LoginMethod } from '../types/Index';
import { Logger } from '../utils/Logger';
import { WXLogin } from '../wx/WXLogin';
import { HmsLogin } from './HmsLogin';

class LoginDefault implements ILogin {
  doLogin(_params: Record<string, ESObject>): Promise<object> {
    return Promise.resolve(new Object);
  }
}

let defaultLogin = new LoginDefault()

class LoginProvider implements ILogin {
  private loginMap: Record<LoginMethod, ILogin> = {
    [LoginMethod.Guest]: defaultLogin,
    [LoginMethod.Harmony]: new HmsLogin,
    [LoginMethod.Hwjos]: new HmsLogin,
    [LoginMethod.UserName]: defaultLogin,
    [LoginMethod.CaptchaCode]: defaultLogin,
    [LoginMethod.Wechat]: new WXLogin
  }

  async doLogin(params: Record<string, ESObject>): Promise<object> {
    const method = params.method as LoginMethod;
    const loginHandler = this.loginMap[method];
    if (loginHandler) {
      return loginHandler.doLogin(params);
    } else {
      Logger.w(`Login method not supported: ${method}`);
      return Object
    }
  }
}

export default new LoginProvider()