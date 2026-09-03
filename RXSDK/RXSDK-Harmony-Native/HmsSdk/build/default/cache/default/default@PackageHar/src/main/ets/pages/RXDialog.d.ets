// @keepTs
// @ts-nocheck
@CustomDialog
export declare struct RXDialog {
    @State
    okText: string;
    @State
    cancelText: string;
    @State
    title: string;
    private controller;
    cancel: () => void;
    open(): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(): void;
    build(): void;
}
