import Passport from "../base/Passport";
import { RequestMethod, RXRequest } from "../net/RXRequest";
import { RXResult } from "../types/Index";


const BIND_DEVICE = "v1/pusher/device/bind_device";
const BIND_ALIAS = "v1/pusher/device/bind_alias";
const ADD_TAGS = "v1/pusher/device/add_tags";
const DEL_TAGS = "v1/pusher/device/del_tags";
const UNBIND_DEVICE = "v1/pusher/device/unbind_device";
const NOTIFY_REPORT = "v1/pusher/notify/device";

class Push {
  get brandName():string {
    return "harmonypush"
  }

  reportNotifyStatus(deviceToken: string, taskId: string, reportType: number): Promise<RXResult>  {
    return RXRequest.request({
      path: NOTIFY_REPORT,
      data: {
        device_token: deviceToken,
        task_id: taskId,
        openid: Passport.openid,
        type: this.brandName,
        status: reportType
      },
      method: RequestMethod.POST,
    });
  }

  addTags(alias: string[]): Promise<RXResult>  {
    return RXRequest.request({
      path: ADD_TAGS,
      data: {
        tags: alias,
      },
      method: RequestMethod.POST
    });
  }

  delTags(alias: string[]): Promise<RXResult>  {
    return RXRequest.request({
      path: DEL_TAGS,
      data: {
        tags: alias,
      },
      method: RequestMethod.POST
    });
  }

  bindAlias(alias: string): Promise<RXResult>  {
    return RXRequest.request({
      path: BIND_ALIAS,
      data: {
        alias: alias,
      },
      method: RequestMethod.POST
    });
  }

  unbindDevice(deviceToken: string): Promise<RXResult>  {
    return RXRequest.request({
      path: UNBIND_DEVICE,
      data: {
        device_code: deviceToken,
        type: this.brandName,
      },
      method: RequestMethod.POST
    });
  }

  bindDevice(deviceToken: string): Promise<RXResult> {
    return RXRequest.request({
      path: BIND_DEVICE,
      data: {
        device_code: deviceToken,
        type: this.brandName,
      },
      method: RequestMethod.POST
    });
  }


}

export default new Push()