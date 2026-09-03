// @keepTs
// @ts-nocheck
import { Account } from '../types/Index';
@Entry
@Component
export declare struct LoginAccountListComponent {
    @State
    title: ResourceStr;
    @Prop
    list: Account[];
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: Account, index: number) => void;
    onDelClick?: (item: Account, index: number) => void;
    aboutToAppear(): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(d95?: ClickEvent): void;
    build(): void;
    private getIcon;
}
