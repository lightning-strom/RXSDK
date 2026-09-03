// @keepTs
// @ts-nocheck
import common from '@ohos.app.ability.common';
import Want from '@ohos.app.ability.Want';
import { OpCallback, OpData, OpInitConfig } from "./e";
import pasteboard from "@ohos.pasteboard";
declare class OpenInstall {
    private d9;
    private e9;
    constructor();
    getVersion(): string;
    getOpid(): string;
    setDebugMode(j12: boolean): void;
    preInit(context: common.UIAbilityContext | common.AbilityStageContext): void;
    init(context: common.UIAbilityContext | common.AbilityStageContext): void;
    init(context: common.UIAbilityContext | common.AbilityStageContext, inputKey: string): void;
    init(context: common.UIAbilityContext | common.AbilityStageContext, g12: OpInitConfig): void;
    init(context: common.UIAbilityContext | common.AbilityStageContext, inputKey: string, g12: OpInitConfig): void;
    getInstall(): Promise<OpData>;
    getInstall(z11: number): Promise<OpData>;
    getInstall(callback: OpCallback<OpData>): void;
    getInstall(z11: number, callback: OpCallback<OpData>): void;
    getWakeUp(want: Want): Promise<OpData>;
    getWakeUp(want: Want, callback: OpCallback<OpData>): void;
    reportRegister(): Promise<void>;
    reportEffectPoint(u11: string, v11: number, w11?: Map<string, string>): Promise<void>;
    reportShare(q11: string, r11: string): Promise<void>;
    reportShare(q11: string, r11: string, callback: OpCallback<void>): void;
    acceptWant(want: Want): boolean;
    acceptPasteData(j11: pasteboard.PasteData): boolean;
    private g9;
}
declare const l15: OpenInstall;
export default l15;
