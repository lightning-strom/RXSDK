// @keepTs
// @ts-nocheck
export declare class TipsParams {
    title: ResourceStr;
    confirmText: ResourceStr;
    content: ResourceStr;
    cancelText: ResourceStr;
    cancelVisible: boolean;
    onConfirm?: (event?: ClickEvent) => void;
    onCancel?: (event?: ClickEvent) => void;
    constructor(q135?: (event?: ClickEvent) => void, r135?: (event?: ClickEvent) => void);
}
@Builder
export declare function tipsBuilder(i135: TipsParams): void;
