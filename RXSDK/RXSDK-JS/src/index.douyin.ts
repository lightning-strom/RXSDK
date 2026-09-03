import v4 from 'uuid/v4'
import {
  SYSTEM_INFO,
  USER_INFO
} from '@/config'
import {
  SYSTEM_INFO as SYSTEM_INFO_RPK
} from '@/rpk/config'
import {
  COMMON_ERROR_CODE
} from '@/config/const'
import {
  qs,
  asyncFunc,
  formatTrackParams,
  handleError
} from '@/utils/utils'
import {
  formatDate
} from '@/utils/day'
import {
  isEmpty,
  omit,
  compact,
  isNil,
  pick,
  isArray,
  isObject
} from '@/utils/is'
import {
  pubCheck
} from '@/utils/paramsValid'
import {
  getSearchQueries,
  customSetStorageSync,
  customGetStorageSync,
  removeStorageSync,
  removeStorageByPrefix,
  handleTrackError
} from '@/rpk/utils'
import {
  checkIReqBusinessData,
  checkIReqBusinessOrder,
  shareScheduleInitParams,
  shareScheduleReportParams,
  douyinLoginParamsCheck,
  douyinPayCheckParams,
  douyinServiceCheckParams
} from '@/rpk/checkConfig'
import {
  getPublicProps,
  activated,
  getInitConf,
  getServerTime,
  loginByCredentialApi,
  loginByTokenApi,
  exchangePromoterCodeApi,
  getPromoterCodeApi,
  getBusinessRules,
  businessOrderApi,
  orderApi,
  schedulingInitApi,
  schedulingReportApi,
  getShareDataApi,
  getAdShareDataApi,
  bindGroupApi,
  unBindGroupApi,
  getThirdGoodsTagApi,
  _getInfoApi,
  refreshUserInfo,
  getIpApi,
  getGiftReceiveRewardApi
} from '@/rpk/apis'
import SdkCommon from '@/rpk/SdkCommon'
import { setupStOffsetRefreshForMiniGame } from '@/utils/stOffset'

const PLATFORM = 'douyin'

declare global {
  var tt: any
}

function formatTimestamp(seconds: any) {
  try {
    // 创建一个新的Date对象，注意JavaScript使用毫秒时间戳，所以要乘以1000
    const date = new Date(seconds * 1000)

    // 获取各个时间组件
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const secondsStr = String(date.getSeconds()).padStart(2, '0')

    // 获取时区偏移（分钟），然后转换为小时
    const timezoneOffset = date.getTimezoneOffset()
    const timezoneHours = Math.abs(Math.floor(timezoneOffset / 60))
    const timezoneMinutes = Math.abs(timezoneOffset % 60)
    const timezoneSign = timezoneOffset > 0 ? '-' : '+'
    const timezoneStr = `${timezoneSign}${String(timezoneHours).padStart(2, '0')}${String(timezoneMinutes).padStart(2, '0')}`

    // 构造最终格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${secondsStr} ${timezoneStr} CST`
  } catch (e) {
    return seconds
  }
}

class SdkDouyin extends SdkCommon {
  private _hasAd: { ['rewarded']: boolean | undefined } = {
    rewarded: undefined
  }
  private _rewardedVideoAd: any
  private funcs: string[] = []
  private isPromoter: boolean = false
  // 默认刷新时间 10 分钟
  private businessRuleDefaultRefreshTime = 600000
  // 商业广告规则信息
  private businessRulesInfo: any = {
    // 定时器的编号
    timerId: 0,
    // 时间间隔
    refresh_time: this.businessRuleDefaultRefreshTime,
    // 主窗口配置信息
    main_window_list: [],
    // 窗口配置信息
    window_list: [],
    // 版本-服务端缓存使用
    version: '',
    // 是否命中缓存
    hit_cache: false
  }
  // 商业化接口是否返回结果
  private businessRuleInvoking = false
  // 条件获取商业化窗口队列
  private businessWindowsQueue: any[] = []

  // 上报公共属性接口失败次数
  private trackPublicPropsFailCount = 0

  private initConfig: any = {}
  // 调度埋点
  private scheduleInitMap: any = {}
  // 获取分享数据缓存调度上报参数
  private scheuleReportProps: any = {}
  private deviceInfo: any = null
  // 子渠道id
  public subChannelId: any = null
  // 是否为推广员
  private is_promoter: boolean = false
  private game_id: string = ''
  // 推广员福利码相关信息
  private promoInfo: {
    timer: any
    refresh_period_exp: number
    polling: number
    promo_code: string
  } = {
    timer: null,
    refresh_period_exp: 0,
    polling: 0,
    promo_code: ''
  }

  private saveDeviceInfo() {
    try {
      this.deviceInfo = tt.getSystemInfoSync(false)
    } catch (e) {
      console.log('saveDeviceInfo error', e)
      return
    }
  }

  constructor(initParams: InitRpkParams) {
    super(PLATFORM)
    Object.assign(SYSTEM_INFO, SYSTEM_INFO_RPK, { ...initParams })
    try {
      const { microapp } = tt.getEnvInfoSync()
      if (microapp?.mpVersion) {
        SYSTEM_INFO.miniVersion = microapp?.mpVersion
      }
    } catch (e) {

    }

    this.saveDeviceInfo()

    if (initParams.isMatch) {
      SYSTEM_INFO.SDK_INIT_FINISHED = true
      initParams.complete({
        code: 0
      })
    } else {
      this.getInitConfig({ complete: initParams.complete })
    }
  }

  private needTrackFeedLogin: boolean = false
  private cacheLoginParams: any = {}

  // public onFeedStatusChange(callback: any) {
  //   tt.onFeedStatusChange((res: any) => {
  //     if (res.type === 'feedEnter') {
  //       if (this.needTrackFeedLogin) {
  //         console.info('触发从Feed流进入小游戏事件上报login')
  //         this.trackLogin()
  //       }
  //     }
  //     callback(res)
  //   })
  // }

  public offFeedStatusChange(callback: any) {
    tt.offFeedStatusChange(callback)
  }

  public trackLogin() {
    if (this.needTrackFeedLogin) {
      console.info('触发从Feed流进入小游戏事件上报login')
      getIpApi().catch(e => {
        const ip = e.client_ip
        this.needTrackFeedLogin = false
        let language = 'zh-CN'
        let model = ''
        let platform = ''
        let appId = ''
        try {
          const systemInfoSync = tt.getSystemInfoSync()
          language = systemInfoSync.language
          model = systemInfoSync.model
          platform = systemInfoSync.platform
        } catch (e) {

        }

        try {
          const envInfo = tt.getEnvInfoSync()
          appId = envInfo.microapp?.appId
        } catch (e) {

        }

        const params = {
          event: '#login',
          ip,
          properties: {
            client_distinct_id: this.cacheLoginParams.distinct_id,
            logintime: Date.now(),
            platformid: 4,
            traceid: v4(),
            method: 'douyinh5',
            username: 'douyinh5_' + USER_INFO.tid,
            external_openid: USER_INFO.tid,
            thirdparty_appid: appId,
            cp_userid: USER_INFO.cp_user_id,
            sex: USER_INFO.sex,
            accept_language: language,
            '#rx_sdk_version': SYSTEM_INFO.__RX_SDK_VERSION,
            openid: USER_INFO.openid,
            channelid: SYSTEM_INFO.channelId,
            subchannelid: USER_INFO.subchannelid,
            last_login_time: formatTimestamp(USER_INFO.last_login_time),
            rx_device_model: model,
            rx_os: platform
          }
        }
        this.track(params,
          {
            complete: (data: any) => {
              console.info('share error add complete func when tracked:', data)
            }
          }
        )
      })
    }
  }

