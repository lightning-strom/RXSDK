// @keepTs
// @ts-nocheck
/**
 * Login page component.
 */
@Entry
@Component
export declare struct RegisterComponent {
    @State
    title: ResourceStr;
    @State
    userName: string;
    @State
    password: string;
    @State
    confirmPassword?: string;
    @State
    needConfirm: boolean;
    onCommitClick?: (userName: string, password?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(p131?: ClickEvent): void;
    build(): void;
    @Builder
    Body(): void;
    isButtonClickable(): boolean;
}
