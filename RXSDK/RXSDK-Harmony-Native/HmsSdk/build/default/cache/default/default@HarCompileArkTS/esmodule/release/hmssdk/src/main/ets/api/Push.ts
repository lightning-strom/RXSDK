import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { RequestMethod, RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { RXResult } from "../types/Index";
const BIND_DEVICE = "v1/pusher/device/bind_device";
const BIND_ALIAS = "v1/pusher/device/bind_alias";
const ADD_TAGS = "v1/pusher/device/add_tags";
const DEL_TAGS = "v1/pusher/device/del_tags";
const UNBIND_DEVICE = "v1/pusher/device/unbind_device";
const NOTIFY_REPORT = "v1/pusher/notify/device";
class Push {
    get brandName(): string {
        return "harmonypush";
    }
    reportNotifyStatus(g2: string, h2: string, i2: number): Promise<RXResult> {
        return RXRequest.request({
            path: NOTIFY_REPORT,
            data: {
                device_token: g2,
                task_id: h2,
                openid: Passport.openid,
                type: this.brandName,
                status: i2
            },
            method: RequestMethod.POST,
        });
    }
    addTags(f2: string[]): Promise<RXResult> {
        return RXRequest.request({
            path: ADD_TAGS,
            data: {
                tags: f2,
            },
            method: RequestMethod.POST
        });
    }
    delTags(e2: string[]): Promise<RXResult> {
        return RXRequest.request({
            path: DEL_TAGS,
            data: {
                tags: e2,
            },
            method: RequestMethod.POST
        });
    }
    bindAlias(d2: string): Promise<RXResult> {
        return RXRequest.request({
            path: BIND_ALIAS,
            data: {
                alias: d2,
            },
            method: RequestMethod.POST
        });
    }
    unbindDevice(c2: string): Promise<RXResult> {
        return RXRequest.request({
            path: UNBIND_DEVICE,
            data: {
                device_code: c2,
                type: this.brandName,
            },
            method: RequestMethod.POST
        });
    }
    bindDevice(b2: string): Promise<RXResult> {
        return RXRequest.request({
            path: BIND_DEVICE,
            data: {
                device_code: b2,
                type: this.brandName,
            },
            method: RequestMethod.POST
        });
    }
}
export default new Push();
