import { LoginDecorator } from "../base/LoginDecorator"
import Passport from "../base/Passport"
import ApiPath from "../constants/ApiPath"
import { RXRequest, RequestMethod } from "../net/RXRequest"
import { OrderData, PayParams, RXCallback, RXError, RXErrorCode, RXResult } from "./Index"

export abstract class BillingClient {
  protected _callbackFrom?: number

  public static init(_params?: string) {
  }

  @LoginDecorator
  async getOrder(params: PayParams): Promise<RXResult<OrderData>> {
    if (!params) {
      throw new RXError("params is null error", RXErrorCode.PAY_PARAMS_ERROR)
    }
    params.currency ??= "CNY"
    params.openid ??= Passport.openid
    params.age ??= Passport.loginData?.age
    this._callbackFrom = params.callback_from
    return RXRequest.request({
      path: ApiPath.ORDER,
      data: params,
      method: RequestMethod.POST,
    });
  }


  notifyResult(notifyUrl: string, data: Record<string, any>): Promise<RXResult> {
    if (!notifyUrl) {
      throw new RXError("notifyUrl is null error", RXErrorCode.PAY_PARAMS_ERROR)
    }
    let ret = RXRequest.request<RXResult>({
      path: notifyUrl,
      data: data,
      method: RequestMethod.POST,
    });
    return ret;
  }

  async pay(params: PayParams): Promise<RXResult> {
    let orderRet = await this.getOrder(this.handleParams(params))
    if (orderRet.code == 0) {
      return this.onOrderResponse(orderRet.data)
    } else {
      return orderRet
    }
  }

  handleParams(params: PayParams): PayParams {
    return params
  }

  queryPurchases(context) {
  }

  abstract name(): string

  abstract onOrderResponse(params: OrderData): Promise<RXResult>
}

