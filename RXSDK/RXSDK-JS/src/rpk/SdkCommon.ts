import {
  bindEmail,
  bindPhone,
  checkActivityVersion,
  checkGameVersion,
  checkVersionGameLobbyByGet,
  checkVersionGameLobbyByPost,
  deregister,
  deregisterCancel,
  getInfoApi,
  getUserInfoByFieldApi,
  sendCaptcha,
  UnbindEmail,
  unBindPhone,
  updateInfoApi,
  getNoticeApi,
  collectPropsApi,
  createFeedbackApi,
  getFeedbackDetailApi,
  getFeedbackListApi,
  getInfolayoutApi,
  getListlayoutApi,
  getMainlayoutApi,
  postResolutionApi,
  setcustomApi,
  addRelationApi,
  deleteRelationApi,
  hasrelationApi,
  relationListApi,
  addfriendApi,
  delfriendApi,
  updatefriendremarksApi,
  isfriendApi,
  friendsApi,
  addscoreApi,
  setscoreApi,
  queryuserrankApi,
  getranklistApi,
  friendsrankApi,
  updateremarksApi,
  trackApi,
  createGameAreaApi,
  createGameCharacterApi,
  delGameAreaApi,
  delGameCharacterApi,
  getGameAccountAreaCharacterApi,
  getGameAreaApi,
  getGameAreaListApi,
  getGameCharacterAccountApi,
  getGameCharacterApi,
  getOperationSceneApi,
  putGameAreaApi,
  putGameCharacterApi,
  itemRedemptionApi,
  getEmailListApi,
  getEmailDetailApi,
  receiveEmailApi,
  delEmailApi,
  getShortUrlApi,
  _getInfoApi,
  updateGameVersionApi,
  searchGameAccountApi,
  getH5LoginConfigApi,
  getTempNoticeApi,
  tradeQueryApi
} from './apis'
import {
  bindEmailParamsCheck,
  bindPhoneParamsCheck,
  sendCaptchaParamsCheck,
  unbindemailParamsCheck,
  unBindPhoneParamsCheck
} from '@/utils/checkConfig/common'
import { handleError } from '@/utils/utils'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { pubCheck } from '@/utils/paramsValid'
import {
  checkActivityVersionParams,
  checkAppVersionParams,
  checkGameVersionParams
} from '@/utils/checkConfig'
import {
  addFriendCheck,
  addRelationCheck,
  addscoreCheck,
  deleteRelationCheck,
  delfriendCheck,
  getranklimitlistCheck,
  getranklistCheck,
  hasRelationCheck,
  queryuserrankCheck,
  relationListCheck,
  setcustomCheck,
  updatefriendremarksCheck,
  updateremarksCheck
} from '@/utils/checkConfig/social'
import { customGetStorageSync, customSetStorageSync, handleTrackError } from '@/rpk/utils'
import v4 from 'uuid/v4'
import { formatDate } from '@/utils/day'
// @ts-ignore
// import drawQrcode from './qrcode.js'

class SdkCommon {
  private platform: any

  constructor(platform: string) {
    this.platform = platform
  }

