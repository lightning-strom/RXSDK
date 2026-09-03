// @keepTs
// @ts-nocheck
import { Mail, MailItem } from '../types/MailInterfaces';
@ComponentV2
export declare struct MailListComponent {
    @Param
    readonly mailObj: Mail;
    @Param
    readonly title: ResourceStr;
    @Local
    selectIndex: number;
    @Event
    onCloseClick?: (event?: ClickEvent) => void;
    @Event
    onMailClick?: (mailItem: MailItem) => void;
    @Event
    onReceiveClick?: () => void;
    aboutToAppear(): void;
    close(n120: ClickEvent): void;
    build(): void;
}
