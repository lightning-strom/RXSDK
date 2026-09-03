// @keepTs
// @ts-nocheck
import UIAbility from "@ohos.app.ability.UIAbility";
import window from "@ohos.window";
export default class j6 {
    onAbilityCreate(ability: UIAbility): void;
    onWindowStageCreate(ability: UIAbility, windowStage: window.WindowStage): void;
    onWindowStageActive(ability: UIAbility, windowStage: window.WindowStage): void;
    onWindowStageInactive(ability: UIAbility, windowStage: window.WindowStage): void;
    onWindowStageDestroy(ability: UIAbility, windowStage: window.WindowStage): void;
    onAbilityDestroy(ability: UIAbility): void;
    onAbilityForeground(ability: UIAbility): void;
    onAbilityBackground(ability: UIAbility): void;
    onAbilityContinue(ability: UIAbility): void;
}
