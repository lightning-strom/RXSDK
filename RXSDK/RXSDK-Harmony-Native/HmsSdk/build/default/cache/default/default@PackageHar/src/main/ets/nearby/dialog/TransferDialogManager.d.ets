// @keepTs
// @ts-nocheck
export declare class TransferDialogManager {
    private static instance;
    private contentNode;
    private transferParam;
    private uiContext;
    private options;
    private constructor();
    static getInstance(w52?: UIContext): TransferDialogManager | undefined;
    openDialog(): void;
    closeDialog(): void;
    /**
     * 动态更新 dialog 信息
     * @param text
     * @param isTransferred
     */
    updateDialogInfo(m52: string, n52: boolean, o52: number, p52: number): void;
    destroy(): void;
}
