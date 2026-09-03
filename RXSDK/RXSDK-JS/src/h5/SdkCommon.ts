import {
  bindEmail,
  bindPhone,
  changePhone,
  changeEmail,
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
import {
  customGetStorageSync,
  customSetStorageSync,
  getDevicecode,
  handleTrackError,
  removeStorageSync
} from '@/h5/utils'
import v4 from 'uuid/v4'
import { formatDate } from '@/utils/day'

class SdkCommon {
  private platform: any

  constructor(platform: string) {
    this.platform = platform
  }

  private getDeviceCode() {
    return getDevicecode()
  }

  // 用户管理
  public async setcustom(params: { custom: string }, { complete }: H5MethodParams) {
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
  public async addRelation(params: H5addRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(addRelationCheck, { complete }, params)
      let result = await addRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 删除自定义关系
  public async deleteRelation(params: H5deleteRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(deleteRelationCheck, { complete }, params)
      let result = await deleteRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 更新自定关系备注
  public async updateremarks(params: H5updateremarks, { complete }: H5MethodParams) {
    try {
      await pubCheck(updateremarksCheck, { complete }, params)
      let result = await updateremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 判断两用户是否存在某自定关系
  public async hasRelation(params: H5HasRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(hasRelationCheck, { complete }, params)
      let result = await hasrelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取自定关系列表
  public async relationList(params: H5relationlists, { complete }: H5MethodParams) {
    try {
      await pubCheck(relationListCheck, { complete }, params)
      let result = await relationListApi({ type: params.type })
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 添加好友关系
  public async addFriend(params: H5addFriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(addFriendCheck, { complete }, params)
      let result = await addfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 删除好友关系
  public async delfriend(params: H5deleFriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await delfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 更新好友备注
  public async updatefriendremarks(params: H5updatefriendremarks, { complete }: H5MethodParams) {
    try {
      await pubCheck(updatefriendremarksCheck, { complete }, params)
      let result = await updatefriendremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 判断两用户是否为好友
  public async isfriend(params: H5isfriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await isfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取好友关系列表
  public async friends({ complete }: H5MethodParams) {
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
  public async addscore(params: H5addscroe, { complete }: H5MethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await addscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 设置用户分数
  public async setscore(params: H5addscroe, { complete }: H5MethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await setscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 查询用户分数
  public async queryuserrank(params: queryuserrank, { complete }: H5MethodParams) {
    try {
      await pubCheck(queryuserrankCheck, { complete }, params)
      let result = await queryuserrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取排行榜列表
  public async getranklist(params: H5getranklistLimit, { complete }: H5MethodParams) {
    try {
      await pubCheck(getranklimitlistCheck, { complete }, params)
      let result = await getranklistApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取好友排行榜列表
  public async friendsrank(params: H5getranklist, { complete }: H5MethodParams) {
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
  public async getHelpcenterMainLayout({ complete }: H5MethodParams) {
    try {
      const result = await getMainlayoutApi()
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async getHelpcenterQuestionLayout(
    params: H5HelpcenterQuestionReq,
    { complete }: H5MethodParams
  ) {
    try {
      const result = await getListlayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async getHelpcenterInfoLayout(params: H5HelpcenterQuestionReq, { complete }: H5MethodParams) {
    try {
      const result = await getInfolayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async helpcenterResolution(params: HelpcenterResolution, { complete }: H5MethodParams) {
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
  private async addFeedback(params: any, callback?: H5MethodParams) {
    try {
      const res = await createFeedbackApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  private async getFeedbackList(params: any, callback?: H5MethodParams) {
    try {
      const res = await getFeedbackListApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  private async getFeedbackDetail(params: any, callback?: H5MethodParams) {
    try {
      const res = await getFeedbackDetailApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 领取道具
  private async collectProps(params: any, callback?: H5MethodParams) {
    try {
      const res = await collectPropsApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取公告列表
  private async getAnnouncement(limit: number, callback?: H5MethodParams) {
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
  public async sendCaptcha(params: H5sendCaptcha, callback: H5MethodParams) {
    try {
      // await pubCheck(sendCaptchaParamsCheck, callback, params)
      let result = await sendCaptcha(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 绑定手机
  public async bindPhone(params: H5BindPhone, callback: H5MethodParams) {
    try {
      // await pubCheck(bindPhoneParamsCheck, callback, params)
      let result = await bindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 解绑手机
  public async unBindPhone(params: H5unBindPhone, callback: H5MethodParams) {
    try {
      // await pubCheck(unBindPhoneParamsCheck, callback, params)
      let result = await unBindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 绑定邮箱
  public async bindEmail(params: H5BindEmail, callback: H5MethodParams) {
    try {
      // await pubCheck(bindEmailParamsCheck, callback, params)
      let data = await bindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 换绑手机
  public async changePhone(params: any, callback: H5MethodParams) {
    try {
      let result = await changePhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 换绑邮箱
  public async changeEmail(params: any, callback: H5MethodParams) {
    try {
      let result = await changeEmail(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 解绑邮箱
  public async UnbindEmail(params: H5unBindEmail, callback: H5MethodParams) {
    try {
      // await pubCheck(unbindemailParamsCheck, callback, params)
      let data = await UnbindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 注销账号
  async deregister(params: any, callback: H5MethodParams) {
    try {
      let result = await deregister(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 撤销账号注销申请
  async deregisterCancel(callback: H5MethodParams) {
    try {
      let result = await deregisterCancel()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 获得用户信息
  async getInfo(callback: H5MethodParams) {
    try {
      let result = await getInfoApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 获取指定用户信息
  async getUserInfoByField(params: any, callback: H5MethodParams) {
    try {
      let result = await getUserInfoByFieldApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 修改瑞雪通行证用户信息。
  async updateInfo(params: any, callback: H5MethodParams) {
    try {
      let result = await updateInfoApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 游戏大厅版本检查-get
  async checkAppVersion(params: H5CheckAppVersion, callback: H5MethodParams) {
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
  async checkVersion(params: H5CheckVersion, callback: H5MethodParams) {
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
  async checkGameVersion(params: H5CheckGameVersion, callback: H5MethodParams) {
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
  async checkActivityVersion(params: H5CheckActivityVersion, callback: H5MethodParams) {
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

  private calculateValueSizeWithEncoding(key: string) {
    const value = localStorage.getItem(key)
    if (value === null) {
      return 0
    }
    let size = 0
    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i)
      if (charCode <= 127) {
        size++
      } else {
        size += 3
      }
    }
    return size
  }

  public async track(params: any, callback: any) {
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

      if (SYSTEM_INFO.region_tag) {
        new_properties.rx_region_tag = `${SYSTEM_INFO.region_tag}`
      }

      if (SYSTEM_INFO.cp_role_id) {
        new_properties['#role_id'] = `${SYSTEM_INFO.cp_role_id}`
      }

      if (SYSTEM_INFO.third_channel_code) {
        new_properties.third_channel = `${SYSTEM_INFO.third_channel_code}`
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

      const useCache = SYSTEM_INFO.single_player_mode
      const size = this.calculateValueSizeWithEncoding('rx_track_queue')

      console.log('rx_track_queue size:', size)
      if (useCache && size <= 2 * 1024 * 1024) {
        let rx_track_queue = customGetStorageSync('rx_track_queue') || []
        rx_track_queue = rx_track_queue.concat(reqarr)
        customSetStorageSync('rx_track_queue', rx_track_queue)
        p2.complete({ code: 0, data: null, msg: 'track cache' })
        return
      }
      let result = await trackApi(reqarr)
      p2.complete({ ...result, data: null, msg: 'track success' })
    } catch (err) {
      p2.complete(handleError(err))
    }
  }

  public async multipleTrack() {
    try {
      let rx_track_queue = customGetStorageSync('rx_track_queue') || []
      if (rx_track_queue.length) {
        console.log('批量补上报大数据')
        await trackApi(rx_track_queue)
        removeStorageSync('rx_track_queue')
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 获取商业化接口
  public async getOperationScene(callback: H5MethodParams) {
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
  }, callback: H5MethodParams) {
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
  async getGameArea(params: { area_id: string }, callback: H5MethodParams) {
    try {
      let result = await getGameAreaApi(params.area_id)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 游戏区服信息修改
  async putGameArea(params: any, callback: H5MethodParams) {
    try {
      let result = await putGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建游戏区服
  async createGameArea(params: any, callback: H5MethodParams) {
    try {
      let result = await createGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏区服
  async delGameArea(params: any, callback: H5MethodParams) {
    try {
      let result = await delGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询区服列表信息
  async getGameAreaList(callback: H5MethodParams) {
    try {
      let result = await getGameAreaListApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建角色
  async createGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await createGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 修改游戏角色信息
  async putGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await putGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏角色
  async delGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await delGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下角色信息列表
  async getGameCharacterAccount(params: any, callback: H5MethodParams) {
    try {
      let result = await getGameCharacterAccountApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下某个区服下的角色信息列表
  async getGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await getGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询具体角色信息
  async getGameAccountAreaCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await getGameAccountAreaCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  public async exchangeItemProp(params: any, callback: H5MethodParams) {
    try {
      const result = await itemRedemptionApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  public getDevicecode() {
    try {
      const devicecode = customGetStorageSync('rx_devicecode')
      if (devicecode) {
        // @ts-ignore
        return devicecode.code
      } else {
        let code = v4()
        customSetStorageSync('rx_devicecode', { code, openIds: {} })
        return code
      }
    } catch (err) {
      return v4()
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

  public setLanguage(language = 'zh-CN') {
    SYSTEM_INFO.language = language
  }
}

export default SdkCommon
