import { RCallback, RXResult, SchedulingReportParams, ShareFuncParams, ShareParams, ShortLinkParams } from '../types/Index';
import { ShareData } from './ShareData';
export default class ShareImpl {
    protected shareData?: ShareData;
    protected handleShareData(k169: ShareData, l169: ShareFuncParams): ShareData;
    isShareFuncParams(j169: ShareParams | ShareFuncParams): j169 is ShareFuncParams;
    protected getDefaultParams(): Record<string, ESObject>;
    getShareData(d169: ShareFuncParams, e169?: RCallback<ShareData>): Promise<RXResult<ShareData>>;
    shareSchedulingReport(z168: SchedulingReportParams, a169?: RCallback): Promise<RXResult<object>>;
    getShortUrl(x168: ShortLinkParams, y168?: RCallback): Promise<RXResult<object>>;
}
