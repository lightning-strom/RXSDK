import { ShareParams } from "../types/Index";
import { Context } from "@ohos.abilityAccessCtrl";
export interface IShareTarget {
    doShare(params: ShareParams, context?: Context): Promise<void>;
}
