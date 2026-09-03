import { RCallback } from '../types/Index';
declare class ServiceChat {
    getServiceChatUnreadCount(y5?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    clearServiceChatUnreadCount(x5?: RCallback): Promise<import("../types/Index").RXResult<object>>;
}
declare const _default: ServiceChat;
export default _default;
