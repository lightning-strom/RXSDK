// @keepTs
// @ts-nocheck
import { Account } from '../types/Index';
@Entry
@Component
export declare struct LoginQuickComponent {
    @State
    isLoading: boolean;
    @StorageProp("rx_logo")
    title: ResourceStr;
    @State
    account: Account;
    @State
    marginBottom: number;
    onCloseClick?: (event?: ClickEvent) => void;
    onMoreMethodClick?: (tag: number) => void;
    onStartClick?: (account: Account) => void;
    aboutToAppear(): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(d111: ClickEvent): void;
    clickMoreLogin(): void;
    clickLogin(): void;
    build(): void;
    @Builder
    Loading(): void;
    @Builder
    Body(): void;
    private getIcon;
}
