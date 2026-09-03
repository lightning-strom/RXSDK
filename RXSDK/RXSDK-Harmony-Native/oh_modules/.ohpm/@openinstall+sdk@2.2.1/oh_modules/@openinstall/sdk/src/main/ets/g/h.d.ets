// @keepTs
// @ts-nocheck
import common from '@ohos.app.ability.common';
import { OpCallback } from "../e";
export declare class b1 {
    private o6;
    private p6;
    private readonly r6;
    private s6;
    private t6;
    private readonly x6;
    constructor(context: common.ApplicationContext);
    u1(): Promise<void>;
    z1(delayTime: number): void;
    z6(): void;
    private a7;
    y6(duration: number): void;
    a2(callback: OpCallback<void>): void;
    b2(i7: string, j7: number, callback: OpCallback<void>, k7?: Map<string, string>): void;
    c7(d7: boolean, e7: boolean): Promise<number>;
    private upload;
    private f7;
}
