import { RXRequest, RequestMethod } from "../net/RXRequest";
import SDKConfig from "../sdk/SDKConfig";
import { RCallback, RXResult } from "../types/Index"
import Devices from "../utils/Devices";
import { Logger } from "../utils/Logger";
import Objects from "../utils/Objects";
import ApiPath from "../constants/ApiPath";
import { Context } from "@kit.AbilityKit";

interface UserAttributionParams {
  device: Record<string, any>;
  distinct_id?: string;
  user_attrs?: Record<string, any>;
  user_source?: Record<string, any>;
  source_ad?: Record<string, any>;
  activate?: {
    result: any;
  };
}

class UserActivate {
  private ipv4: string = undefined
  private activateResult: object
  private isLoginSuccess: boolean = false;
  private userActivatedReTryCount: number = 2

  async getDevice(): Promise<Record<string, any>> {
    let params: Record<string, any> = {}
    params.oaid = await Devices.getOAID(SDKConfig.context)
    params.ipv4 = await this.getIp();
    params.package_name = Devices.bundleName
    if (SDKConfig.isModReport) {
      params.model = Devices.model;
    }
    if (SDKConfig.isNetReport) {
      params.network_standard = Devices.getNetCapabilities();
    }
    return params;
  }

  onLoginSuccess() {
    this.isLoginSuccess = true
  }

  async getAttributionData(context?: Context): Promise<UserAttributionParams> {
    const params: UserAttributionParams = {
      device: await this.getDevice(),
    };
    const clipData: Record<string, any> = Devices.getRXPasteboardData(true, context);
    if (clipData && "user_source" in clipData) {
      const userSource = clipData["user_source"] as string;
      if (userSource && userSource.trim() !== "") {
        delete clipData["user_source"]; // 删除 user_source 属性
        if (Object.keys(clipData).length > 0) {
          if (
            (userSource === "attr" || userSource === "attrs") &&
              !("user_attrs" in params)
          ) {
            // 设置大数据用户属性，仅对本次登录新注册的用户有效
            params.user_attrs = clipData;
          } else if (!("user_source" in params) && userSource !== "ad") {
            const userSourceMap: Record<string, any> = {};
            userSourceMap[userSource] = clipData;
            params.user_source = userSourceMap;
          }
        }
      }
    }
    let pushTaskId = SDKConfig.pushTaskId
    if (pushTaskId && pushTaskId.trim() !== "") {
      let userSource: Record<string, any> = params["user_source"] || {};
      if (userSource) {
        const pushData: Record<string, any> = { taskid: pushTaskId };
        userSource["push"] = pushData;
        params["user_source"] = userSource;
      }
    }

    const subChannelId = SDKConfig.subChannelId;
    if (subChannelId && subChannelId.trim() !== "") {
      let userSource: Record<string, any> = params["user_source"] || {};
      if (userSource) {
        const subPackageData: Record<string, any> = {
          sub_channel_id: subChannelId,
          package_type: "promoter",
        };
        userSource["sub_package"] = subPackageData;
        params["user_source"] = userSource;
      }
    }

    if (Devices.getLoginCount() < 1) {
      if (Devices.distinctId) {
        params.distinct_id = Devices.distinctId;
      }
      if (this.activateResult) {
        params.activate = { result: this.activateResult };
      }
    }
    return params;
  }

  async getIp(): Promise<string> {
    const url = SDKConfig.ipUrl;
    if (!url) {
      Logger.i("init ip.api is not configured.");
      return this.ipv4;
    }
    if (this.ipv4) {
      return this.ipv4
    }
    try {
      const resp = await RXRequest.request({
        path: url,
        method: RequestMethod.GET,
      });
      this.ipv4 = resp?.["ip"] || resp?.["client_ip"];
    } catch (error) {
      Logger.e("Failed to fetch IP: " + error);
    }
    return this.ipv4;
  }

  async init(context: Context, params: Record<string, any> = {}, callback?: RCallback): Promise<RXResult<object>> {
    if (!Devices.isActivated && Devices.getLoginCount() < 1) {
      let ret = await this.activate(params, context)
      Logger.log(`sdk activate result:${JSON.stringify(ret)}`);
      callback?.(  ret)
      return ret
    }
  }

  async activate(params: Record<string, any> = {}, context: Context, retryCount = 0): Promise<RXResult<object>> {
    params = Objects.deepAssign(params, await this.getAttributionData())
    params.activate_time = new Date().getTime() - SDKConfig.START_TIME



    let result = await RXRequest.request<RXResult<object>>({
      path: ApiPath.FIRST_ACTIVATED,
      data: params,
      method: RequestMethod.POST,
    }, null).then(resp => {
      if (resp.code == 0) {
        Devices.setActivated()
        this.activateResult = resp.data
      }
      return resp
    });
    if (result.code != 0 && retryCount < this.userActivatedReTryCount) {
      return await new Promise<RXResult<object>>((resolve, reject) => {
        setTimeout(() => {
          resolve(this.activate(params, context, retryCount + 1))
        }, 100)
      })
    } else {
      return result
    }
  }
}

export default new UserActivate()