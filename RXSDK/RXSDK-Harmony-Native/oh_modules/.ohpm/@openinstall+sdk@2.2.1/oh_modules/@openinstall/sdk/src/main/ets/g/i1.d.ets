// @keepTs
// @ts-nocheck
import j6 from "../g1";
import UIAbility from "@ohos.app.ability.UIAbility";
import window from "@ohos.window";
export declare class q6 extends j6 {
    private g6;
    private isStopped;
    private h6;
    private onAppStart;
    private i6;
    constructor(onAppStart: Nullable<Function>, t6: Nullable<Function>);
    onWindowStageActive(ability: UIAbility, windowStage: window.WindowStage): void;
    onWindowStageInactive(ability: UIAbility, windowStage: window.WindowStage): void;
}
