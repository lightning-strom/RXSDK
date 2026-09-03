// @keepTs
// @ts-nocheck
/**
 * 键盘类型枚举
 */
export declare enum EKeyboardType {
    NUMERIC = 0,
    UPPERCASE = 1,
    LOWERCASE = 2,
    SPECIAL = 3,
    IDCARD = 4
}
/**
 * 键盘按键类型枚举
 */
export declare enum EKeyType {
    INPUT = 0,
    DELETE = 1,
    NUMERIC = 2,
    CAPSLOCK = 3,
    SPECIAL = 4,
    COMPLETE = 5,
    CANCEL = 6
}
/**
 * 键盘按键数据接口
 */
export interface IKeyAttribute {
    label: string | Resource;
    value?: string;
    type?: EKeyType;
    fontSize?: number;
    fontColor?: string | Color;
    backgroundColor?: string | Color;
    position?: [
        number,
        number,
        number,
        number
    ];
}
/**
 *  身份证键盘数据
 */
export declare const idCardKeyData: IKeyAttribute[];
/**
 * 数字键盘数据，真实业务场景网络请求下发的数据
 */
export declare const numericKeyData: IKeyAttribute[];
/**
 * 小写字母键盘数据，真实业务场景网络请求下发的数据
 */
export declare const lowerCaseKeyData: IKeyAttribute[];
/**
 * 大写字母键盘数据，真实业务场景网络请求下发的数据
 */
export declare const upperCaseKeyData: IKeyAttribute[];
/**
 * 特殊字符键盘数据，真实业务场景网络请求下发的数据
 */
export declare const specialKeyData: IKeyAttribute[];
