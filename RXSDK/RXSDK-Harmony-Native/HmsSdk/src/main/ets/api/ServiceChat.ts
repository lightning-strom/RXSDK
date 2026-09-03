import { RequestMethod, RXRequest } from '../net/RXRequest'
import SDKConfig from '../sdk/SDKConfig';
import { RCallback } from '../types/Index'
import { Logger } from '../utils/Logger';


const GET_GLOBAL_UNREAD = "v1/servicechat/queue/get_global_unread";
const CLEAR_GLOBAL_UNREAD = "v1/servicechat/queue/clear_global_unread";

class ServiceChat {
  //   {
  //     "code": 0,
  //     "data": {
  //        "ims_session_id":"259131754232",
  //        "unread_num":3
  //     }
  // }
  getServiceChatUnreadCount(callback?: RCallback) {
    return RXRequest.request({
      path: GET_GLOBAL_UNREAD,
      method: RequestMethod.GET,
    }, callback);
  }

  clearServiceChatUnreadCount(callback?: RCallback) {
    return RXRequest.request({
      path: CLEAR_GLOBAL_UNREAD,
      method: RequestMethod.POST,
    }, callback);
  }
}

export default new ServiceChat()