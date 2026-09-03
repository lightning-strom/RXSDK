import { RequestMethod, RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { RCallback } from '../types/Index';
const GET_GLOBAL_UNREAD = "v1/servicechat/queue/get_global_unread";
const CLEAR_GLOBAL_UNREAD = "v1/servicechat/queue/clear_global_unread";
class ServiceChat {
    getServiceChatUnreadCount(y5?: RCallback) {
        return RXRequest.request({
            path: GET_GLOBAL_UNREAD,
            method: RequestMethod.GET,
        }, y5);
    }
    clearServiceChatUnreadCount(x5?: RCallback) {
        return RXRequest.request({
            path: CLEAR_GLOBAL_UNREAD,
            method: RequestMethod.POST,
        }, x5);
    }
}
export default new ServiceChat();
