// @keepTs
// @ts-nocheck
@Component
@CustomDialog
export declare struct TipsComponent {
    @State
    title: ResourceStr;
    @State
    confirmText: ResourceStr;
    @State
    content: ResourceStr;
    @State
    linkContent: string[];
    @State
    cancelText: ResourceStr;
    @State
    cancelVisible: boolean;
    @State
    isPrivacyAgreed: boolean;
    contentFontSize: number;
    onConfirm?: (event: ClickEvent) => void;
    onCancel?: (event: ClickEvent) => void;
    onLinkClick?: (index: number) => void;
    private controller;
    aboutToAppear(): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(l137: ClickEvent): void;
    confirm(k137: ClickEvent): void;
    build(): void;
}
