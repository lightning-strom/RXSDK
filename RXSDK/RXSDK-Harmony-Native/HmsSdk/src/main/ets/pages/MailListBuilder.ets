import { Mail, MailItem } from '../types/MailInterfaces';
import { MailListComponent } from './MailListComponent';

@Observed
export class MailListParams {
  _mailObj: Mail;
  // _mailList?: MailItem[] ;

  onCloseClick?: (event?: ClickEvent) => void;
  onMailClick?: (mailItem: MailItem) => void;
  onReceiveClick?: () => void;

  public set mailObj(value: Mail) {
    this._mailObj = value;
  }

  // public set mailList(value: MailItem[] | undefined) {
  //   this._mailList = value;
  // }

  public setOnReceiveClick(value: () => void) {
    this.onReceiveClick = value;
    return this;
  }

  public setOnMailClick(value: (mailItem: MailItem) => void) {
    this.onMailClick = value;
    return this;
  }

  constructor(mail: Mail, onCloseClick?: (event?: ClickEvent) => void) {
    this._mailObj = mail;
    // this._mailList=mail.list
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function mailListBuilder(params: MailListParams) {
  MailListComponent({
    mailObj: params._mailObj,
    // mailList:params._mailList,
    onCloseClick: params.onCloseClick,
    onMailClick: params.onMailClick,
    onReceiveClick: params.onReceiveClick
  })
}