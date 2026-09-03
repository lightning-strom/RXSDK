// @keepTs
// @ts-nocheck
let NextID: number = 1;
export enum MailStatus {
    Read = 1,
    Received = 2,
    Unread = 3
}
@ObservedV2
export class ObservedArray<T> extends Array<T> {
    constructor(h171?: T[]) {
        if (h171 instanceof Array) {
            super(...h171);
        }
        else {
            super();
        }
    }
}
export interface MailDetail {
    rx_mail_id: number;
    title: string;
    content: string;
    sign: string;
    props: MailPropItem[];
    status: MailStatus;
}
export interface MailPropItem {
    name: string;
    describe: string;
    icon: string;
    tag: string;
    count: number;
    count_format: string;
    is_permanent: number;
    time_limit: number;
}
@ObservedV2
export class Mail {
    all_count: number = 0;
    not_received_count: number = 0;
    not_read_count: number = 0;
    @Trace
    list: MailItem[] = [];
}
@ObservedV2
export class MailItem {
    rx_mail_id: number = 0;
    title: string = '';
    send_at: string = '';
    @Trace
    status: MailStatus = 3;
    @Trace
    has_reward: number = 0;
}
