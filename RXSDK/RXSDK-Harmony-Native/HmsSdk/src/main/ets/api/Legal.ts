import { RequestMethod, RXRequest } from '../net/RXRequest'
import SDKConfig from '../sdk/SDKConfig';
import { RCallback } from '../types/Index'
import { Logger } from '../utils/Logger';

const LEGAL = "v1/operationapi/legal";

const LEGAL_TERMS = "v1/operationapi/legal/terms";

class Legal {

  legal(callback?: RCallback) {
    return RXRequest.request({
      path: LEGAL,
      data: { channel_id: SDKConfig.channelId, product_id: SDKConfig.productId },
      withToken: false,
      method: RequestMethod.GET,
    }, callback);
  }

  // keys ， position 二选一
  legalTerms(args: { product_id?: string, channel_id?: string, keys?: string, position?: string }, callback?: RCallback) {
    args.product_id ??= SDKConfig.productId
    args.channel_id ??= SDKConfig.channelId
    if (!args.keys && !args.position) {
      Logger.e("keys 和 position 参数必须二选一");
    }
    return RXRequest.request({
      path: LEGAL_TERMS,
      data: args,
      withToken: false,
      method: RequestMethod.GET,
    }, callback);
  }


}

export default new Legal()