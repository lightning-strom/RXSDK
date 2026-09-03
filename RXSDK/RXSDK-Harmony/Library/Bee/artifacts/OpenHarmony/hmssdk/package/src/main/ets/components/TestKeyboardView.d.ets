// @keepTs
// @ts-nocheck
import { EKeyboardType, IKeyAttribute } from './KeyboardDefine';
@Entry
@Component
export declare struct TestKeyboardView {
    @State
    inputValue: string;
    @State
    inputValue1: string;
    @State
    placeholder: string;
    @State
    curKeyboardType: EKeyboardType;
    @State
    items: IKeyAttribute[];
    private controller;
    private controller1;
    onKeyboardEvent(c34: IKeyAttribute): void;
    /**
     * 自定义键盘组件Builder
     */
    @Builder
    customKeyboardBuilder(): void;
    @Builder
    customKeyboardBuilder1(): void;
    build(): void;
}
