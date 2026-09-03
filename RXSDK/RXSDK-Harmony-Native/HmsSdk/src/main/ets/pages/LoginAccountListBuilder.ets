import { Account } from '../types/Index';
import { LoginAccountListComponent } from './LoginAccountListComponent';

export class LoginAccountListParams {
  list: Account[] = []
  onCloseClick?: (event?: ClickEvent) => void;
  onItemClick?: (item: Account, index: number) => void;
  onDelClick?: (item: Account, index: number) => void;

  constructor(list: Account[], onCloseClick?: (event?: ClickEvent) => void) {
    this.list = list
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function loginAccountListBuilder(params: LoginAccountListParams) {
  LoginAccountListComponent({
    list: params.list,
    onItemClick: params.onItemClick,
    onCloseClick: params.onCloseClick,
    onDelClick: params.onDelClick,
  })
}