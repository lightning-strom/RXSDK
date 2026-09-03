// @keepTs
// @ts-nocheck
import { Singleton } from "../types/Types";
import { RXResult } from "../sdk/RXIndex";
export declare enum ReportType {
    Arrived = 2,
    Click = 3
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
export declare class PushManager extends Singleton<PushManager> implements IPush {
    token: string;
    taskIdCache: Map<string, number>;
    getDeviceToken(): Promise<string>;
    reportNotifyStatus(r24: string, s24: ReportType): Promise<void>;
    registerToken(): Promise<RXResult>;
    unRegisterToken(): Promise<RXResult>;
    bindAlias(e24: string): Promise<RXResult>;
    unBindAlias(c24: string): Promise<RXResult>;
}
