// @keepTs
// @ts-nocheck
import { EKeyboardType, IKeyAttribute } from '../components/KeyboardDefine';
import { Obj, Reward } from '../types/Index';
/**
 * Login page component.
 */
@Component
@CustomDialog
export declare struct RealNameComponent {
    @State
    title: ResourceStr;
    @State
    description: ResourceStr;
    @State
    realName: string;
    @State
    idCard: string;
    @State
    isFastAuth: boolean;
    @State
    closeVisible: boolean;
    @State
    useAlipayAuth: boolean;
    @State
    showManualForm: boolean;
    onCommitClick?: (realName: string, idCard: string, isFastAuth: boolean) => void;
    onAlipayAuthClick?: () => void;
    onCloseClick?: (event?: ClickEvent) => void;
    private controller;
    @State
    curKeyboardType: EKeyboardType;
    @State
    items: IKeyAttribute[];
    inputController: TextInputController;
    @State
    props?: Reward[];
    aboutToAppear(): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(z127?: ClickEvent): void;
    onAction(x127: string, y127?: Obj): void;
    build(): void;
    @Builder
    idCardboardBuilder(): void;
    @Builder
    Body(): void;
    @Builder
    AlipayAuthBody(): void;
    @Builder
    ManualAuthBody(): void;
}
