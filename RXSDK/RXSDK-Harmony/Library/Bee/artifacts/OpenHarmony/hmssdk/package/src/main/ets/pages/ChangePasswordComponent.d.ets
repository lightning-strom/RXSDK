// @keepTs
// @ts-nocheck
/**
 * Login page component.
 */
@Component
@CustomDialog
export declare struct ChangePasswordComponent {
    @State
    isFirstSet: boolean;
    @State
    title: ResourceStr;
    @State
    oldPassword?: string;
    @State
    newPassword: string;
    @State
    confirmPassword: string;
    onCommitClick?: (password: string, oldPassword?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    private controller;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(q74?: ClickEvent): void;
    build(): void;
    @Builder
    Body(): void;
    isButtonClickable(): boolean;
}
