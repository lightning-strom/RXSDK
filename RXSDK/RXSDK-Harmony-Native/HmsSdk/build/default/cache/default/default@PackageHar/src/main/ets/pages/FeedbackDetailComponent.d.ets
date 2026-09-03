// @keepTs
// @ts-nocheck
import { FeedbackDetailBean } from '../api/Feedback';
@Entry
@Component
export declare struct FeedbackDetailComponent {
    @Prop
    content?: FeedbackDetailBean;
    @State
    title: ResourceStr;
    onCloseClick?: (event?: ClickEvent) => void;
    onReceiveClick?: (event?: ClickEvent) => void;
    @State
    previewUri: string;
    aboutToAppear(): void;
    close(x85: ClickEvent): void;
    @Builder
    addAttachments(z84: string[]): void;
    build(): void;
}
