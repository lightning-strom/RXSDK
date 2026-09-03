// @keepTs
// @ts-nocheck
import { FeedbackItemBean } from '../types/Index';
@Entry
@Component
export declare struct FeedbackListComponent {
    @State
    resList: FeedbackItemBean[];
    @State
    title: ResourceStr;
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: FeedbackItemBean) => void;
    currentPage: number;
    pageSize: number;
    aboutToAppear(): Promise<void>;
    getFeedbackList(l89: number): Promise<void>;
    close(k89: ClickEvent): void;
    build(): void;
}
