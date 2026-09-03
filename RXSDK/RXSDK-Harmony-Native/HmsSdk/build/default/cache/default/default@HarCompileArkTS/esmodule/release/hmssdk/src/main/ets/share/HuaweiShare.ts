import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { ShareParams } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { IShareTarget } from "./ISharableTarget";
import type { Context } from "@ohos:abilityAccessCtrl";
import harmonyShare from "@hms:collaboration.harmonyShare";
import { ShareObject } from "@normalized:N&&&hmssdk/src/main/ets/share/ShareObject&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type { BusinessError } from "@ohos:base";
import type { Callback } from "@ohos:base";
export default class HuaweiShare implements IShareTarget {
    private sharableTarget: harmonyShare.SharableTarget;
    async doShare(u168: ShareParams, v168: Context): Promise<void> {
        if (this.sharableTarget) {
            return this.sharableTarget.share(await new ShareObject(u168).toSystemShareData());
        }
        else {
            let w168: BusinessError = {
                code: RXErrorCode.SHARE_KNOCK_NOT_ENABLE,
                name: "knockShareError",
                message: "The share can only be called after the onKnockShareEvent has been executed. Please ensure that onKnockShareEvent is called first. "
            };
            throw w168;
        }
    }
    public onKnockShare(s168: Callback<harmonyShare.SharableTarget>) {
        Logger.d("knockShare on " + s168);
        harmonyShare.on('knockShare', (t168: harmonyShare.SharableTarget) => {
            Logger.d("knockShare called");
            this.sharableTarget = t168;
            s168?.(t168);
        });
    }
    public offKnockShare() {
        Logger.d("knockShare off");
        this.sharableTarget = undefined;
        harmonyShare.off('knockShare');
    }
}
