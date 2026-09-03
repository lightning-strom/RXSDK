// @keepTs
// @ts-nocheck
import { RXErrorCode, SharePlatforms } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { IShare, RCallback, RXResult, ShareFuncParams, ShareParams, SharePlatform } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type harmonyShare from "@hms:collaboration.harmonyShare";
import type { Context } from "@ohos:abilityAccessCtrl";
import type { Callback } from "@ohos:base";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import type { ShareData } from './ShareData';
import type { IShareTarget } from './ISharableTarget';
import HuaweiShare from "@normalized:N&&&hmssdk/src/main/ets/share/HuaweiShare&4.0.0";
import SystemShare from "@normalized:N&&&hmssdk/src/main/ets/share/SystemShare&4.0.0";
import WXShare from "@normalized:N&&&hmssdk/src/main/ets/wx/WXShare&4.0.0";
import ShareImpl from "@normalized:N&&&hmssdk/src/main/ets/share/ShareImpl&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
class ShareProvider extends ShareImpl implements IShare, IShareTarget {
    private readonly sharableTargets: Record<SharePlatform, IShareTarget> = {
        [SharePlatforms.WECHAT]: new WXShare(),
        [SharePlatforms.HW_KNOCK]: new HuaweiShare(),
        [SharePlatforms.SYSTEM]: new SystemShare(),
    };
    private getShareTarget(r170: SharePlatform) {
        return this.sharableTargets[r170];
    }
    async share(l170: Context, m170: ShareFuncParams | ShareParams, n170?: RCallback): Promise<RXResult<object>> {
        let o170: RXResult<ShareData>;
        try {
            if (this.isShareFuncParams(m170)) {
                o170 = await this.getShareData(m170);
                if (o170.code == RXErrorCode.OK) {
                    let q170 = await this.doShare(Objects.assign(o170.data?.content, m170), l170);
                    o170 = RXUtil.getRXResult() as RXResult<ShareData>;
                    n170?.(o170);
                    return o170;
                }
                else {
                    Logger.e("data   error " + o170.code);
                    o170 = RXUtil.getRXResult(RXErrorCode.SHARE_PARAMS_ERROR) as RXResult<ShareData>;
                    n170?.(o170);
                    return o170;
                }
            }
            else {
                return this.shareCustom(l170, m170, n170);
            }
        }
        catch (p170) {
            Logger.e(p170);
            o170 = RXUtil.formatResult(p170);
            n170?.(o170);
            return o170;
        }
    }
    async shareCustom(f170: Context, g170: ShareParams, h170?: RCallback): Promise<RXResult<object>> {
        let i170: RXResult<object>;
        try {
            let k170 = await this.doShare(g170, f170);
            i170 = RXUtil.getRXResult();
            h170?.(i170);
            return i170;
        }
        catch (j170) {
            i170 = RXUtil.formatResult(j170);
            h170?.(i170);
            return i170;
        }
    }
    isSupportKnockShare() {
        return canIUse('SystemCapability.Collaboration.HarmonyShare');
    }
    doShare(b170: ShareParams, c170: Context): Promise<void> {
        let d170 = this.getShareTarget(b170.platform);
        if (d170) {
            Logger.d("doShare:" + JSON.stringify(b170));
            return d170?.doShare(b170, c170);
        }
        else {
            let e170 = RXUtil.getError(RXErrorCode.SHARE_PARAMS_ERROR, "not support platform " + b170.platform);
            throw e170;
        }
    }
    public onKnockShare(a170: Callback<harmonyShare.SharableTarget>) {
        (this.getShareTarget(SharePlatforms.HW_KNOCK) as HuaweiShare)?.onKnockShare(a170);
    }
    public offKnockShare() {
        (this.getShareTarget(SharePlatforms.HW_KNOCK) as HuaweiShare)?.offKnockShare();
    }
}
export default new ShareProvider();
