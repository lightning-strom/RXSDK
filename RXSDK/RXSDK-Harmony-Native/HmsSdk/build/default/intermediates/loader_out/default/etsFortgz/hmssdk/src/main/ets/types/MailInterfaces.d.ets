// @keepTs
// @ts-nocheck
export declare enum MailStatus {
    Read = 1,
    Received = 2,
    Unread = 3
}
@ObservedV2
export declare class ObservedArray<T> extends Array<T> {
    constructor(h171?: T[]);
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
export declare class Mail {
    all_count: number;
    not_received_count: number;
    not_read_count: number;
    list: MailItem[];
}
@ObservedV2
export declare class MailItem {
    rx_mail_id: number;
    title: string;
    send_at: string;
    status: MailStatus;
    has_reward: number;
}
