import { MailDetail } from '../types/MailInterfaces';
import { MailDetailComponent } from './MailDetailComponent';

export class MailDetailParams {
  mailContent: MailDetail
  onCloseClick?: (event?: ClickEvent) => void;
  _onMailClick?: ((isDelete: boolean) => void) | undefined;

  public setOnMailClick(value: ((isDelete: boolean) => void) | undefined) {
    this._onMailClick = value;
    return this
  }


  constructor(data: MailDetail, onCloseClick?: (event?: ClickEvent) => void) {
    this.mailContent = data;
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function mailDetailBuilder(params: MailDetailParams) {
  MailDetailComponent({ mailContent: params.mailContent, onCloseClick: params.onCloseClick, onMailClick: params._onMailClick })
}