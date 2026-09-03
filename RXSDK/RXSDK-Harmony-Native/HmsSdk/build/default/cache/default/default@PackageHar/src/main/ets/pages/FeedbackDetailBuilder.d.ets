// @keepTs
// @ts-nocheck
import { FeedbackDetailBean } from '../api/Feedback';
export declare class FeedbackDetailParams {
    content?: FeedbackDetailBean;
    onCloseClick?: (event?: ClickEvent) => void;
    onReceiveClick?: (event?: ClickEvent) => void;
    setContent(s81: FeedbackDetailBean): this;
    constructor(r81?: (event?: ClickEvent) => void);
}
@Builder
export declare function feedbackDetailBuilder(j81: FeedbackDetailParams): void;
