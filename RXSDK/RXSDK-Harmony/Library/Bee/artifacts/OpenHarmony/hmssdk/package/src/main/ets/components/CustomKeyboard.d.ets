// @keepTs
// @ts-nocheck
import { EKeyboardType, IKeyAttribute } from './KeyboardDefine';
@Component
export declare struct CustomKeyboard {
    @Prop
    items: IKeyAttribute[];
    @Prop
    curKeyboardType: EKeyboardType;
    @Link
    inputValue: string;
    @State
    placeholder: string;
    controller: TextInputController;
    onKeyboardEvent: Function | null;
    private rowSpace;
    private rowCount;
    private columnSpace;
    private itemHeight;
    private bgColor;
    @StorageLink('bottomHeight')
    bottomHeight: number;
    @State
    inputShow: boolean;
    aboutToAppear(): void;
    @Builder
    myGridItem(k29: IKeyAttribute): void;
    @Builder
    titleBar(): void;
    build(): void;
    private onKeyClickEvent;
}
