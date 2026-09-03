import { Account } from '../types/Index';
import { LoginQuickComponent } from './LoginQuickComponent';

export class LoginQuickParams {
  account: Account
  onCloseClick?: (event?: ClickEvent) => void;
  onStartClick?: (account: Account) => void;
  onMoreMethodClick?: (tag: number) => void;

  constructor(account: Account, onCloseClick?: (event?: ClickEvent) => void) {
    this.account = account
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function loginQuickBuilder(params: LoginQuickParams) {
  LoginQuickComponent({
    account: params.account,
    onCloseClick: params.onCloseClick,
    onStartClick: params.onStartClick,
    onMoreMethodClick: params.onMoreMethodClick,
  })
}