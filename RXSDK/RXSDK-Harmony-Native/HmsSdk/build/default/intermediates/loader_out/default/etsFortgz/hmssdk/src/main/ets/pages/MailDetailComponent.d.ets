// @keepTs
// @ts-nocheck
import { MailDetail } from '../types/MailInterfaces';
export interface WebFuncs {
    onImageClick: (urls: string[], index: number) => void;
}
@Component
export declare struct MailDetailComponent {
    @State
    mailContent: MailDetail;
    @State
    title: ResourceStr;
    onCloseClick?: (event?: ClickEvent) => void;
    onMailClick?: (isDelete: boolean) => void;
    private controller;
    @State
    scrollState: number;
    @State
    propIndex: number;
    @State
    webFunc: WebFuncs;
    aboutToAppear(): void;
    close(b117: ClickEvent): void;
    build(): void;
    @Builder
    Webview(): void;
    @Builder
    showDetail(): void;
}
