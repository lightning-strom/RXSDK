import type { ShareParams } from "../types/Index";
import type { Context } from "@ohos:abilityAccessCtrl";
export interface IShareTarget {
    doShare(params: ShareParams, context?: Context): Promise<void>;
}
