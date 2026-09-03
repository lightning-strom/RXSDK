// @keepTs
// @ts-nocheck
import { MailDetail } from '../types/MailInterfaces';
export declare class MailDetailParams {
    mailContent: MailDetail;
    onCloseClick?: (event?: ClickEvent) => void;
    _onMailClick?: ((isDelete: boolean) => void) | undefined;
    setOnMailClick(x112: ((isDelete: boolean) => void) | undefined): this;
    constructor(v112: MailDetail, w112?: (event?: ClickEvent) => void);
}
@Builder
export declare function mailDetailBuilder(n112: MailDetailParams): void;
