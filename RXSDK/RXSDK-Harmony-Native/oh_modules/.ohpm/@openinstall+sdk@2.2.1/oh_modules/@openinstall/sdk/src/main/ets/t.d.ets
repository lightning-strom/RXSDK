// @keepTs
// @ts-nocheck
import common from '@ohos.app.ability.common';
import { OpCallback, OpData, OpInitConfig } from "./e";
export declare class l1 {
    private m1;
    private constructor();
    private static n1;
    static getInstance(): l1;
    o1(): string;
    preInit(context: common.ApplicationContext): void;
    init(context: common.ApplicationContext, b2: string, c2: OpInitConfig): void;
    getInstall(callback: OpCallback<OpData>, timeout: number): void;
    getWakeUp(data: Nullable<string>, callback: OpCallback<OpData>): void;
    reportRegister(): Promise<void>;
    reportEffectPoint(p1: string, q1: number, s1?: Map<string, string>): Promise<void>;
    reportShare(m1: string, n1: string, callback: OpCallback<void>): void;
}
