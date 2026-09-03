import ApiPath from "../constants/ApiPath";
import  { RXRequest,RequestMethod } from "../net/RXRequest";
import SDKConfig from "../sdk/SDKConfig";
import { RCallback, RXErrorCode, RXResult } from "../types/Index";
import Devices from "../utils/Devices";
import { Logger } from "../utils/Logger";
import Objects from "../utils/Objects";
import { RXUtil } from "../utils/RXUtil";
import UrlUtil from "../utils/UrlUtil";

type queryType = { type: string, format?: string }

export default class Update {
  private static handlePath(path: string) {
    return UrlUtil.joinQuery(path, { local_country: Devices.systemCountry })
  }

  private static handleUpdateResp(res: RXResult<object>) {
    if (res.code == 0 && res.data) {
      // let login_config
      // if (typeof res.data == 'object') {
      //   login_config = res.data["login_config"]
      // } else if (typeof res.data == 'string') {
      //   login_config = JSON.parse(res.data)["login_config"]
      // }
    }
    return res
  }

  static async updateGameVersion(body: Record<string, any>, callback: RCallback) {
    try {
      body ??= {}
      body.type ??= "js"
      const requiredParams = {
        api: SDKConfig.domain,
        productId: SDKConfig.productId,
        channelId: SDKConfig.channelId,
      };
      Objects.checkRequiredParams(requiredParams, Object.keys(requiredParams));
      return await RXRequest.request({
        method: RequestMethod.POST,
        path: this.handlePath(ApiPath.UPDATE_MODULE_VERSION),
        data: body
      }, callback)
        .then(res => {
          return this.handleUpdateResp(res)
        })
    } catch (e) {
      Logger.e(e)
      let ret = RXUtil.formatResult(e, RXErrorCode.INIT_ERROR)
      callback?.(ret)
      return ret
    }
  }

  static async checkAppUpdate(version: string, region: string, body?: Record<string, any>, callback?: RCallback, method?: string, query?: queryType) {
    try {
      const requiredParams = {
        productId: SDKConfig.productId,
        channelId: SDKConfig.channelId,
        deviceCode: Devices.deviceCode,
        version: version
      };
      Objects.checkRequiredParams(requiredParams, Object.keys(requiredParams));
      query ??= {
        type: "js"
      }
      if (!query.type && !query.format) {
        query.type = "js"
      }
      let api = `v1/vcapi/update/${SDKConfig.productId}/${SDKConfig.channelId}/${version}/${Devices.deviceCode}/${region}?${UrlUtil.toQueryString(query)}`

      return await RXRequest.request({
        method: method || RequestMethod.GET,
        path: this.handlePath(api),
        data: body ?? {}
      }, callback)
        .then(res => {
          return this.handleUpdateResp(res)
        })
    } catch (e) {
      let ret = RXUtil.formatResult(e, RXErrorCode.INIT_ERROR)
      callback?.(ret)
      return ret
    }
  }

  static async checkActivityUpdate(activityShortName: string, activityVersion: string, activityCheckVersion: string, body: Record<string, any>, callback?: RCallback, method?: string,
    query?: queryType) {
    try {
      const requiredParams = {
        activityShortName, activityVersion, activityCheckVersion
      };
      Objects.checkRequiredParams(requiredParams);
      let api = `v1/vcapi/update_activity/${activityShortName}/${activityVersion}/${activityCheckVersion}?${UrlUtil.toQueryString(query)}`
      return await RXRequest.request({
        method: method || RequestMethod.GET,
        path: this.handlePath(api),
        data: body ?? {}
      }, callback)
        .then(res => {
          return this.handleUpdateResp(res)
        })
    } catch (e) {
      let ret = RXUtil.formatResult(e, RXErrorCode.PARAMETER_ERROR)
      callback?.(ret)
      return ret
    }
  }

  static async checkGameUpdate(gameId: string, gameVersion: string, gameCheckVersion: string, body: Record<string, any>, callback?: RCallback, method?: string,
    query?: queryType) {
    try {
      const requiredParams = {
        gameId, gameVersion, gameCheckVersion
      };
      Objects.checkRequiredParams(requiredParams);
      let api = `v1/vcapi/update_game/${gameId}/${gameVersion}/${gameCheckVersion}?${UrlUtil.toQueryString(query)}`
      return await RXRequest.request({
        method: method || RequestMethod.GET,
        path: this.handlePath(api),
        data: body ?? {}
      }, callback)
        .then(res => {
          return this.handleUpdateResp(res)
        })
    } catch (e) {
      let ret = RXUtil.formatResult(e, RXErrorCode.PARAMETER_ERROR)
      callback?.(ret)
      return ret
    }
  }
}