  // 用户管理
  public async setcustom(params: { custom: string }, { complete }: RpkMethodParams) {
    try {
      await pubCheck(setcustomCheck, { complete }, params)
      let result = await setcustomApi({ custom: params.custom })
      console.log(result)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 添加自定义关系
  public async addRelation(params: RpkaddRelation, { complete }: RpkMethodParams) {
    try {
      await pubCheck(addRelationCheck, { complete }, params)
      let result = await addRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 删除自定义关系
  public async deleteRelation(params: RpkdeleteRelation, { complete }: RpkMethodParams) {
    try {
      await pubCheck(deleteRelationCheck, { complete }, params)
      let result = await deleteRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 更新自定关系备注
  public async updateremarks(params: Rpkupdateremarks, { complete }: RpkMethodParams) {
    try {
      await pubCheck(updateremarksCheck, { complete }, params)
      let result = await updateremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 判断两用户是否存在某自定关系
  public async hasRelation(params: RpkHasRelation, { complete }: RpkMethodParams) {
    try {
      await pubCheck(hasRelationCheck, { complete }, params)
      let result = await hasrelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取自定关系列表
  public async relationList(params: Rpkrelationlists, { complete }: RpkMethodParams) {
    try {
      await pubCheck(relationListCheck, { complete }, params)
      let result = await relationListApi({ type: params.type })
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 添加好友关系
  public async addFriend(params: RpkaddFriend, { complete }: RpkMethodParams) {
    try {
      await pubCheck(addFriendCheck, { complete }, params)
      let result = await addfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 删除好友关系
  public async delfriend(params: RpkdeleFriend, { complete }: RpkMethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await delfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 更新好友备注
  public async updatefriendremarks(params: Rpkupdatefriendremarks, { complete }: RpkMethodParams) {
    try {
      await pubCheck(updatefriendremarksCheck, { complete }, params)
      let result = await updatefriendremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 判断两用户是否为好友
  public async isfriend(params: Rpkisfriend, { complete }: RpkMethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await isfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取好友关系列表
  public async friends({ complete }: RpkMethodParams) {
    try {
      let result = await friendsApi()
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  /**
   * 排行榜相关接口
   */

  // 增加用户分数
  public async addscore(params: Rpkaddscroe, { complete }: RpkMethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await addscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 设置用户分数
  public async setscore(params: Rpkaddscroe, { complete }: RpkMethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await setscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 查询用户分数
  public async queryuserrank(params: queryuserrank, { complete }: RpkMethodParams) {
    try {
      await pubCheck(queryuserrankCheck, { complete }, params)
      let result = await queryuserrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取排行榜列表
  public async getranklist(params: RpkgetranklistLimit, { complete }: RpkMethodParams) {
    try {
      await pubCheck(getranklimitlistCheck, { complete }, params)
      let result = await getranklistApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取好友排行榜列表
  public async friendsrank(params: Rpkgetranklist, { complete }: RpkMethodParams) {
    try {
      await pubCheck(getranklistCheck, { complete }, params)
      let result = await friendsrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  /**
   * 帮助中心
   */
  public async getHelpcenterMainLayout({ complete }: RpkMethodParams) {
    try {
      const result = await getMainlayoutApi()
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async getHelpcenterQuestionLayout(
    params: RpkHelpcenterQuestionReq,
    { complete }: RpkMethodParams
  ) {
    try {
      const result = await getListlayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async getHelpcenterInfoLayout(params: RpkHelpcenterQuestionReq, { complete }: RpkMethodParams) {
    try {
      const result = await getInfolayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async helpcenterResolution(params: HelpcenterResolution, { complete }: RpkMethodParams) {
    try {
      const result = await postResolutionApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  /**
   * 玩家意见反馈
   */
  private async addFeedback(params: any, callback?: RpkMethodParams) {
    try {
      const res = await createFeedbackApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  private async getFeedbackList(params: any, callback?: RpkMethodParams) {
    try {
      const res = await getFeedbackListApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  private async getFeedbackDetail(params: any, callback?: RpkMethodParams) {
    try {
      const res = await getFeedbackDetailApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 领取道具
  private async collectProps(params: any, callback?: RpkMethodParams) {
    try {
      const res = await collectPropsApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取公告列表
  private async getAnnouncement(limit: number, callback?: RpkMethodParams) {
    if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
      callback && callback.complete(handleError({
        code: 2000,
        data: null,
        message: 'limit 必须填1 - 100整数'
      }))
      return
    }
    try {
      const { productId, channelId } = SYSTEM_INFO
      const res = await getNoticeApi({
        limit,
        product_id: productId,
        channel_id: channelId
      })
      console.log(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  /**
   * 用于设置自定义返回错误 Msg
   */
  public setErrorMsg(errMsg: [key: string]) {
    SYSTEM_INFO.errMsg = errMsg
  }

  /**
   * 清空返回错误 Msg
   */
  public clearErrorMsg() {
    SYSTEM_INFO.errMsg = {
      default: ''
    }
  }

  // 发送验证码
  public async sendCaptcha(params: RpksendCaptcha, callback: RpkMethodParams) {
    try {
      await pubCheck(sendCaptchaParamsCheck, callback, params)
      let result = await sendCaptcha(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 绑定手机
  public async bindPhone(params: RpkBindPhone, callback: RpkMethodParams) {
    try {
      await pubCheck(bindPhoneParamsCheck, callback, params)
      let result = await bindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 解绑手机
  public async unBindPhone(params: RpkunBindPhone, callback: RpkMethodParams) {
    try {
      await pubCheck(unBindPhoneParamsCheck, callback, params)
      let result = await unBindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 绑定邮箱
  public async bindEmail(params: RpkBindEmail, callback: RpkMethodParams) {
    try {
      await pubCheck(bindEmailParamsCheck, callback, params)
      let data = await bindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 解绑邮箱
  public async UnbindEmail(params: RpkunBindEmail, callback: RpkMethodParams) {
    try {
      await pubCheck(unbindemailParamsCheck, callback, params)
      let data = await UnbindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 注销账号
  async deregister(params: any, callback: RpkMethodParams) {
    try {
      let result = await deregister(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 撤销账号注销申请
  async deregisterCancel(callback: RpkMethodParams) {
    try {
      let result = await deregisterCancel()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 获得用户信息
  async getInfo(callback: RpkMethodParams) {
    try {
      let result = await getInfoApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 修改瑞雪通行证用户信息。
  async updateInfo(params: any, callback: RpkMethodParams) {
    try {
      let result = await updateInfoApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 游戏大厅版本检查-get
  async checkAppVersion(params: RpkCheckAppVersion, callback: RpkMethodParams) {
    try {
      await pubCheck(checkAppVersionParams, callback, params)
      const req = {
        ...params,
        productid: SYSTEM_INFO.productId,
        channelid: SYSTEM_INFO.channelId,
        type: params?.type || 'js',
        format: params?.format || 'json',
        region: params?.region || 0
      }
      let result = await checkVersionGameLobbyByGet(req)
      try {
        if(result.code === 0) {
          const data: any = JSON.parse(result.data)
          const region_tag = data.login_config?.[0]?.region_tag
          if(region_tag) {
            SYSTEM_INFO.region_tag = region_tag
          }
        }
      } catch (e) {

      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 游戏大厅版本检查-post
  async checkVersion(params: RpkCheckVersion, callback: RpkMethodParams) {
    try {
      await pubCheck(checkAppVersionParams, callback, params)
      const req = {
        ...params,
        productid: SYSTEM_INFO.productId,
        channelid: SYSTEM_INFO.channelId,
        type: params?.type || 'js',
        format: params?.format || 'json',
        region: params?.region || 0
      }
      let result = await checkVersionGameLobbyByPost(req)
      try {
        if(result.code === 0) {
          const data: any = JSON.parse(result.data)
          const region_tag = data.login_config?.[0]?.region_tag
          if(region_tag) {
            SYSTEM_INFO.region_tag = region_tag
          }
        }
      } catch (e) {

      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 游戏版本检查
  async checkGameVersion(params: RpkCheckGameVersion, callback: RpkMethodParams) {
    try {
      await pubCheck(checkGameVersionParams, callback, params)
      const req = {
        ...params,
        gamecheckversion: params?.gamecheckversion || 0,
        type: params?.type || 'lua',
        format: params?.format || 'lua'
      }
      let result = await checkGameVersion(req)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 活动版本检查
  async checkActivityVersion(params: RpkCheckActivityVersion, callback: RpkMethodParams) {
    try {
      await pubCheck(checkActivityVersionParams, callback, params)
      const req = {
        ...params,
        activitycheckversion: params?.activitycheckversion || 0,
        type: params?.type || 'lua',
        format: params?.format || 'lua'
      }
      let result = await checkActivityVersion(req)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  public async track(params: any, callback: any) {
    if (SYSTEM_INFO.isMatch) {
      callback.complete({ code: 0 })
      return
    }
    //传递的params的值
    let p1: any = null
    //传递的callback的值
    let p2: any = null

    try {
      if (params.complete) {
        p2 = params
        p1 = callback
      } else {
        p1 = params
        p2 = callback
      }
    } catch (err: any) {
      p1 = params
      p2 = callback
    }

    try {
      const getDevicecode = () => {
        var devicecode = customGetStorageSync('rx_devicecode')
        if (devicecode) {
          return devicecode.code
        } else {
          let code = v4()
          customSetStorageSync('rx_devicecode', { code, openIds: {} })
          return code
        }
      }
      let devicecode = getDevicecode()
      let type: 'track' = 'track'
      let time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ')
      let uuids = v4()
      let platform_id: 4 = 4
      let { cpid: copyCpid, productId: product_id, channelId: channel_id } = SYSTEM_INFO
      let cpid = Number(copyCpid)
      const publicProps = customGetStorageSync('rx_public_props')
      const new_properties: any = {}

      if (params.ip) {
        new_properties.ipv4 = params.ip
      }

      if (SYSTEM_INFO.region_tag) {
        new_properties.rx_region_tag = `${SYSTEM_INFO.region_tag}`
      }

      if (SYSTEM_INFO.cp_role_id) {
        new_properties['#role_id'] = `${SYSTEM_INFO.cp_role_id}`
      }

      try {
        const version = SYSTEM_INFO.miniVersion
        if (version) {
          new_properties['rx_app_info'] = {
            version
          }
        }
      } catch (e) {

      }

      let reqarr: RpkTrackForReq[] = [
        {
          type,
          time,
          uuid: uuids,
          distinct_id: USER_INFO?.openid,
          sub_channel_id: USER_INFO?.subchannelid,
          platform_id,
          product_id,
          cpid,
          channel_id,
          devicecode,
          ...{
            ...p1,
            properties: {
              ...new_properties,
              ...p1.properties,
              ...publicProps
            }
          }
        }
      ]
      !USER_INFO.subchannelid || (reqarr[0].sub_channel_id = USER_INFO.subchannelid)

      let result = await trackApi(reqarr)
      p2.complete({ ...result, data: null, msg: 'track success' })
    } catch (err) {
      p2.complete(handleError(err))
    }
  }

  // 获取商业化接口
  public async getOperationScene(callback: RpkMethodParams) {
    try {
      const res = await getOperationSceneApi()
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 商业化上报接口
  public async reportWindowExposure(properties: {
    [key: string]: any
  }, callback: RpkMethodParams) {
    this.track(
      {
        complete: (data: any) => {
          callback && callback.complete(data)
        }
      },
      {
        event: '#window_exposure',
        properties: properties
      }
    )
  }

  // 游戏区服信息查询
  async getGameArea(params: { area_id: string }, callback: RpkMethodParams) {
    try {
      let result = await getGameAreaApi(params.area_id)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 游戏区服信息修改
  async putGameArea(params: any, callback: RpkMethodParams) {
    try {
      let result = await putGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建游戏区服
  async createGameArea(params: any, callback: RpkMethodParams) {
    try {
      let result = await createGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏区服
  async delGameArea(params: any, callback: RpkMethodParams) {
    try {
      let result = await delGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询区服列表信息
  async getGameAreaList(callback: RpkMethodParams) {
    try {
      let result = await getGameAreaListApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建角色
  async createGameCharacter(params: any, callback: RpkMethodParams) {
    try {
      let result = await createGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 修改游戏角色信息
  async putGameCharacter(params: any, callback: RpkMethodParams) {
    try {
      let result = await putGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏角色
  async delGameCharacter(params: any, callback: RpkMethodParams) {
    try {
      let result = await delGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下角色信息列表
  async getGameCharacterAccount(params: any, callback: RpkMethodParams) {
    try {
      let result = await getGameCharacterAccountApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下某个区服下的角色信息列表
  async getGameCharacter(params: any, callback: RpkMethodParams) {
    try {
      let result = await getGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询具体角色信息
  async getGameAccountAreaCharacter(params: any, callback: RpkMethodParams) {
    try {
      let result = await getGameAccountAreaCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  public async exchangeItemProp(params: any, callback: RpkMethodParams) {
    try {
      const result = await itemRedemptionApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }


  // 邮件列表
  async getEmailList(params: any, callback: IMethodParams) {
    try {
      let result = await getEmailListApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 邮件详情
  async getEmailDetail(params: any, callback: IMethodParams) {
    try {
      let result = await getEmailDetailApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 邮件领取
  async receiveEmail(params: any, callback: IMethodParams) {
    try {
      let result = await receiveEmailApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 邮件删除
  async delEmail(params: any, callback: IMethodParams) {
    try {
      let result = await delEmailApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async getShortUrl(params: any, callback: IMethodParams) {
    try {
      let result = await getShortUrlApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async _getInfo(callback: IMethodParams) {
    try {
      let result = await _getInfoApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 获取指定用户信息
  async getUserInfoByField(params: any, callback: IMethodParams) {
    try {
      let result = await getUserInfoByFieldApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 新版通用版本检查 v2
  async updateGameVersion(params: any, callback: IMethodParams) {
    try {
      let result = await updateGameVersionApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  private setCpOf(bool: boolean) {
    SYSTEM_INFO.CP_OF = bool
  }

  private getCpOf() {
    return SYSTEM_INFO.CP_OF || false
  }

  setGameInfo(cp_role_id: string, region_tag: string) {
    SYSTEM_INFO.cp_role_id = cp_role_id
    SYSTEM_INFO.region_tag = region_tag
  }

  async searchGameAccount(callback: IMethodParams) {
    try {
      let result = await searchGameAccountApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async getTempNotice(callback: IMethodParams) {
    try {
      let result = await getTempNoticeApi(SYSTEM_INFO.productId, SYSTEM_INFO.channelId)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async getH5LoginConfig(callback: IMethodParams) {
    try {
      let result = await getH5LoginConfigApi(SYSTEM_INFO.productId, SYSTEM_INFO.channelId)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async tradeQuery(params:any, callback: IMethodParams) {
    try {
      let result = await tradeQueryApi(params.order_no)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  /*private loadImage(src: string) {
    return new Promise((resolve, reject) => {
      const image = bl.createImage()

      image.onload = () => {
        resolve(image)
      }
      image.onerror = (err: any) => {
        reject(err)
      }
      image.src = src
    })
  }

  private async _drawQrcode(canvas: any, qrCodeData: any) {
    return new Promise((resolve: any) => {
      drawQrcode({
        canvas: canvas,
        background: '#ffffff',
        foreground: '#000000',
        text: qrCodeData
      }, bl.getSystemInfoSync().pixelRatio)

      setTimeout(() => {
        resolve()
      }, 300)
    })
  }

  private async getQrcodeImage(qrCodeData: string) {
    const canvas = bl.createCanvas()
    await this._drawQrcode(
      canvas,
      qrCodeData
    )
    return canvas.toTempFilePathSync({
      fileType: 'png'
    })
  }

  public async generateQRCodeImage(params: any, callback: RpkMethodParams) {
    try {
      const canvas = bl.createCanvas()
      const ctx = canvas.getContext('2d')
      const tempQrcodeImagePath = await this.getQrcodeImage(params.qrCodeData)
      const bgImage = await this.loadImage(params.backgroundImage)
      const qrcodeImage = await this.loadImage(tempQrcodeImagePath)

      // @ts-ignore
      let bgImageWidth = bgImage.width
      // @ts-ignore
      let bgImageHeight = bgImage.height
      const ratio = bgImageHeight / bgImageWidth
      // @ts-ignore
      const { screenWidth } = bl.getSystemInfoSync()
      if (bgImageWidth > screenWidth) {
        bgImageWidth = screenWidth
        bgImageHeight = bgImageWidth * ratio
      }
      canvas.width = bgImageWidth
      canvas.height = bgImageHeight
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(qrcodeImage, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100)
      const resultImage = canvas.toTempFilePathSync({
        fileType: 'png'
      })
      callback.complete({
        code: 0,
        data: resultImage
      })
    } catch (err) {
      callback.complete(err)
    }
  }*/
}

export default SdkCommon
