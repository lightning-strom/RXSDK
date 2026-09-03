import { pushCommon, pushService } from "@kit.PushKit";
import { Singleton } from "../types/Types";
import { RXError, RXResult, RXUtil } from "../sdk/RXIndex";
import Push from "../api/Push";
import { Logger } from "../utils/Logger";
import SDKConfig from "../sdk/SDKConfig";

export enum ReportType {
  Arrived = 2,
  Click
}

export interface IPush {
  /**
   * 获取设备推送令牌
   *
   * @returns 返回Promise，解析为设备的唯一推送令牌
   *          该令牌用于标识设备，推送服务通过此令牌向设备发送消息
   *
   * @throws {Error} 如果获取令牌失败（如权限不足、设备不支持等）
   *
   * @example
   * getDeviceToken().then(token => {
   *   console.log("设备令牌:", token);
   * });
   */
  getDeviceToken(): Promise<string>;

  /**
   * 注册推送令牌
   * 将设备令牌注册到推送服务，使设备能够接收推送消息
   *
   * @returns 返回Promise，解析为操作结果
   *          成功时data字段可能包含注册信息
   *
   * @throws {Error} 如果注册失败（如网络错误、令牌无效等）
   *
   * @example
   * registerToken().then(result => {
   *   if (result.code === 0) {
   *     console.log("推送注册成功");
   *   } else {
   *     console.error("推送注册失败:", result.message);
   *   }
   * });
   */
  registerToken(): Promise<RXResult>;

  /**
   * 注销推送令牌
   * 取消设备的推送接收权限，停止接收推送消息
   *
   * @returns 返回Promise，解析为操作结果
   *
   * @throws {Error} 如果注销失败
   *
   * @example
   * unRegisterToken().then(result => {
   *   console.log("推送已注销");
   * });
   */
  unRegisterToken(): Promise<RXResult>;

  /**
   * 绑定推送别名
   * 将设备与指定的别名（通常是用户ID）关联，以便通过别名向特定用户推送消息
   *
   * @param appProfileId - 用户应用配置ID，作为推送别名
   *                       通常是用户的唯一标识，如用户ID、账号等
   *
   * @returns 返回Promise，解析为操作结果
   *
   * @throws {Error} 如果绑定失败（如参数格式错误、服务异常等）
   *
   * @example
   * bindAlias("USER_123456").then(result => {
   *   console.log("推送别名绑定成功");
   * });
   */
  bindAlias(appProfileId: string): Promise<RXResult>;

  /**
   * 解绑推送别名
   * 解除设备与指定别名的关联
   *
   * @param appProfileId - 需要解绑的用户应用配置ID
   *
   * @returns 返回Promise，解析为操作结果
   *
   * @throws {Error} 如果解绑失败
   *
   * @example
   * unBindAlias("USER_123456").then(result => {
   *   console.log("推送别名已解绑");
   * });
   */
  unBindAlias(appProfileId: string): Promise<RXResult>;
}

export class PushManager extends Singleton<PushManager> implements IPush {
  token: string = ""
  taskIdCache: Map<string, number> = new Map<string, number>()

  async getDeviceToken(): Promise<string> {
    if (!this.token) {
      this.token = await pushService.getToken()
    }
    return this.token
  }

  async reportNotifyStatus(taskId: string, reportType: ReportType): Promise<void> {
    try {
      if (!taskId) {
        if (SDKConfig.isInit) {
          Push.reportNotifyStatus(await this.getDeviceToken(), taskId, reportType)
        } else {
          this.taskIdCache.set(taskId, reportType)
        }
      }
    } catch (err) {
      Logger.e(err)
    }
  }

  async registerToken(): Promise<RXResult> {
    try {
      let token = await this.getDeviceToken()
      let result = Push.bindDevice(token)

      if (this.taskIdCache.size > 0) {
        const entries = Array.from(this.taskIdCache.entries());
        for (let i = 0; i < entries.length; i++) {
          const key = entries[i][0];
          const value = entries[i][1];
          let r = await Push.reportNotifyStatus(token, key, value)
          if (r.code == 0) {
            this.taskIdCache.delete(key);
            console.log(`reportNotify success: ${key}  ${value}`);
          }
        }
      }
      return result
    } catch (err) {
      Logger.e(err)
      return RXUtil.getRXResult(err);
    }
  }

  async unRegisterToken(): Promise<RXResult> {
    try {
      let token = await this.getDeviceToken()
      if (!token) {
        throw new RXError("token is null")
      }
      let result = await Push.unbindDevice(token)
      if (result.code == 0) {
        pushService.deleteToken()
        this.token = ""
      }
      return result
    } catch (err) {
      Logger.e(err)
      return RXUtil.getRXResult(err);
    }
  }

  async bindAlias(appProfileId: string): Promise<RXResult> {
    try {
      pushService.bindAppProfileId(pushCommon.AppProfileType.PROFILE_TYPE_APPLICATION_ACCOUNT, appProfileId)
      return Push.bindAlias(appProfileId)
    } catch (err) {
      Logger.e(err)
      return RXUtil.getRXResult(err);
    }
  }

  async unBindAlias(appProfileId: string): Promise<RXResult> {
    try {
      pushService.unbindAppProfileId(appProfileId)
      return Push.bindAlias("")
    } catch (err) {
      Logger.e(err)
      return RXUtil.getRXResult(err);
    }
  }
}