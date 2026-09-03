import { RXRequest, RequestMethod } from '../net/RXRequest';
import { PromoCode, RCallback } from '../types/Index';
import { Singleton } from '../types/Types';
import { Logger } from '../utils/Logger';
import { LoginDecorator } from './LoginDecorator';


const PROMO_GET_API = "v1/operationtoolsapi/exchange/game_display";

const PROMO_EXCHANGE = "v1/operationtoolsapi/exchange/exchange";
const INVALID_TIMER_ID: number = -1

// "refresh_period": 1,
// "promo_name": "福利码策略",
// "gift_name": "礼包名",
// "promo_valid_start": "2024-01-01 01:01:01",
// "promo_valid_end": "2024-01-02 01:01:01",
// "promo_code": "123456",
// "refresh_period_exp": 1000,
// "polling": 10


export default class CDKeyProvider extends Singleton<CDKeyProvider>{
  private cpUserId: string
  private autoRefresh: boolean
  private refreshInterval: number = 10;
  private timerID: number = INVALID_TIMER_ID
  private callback?: RCallback<PromoCode>
  private _lastPromoCode: PromoCode;



  public set promoCode(value: PromoCode) {
    this._lastPromoCode = value;
  }

  public get promoCode(): PromoCode {
    return this._lastPromoCode;
  }

  init(cpUserId: string, isAnchor: boolean) {
    if (isAnchor) {
      this.cpUserId = cpUserId;
    } else {
      this.reset()
    }
  }

  private reset() {
    this.callback = null
    this.autoRefresh = false
    this._lastPromoCode = null
    this.refreshInterval = 10
    this.stopTimer()
  }

  startTimer(interval: number) {
    this.stopTimer()
    this.timerID = setTimeout(() => {
      this.timerID = INVALID_TIMER_ID
      this.request(this.callback)
    }, interval * 1000)
    // Logger.debug("start timer " + this.timerID)
  }

  stopTimer() {
    if (this.timerID !== INVALID_TIMER_ID) {
      clearTimeout(this.timerID)
      this.timerID = INVALID_TIMER_ID;
    }
  }

  @LoginDecorator
  async request(callback?: RCallback< PromoCode>) {
    try {
      let params: Record<string, any> = {
        game_id: this.cpUserId
      }
      let ret = await RXRequest.request< PromoCode>({
        method: RequestMethod.GET,
        path: PROMO_GET_API,
        data: params
      })

      if (ret.code == 0) {
        if (this.autoRefresh) {
          if (ret.data?.polling > 0) {
            this.refreshInterval = ret.data?.polling
          }
          this.startTimer(ret.data?.refresh_period_exp < 1 ? this.refreshInterval : ret.data?.refresh_period_exp)
        }
        if (ret.data) {
          if (this._lastPromoCode != ret.data && this._lastPromoCode?.promo_code != ret.data?.promo_code) {
            callback?.(ret)
          }
          this.promoCode = ret.data
        }
      } else {
        callback?.(ret)
      }
      return ret
    } catch (e) {
      if (this.autoRefresh && this.timerID === INVALID_TIMER_ID) {
        this.startTimer(this.refreshInterval)
      }
      return e
    }
  }

  // 获取达人游戏内显示福利码
  getPromoDisplayKEY(callback: RCallback<PromoCode>, autoRefresh?: boolean) {
    this.autoRefresh = autoRefresh
    if (this.autoRefresh) {
      this.callback = callback;
    }
    this.request(callback)
  }

  @LoginDecorator
  async exchangePromoCDKEY(cdKey: string, callback: RCallback<string>) {

    let params: Record<string, any> = {
      cdkey: cdKey
    }
    let ret = RXRequest.post(
      PROMO_EXCHANGE,
      params, null, callback
    )
    return ret
  }
}
