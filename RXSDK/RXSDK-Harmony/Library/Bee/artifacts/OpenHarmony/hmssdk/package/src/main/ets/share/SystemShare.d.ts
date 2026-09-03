import { ShareParams } from "../types/Index";
import { IShareTarget } from "./ISharableTarget";
import { Context } from "@ohos.abilityAccessCtrl";
export default class SystemShare implements IShareTarget {
    doShare(s170: ShareParams, t170: Context): Promise<void>;
}
