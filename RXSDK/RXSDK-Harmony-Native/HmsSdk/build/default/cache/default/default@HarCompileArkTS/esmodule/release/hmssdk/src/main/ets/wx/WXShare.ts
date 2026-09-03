// @keepTs
// @ts-nocheck
import { RXError, RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { ShareParams } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { IShareTarget } from "../share/ISharableTarget";
import type common from "@ohos:app.ability.common";
import type { Context } from "@ohos:abilityAccessCtrl";
import { ShareObject } from "@normalized:N&&&hmssdk/src/main/ets/share/ShareObject&4.0.0";
import { WXApi } from "@normalized:N&&&hmssdk/src/main/ets/wx/WXApi&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
export default class WXShare implements IShareTarget {
    async doShare(o205: ShareParams, p205?: Context): Promise<void> {
        try {
            const r205 = await WXApi.getInstance(o205.wx_appid).share(new ShareObject(o205), p205 as common.UIAbilityContext);
            if (r205.errCode === 0) {
                console.log("Share successful");
            }
            else {
                Logger.e(`Share failed with error code: ${r205.errCode}`);
                throw new RXError(`Share failed with error code: ${r205.errCode}`, RXErrorCode.SHARE_PARAMS_ERROR, r205.errCode, r205.errStr);
            }
        }
        catch (q205) {
            if (q205 instanceof Error) {
                throw q205;
            }
            else {
                throw new RXError(`wx share error code: ${q205}`, RXErrorCode.SHARE_PARAMS_ERROR);
            }
        }
    }
}
