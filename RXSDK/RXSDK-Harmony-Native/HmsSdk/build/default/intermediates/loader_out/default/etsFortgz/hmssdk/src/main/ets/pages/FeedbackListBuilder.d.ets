// @keepTs
// @ts-nocheck
import { FeedbackItemBean } from '../types/Index';
export declare class FeedbackListParams {
    page: number;
    size: number;
    resList?: FeedbackItemBean[];
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: FeedbackItemBean) => void;
    constructor(m87?: (event?: ClickEvent) => void);
}
@Builder
export declare function feedbackListBuilder(e87: FeedbackListParams): void;
