// @keepTs
// @ts-nocheck
import common from "@ohos.app.ability.common";
import Want from "@ohos.app.ability.Want";
import { Singleton } from "../types/Types";
export declare class OpenInstall extends Singleton<OpenInstall> {
    private plugin?;
    constructor();
    name(): string;
    getVersion(): string | undefined;
    getOpid(): string | undefined;
    preInit(y151: common.UIAbilityContext | common.AbilityStageContext): void;
    init(w151: common.UIAbilityContext | common.AbilityStageContext, x151?: ESObject): void;
    getInstall(u151?: number): Promise<ESObject>;
    getWakeUp(s151?: Want): Promise<ESObject>;
}
