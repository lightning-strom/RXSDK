// @keepTs
// @ts-nocheck
@Entry
@Component
export declare struct PreviewComponent {
    @State
    title: ResourceStr;
    @State
    backVisible: boolean;
    @State
    closeVisible: boolean;
    onCloseClick?: (event: ClickEvent) => void;
    onBack?: (event: ClickEvent) => void;
    list: string[];
    @State
    cursorIdx: number;
    @State
    clickClose: boolean;
    private swiperController;
    private data;
    aboutToAppear(): void;
    close(r122: ClickEvent): void;
    build(): void;
}
