import { BillingClient } from '../types/BillingClient';
import { PayParams, RXCallback, RXError, RXErrorCode, RXResult } from '../types/Index'
import { Logger } from '../utils/Logger';
import Objects from '../utils/Objects';
import { RXUtil } from '../utils/RXUtil';
//ts-ignore
import _HmsPay from './HmsPay';


class BillingProvider {
  private static instance: BillingProvider;
  private providers: Map<string, BillingClient> = new Map();

  constructor() {
    if (!BillingProvider.instance) {
      BillingProvider.instance = this;
    }
    return BillingProvider.instance;
  }

  getProvider(name: string): BillingClient | undefined {
    Logger.d("provider types：" + Objects.stringify(this.providers))
    return this.providers.get(name);
  }

  register(client: BillingClient) {
    console.log("register type " + client.name())
    this.providers.set(client.name(), client);
  }

  queryPurchases(context, payType?: string) {
    try {
      payType ??= "harmony"
      let client: BillingClient = this.getProvider(payType ?? "harmony")
      if (!client) {
        let ret = RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "not support pay type " + payType)
        Logger.w("not support type " + payType)
        return ret
      } else {
        return client.queryPurchases(context)
      }
    } catch (e) {
      Logger.e(e)
      return e
    }
  }

  async pay(params: PayParams, callback?: RXCallback<RXResult>): Promise<RXResult> {
    try {
      let client: BillingClient = this.getProvider(params.pay_type)
      if (!client) {
        let ret = RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "not support pay type " + params.pay_type)
        Logger.w("not support type " + params.pay_type)
        callback?.(null, ret)
        return ret
      } else {
        Logger.d("invoke pay " + JSON.stringify(params))
        return client.pay(params)
      }
    } catch (e) {
      Logger.e(e)
      return e
    }
  }
}

const billingProvider = new BillingProvider();

export function RegisterPayment() {
  return function (target: new () => BillingClient) {
    const instance = new target();
    billingProvider.register(instance);
  };
}

export default billingProvider;