import { RXRequest } from '../net/RXRequest'
import SDKConfig from '../sdk/SDKConfig'
import { Announcement, IOperation, RCallback, RXCallback, RXResult } from '../types/Index'
import Passport from '../base/Passport'

enum OptAPI {
  MAINTAIN = "v1/operationtoolsapi/maintain/get",
  MAIL_LIST = "v1/operationtoolsapi/rxmail/cpuser/list",
  MAIL_DELETE = "v1/operationtoolsapi/rxmail/cpuser/delete",
  MAIL_DETAIL = "v1/operationtoolsapi/rxmail/cpuser/detail",
  MAIL_RECEIVE = "v1/operationtoolsapi/rxmail/cpuser/receive",
  DATA_OPERATION_SCENE = "v1/operationtoolsapi/user_data_operation_platform/scene/all"

}

interface MailArgs {
  cp_user_id: string
  type: number
  rx_mail_id?: number //type == 1 时需要
}

class Operation implements IOperation {
  public async getOperationScene(callback?: RCallback) {
    return await RXRequest.post(OptAPI.DATA_OPERATION_SCENE, null, null, callback)
  }

  /**
   * 获取公告列表
   * @param limit 获取条数
   * @param callback 回调
   */
  public async getAnnouncement(limit: number = 100, callback?: RCallback<Announcement[]>) {
    return await RXRequest.get< Announcement[]>(OptAPI.MAINTAIN, {
      limit: limit, product_id: SDKConfig.productId, channel_id: SDKConfig.channelId
    }, null, callback)
  }

  public async getEmailList(userId?, callback?: RCallback) {
    return await RXRequest.post(OptAPI.MAIL_LIST, {
      cp_user_id: userId ?? Passport.cpUserId
    }, null, callback)
  }

  // 1-删除单封邮件 2-一键删除
  public async deleteEmail(param: { cp_user_id: string, type: number, rx_mail_id?: number }, callback?: RCallback) {
    param.cp_user_id ??= Passport.cpUserId
    return await RXRequest.post(OptAPI.MAIL_DELETE, param, null, callback)
  }

  public async getEmailDetail(mailId: number, userId?: string, callback?: RCallback) {
    return await RXRequest.post(OptAPI.MAIL_DETAIL, {
      cp_user_id: userId ?? Passport.cpUserId,
      rx_mail_id: mailId
    }, null, callback)

  }

  // 1-领取单封邮件 2-一键领取
  public async getEmailAward(param: { cp_user_id: string, type: number, rx_mail_id?: number }, callback?: RCallback) {
    param.cp_user_id ??= Passport.cpUserId
    return await RXRequest.post(OptAPI.MAIL_RECEIVE, param, null, callback)
  }
}

export default new Operation()