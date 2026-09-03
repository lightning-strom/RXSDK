import { RXRequest, RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { PromoCode, RCallback } from '../types/Index';
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import { LoginDecorator } from "@normalized:N&&&hmssdk/src/main/ets/base/LoginDecorator&4.0.0";
const PROMO_GET_API = "v1/operationtoolsapi/exchange/game_display";
const PROMO_EXCHANGE = "v1/operationtoolsapi/exchange/exchange";
const INVALID_TIMER_ID: number = -1;
export default class CDKeyProvider extends Singleton<CDKeyProvider> {
    private cpUserId: string;
    private autoRefresh: boolean;
    private refreshInterval: number = 10;
    private timerID: number = INVALID_TIMER_ID;
    private callback?: RCallback<PromoCode>;
    private _lastPromoCode: PromoCode;
    public set promoCode(j12: PromoCode) {
        this._lastPromoCode = j12;
    }
    public get promoCode(): PromoCode {
        return this._lastPromoCode;
    }
    init(h12: string, i12: boolean) {
        if (i12) {
            this.cpUserId = h12;
        }
        else {
            this.reset();
        }
    }
    private reset() {
        this.callback = null;
        this.autoRefresh = false;
        this._lastPromoCode = null;
        this.refreshInterval = 10;
        this.stopTimer();
    }
    startTimer(g12: number) {
        this.stopTimer();
        this.timerID = setTimeout(() => {
            this.timerID = INVALID_TIMER_ID;
            this.request(this.callback);
        }, g12 * 1000);
    }
    stopTimer() {
        if (this.timerID !== INVALID_TIMER_ID) {
            clearTimeout(this.timerID);
            this.timerID = INVALID_TIMER_ID;
        }
    }
    @LoginDecorator
    async request(c12?: RCallback<PromoCode>) {
        try {
            let e12: Record<string, any> = {
                game_id: this.cpUserId
            };
            let f12 = await RXRequest.request<PromoCode>({
                method: RequestMethod.GET,
                path: PROMO_GET_API,
                data: e12
            });
            if (f12.code == 0) {
                if (this.autoRefresh) {
                    if (f12.data?.polling > 0) {
                        this.refreshInterval = f12.data?.polling;
                    }
                    this.startTimer(f12.data?.refresh_period_exp < 1 ? this.refreshInterval : f12.data?.refresh_period_exp);
                }
                if (f12.data) {
                    if (this._lastPromoCode != f12.data && this._lastPromoCode?.promo_code != f12.data?.promo_code) {
                        c12?.(f12);
                    }
                    this.promoCode = f12.data;
                }
            }
            else {
                c12?.(f12);
            }
            return f12;
        }
        catch (d12) {
            if (this.autoRefresh && this.timerID === INVALID_TIMER_ID) {
                this.startTimer(this.refreshInterval);
            }
            return d12;
        }
    }
    getPromoDisplayKEY(a12: RCallback<PromoCode>, b12?: boolean) {
        this.autoRefresh = b12;
        if (this.autoRefresh) {
            this.callback = a12;
        }
        this.request(a12);
    }
    @LoginDecorator
    async exchangePromoCDKEY(w11: string, x11: RCallback<string>) {
        let y11: Record<string, any> = {
            cdkey: w11
        };
        let z11 = RXRequest.post(PROMO_EXCHANGE, y11, null, x11);
        return z11;
    }
}
