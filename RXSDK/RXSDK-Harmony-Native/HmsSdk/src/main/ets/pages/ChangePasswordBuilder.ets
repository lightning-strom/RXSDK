import ApiPath from '../constants/ApiPath';
import { ChangePasswordComponent } from './ChangePasswordComponent';


export class ChangePasswordParams {
  isFirstSet: boolean = false;
  onCommitClick?: (password: string, oldPassword?: string) => void;
  onCloseClick?: (event?: ClickEvent) => void;

  constructor(isFirstSet: boolean, onCommitClick?: (password: string, oldPassword?: string) => void, onCloseClick?: (event?: ClickEvent) => void) {
    this.isFirstSet = isFirstSet
    this.onCommitClick = onCommitClick
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function changePasswordBuilder(params: ChangePasswordParams) {
  ChangePasswordComponent({ isFirstSet: params.isFirstSet, onCommitClick: params.onCommitClick, onCloseClick: params.onCloseClick })
}