  public async login(params: RpkDouyinLogin, callback: RpkMethodParams) {
    try {
      await pubCheck(douyinLoginParamsCheck, callback, params)
      const user_source = this.getLoginQsAndGenerateStruct()
      const source_ad = this.getAttributionData()
      params.method = params.method || 'douyinh5'
      let distinct_idLocal = customGetStorageSync('rx_distinct_id')
      let distinct_id = distinct_idLocal || v4()
      if (!distinct_idLocal) {
        customSetStorageSync('rx_distinct_id', distinct_id)
      }
      const now = new Date().getTime()
      let reqLogin = { ...omit(params, 'force'), ...user_source, distinct_id, ts: now }

      try {
        if (this.subChannelId !== null) {
          const queryJson = getSearchQueries()
          reqLogin.user_source = {
            guide: { ...user_source, subchannelid: this.subChannelId }
          }
          if (queryJson) {
            reqLogin.user_source.guide = { ...reqLogin.user_source.guide, ...queryJson }
          }
        }
      } catch (err) {

      }

      const loginResult: any = await asyncFunc(tt.login, {
        force: params.force
      })

      const { custom_ext, ...rest_ext } = reqLogin.ext || {}
      reqLogin.custom_ext = custom_ext || {}
      reqLogin.ext = {
        ...(rest_ext || {}),
        ...pick(loginResult, ['anonymousCode', 'code'])
      }

      try {
        const launchOptions = tt.getLaunchOptionsSync()
        console.info(launchOptions)
        if (launchOptions.scene?.endsWith('3041') || launchOptions.query.is_preload_test === '3041') {
          this.needTrackFeedLogin = true
          this.cacheLoginParams = reqLogin
          reqLogin.is_preload = true
        }
      } catch (e) {
        console.log(e)
      }

      if (params.login_openid) {
        const loginTokenRx = await loginByTokenApi(this.ActivePrefix(reqLogin))
        Object.assign(USER_INFO, loginTokenRx.data)
        customSetStorageSync('rxToken', loginTokenRx.data.token)
        customSetStorageSync('rx-loginState', 1)
        try {
          if ((loginTokenRx?.data?.user_flag & 1) == 1) {
            this.isPromoter = true
            this.game_id = loginTokenRx?.data?.cp_user_id
          }
        } catch (e) {
        }
        callback.complete(loginTokenRx)
      } else {
        const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
        reqLogin = reflowEnabled ? { ...reqLogin, device: source_ad } : { ...reqLogin }
        console.log('reqLogin', reqLogin)
        let loginRx = await loginByCredentialApi(this.ActivePrefix(reqLogin))
        Object.assign(USER_INFO, loginRx.data)
        customSetStorageSync('rxToken', loginRx.data.token)
        customSetStorageSync('rx-loginState', 1)
        try {
          if ((loginRx?.data?.user_flag & 1) == 1) {
            this.isPromoter = true
            this.game_id = loginRx?.data?.cp_user_id
          }
        } catch (e) {
        }
        callback.complete(loginRx)
      }
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err, COMMON_ERROR_CODE.LOGIN_FAIL))
    }
  }

  // 同步用户信息
  async infoSync(callback: RpkMethodParams) {
    try {
      const loginResult: any = await asyncFunc(tt.login, {
        force: true
      })
      const userInfoResult: any = await asyncFunc(tt.getUserInfo, {})
      let result = await refreshUserInfo({
        ...pick(loginResult, ['anonymousCode', 'code']),
        nickname: userInfoResult?.userInfo?.nickName || '',
        avatar: userInfoResult?.userInfo?.avatarUrl || ''
      })
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  public async pay(params: RpkDouyinPayParam, callback: RpkMethodParams) {
    try {
      await pubCheck(douyinPayCheckParams, callback, params)

      let reqOrder = {
        ...params,
        sub_channel_id: USER_INFO?.subchannelid,
        ext: params.ext || {},
        currency: 'CNY',
        openid: USER_INFO.openid,
        is_debug: params.is_debug || 0,
        env: params.env || 0,
        ...(!isEmpty(this.deviceInfo) ? { device_info: this.deviceInfo } : {})
      }

      if (params.isGift) {
        this.payGift(reqOrder, callback)
        return
      }

      const result = await orderApi(reqOrder)

      //unity 兼容逻辑
      if (params.onlyGetOrder) {
        callback.complete({ code: 0, data: result })
        return
      }
      //检查用户的登录态是否有效
      await asyncFunc(tt.checkSession)
      if (params.platform == 'ios') {
        const pay_data = {
          currencyType: result.data?.ext?.currency_type || (result.data?.ext?.micro ? 'DIAMOND_PROP' : 'DIAMOND'),
          buyQuantity: result.data?.ext?.micro ? (result.data?.price / 10) : result.data?.ext?.mini_game_amount,
          zoneId: params.zoneId || '1',
          customId: result.data?.order_no,
          extraInfo: result.data?.transmit_args
        }
        console.info('ios支付：', pay_data)
        await asyncFunc(tt.openAwemeCustomerService, pay_data)
      } else {
        if (tt.canIUse('requestGamePayment.object.goodType') && result.data?.ext?.micro) {
          const pay_data = {
            goodType: 2,
            mode: 'game',
            orderAmount: result.data?.price,
            env: params.env || 0,
            currencyType: 'CNY',
            platform: 'android',
            zoneId: params.zoneId || '1',
            customId: result.data?.order_no,
            extraInfo: result.data?.transmit_args
          }
          console.info('安卓小额支付：', pay_data)
          await asyncFunc(tt.requestGamePayment, pay_data)
        } else {
          const pay_data = {
            mode: 'game',
            env: params.env || 0,
            currencyType: 'CNY',
            platform: 'android',
            buyQuantity: result.data?.ext?.mini_game_amount,
            zoneId: params.zoneId || '1',
            customId: result.data?.order_no,
            extraInfo: result.data?.transmit_args
          }
          console.info('安卓支付：', pay_data)
          await asyncFunc(tt.requestGamePayment, pay_data)
        }
      }
      callback.complete({ code: 0 })
    } catch (err: any) {
      if (err.errCode == -2 || err.errNo == -2) {
        err.code = COMMON_ERROR_CODE.CANCEL_PAY
        err.thirdcode = -2
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err))
        return
      }
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err, COMMON_ERROR_CODE.PAY_ERROR))
    }
  }

  //分享
  public async share(params: RpkDouyinShareParams, callback: RpkMethodParams) {
    try {
      let shareData = await this.getShareData(params, callback, true)
      let query = qs.stringify({
        type: 'rx',
        user_source: 'share',
        platform: shareData?.data?.platform || '',
        transmits: encodeURIComponent(params?.transmits || ''),
        landing_id: shareData?.data?.content?.landing_id || '',
        trigger_id: shareData?.data?.trigger?.id || '',
        trigger_tag: shareData?.data?.trigger?.tag || '',
        trigger_type: shareData?.data?.trigger?.type || '',
        material_type: shareData?.data?.content?.material_type || '',
        material_id: shareData?.data?.content?.material_id || '',
        strategy_type: shareData?.data?.strategy?.type || '',
        strategy_id: shareData?.data?.strategy?.id || '',
        material_name: shareData?.data?.content?.title || '',  // 素材名称
        trigger_name: shareData?.data?.trigger?.title || '',      // 埋点名称
        strategy_name: shareData?.data?.strategy?.name || '', // 策略名称
        share_time: Math.floor(new Date().getTime() / 1000),
        share_type: 'mini',
        inviter_region: USER_INFO.region || '',
        inviter_openid: USER_INFO.openid || '',
        inviter_productid: SYSTEM_INFO.productId,
        inviter_channelid: SYSTEM_INFO.channelId,
        inviter_subchannelid: USER_INFO?.subchannelid || ''
      })
      query = params.query ? `${query}&${params.query}` : query
      const title = params.title || shareData?.data?.content?.title || shareData?.data?.content?.content || ''
      if (shareData?.data?.content?.material_type === 'video') {
        tt.shareAppMessage({
          ...params,
          channel: 'video',
          title,
          query,
          extra: {
            ...params.extra || {},
            cutTemplateId: params.extra?.cutTemplateId || shareData?.data?.content?.share_id || '',
            video_title: params.extra?.video_title || params.title || title,
            videoTopics: params.extra?.videoTopics || shareData?.data?.content?.video_contents || [],
            hashtag_list: params.extra?.hashtag_list || shareData?.data?.content?.video_contents || []
          },
          success() {
            callback.complete({
              code: 0,
              msg: '分享成功',
              ...shareData
            })
          },
          fail(err: any) {
            handleTrackError(PLATFORM, 'rxlog_error_share', err)
            callback.complete({
              code: -1,
              msg: '分享失败'
            })
          }
        })
      } else if (shareData?.data?.content?.material_type === 'card' || shareData?.data?.content?.material_type === 'words') {
        tt.shareAppMessage({
          ...params,
          extra: params.extra || {},
          templateId: params.templateId || shareData?.data?.content?.share_id || '',
          title,
          query,
          success() {
            callback.complete({
              code: 0,
              msg: '分享成功',
              ...shareData
            })
          },
          fail(err: any) {
            handleTrackError(PLATFORM, 'rxlog_error_share', err)
            callback.complete({
              code: -1,
              msg: '分享失败'
            })
          }
        })
      } else {
        tt.shareAppMessage({
          ...params,
          extra: params.extra || {},
          title,
          query,
          success() {
            callback.complete({
              code: 0,
              msg: '分享成功'
            })
          },
          fail(err: any) {
            handleTrackError(PLATFORM, 'rxlog_error_share', err)
            callback.complete({
              code: -1,
              msg: '分享失败'
            })
          }
        })
      }
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', err))
      this.track(
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'share',
          reqParams: params,
          errorInfo: err,
          loginInfo: USER_INFO
        }),
        {
          complete: (data: any) => {
            console.info('share error add complete func when tracked:', data)
          }
        }
      )
    }
  }

  public async schedulingAction(params: any, callback: RpkMethodParams) {
    try {
      const func = params?.func
      const schedulingRes: any = this.getShareScheduling({ funcs: [func] })
      // 调度数据未初始化完成时取不到类型，兜底走分享
      const scheduling_type = schedulingRes?.data?.[func]?.scheduling_type || 'share'
      console.log('sdk schedulingAction scheduling_type:', func, scheduling_type)
      let shareData = await this.getShareData(params, callback, true)
      console.log('sdk getShareData:', shareData)
      if (scheduling_type === 'ad') {
        const adUnitId = params.adUnitId || shareData?.data?.ad_content?.identify
        this.rewardedVideoAd({
            adUnitId,
            custom_ext: params.custom_ext
          },
          {
            complete:
            // @ts-ignore
              (args: any) => {
                callback.complete({
                  scheduling_type: 'ad',
                  ...(args || {})
                })
              }
          })
      } else if (scheduling_type === 'share') {
        this.share(
          params,
          {
            complete:
            // @ts-ignore
              (args: any) => {
                callback.complete({
                  scheduling_type: 'share',
                  ...(args || {})
                })
              }
          })
      }
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', err))
    }
  }

  //获得分享内容
  public async getAdShareData(
    params: RpkgetShareData,
    callback?: RpkMethodParams
  ) {
    try {
      const region = params?.region || USER_INFO.region || ''
      const { productId, channelId } = SYSTEM_INFO
      const platform = PLATFORM
      const transmits = encodeURI(params.transmits || '')
      const func = params.func
      const type = 'mini'
      const sub_channel_id = USER_INFO.subchannelid || ''
      const open_id = USER_INFO.openid
      const shareData = await getAdShareDataApi({
        func,
        transmits,
        product_id: productId,
        channel_id: channelId,
        platform,
        type,
        region,
        sub_channel_id,
        open_id,
        custom_ext: params.custom_ext
      })
      callback && callback.complete(shareData)
      return shareData
    } catch (err: any) {
      callback && callback.complete(handleTrackError(PLATFORM, '', err))
      return err
    }
  }

  //激励广告
  public async rewardedVideoAd(data: RpkDouyinRewardedAdParams, {
    complete,
    fail: failCallback
  }: RpkMethodParams) {
    let adShareData: any = {}
    if (!data.adUnitId && data.func) {
      adShareData = await this.getAdShareData({
        func: data.func,
        custom_ext: data.custom_ext || {}
      })
      console.log('ad share data', adShareData)
    }
    const adUnitId = data.adUnitId || adShareData?.data?.ad_content?.identify
    const fail = (error: any) => {
      error.message = error.message || error.errMsg || error.errorMsg || error.err_msg || error.error_msg || error.msg || error.error
      const _error = handleTrackError(PLATFORM, 'rxlog_error_ad', error)
      complete(_error)
      failCallback && failCallback(_error)
      this.track(
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'rewardedVideoAd',
          reqParams: data,
          errorInfo: error,
          loginInfo: USER_INFO
        }),
        {
          complete: (data: any) => {
            console.info('rewardedVideoAd error add complete func when tracked:', data)
          }
        }
      )
    }
    try {
      let ad: any
      const onClose: any = async ({ isEnded }: { isEnded: boolean }) => {
        ad.offClose(onClose)
        if (data.destroyAd) {
          ad.destroy().then(() => {
            this._rewardedVideoAd = null
            if (isEnded) {
              complete({
                code: 0,
                data: null,
                msg: isEnded,
                isEnded
              })
            } else {
              complete({
                code: -1,
                data: null,
                msg: isEnded,
                isEnded
              })
            }
          }).catch((err: any) => {
            complete(handleTrackError(PLATFORM, 'rxlog_error_ad', err))
          })
        } else {
          if (isEnded) {
            complete({
              code: 0,
              data: null,
              msg: isEnded,
              isEnded
            })
          } else {
            complete({
              code: -1,
              data: null,
              msg: isEnded,
              isEnded
            })
          }
        }
      }
      if (!this._rewardedVideoAd) {
        ad = tt.createRewardedVideoAd({
          adUnitId
        })
        await new Promise<void>((resolve, reject) => {
          let timer: NodeJS.Timeout | null = setTimeout(() => {
            reject({ code: 1000000, msg: 'adLoadTimeout' })
            clearTimeout(timer as NodeJS.Timeout)
            timer = null
          }, 10000)
          ad.onLoad(() => {
            this._rewardedVideoAd = ad
            this._hasAd.rewarded = true
            resolve()
          })
          ad.onError((error: any) => {
            this._hasAd.rewarded = false
            reject(error)
          })
          ad.load()
        })
      }
      ad = this._rewardedVideoAd as WechatMinigame.RewardedVideoAd
      if (data.isCheck) {
        complete({
          code: 0,
          ...data,
          adUnitId,
          isEnded: false,
          ad
        })
      } else {
        ad.onClose(onClose)
        let catchLoadAndShowError = async (error: any) => {
          fail(error)
        }
        if (!this._hasAd.rewarded) {
          ad.load()
            .then(() => {
              ad.show().catch(() => {
                ad.load()
                  .then(() => ad.show())
                  .catch(catchLoadAndShowError)
              })
            })
            .catch(catchLoadAndShowError)
          return
        }
        if (!data.isCheck) {
          ad.show().catch(() => {
            ad.load()
              .then(() => ad.show())
              .catch(catchLoadAndShowError)
          })
        }
      }
    } catch (error) {
      fail(error)
    }
  }

  //创建os接口
  public async openCustomServiceForOs(params: RpkDouyinOpenCustomServiceParams, callback: RpkMethodParams) {
    try {
      await asyncFunc(tt.openAwemeCustomerService, params)
      callback.complete({
        code: 0
      })
    } catch (err: any) {
      handleTrackError(PLATFORM, '', err)
      callback.complete({
        code: -1
      })
    }
  }

  //创建客服按钮
  public async createContactButton(params: RpkDouyinCustomType, callback: RpkMethodParams) {
    try {
      await pubCheck(douyinServiceCheckParams, callback, params)
      const btn = tt.createContactButton(params)
      callback.complete(btn)
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, '', err))
    }
  }

  //跳转客服
  public async openCustomService(params: RpkDouyinOpenCustomServiceParams, callback: RpkMethodParams) {
    if(params.type === 3) {
      tt.openCustomerServiceConversation({
        ...params,
        success(res: any) {
          callback.complete({
            code: 0
          })
        },
        fail(err: any) {
          callback.complete(handleTrackError(PLATFORM, '', err, -1))
        }
      })
      return
    }
    try {
      let { sessionFrom = '{}', ..._params } = params
      let infoResult: any = {}

      try {
        infoResult = await _getInfoApi()
      } catch (e) {
        console.log(e)
      }

      console.log('sessionFrom', sessionFrom)

      if (typeof infoResult?.data?.r_mode === 'number') {
        if (typeof sessionFrom === 'object') {
          sessionFrom = {
            // @ts-ignore
            ...sessionFrom,
            r_mode: infoResult?.data.r_mode
          }
        } else {
          try {
            sessionFrom = {
              ...JSON.parse(sessionFrom),
              r_mode: infoResult?.data.r_mode
            }
            sessionFrom = JSON.stringify(sessionFrom)
          } catch (e) {
            console.log('e', e)
          }
        }
      }

      if (sessionFrom) {
        // @ts-ignore
        _params.sessionFrom = sessionFrom
      }
      console.log(_params)
      await asyncFunc(tt.openCustomerServiceConversation, _params)
      callback.complete({
        code: 0
      })
    } catch (err: any) {
      callback.complete(handleTrackError(PLATFORM, '', err, -1))
    }
  }

  //拉起实名认证
  public async authenticateRealName({ complete }: RpkMethodParams) {
    try {
      await asyncFunc(tt.authenticateRealName)
      complete({ code: 0 })
    } catch (err: any) {
      handleTrackError(PLATFORM, '', err)
      complete({ code: -1, data: err })
    }
  }

  //录制屏幕
  public async getGameRecorderManager({ complete }: RpkMethodParams) {
    const GameRecorderManager = tt.getGameRecorderManager()
    complete({ code: 0, data: GameRecorderManager })
  }

  setScheuleReportProps(data: any) {
    this.scheuleReportProps = {
      trigger_tag: data?.trigger?.tag || '',
      trigger_id: data?.trigger?.id || 0,
      trigger_type: data?.trigger?.type || 0,
      material_type: data?.content?.material_type || '',
      material_id: data?.content?.material_id || 0,
      landing_id: data?.content?.landing_id || 0,
      strategy_id: data?.strategy?.id || 0,
      strategy_type: data?.strategy?.type || 0,
      platform: data?.platform || PLATFORM
    }
  }

  // 获得公共属性
  public getPublicProperties() {
    let data = customGetStorageSync(`rx_public_props`)

    return { code: 0, data }
  }

  /**
   * 设置公共属性
   * 设置后CP无需每次上报都传，由SDK填入properties中。
   */
  public setPublicProperties(params: { [key: string]: any }) {
    if (!isObject(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR

      return handleTrackError(PLATFORM, '', error)
    }

    try {
      customSetStorageSync('rx_public_props', params)
      return { code: 0 }
    } catch (error) {
      return handleTrackError(PLATFORM, '', error)
    }
  }

  /**
   * 修改设置的公共数据。
   */
  public updatePublicProperties(params: { [key: string]: any }) {
    if (!isObject(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR

      return handleTrackError(PLATFORM, '', error)
    }

    try {
      const cache = customGetStorageSync('rx_public_props')
      // @ts-ignore
      customSetStorageSync('rx_public_props', { ...cache, ...params })
      return { code: 0 }
    } catch (error) {
      return handleTrackError(PLATFORM, '', error)
    }
  }

  /**
   * 删除公共属性
   */
  public deletePublicProperties(params: string[]) {
    try {
      const cache = customGetStorageSync('rx_public_props')
      // @ts-ignore
      const rest = omit(cache, params)
      customSetStorageSync('rx_public_props', rest)
      return { code: 0 }
    } catch (error) {
      return handleTrackError(PLATFORM, '', error)
    }
  }

  //获得分享内容
  public async getShareData(
    params: RpkgetShareData,
    callback: RpkMethodParams,
    stopCallback?: boolean
  ) {
    try {
      // await pubCheck(ShareCheckParams, callback, params)
      const region = params?.region || USER_INFO.region || ''
      const cacheShareData = customGetStorageSync(`rx_schedule_${USER_INFO.tid}_${params.func}_${region}`)
      const { readCache = true } = params
      if (readCache && cacheShareData) {
        const cShareData: any = JSON.parse(cacheShareData)
        console.info('sdk 缓存分享数据：', cShareData)
        this.setScheuleReportProps(cShareData?.data)
        !stopCallback && callback.complete(cShareData)
        return cShareData
      }

      const { productId, channelId } = SYSTEM_INFO
      const platform = PLATFORM
      const transmits = encodeURI(params.transmits || '')
      const func = params.func
      const type = 'mini'
      const sub_channel_id = USER_INFO.subchannelid || ''
      const open_id = USER_INFO.openid
      const shareData = await getShareDataApi({
        func,
        transmits,
        product_id: productId,
        channel_id: channelId,
        platform,
        type,
        region,
        sub_channel_id,
        open_id,
        custom_ext: params.custom_ext || {}
      })
      if (!stopCallback) {
        callback.complete(shareData)
      }
      this.setScheuleReportProps(shareData?.data)
      return shareData
    } catch (err: any) {
      if (err.code == 305407) {
        await this.shareSchedulingInit({}, {
          complete: () => {
            if (!stopCallback) {
              callback.complete(handleTrackError(PLATFORM, '', err))
            }
          }
        })
      } else {
        if (!stopCallback) {
          callback.complete(handleTrackError(PLATFORM, '', err))
        }
      }
      this.track(
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'getShareData',
          reqParams: params,
          errorInfo: err,
          loginInfo: USER_INFO
        }),
        {
          complete: (data: any) => {
            console.info('getShareData error add complete func when tracked:', data)
          }
        }
      )
      return handleTrackError(PLATFORM, '', err)
    }
  }

  // 获取埋点调度
  public getShareScheduling(params: { funcs?: string[] }) {
    const funcs = params?.funcs
    if (!funcs) return { code: 0, data: this.scheduleInitMap }
    if (funcs && !isArray(funcs)) {
      const error: any = new Error('funcs must be Array')
      error.code = COMMON_ERROR_CODE.PARAMS_ERROR
      return handleTrackError(PLATFORM, '', error)
    }
    try {
      console.log('sdk getShareScheduling: ', params, this.scheduleInitMap)
      const data = pick(this.scheduleInitMap, funcs)
      return { code: 0, data }
    } catch (error) {
      return handleTrackError(PLATFORM, '', error)
    }
  }

  // 分享调度初始化
  public async shareSchedulingInit(params: RpkReqShareScheduleInit, callback: RpkMethodParams) {
    try {
      await pubCheck(shareScheduleInitParams, callback, params)
      this.funcs = params?.funcs || []
      const req = {
        func: this.funcs,
        type: 'mini',
        open_id: USER_INFO.openid || ''
      }
      let res = await schedulingInitApi(req)
      this.scheduleInitMap = res?.data || {}
      removeStorageByPrefix('rx_schedule')
      callback.complete(res)
    } catch (error) {

    }
  }

  // 看广告完成上报
  public async shareSchedulingReport(params: RpkReqShareScheduleReport, callback: RpkMethodParams) {
    try {
      await pubCheck(shareScheduleReportParams, callback, params)
      const func = params.func
      const region = params?.region || USER_INFO.region || ''
      const sub_channel_id = USER_INFO.subchannelid || ''
      const open_id = USER_INFO.openid || ''
      const scheduling_event = params?.scheduling_event === true ? 'done' : 'fail'
      const Iparams = {
        platform: PLATFORM,
        type: 'mini',
        sub_channel_id,
        open_id,
        ...params,
        region,
        scheduling_event,
        properties: {
          region,
          ...params?.properties
        }
      }
      // ad不上报上一次的分享数据
      if (params.scheduling_type == 'share') {
        Iparams.properties = { ...this.scheuleReportProps, ...Iparams.properties }
      }

      let result = await schedulingReportApi(Iparams)
      if (isEmpty(result?.data)) {
        console.log('上报返回为空，对应埋点删除')
        this.scheduleInitMap = omit(this.scheduleInitMap, func)
        removeStorageSync(`rx_schedule_${USER_INFO.tid}_${func}_${region}`)
        await this.shareSchedulingInit({}, {
          complete: () => {
            console.log('shareSchedulingInit')
            callback.complete(result)
          }
        })
        return
      } else {
        const remaining_share_count = result?.data?.scheduling?.remaining_share_count || 0
        console.log('上报后剩余次数为' + remaining_share_count)
        if (remaining_share_count <= 0) {
          await this.shareSchedulingInit({}, {
            complete: () => {
              console.log('shareSchedulingInit')
              callback.complete(result)
            }
          })
          return
        }
        this.scheduleInitMap[func] = result?.data?.scheduling
        customSetStorageSync(`rx_schedule_${USER_INFO.tid}_${func}_${region}`, JSON.stringify(result))
      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  private async getInitConfig(callback: RpkMethodParams) {
    const initParams = customGetStorageSync('rx-init-params') || {}
    try {
      const res = await getInitConf({ version: initParams?.version ?? {} })
      const config = res.data || {}
      const version: any = {}
      for (const key of Object.keys(config)) {
        const prop_version = config[key]?.version ?? ''
        if (prop_version) {
          version[key] = prop_version
          this.initConfig[key] = { timerId: 0 }
        }
        this.initConfig[key] = config[key]
      }

      //检查是否需要传递subchannleid
      this.publicSubchannelCheck(res)
      customSetStorageSync('rx-init-params', { version })
      SYSTEM_INFO.SDK_INIT_FINISHED = true
      SYSTEM_INFO.CP_OF = res?.data?.cp?.of || false
      const _serverTime = res?.data?.server?.time
      if (_serverTime) {
        SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now())
      }

      // 初始化成功后监听应用进入前台，刷新 st_offset
      setupStOffsetRefreshForMiniGame(typeof tt !== 'undefined' ? tt : null, getServerTime)
      this.saveDeviceInfo()

      // 检查是否需要激活
      this.checkNeedActivate()
      // this.loopGetPublicProps()

      callback.complete({ code: 0, data: this.initConfig })
    } catch (err: any) {
      const error: any = {
        ...(err || {}),
        msg: '初始化错误，或未初始化',
        code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
        thirdcode: err.code || err.errCode,
        message: err.message || err.msg || err.errMsg,
        thirdmsg: err.message || err.msg || err.errMsg
      }
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_init', error))
    }
  }

  private publicSubchannelCheck(res: any) {
    try {
      const sub_channel = res?.data?.subcq?.subc
      const queryString = getSearchQueries(true)
      let query: any = queryString ? queryString.split('&') : []
      if (sub_channel?.length && query?.length) {
        for (let a = 0; a < sub_channel.length; a++) {
          let item = sub_channel[a]
          let reflectStringArr = item?.map
          if (reflectStringArr?.length) {
            let arr = item?.map
            let sub_channel_id = item?.id
            for (let k in arr) {
              let str = arr[k]
              for (let c in query) {
                if (str.includes(query[c])) {
                  this.subChannelId = sub_channel_id
                  return
                }
              }
            }
          }
        }

      }
    } catch (err) {

    }
  }

  // 获取归因数据
  private getAttributionData() {
    const universal: any = getSearchQueries()
    if (universal?.ad_platform) {
      const source_ad: any = {}
      source_ad.ad_rawargs = omit(universal, ['ad_platform'])
      source_ad.ad_platform = universal.ad_platform
      return source_ad
    } else {
      return {
        ad_rawargs: universal
      }
    }
  }

  private async checkNeedActivate() {
    const activeResult = customGetStorageSync('rx-active-result')
    if (!activeResult) {
      const source_ad: any = this.getAttributionData()
      const distinct_id = v4()
      customSetStorageSync('rx_distinct_id', distinct_id)
      const req: any = {
        stage: 'init',
        distinct_id,
        source_ad
      }
      try {
        const result = await activated(req)
        customSetStorageSync('rx-active-result', { isSuccess: true, activeResult: result.data })
      } catch (err) {
        customSetStorageSync('rx-active-result', { isSuccess: false, activeResult: req })
      }
    }
  }

  /**
   * 轮训获取公共属性
   *
   */
  private async loopGetPublicProps() {
    let event_public_attr = this.initConfig?.event_public_attr
    if (isEmpty(event_public_attr)) return

    const repeat = (ms: number) => {
      event_public_attr.timerId && clearTimeout(event_public_attr.timerId)
      event_public_attr.timerId = setTimeout(() => getPublicPropsConfig(), ms || this.businessRuleDefaultRefreshTime)
    }

    const getPublicPropsConfig = async () => {
      try {
        const res = await getPublicProps(event_public_attr.version)
        const {
          refresh = this.businessRuleDefaultRefreshTime,
          public_attr,
          version = ''
        } = res?.data || {}

        event_public_attr.public_attr = public_attr || event_public_attr.public_attr
        event_public_attr.refresh = refresh
        event_public_attr.version = version

        const initParams = customGetStorageSync('rx-init-params')
        // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
        customSetStorageSync('rx-init-params', {
          ...initParams,
          version: { ...initParams.version, event_public_attr: version }
        })

        repeat(event_public_attr.refresh)
      } catch (error) {
        handleTrackError(PLATFORM, '', error)
        if (this.trackPublicPropsFailCount < 1) {
          // 首次获取失败3秒后重试
          this.trackPublicPropsFailCount += 1
          repeat(3000)
        } else {
          // 再失败每十分钟后重试，直至成功
          this.trackPublicPropsFailCount += 1
          repeat(600000)
        }
      }
    }

    repeat((event_public_attr as any)?.refresh)
  }

  //格式化queryString
  private getLoginQsAndGenerateStruct() {
    const universal: any = getSearchQueries()
    let user_source: any = {}
    if (universal.hasOwnProperty('user_source')) {
      const omitKeys = universal?.user_source === 'transmits' ? ['user_source'] : ['user_source', 'type', 'transmits']
      const leftProps = {
        ...omit(universal, omitKeys)
      }
      /**
       * url 上有user_source字段并且除了'user_source', 'type', 'transmits'等字段外还有属性，则将剩余属性全部放到universal['user_source']属性下
       * 多包了一层'user_source',使用的地方直接 ...
       */
      if (!isEmpty(leftProps)) {
        // 用户透传参数
        if (universal?.user_source == 'transmits') {
          user_source = {
            user_transmits: Object.assign(leftProps, { transmits: decodeURIComponent((leftProps as any).transmits || '') })
          }
        } else if (universal?.user_source == 'attr') {
          user_source = {
            user_attrs: leftProps
          }
        } else {
          user_source = {
            user_source: {
              [universal['user_source']]: leftProps
            }
          }
        }
        return user_source
      }
    }
    const subPackageInfo: any = customGetStorageSync('rx_sub_package_info')
    if (!isEmpty(subPackageInfo)) {
      user_source = {
        user_source: {
          sub_package: subPackageInfo
        }
      }
      return user_source
    }
    return null
  }

  private ActivePrefix(reqParams: any) {
    const loginState = customGetStorageSync('rx-loginState')
    const activeSave = customGetStorageSync('rx-active-result')
    if (loginState || !activeSave) {
      return reqParams
    } else {
      if (activeSave?.isSuccess) {
        return { ...reqParams, activate: { result: activeSave?.activeResult } }
      } else {
        return { ...reqParams, activate: { args: activeSave?.activeResult } }
      }
    }
  }

  /**
   * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
   */
  private setSubChannelId(subChannelId: string) {
    try {
      customSetStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId })
      return { code: 0 }
    } catch (error) {
      return handleTrackError(PLATFORM, '', error)
    }
  }

  //商业广告
  public async getAllBusinessData(callback: RpkMethodParams) {
    try {
      const data = omit(this.businessRulesInfo, 'timerId')
      let result = { code: 0, data }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  // 条件获取商业化窗口数据
  public async getBusinessData(params: RpkReqBusinessData, callback: RpkMethodParams) {
    // 如果登录接口内部调用的商业化接口没有返回结果，将此接口按调用次序缓存起来，接口结果回来后一次返回
    // cp 主动调用更新商业化接口不管，需要他们自己在接口返回后条件获取商业化窗口数据
    if (this.businessRuleInvoking) {
      this.businessWindowsQueue.push(() => this.getBusinessData(params, callback))
      return
    }
    const checkCache = () => {
      const currentDate = formatDate('YYYY-MM-DD') //dayjs().format('YYYY-MM-DD')
      const cacheKeyPrefix = 'rx_business_popup_'
      const cacheKey = `${cacheKeyPrefix}${currentDate}`
      let cache = customGetStorageSync(cacheKey)
      if (!cache) {
        cache = {}
        customSetStorageSync(cacheKey, {})
      }

      // 删除当天之前的商业化窗口缓存
      removeStorageByPrefix(
        cacheKeyPrefix,
        (key: string) => key.startsWith(cacheKeyPrefix) && !key.endsWith(currentDate)
      )
      console.info('sdk business window cacheKey: ', cacheKey, ' cache: ', cache)
      return { cache, cacheKey }
    }

    try {
      await pubCheck(checkIReqBusinessData, callback, params)
      const { window_key, event, before_event = '' } = params

      const { cache, cacheKey } = checkCache()
      // 匹配主窗口，只会匹配到第一个
      const [{ auto_popups = {}, manual_popups = {} } = {}] =
        this.businessRulesInfo.main_window_list?.filter(
          (window: any) => window.window_key === window_key
        )

      let matchWindows: any = []
      // 匹配自动窗口, 匹配到自动窗口，忽略前置事件
      matchWindows = auto_popups?.[event] || []

      // 匹配手动窗口
      if (!matchWindows?.length) {
        matchWindows = manual_popups?.[event]?.[before_event] || []
      }
      console.info('sdk matchWindows: ', matchWindows)

      const windows = compact(
        matchWindows.map((matWindow: any) => {
          const windowInfo = this.businessRulesInfo.window_list?.find(
            (window: any) => window.window_key === matWindow.window_key
          )
          if (windowInfo) {
            if (!isNil(matWindow?.day_limit)) {
              const key = `${window_key}_${event}_${matWindow.window_key}`
              const count = cache[key] || 0
              if (matWindow?.day_limit === count) return
              cache[key] = count + 1
              customSetStorageSync(cacheKey, cache)
            }
            return windowInfo
          }
        })
      )

      console.log('result windows: ', windows)

      const result = { code: 0, data: windows }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  // 更新商业化窗口数据
  public async refreshBusinessData(callback?: RpkMethodParams, isRecord?: boolean) {
    isRecord && (this.businessRuleInvoking = true)
    try {
      const res = await getBusinessRules(this.businessRulesInfo.version)
      const data = res?.data || {}
      const { hit_cache, version = '', refresh_time = this.businessRuleDefaultRefreshTime } = data
      let { main_window_list = [], window_list = [] } = data
      if (!hit_cache) {
        this.businessRulesInfo.main_window_list = main_window_list
        this.businessRulesInfo.window_list = window_list
      }
      this.businessRulesInfo.refresh_time = refresh_time
      this.businessRulesInfo.version = version
      this.businessRulesInfo.hit_cache = hit_cache
      callback?.complete && callback.complete({ code: 0 })
    } catch (error) {
      callback?.complete && callback.complete(handleTrackError(PLATFORM, '', error))
    } finally {
      isRecord && this.dispatchBusinessWindowsQueue()
    }
  }

  private async dispatchBusinessWindowsQueue() {
    // console.info('sdk 触发商业化窗口队列释放')
    this.businessRuleInvoking = false
    const execute = () => {
      while (this.businessWindowsQueue.length) {
        const queueGetBusinessData = this.businessWindowsQueue.shift()
        queueGetBusinessData()
      }
    }
    await Promise.resolve(execute())
  }


  // 商业化下单
  public async requestBusinessOrder(params: RpkReqBusinessOrder, callback: RpkMethodParams) {
    try {
      await pubCheck(checkIReqBusinessOrder, callback, params)
      const result = await businessOrderApi(params)
      callback.complete(result)
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, '', err))
    }
  }

  private clearPromoterTimer() {
    console.log('clearPromoterTimer')
    if (this.promoInfo.timer) {
      clearTimeout(this.promoInfo.timer)
      this.promoInfo.timer = null
    }
  }

  // 启动定时器
  private startPromoterTimer(callback?: RpkMethodParams, autoRefresh = true) {
    const delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000)
    console.log('startPromoterTimer', delay)
    this.promoInfo.timer = setTimeout(() => {
      this.getPromoDisplayKEY(callback, autoRefresh, false)
    }, delay)
  }

  // 获取福利码
  private getPromoDisplayKEY(callback?: RpkMethodParams, autoRefresh = false, immediately = true) {
    this.clearPromoterTimer()
    let promo_code = this.promoInfo.promo_code
    getPromoterCodeApi(this.game_id).then(res => {
      try {
        if (res.code == 0) {
          this.promoInfo.refresh_period_exp = res.data.refresh_period_exp || 0
          this.promoInfo.polling = res.data.polling || 0
          promo_code = res.data.promo_code
        }
      } catch (e: any) {
        this.promoInfo.refresh_period_exp = 0
        this.promoInfo.polling = 0
      }
      if (autoRefresh) {
        this.startPromoterTimer(callback, autoRefresh)
      }
      if (!immediately && promo_code == this.promoInfo.promo_code) {
        return
      } else {
        this.promoInfo.promo_code = promo_code
      }
      callback && callback.complete(res)
    }).catch((err: any) => {
      if (err.isServerError) {
        this.clearPromoterTimer()
        callback && callback.complete(handleTrackError(PLATFORM, '', err))
      } else {
        if (autoRefresh) {
          this.startPromoterTimer(callback, autoRefresh)
        } else {
          callback && callback.complete(handleTrackError(PLATFORM, '', err))
        }
      }
    })
  }

  // 兑换福利码
  private exchangePromoCDKEY(cdkey: string, callback: RpkMethodParams) {
    exchangePromoterCodeApi(cdkey).then(res => {
      callback.complete(res)
    }).catch((err) => {
      callback.complete(handleTrackError(PLATFORM, '', err))
    })
  }

  private checkIsPromoter(): boolean {
    return this.isPromoter
  }

  // 选择视频
  private async chooseVideo(callback: RpkMethodParams) {
    tt.chooseVideo({
      success: (res: any) => {
        callback?.complete && callback.complete({ code: 0, data: res })
      },
      fail: async (err: any) => {
        if (err.errMsg == 'chooseVideo:fail cancel') {
          callback?.complete && callback.complete({ code: -1, msg: '取消' })
          return
        }
        const { authSetting } = await asyncFunc(tt.getSetting)
        console.log(authSetting)
        // 拒绝过授权 重新去授权
        const res = await asyncFunc(tt.showModal, {
          title: `申请使用您的${[authSetting['scope.album'] ? '' : '相册', authSetting['scope.camera'] ? '' : '摄像头'].filter(value => !!value).join('、')}`,
          cancelText: '拒绝',
          confirmText: '允许'
        })
        if (res.cancel) {
          callback?.complete && callback.complete({ code: -1, msg: '您已拒绝授权' })
        } else if (res.confirm) {
          const openSetting = await asyncFunc(tt.openSetting)
          console.log('openSetting', openSetting)
          if (openSetting.authSetting['scope.album'] === false) {
            callback?.complete && callback.complete({ code: -1, msg: '未授权相册' })
            return false
          }
          if (openSetting.authSetting['scope.camera'] === false) {
            callback?.complete && callback.complete({ code: -1, msg: '未授权摄像头' })
            return false
          }
          this.chooseVideo(callback)
        }
      }
    })
  }

  // 跳转个人抖音号主页
  private openAwemeUserProfile(callback: RpkMethodParams) {
    tt.openAwemeUserProfile({
      success: (res: any) => {
        callback && callback.complete({
          code: 0,
          msg: res.errMsg,
          hasFollowed: res.hasFollowed
        })
      },
      fail: (err: any) => {
        console.log(err)
        let msg = ''
        if (err.errMsg?.includes('fail aweme uid is null')) {
          msg = '未绑定抖音号'
        } else if (err.errMsg?.includes('fail feature is not supported in app')) {
          msg = '宿主不支持'
        } else if (err.errMsg?.includes('fail not login')) {
          msg = '玩家没有登录'
        }
        callback && callback.complete(handleTrackError(PLATFORM, '', {
          ...err,
          thirdmsg: err.errMsg,
          errMsg: msg || err.errMsg
        }))
      }
    })
  }

  // 查看抖音号是否关注
  private checkFollowAwemeState(callback: RpkMethodParams) {
    tt.checkFollowAwemeState({
      success: (res: any) => {
        callback && callback.complete({
          code: 0,
          msg: res.errMsg,
          hasFollowed: res.hasFollowed
        })
      },
      fail: (err: any) => {
        let msg = ''
        if (err.errMsg?.includes('fail aweme uid is null')) {
          msg = '未绑定抖音号'
        } else if (err.errMsg?.includes('fail feature is not supported in app')) {
          msg = '宿主不支持'
        } else if (err.errMsg?.includes('fail not login')) {
          msg = '玩家没有登录'
        }
        callback && callback.complete(handleTrackError(PLATFORM, '', {
          ...err,
          thirdmsg: err.errMsg,
          errMsg: msg || err.errMsg
        }))
      }
    })
  }

  // 设置写入用户的排行榜数据
  private setImRankData(params: RpkDouyinImRankData, callback: RpkMethodParams) {
    tt.setImRankData({
      ...params,
      success: () => {
        callback && callback.complete({
          code: 0
        })
      },
      fail: (err: any) => {
        callback && callback.complete(handleTrackError(PLATFORM, '', err))
      }
    })
  }

  // 获取排序好的「好友/总榜」数据源
  private getImRankData(params: RpkDouyinGetImRankData, callback: RpkMethodParams) {
    tt.getImRankData({
      ...params,
      success: (res: any) => {
        callback && callback.complete({
          code: 0,
          data: res
        })
      },
      fail: (err: any) => {
        callback && callback.complete(handleTrackError(PLATFORM, '', err))
      }
    })
  }

  // 获取排行榜列表
  private getImRankList(params: RpkDouyinImRankList, callback: RpkMethodParams) {
    tt.getImRankList({
      ...params,
      success: (res: any) => {
        callback && callback.complete({
          code: 0,
          data: res
        })
      },
      fail: (err: any) => {
        callback && callback.complete(handleTrackError(PLATFORM, '', err))
      }
    })
  }

  // 创建游戏推荐组件实例
  private createGridGamePanel(params: RpkDouyinGridGamePanel, callback: RpkMethodParams) {
    try {
      const GridGamePanel = tt.createGridGamePanel(params)
      callback && callback.complete({
        code: 0,
        data: GridGamePanel
      })
    } catch (err: any) {
      callback && callback.complete(handleTrackError(PLATFORM, '', err))
    }
  }

  // 调起客户端订阅消息界面
  private requestSubscribeMessage(params: { tmplIds: string[] }, callback: RpkMethodParams) {
    console.log('tmplIds', params.tmplIds)
    tt.requestSubscribeMessage({
      tmplIds: params.tmplIds,
      success: (res: any) => {
        const { errMsg, ...template_map } = res
        callback && callback.complete({
          code: 0,
          msg: errMsg,
          data: template_map
        })
      },
      fail(err: any) {
        callback && callback.complete({
          msg: err.errMsg?.includes('template not exist or invalid') ? '模版消息不存在或不合法' : err.errMsg,
          code: err.errCode === 3001 ? 30010 : (err.errCode || err.errNo),
          thirdcode: (err.errCode || err.errNo),
          thirdmsg: err.errMsg
        })
      }
    })
  }

  // 查询指定公会是否绑定公开群
  private getUnionGroupInfo(params: { unionId: string }, callback: RpkMethodParams) {
    console.log('unionId', params.unionId)
    tt.getUnionGroupInfo({
      unionId: params.unionId,
      success: (res: any) => {
        callback && callback.complete({
          code: 0,
          bindStatus: res.bindStatus,
          msg: res.errMsg
        })
      },
      fail(err: any) {
        callback && callback.complete(handleTrackError(PLATFORM, '', err, 8000))
      }
    })
  }

  // 给指定公会绑定公开群
  private bindUnionGroup(params: { unionId: string }, callback: RpkMethodParams) {
    console.log('unionId', params.unionId)
    tt.bindUnionGroup({
      unionId: params.unionId,
      success: () => {
        this.getUnionGroupInfo({
          unionId: params.unionId
        }, {
          complete: async (res) => {
            callback && callback.complete(res)
            if (res.bindStatus) {
              try {
                await bindGroupApi({
                  rx_openid: USER_INFO.openid,
                  unionid: params.unionId,
                  is_leader: 1
                })
              } catch (err: any) {
                console.log('err', err)
              }
            }
          }
        })
      },
      fail(err: any) {
        callback && callback.complete(handleTrackError(PLATFORM, '', err, 8000))
      }
    })
  }

  // 解除指定公会和公开群的绑定关系
  private unbindUnionGroup(params: { unionId: string }, callback: RpkMethodParams) {
    console.log('unionId', params.unionId)
    tt.unbindUnionGroup({
      unionId: params.unionId,
      success: () => {
        this.getUnionGroupInfo({
          unionId: params.unionId
        }, {
          complete: async (res) => {
            callback && callback.complete(res)
            if (!res.bindStatus) {
              try {
                await unBindGroupApi({
                  rx_openid: USER_INFO.openid,
                  unionid: params.unionId,
                  is_leader: 1
                })
              } catch (err: any) {
                console.log('err', err)
              }
            }
          }
        })
      },
      fail(err: any) {
        callback && callback.complete(handleTrackError(PLATFORM, '', err, 8000))
      }
    })
  }

  // 加入指定公会绑定的公开群
  private joinUnionGroup(params: { unionId: string }, callback: RpkMethodParams) {
    console.log('unionId', params.unionId)
    tt.joinUnionGroup({
      unionId: params.unionId,
      success: (res: any) => {
        callback && callback.complete({
          code: 0,
          msg: res.errMsg
        })

        bindGroupApi({
          rx_openid: USER_INFO.openid,
          unionid: params.unionId,
          is_leader: 0
        })
      },
      fail(err: any) {
        callback && callback.complete(handleTrackError(PLATFORM, '', err, 8000))
      }
    })
  }

  public async payGift(params: any, callback: RpkMethodParams) {
    try {
      //检查用户的登录态是否有效
      await asyncFunc(tt.checkSession)
      const goodsTagResult = await getThirdGoodsTagApi({
        pay_type: 'douyinh5',
        third_goods_tag: params.goods_tag
      })

      const result = await orderApi({
        ...params,
        goods_tag: goodsTagResult.data?.goods_tag,
        ...(!isEmpty(this.deviceInfo) ? { device_info: this.deviceInfo } : {})
      })
      let payResult: any = {}
      if (params.platform == 'ios') {
        const pay_data = {
          orderAmount: params.orderAmount,
          goodName: params.goods_name,
          zoneId: params.zoneId || '1',
          customId: result.data?.order_no,
          extraInfo: result.data?.transmit_args,
          goodsId: params.goods_tag,
          goodType: 3
        }
        console.log(`ios支付：`, pay_data)
        payResult = await asyncFunc(tt.openAwemeCustomerService, pay_data)
      } else {
        const pay_data = {
          mode: 'game',
          env: params.env || 0,
          currencyType: 'CNY',
          platform: 'android',
          goodType: 3,
          orderAmount: params.orderAmount,
          goodsId: params.goods_tag,
          goodName: params.goods_name,
          zoneId: params.zoneId || '1',
          customId: result.data?.order_no,
          extraInfo: result.data?.transmit_args
        }
        console.log('安卓支付：', pay_data)
        payResult = await asyncFunc(tt.requestGamePayment, pay_data)
      }

      const {
        gift_id, // 礼包类型id
        gift_code, // 用户在获取到礼包兑换码进入游戏后，发起核销兑换码的动作，开发者需要使用本接口校验礼包兑换码的有效性。校验通过后才可以发放对应礼包
        status
      } = payResult.gift

      if (status === 'cancel') {
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
          code: COMMON_ERROR_CODE.CANCEL_PAY,
          msg: '已取消',
          thirdcode: COMMON_ERROR_CODE.CANCEL_PAY,
          thirdmsg: '已取消'
        }))
      } else if (status === 'finish') {
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
          code: COMMON_ERROR_CODE.PAY_GIFT_FINISH,
          msg: '已核销',
          thirdcode: COMMON_ERROR_CODE.PAY_GIFT_FINISH,
          thirdmsg: '已核销'
        }))
      } else {
        callback.complete({ code: 0 })
      }
    } catch (err: any) {
      if (err.errCode == -2 || err.errNo == -2) {
        err.code = COMMON_ERROR_CODE.CANCEL_PAY
        err.thirdcode = -2
      }
      if (err.errCode == -1 || err.errNo == -1) {
        err.code = COMMON_ERROR_CODE.PAY_ERROR
        err.thirdcode = -1
      }
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err))
    }
  }

  // 监听到用户打开推送的付费礼包并点击购买时触发事件回调
  private async onBuyGift(params: {
    env?: 0 | 1,
    zoneId?: string,
    platform: 'ios' | 'android'
  }, callback: RpkMethodParams) {
    try {
      if (!tt.canIUse('onBuyGift')) {
        callback && callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
          code: -1,
          thirdcode: -1,
          msg: '不支持调用 tt.onBuyGift',
          thirdmsg: '不支持调用 tt.onBuyGift'
        }))
        return
      }

      //检查用户的登录态是否有效
      await asyncFunc(tt.checkSession)
      tt.onBuyGift((param: any) => {
        console.log('onBuyGift param: ', param)
        this.payGift({
          ...params,
          ...param
        }, {
          complete(res) {
            callback && callback.complete(res)
          }
        })
      })
    } catch (err: any) {
      callback && callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err))
    }
  }

  // 查询用户直玩订阅的授权情况
  private checkFeedSubscribeStatus(params: {
    scene?: 1 | 2 | 3,
    allScene: boolean,
    type?: string
  }, callback: RpkMethodParams) {
    try {
      if (!params.allScene && ![1, 2, 3].includes(params.scene || 0)) {
        throw Error(`订阅的场景 ID（非全场景下必传）, 且为数字 1、2、3`)
      }
      const data: any = {
        type: params.type || 'play'
      }

      if (params.allScene) {
        data.allScene = true
      } else {
        data.scene = params.scene
      }
      tt.checkFeedSubscribeStatus({
        ...data,
        success: (res: any) => {
          callback && callback.complete({
            code: 0,
            status: res.status,
            msg: res.errMsg
          })
        },
        fail(err: any) {
          callback && callback.complete(handleTrackError(PLATFORM, '', err))
        }
      })
    } catch (err) {
      callback && callback.complete(handleTrackError(PLATFORM, '', err))
    }
  }

  // 向用户请求授权，允许游戏在满足一定的条件后出现在 Feed 流中
  private requestFeedSubscribe(params: {
    scene?: 1 | 2 | 3,
    allScene: boolean,
    type?: string,
    contentIDs?: string[]
  }, callback: RpkMethodParams) {
    try {
      if (!params.allScene && ![1, 2, 3].includes(params.scene || 0)) {
        throw Error(`订阅的场景 ID（非全场景下必传）, 且为数字 1、2、3`)
      }
      if (!params.allScene && (!params.contentIDs || params.contentIDs.length == 0)) {
        throw Error(`自定义文案 contentID 数组（非全场景下必传）, contentID 在后台申请开通直玩能力后可获取`)
      }

      const data: any = {
        type: params.type || 'play'
      }

      if (params.allScene) {
        data.allScene = true
      } else {
        data.scene = params.scene
        data.contentIDs = params.contentIDs
      }
      tt.requestFeedSubscribe({
        ...data,
        success: (res: any) => {
          callback && callback.complete({
            code: 0,
            success: res.success,
            msg: res.errMsg
          })
        },
        fail(err: any) {
          callback && callback.complete(handleTrackError(PLATFORM, '', err))
        }
      })
    } catch (err) {
      callback && callback.complete(handleTrackError(PLATFORM, '', err))
    }
  }

  // 自定义启动场景数据上报
  private reportScene(params: any, callback: RpkMethodParams) {
    try {
      tt.reportScene({
        ...params,
        success: (res: any) => {
          callback && callback.complete({
            code: 0,
            data: res.data,
            msg: res.errMsg
          })
        },
        fail(err: any) {
          callback && callback.complete(handleTrackError(PLATFORM, '', err))
        }
      })
    } catch (err) {
      callback && callback.complete(handleTrackError(PLATFORM, '', err))
    }
  }

  // 游戏礼包cdk验证
  // async getGiftReceiveReward(params: any, callback: IMethodParams) {
  //   try {
  //     let result = await getGiftReceiveRewardApi({
  //       uuid: v4(),
  //       // @ts-ignore
  //       gift_code: 'ruixue6',
  //       env_type: 'development',
  //       rx_openid: USER_INFO.openid
  //     })
  //     callback.complete(result)
  //   } catch (error) {
  //     callback.complete(handleError(error))
  //   }
  // }
}

export default SdkDouyin
