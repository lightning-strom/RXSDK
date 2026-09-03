// @keepTs
// @ts-nocheck
/**
 * Login page component.
 */
@Component
export declare struct SuccessTipsComponent {
    @State
    title: ResourceStr;
    @State
    icon: ResourceStr;
    @State
    description: ResourceStr;
    @State
    closeVisible: boolean;
    onCloseClick?: (event?: ClickEvent) => void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(o134?: ClickEvent): void;
    build(): void;
    @Builder
    Body(): void;
}
