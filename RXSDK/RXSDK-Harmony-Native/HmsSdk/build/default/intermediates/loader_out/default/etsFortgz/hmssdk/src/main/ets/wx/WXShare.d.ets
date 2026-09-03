// @keepTs
// @ts-nocheck
import { ShareParams } from "../types/Index";
import { IShareTarget } from "../share/ISharableTarget";
import { Context } from "@ohos.abilityAccessCtrl";
export default class WXShare implements IShareTarget {
    doShare(o205: ShareParams, p205?: Context): Promise<void>;
}
