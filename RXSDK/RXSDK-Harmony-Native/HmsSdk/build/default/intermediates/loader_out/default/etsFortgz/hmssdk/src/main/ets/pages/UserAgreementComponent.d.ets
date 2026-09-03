// @keepTs
// @ts-nocheck
@Component
export declare struct UserAgreementComponent {
    @State
    title: ResourceStr;
    @State
    confirmText: ResourceStr;
    @State
    cancelText: ResourceStr;
    contentFontSize: number;
    onConfirm?: (event: ClickEvent) => void;
    onCancel?: (event: ClickEvent) => void;
    onLinkClick?: (index: number) => void;
    agreement: string;
    @State
    content: string;
    aboutToAppear(): void;
    showPrivacyDetailDialog(u142: string, v142: string): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(t142: ClickEvent): void;
    confirm(s142: ClickEvent): void;
    build(): void;
}
