import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type { Announcement, IOperation, RCallback } from '../types/Index';
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
enum OptAPI {
    MAINTAIN = "v1/operationtoolsapi/maintain/get",
    MAIL_LIST = "v1/operationtoolsapi/rxmail/cpuser/list",
    MAIL_DELETE = "v1/operationtoolsapi/rxmail/cpuser/delete",
    MAIL_DETAIL = "v1/operationtoolsapi/rxmail/cpuser/detail",
    MAIL_RECEIVE = "v1/operationtoolsapi/rxmail/cpuser/receive",
    DATA_OPERATION_SCENE = "v1/operationtoolsapi/user_data_operation_platform/scene/all"
}
interface MailArgs {
    cp_user_id: string;
    type: number;
    rx_mail_id?: number;
}
class Operation implements IOperation {
    public async getOperationScene(a2?: RCallback) {
        return await RXRequest.post(OptAPI.DATA_OPERATION_SCENE, null, null, a2);
    }
    public async getAnnouncement(y1: number = 100, z1?: RCallback<Announcement[]>) {
        return await RXRequest.get<Announcement[]>(OptAPI.MAINTAIN, {
            limit: y1,
            product_id: SDKConfig.productId, channel_id: SDKConfig.channelId
        }, null, z1);
    }
    public async getEmailList(w1?, x1?: RCallback) {
        return await RXRequest.post(OptAPI.MAIL_LIST, {
            cp_user_id: w1 ?? Passport.cpUserId
        }, null, x1);
    }
    public async deleteEmail(u1: {
        cp_user_id: string;
        type: number;
        rx_mail_id?: number;
    }, v1?: RCallback) {
        u1.cp_user_id ??= Passport.cpUserId;
        return await RXRequest.post(OptAPI.MAIL_DELETE, u1, null, v1);
    }
    public async getEmailDetail(r1: number, s1?: string, t1?: RCallback) {
        return await RXRequest.post(OptAPI.MAIL_DETAIL, {
            cp_user_id: s1 ?? Passport.cpUserId,
            rx_mail_id: r1
        }, null, t1);
    }
    public async getEmailAward(p1: {
        cp_user_id: string;
        type: number;
        rx_mail_id?: number;
    }, q1?: RCallback) {
        p1.cp_user_id ??= Passport.cpUserId;
        return await RXRequest.post(OptAPI.MAIL_RECEIVE, p1, null, q1);
    }
}
export default new Operation();
