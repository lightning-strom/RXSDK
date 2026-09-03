// @keepTs
// @ts-nocheck
import { IShare, RCallback, RXResult, ShareFuncParams, ShareParams } from '../types/Index';
import harmonyShare from "@hms.collaboration.harmonyShare";
import { Context } from "@ohos.abilityAccessCtrl";
import { Callback } from "@ohos.base";
import { IShareTarget } from './ISharableTarget';
import ShareImpl from './ShareImpl';
declare class ShareProvider extends ShareImpl implements IShare, IShareTarget {
    private readonly sharableTargets;
    private getShareTarget;
    share(l170: Context, m170: ShareFuncParams | ShareParams, n170?: RCallback): Promise<RXResult<object>>;
    shareCustom(f170: Context, g170: ShareParams, h170?: RCallback): Promise<RXResult<object>>;
    isSupportKnockShare(): boolean;
    doShare(b170: ShareParams, c170: Context): Promise<void>;
    onKnockShare(a170: Callback<harmonyShare.SharableTarget>): void;
    offKnockShare(): void;
}
declare const _default: ShareProvider;
export default _default;
