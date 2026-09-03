// @keepTs
// @ts-nocheck
export declare class PreviewParams {
    list: string[];
    index: number;
    onCloseClick?: (event?: ClickEvent) => void;
    setIndex(t121: number): this;
    constructor(q121: string[], r121?: (event?: ClickEvent) => void, s121?: number);
}
@Builder
export declare function previewBuilder(i121: PreviewParams): void;
