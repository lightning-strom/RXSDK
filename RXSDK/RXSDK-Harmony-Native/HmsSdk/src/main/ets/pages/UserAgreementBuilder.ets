import { UserAgreementComponent } from './UserAgreementComponent';

export class UserAgreementParams {
  title: ResourceStr = '用户协议和隐私政策';
  confirmText: ResourceStr = '同意';
  cancelText: ResourceStr = '不同意';
  content: string = '';
  onConfirm?: (event?: ClickEvent) => void;
  onCancel?: (event?: ClickEvent) => void;

  constructor(content:string,onConfirm?: (event?: ClickEvent) => void, onCancel?: (event?: ClickEvent) => void) {
    this.content = content
    this.onConfirm = onConfirm
    this.onCancel = onCancel
  }
}

@Builder
export function userAgreementBuilder(params: UserAgreementParams) {
  UserAgreementComponent({
    onConfirm: params.onConfirm,
    onCancel: params.onCancel,
    title: params.title,
    confirmText: params.confirmText,
    cancelText: params.cancelText,
    content: params.content
  })
}