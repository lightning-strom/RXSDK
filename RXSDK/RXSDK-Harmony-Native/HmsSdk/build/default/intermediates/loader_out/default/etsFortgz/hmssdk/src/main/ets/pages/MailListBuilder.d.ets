// @keepTs
// @ts-nocheck
import { Mail, MailItem } from '../types/MailInterfaces';
@Observed
export declare class MailListParams {
    _mailObj: Mail;
    onCloseClick?: (event?: ClickEvent) => void;
    onMailClick?: (mailItem: MailItem) => void;
    onReceiveClick?: () => void;
    set mailObj(p118: Mail);
    setOnReceiveClick(o118: () => void): this;
    setOnMailClick(n118: (mailItem: MailItem) => void): this;
    constructor(l118: Mail, m118?: (event?: ClickEvent) => void);
}
@Builder
export declare function mailListBuilder(d118: MailListParams): void;
