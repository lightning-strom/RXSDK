import { ShareParams } from "../types/Index";
import { IShareTarget } from "./ISharableTarget";
import { Context } from "@ohos.abilityAccessCtrl";
import harmonyShare from "@hms.collaboration.harmonyShare";
import { Callback } from "@ohos.base";
export default class HuaweiShare implements IShareTarget {
    private sharableTarget;
    doShare(u168: ShareParams, v168: Context): Promise<void>;
    onKnockShare(s168: Callback<harmonyShare.SharableTarget>): void;
    offKnockShare(): void;
}
