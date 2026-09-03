let NextID: number = 1;

//邮件状态：1-已读 2-已领 3-已发送
export enum MailStatus {
  Read = 1,
  Received = 2,
  Unread = 3
}

@ObservedV2
export class ObservedArray<T> extends Array<T> {
  constructor(args?: T[]) {
    if (args instanceof Array) {
      super(...args);
    } else {
      super();
    }
  }
}



export interface MailDetail {
  rx_mail_id: number,
  title: string,
  content: string,
  sign: string,
  props: MailPropItem[],
  status: MailStatus
}


export interface MailPropItem {
  name: string;
  describe: string;
  icon: string;
  tag: string;
  count: number;
  count_format: string;
  is_permanent: number;
  time_limit: number
}

@ObservedV2
export class Mail {
  all_count: number = 0;
  not_received_count: number = 0;
  not_read_count: number = 0;
  @Trace list: MailItem[] = [];
}

@ObservedV2
export class MailItem {
  rx_mail_id: number = 0
  title: string = ''
  send_at: string = ''
  @Trace status: MailStatus = 3;
  @Trace has_reward: number = 0
  // constructor(rx_mail_id: number, title: string, send_at: string, status: 1 | 2 | 3, has_reward: number) {
  //   this.rx_mail_id = rx_mail_id;
  //   this.title = title;
  //   this.send_at = send_at;
  //   this.status = status;
  //   this.has_reward = has_reward;
  // }
}

// export interface MailItem {
//   rx_mail_id: number
//   title: string
//   send_at: string
//   status: number
//   has_reward: number
// }
