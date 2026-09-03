// @keepTs
// @ts-nocheck
export declare class FeedbackParams {
    resList?: string[];
    onCloseClick?: (event?: ClickEvent) => void;
    onCommitClick?: (content: string, resList: string[], phone: string) => void;
    onAddFileClick?: (event?: ClickEvent) => void;
    setOnCommitClick(a77: (content: string, resList: string[], phone: string) => void): this;
    constructor(z76?: (event?: ClickEvent) => void);
}
@Builder
export declare function feedbackBuilder(r76: FeedbackParams): void;
