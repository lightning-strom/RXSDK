import { OrderData, RXErrorCode, RXResult } from '../types/Index';
import { Logger } from '../utils/Logger';
import { iap } from '@kit.IAPKit';
import SDKConfig from '../sdk/SDKConfig';
import { common } from '@kit.AbilityKit';
import { JWTUtil } from '../utils/JWTUtil';

import { RegisterPayment } from './BillingProvider';
import { BillingClient } from '../types/BillingClient';
import { RXUtil } from '../utils/RXUtil';

export interface PurchaseData {
  type: number;
  jwsPurchaseOrder?: string;
  jwsSubscriptionStatus?: string;
  iap_version: string;
  restore: boolean;
  env: number;

}

export interface PurchaseOrderPayload {
  applicationId: string;
  countryCode: string;
  environment: string;
  payOrderId: string;
  price: number;
  productId: string;
  productType: number;
  purchaseOrderId: string;
  purchaseTime: number;
  purchaseToken: string;
  signedTime: number;
  developerPayload?: string;
}

const IAP_VERSION: string = "12";
const CALLBACK_FROM_CLIENT: number = 1;

@RegisterPayment()
class HmsPay extends BillingClient {
  private _notifyUrl?: string = undefined

  getDeveloperPayload(params: OrderData): string {
    const { order_no, price, notify_url } = params;
    return [order_no, price, (notify_url)].join(',');
  }

  async onOrderResponse(params: OrderData): Promise<RXResult<object>> {
    // Logger.d("onOrderResponse " + JSON.stringify(params))
    let context: common.UIAbilityContext = SDKConfig.context
    try {
      let purchaseParams: iap.PurchaseParameter = params.ext as iap.PurchaseParameter
      purchaseParams.productId ??= params.ext?.["third_tag"]
      purchaseParams.productType ??= iap.ProductType.CONSUMABLE
      purchaseParams.developerPayload ??= this.getDeveloperPayload(params)
      purchaseParams.reservedInfo ??= params.transmit_args
      this._notifyUrl = params.notify_url

      let purchaseResult: iap.CreatePurchaseResult = await iap.createPurchase(context, purchaseParams)
      const purchaseData = JSON.parse(purchaseResult.purchaseData) as PurchaseData;
      // let isEvn: boolean = await iap.isSandboxActivated(context);
      // purchaseData.env = isEvn ? 1 : 0;
      purchaseData.iap_version = IAP_VERSION;
      // const jwsPurchaseOrder: string = purchaseData.jwsPurchaseOrder;
      // const purchaseStr = JWTUtil.decodeJwtObj(jwsPurchaseOrder);
      // 记录购买结果
      Logger.debug(JSON.stringify(purchaseData));
      // 返回成功结果
      // return JSON.stringify({ code: 0, data: purchaseData });
      if (this._callbackFrom == CALLBACK_FROM_CLIENT) {
        return this.notifyPay(params.notify_url, purchaseData, context)
      } else {
        return RXUtil.getRXResult(RXErrorCode.OK)
      }
    } catch (err) {
      Logger.warn(JSON.stringify(err));
      err.code = err.code ?? -1;
      err.msg ??= err.message
      //BusinessError 1001860051: Failed to purchase a product because the user already owns the product. ITEM_ALREADY_OWNED
      if (err.code === iap.IAPErrorCode.PRODUCT_OWNED || err.code === iap.IAPErrorCode.SYSTEM_ERROR) {
        let result = await this.handleOwnedPurchases({
          productType: iap.ProductType.CONSUMABLE
        }, context)
        // let res = JSON.parse(result) as { data: { purchaseStr: string } }
        // await this.handleConsumePurchase(res.data.purchaseStr, context);
        return result;
      } else {
        // 返回错误结果
        // return JSON.stringify(err);
        return err
      }
    }
  }

  name(): string {
    return 'harmony'
  }

  static install() {
  }

  async queryPurchases(context: common.UIAbilityContext) {
    await iap.queryEnvironmentStatus(context as common.UIAbilityContext);
    Logger.info("queryEnvironmentStatus invoked.");
    return this.handleOwnedPurchases({
      productType: iap.ProductType.CONSUMABLE
    }, context)
  }

  public async handleOwnedPurchases(param: iap.QueryPurchasesParameter, context: common.UIAbilityContext): Promise<RXResult<object>> {
    try {
      param.productType ??= iap.ProductType.CONSUMABLE
      param.queryType ??= iap.PurchaseQueryType.UNFINISHED
      // const param: iap.QueryPurchasesParameter = {
      //   productType: this.strToProductType(storeType),
      //   queryType: this.strToQueryType(queryType),
      // };

      const res: iap.QueryPurchaseResult = await iap.queryPurchases(context as common.UIAbilityContext, param);
      const purchaseDataList = res.purchaseDataList;
      if (!purchaseDataList || purchaseDataList.length === 0) {
        Logger.info("queryPurchases list is null.");
        return RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "未能获取到已购买商品的相关数据，请检查支付参数");
      }

      const firstPurchaseDataStr = purchaseDataList[0];
      const purchaseDataObj = JSON.parse(firstPurchaseDataStr) as PurchaseData;
      // let str= purchaseOrderPayload.developerPayload
      // let isEvn: boolean = await iap.isSandboxActivated(context);
      // if (isEvn) {
      //   purchaseDataObj.env = 1;
      // }
      // purchaseDataObj.developerPayload = purchaseOrderPayload.developerPayload
      purchaseDataObj.iap_version = IAP_VERSION;
      purchaseDataObj.restore = true
      let orderData = this.parseDeveloperPayload(purchaseDataObj)
      return this.notifyPay(orderData?.notify_url || this._notifyUrl, purchaseDataObj, context)
      // return { code: 0, message: "", data: purchaseDataObj };
    } catch (error) {
      return RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "获取已购买商品错误", error.code, error.message);
    }
  }

  async notifyPay(notifyUrl: string, data: PurchaseData, context): Promise<RXResult> {
    let ret = await this.notifyResult(notifyUrl, data)
    if (ret.code == 0 && !ret.data?.["consumed"]) {
      this.consumePurchase(data, context)
    }
    return ret;
  }

  async consumePurchase(purchaseData: PurchaseData, context): Promise<RXResult> {
    try {
      let purchaseOrderStr = JWTUtil.decodeJwtObj(purchaseData.jwsPurchaseOrder);
      let purchaseOrder = JSON.parse(purchaseOrderStr) as PurchaseOrderPayload;
      let finishPurchaseParam: iap.FinishPurchaseParameter = {
        productType: purchaseOrder.productType,
        purchaseToken: purchaseOrder.purchaseToken,
        purchaseOrderId: purchaseOrder.purchaseOrderId
      };
      await iap.finishPurchase(context as common.UIAbilityContext, finishPurchaseParam);
      return RXUtil.getRXResult(RXErrorCode.OK)
    } catch (e) {
      Logger.e(e)
      return e
    }
  }

  parseDeveloperPayload(purchaseData: PurchaseData): OrderData | null {
    let purchaseOrderPayload = JSON.parse(JWTUtil.decodeJwtObj(purchaseData.jwsPurchaseOrder)) as PurchaseOrderPayload;
    let payload = purchaseOrderPayload.developerPayload
    if (payload && payload.trim()) {
      const arr = payload.split(",");
      if (arr.length >= 3) {
        const orderData: OrderData = {
          order_no: arr[0],
          price: parseInt(arr[1]) || 0, // 解析整数，若 NaN 则默认为 0
          notify_url: arr[2],
        };
        return orderData;
      }
    }
    return null;
  }
}

export default HmsPay;