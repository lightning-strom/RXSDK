// @keepTs
// @ts-nocheck
@Entry
@Component
export declare struct FeedbackComponent {
    @State
    resList: string[];
    @State
    title: ResourceStr;
    @State
    scrollState: number;
    @State
    propIndex: number;
    @State
    textLength: number;
    @State
    maxLength: number;
    @State
    inputContent: string;
    @State
    phone: string;
    onCloseClick?: (event?: ClickEvent) => void;
    onCommitClick?: (content: string, resList: string[], phone: string) => void;
    onAddFileClick?: (event?: ClickEvent) => void;
    aboutToAppear(): void;
    close(r80: ClickEvent): void;
    build(): void;
    private getResList;
    @Builder
    addFile(): void;
}
