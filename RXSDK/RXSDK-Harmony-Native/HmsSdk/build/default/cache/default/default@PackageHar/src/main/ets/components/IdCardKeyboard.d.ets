// @keepTs
// @ts-nocheck
import { EKeyboardType, IKeyAttribute } from './KeyboardDefine';
import display from "@ohos.display";
export interface ColorConfig {
    bgColor: ResourceColor;
    hdColor: ResourceColor;
    pressColor: ResourceColor;
    fontColor?: string | Color;
    disableColor?: string | Color;
}
export declare const rxCardKeyCfg: ColorConfig;
@Component
export declare struct IdCardKeyboard {
    @State
    items: IKeyAttribute[];
    @State
    curKeyboardType: EKeyboardType;
    @State
    inputValue: string;
    @State
    placeholder: string;
    controller: TextInputController;
    onKeyboardEvent: Function | null;
    private rowSpace;
    private columnSpace;
    private rowCount;
    @State
    itemHeight: number;
    @State
    theme: ColorConfig;
    @State
    bottomHeight: number;
    @State
    inputShow: boolean;
    maxWidth: number;
    @State
    orientation: display.Orientation;
    aboutToAppear(): void;
    @Builder
    myGridItem(a32: IKeyAttribute): void;
    @Builder
    titleBar(): void;
    pressedStyles(): void;
    build(): void;
    private onKeyClickEvent;
}
