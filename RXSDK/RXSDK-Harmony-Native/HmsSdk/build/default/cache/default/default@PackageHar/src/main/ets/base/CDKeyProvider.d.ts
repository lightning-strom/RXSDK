import { PromoCode, RCallback } from '../types/Index';
import { Singleton } from '../types/Types';
export default class CDKeyProvider extends Singleton<CDKeyProvider> {
    private cpUserId;
    private autoRefresh;
    private refreshInterval;
    private timerID;
    private callback?;
    private _lastPromoCode;
    set promoCode(j12: PromoCode);
    get promoCode(): PromoCode;
    init(h12: string, i12: boolean): void;
    private reset;
    startTimer(g12: number): void;
    stopTimer(): void;
    request(c12?: RCallback<PromoCode>): Promise<any>;
    getPromoDisplayKEY(a12: RCallback<PromoCode>, b12?: boolean): void;
    exchangePromoCDKEY(w11: string, x11: RCallback<string>): Promise<import("../types/Index").RXResult<string>>;
}
