import { LoginConfig } from '../types/InitConfig';
import { Account, LoginParams } from '../types/Index';
import { LoginComponent2 } from './LoginComponent2';


export class LoginBuilderParams {
  onLoginClick?: (login: LoginParams) => void;
  onForgotPwdClick?: (event: ClickEvent) => void;
  onCloseClick?: (event?: ClickEvent) => void;
  privacyEnable: boolean = true;
  privacyText1: string = '用户协议';
  privacyText2: string = '隐私政策';
  privacyText3: string = '';
  privacyUrl1: string = '00001';
  privacyUrl2: string = '00002';
  privacyUrl3: string = '';
  lastMethod?: string;
  loginMethods?: Array<LoginConfig>
  isCaptcha?: boolean
  account?: Account;

  constructor(onLoginClick?: (login: LoginParams) => void, onCloseClick?: (event?: ClickEvent) => void) {
    this.onLoginClick = onLoginClick
    this.onCloseClick = onCloseClick
  }

  setLoginMethods(loginMethods: Array<LoginConfig>) {
    this.loginMethods = loginMethods
    return this;
  }
}

@Builder
export function loginBuilder(params: LoginBuilderParams) {
  LoginComponent2({
    account: params.account,
    privacyEnable: params.privacyEnable,
    privacyText1: params.privacyText1,
    privacyText2: params.privacyText2,
    privacyText3: params.privacyText3,
    privacyUrl1: params.privacyUrl1,
    privacyUrl2: params.privacyUrl2,
    privacyUrl3: params.privacyUrl3,
    onLoginClick: params.onLoginClick,
    onCloseClick: params.onCloseClick,
    onForgotPwdClick: params.onForgotPwdClick,
    loginMethods: params.loginMethods,
    isCaptcha: params.isCaptcha ?? params.loginMethods?.[0]?.method != "username" ?? true,
    lastMethod: params.lastMethod,
  })
}