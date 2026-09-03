import type { ShareParams } from "../types/Index";
import type { IShareTarget } from "./ISharableTarget";
import type common from "@ohos:app.ability.common";
import type { Context } from "@ohos:abilityAccessCtrl";
import systemShare from "@hms:collaboration.systemShare";
import { ShareObject } from "@normalized:N&&&hmssdk/src/main/ets/share/ShareObject&4.0.0";
export default class SystemShare implements IShareTarget {
    async doShare(s170: ShareParams, t170: Context): Promise<void> {
        let u170 = await new ShareObject(s170).toSystemShareData();
        let v170: systemShare.ShareController = new systemShare.ShareController(u170);
        let w170: systemShare.ShareControllerOptions = {
            previewMode: systemShare.SharePreviewMode.DETAIL,
            selectionMode: systemShare.SelectionMode.SINGLE
        };
        return v170.show(t170 as common.UIAbilityContext, {
            selectionMode: systemShare.SelectionMode.SINGLE,
            previewMode: systemShare.SharePreviewMode.DEFAULT,
        });
    }
}
