import v4 from 'uuid/v4'
import {
  SYSTEM_INFO,
  USER_INFO
} from '@/config'
import {
  SYSTEM_INFO as SYSTEM_INFO_H5
} from '@/h5/config'
import {
  COMMON_ERROR_CODE
} from '@/config/const'
import {
  formatTrackParams,
  asyncFunc
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
} from '@/h5/utils'
import {
  checkIReqBusinessData,
  checkIReqBusinessOrder,
  shareScheduleInitParams,
  shareScheduleReportParams,
  H5ShareCheckParams
} from '@/h5/checkConfig'
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
  refreshUserInfo
} from '@/h5/apis'
import SdkCommon from './h5/SdkCommon'
import { setupStOffsetRefreshForH5 } from '@/utils/stOffset'

const PLATFORM = 'minigame_vivo'

declare global {
  var qg: any
}

class SdkH5Vivo extends SdkCommon {
  _hasAd: { ['rewarded']: boolean | undefined } = {
    rewarded: undefined
  }
  _ad: any | null = null

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
  private funcs: string[] = []

  private initConfig: any = {}
  // 调度埋点
  private scheduleInitMap: any = {}
  // 获取分享数据缓存调度上报参数
  private scheuleReportProps: any = {}
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

  constructor(initParams: InitH5Params) {
    super(PLATFORM)
    Object.assign(SYSTEM_INFO, SYSTEM_INFO_H5, { ...initParams })
    this.getInitConfig({ complete: initParams.complete })
    console.log('getSearchQueries', getSearchQueries())
  }

  // 同步用户信息
  async infoSync(callback: RpkMethodParams) {
    try {
      const loginResult: any = await asyncFunc(qg.login, {})
      const { miniGame } = qg.getSystemInfoSync()
      let result = await refreshUserInfo({
        authtoken: loginResult.data.token,
        pkgName: miniGame.package
      })
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  private async login(params: H5VivoLoginParam, callback: H5MethodParams) {
    try {
      const user_source = this.getLoginQsAndGenerateStruct()
      const source_ad = this.getAttributionData()
      params.method = params.method || 'minigame_vivo'
      let distinct_idLocal = customGetStorageSync('rx_distinct_id')
      let distinct_id = distinct_idLocal || v4()
      if (!distinct_idLocal) {
        customSetStorageSync('rx_distinct_id', distinct_id)
      }
      const now = new Date().getTime()
      let reqLogin = { ...omit(params), ...user_source, distinct_id, ts: now }

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

      const loginResult: any = await asyncFunc(qg.login, {})

      const { miniGame } = qg.getSystemInfoSync()
      const { custom_ext, ...rest_ext } = reqLogin.ext || {}
      reqLogin.custom_ext = custom_ext || {}
      reqLogin.ext = {
        ...(rest_ext || {}),
        authtoken: loginResult.data.token,
        pkgName: miniGame.package
      }

      if (params.login_openid) {
        const loginTokenRx = await loginByTokenApi(this.ActivePrefix(reqLogin))
        Object.assign(USER_INFO, loginTokenRx.data)
        customSetStorageSync('rxToken', loginTokenRx.data.token)
        customSetStorageSync('rxUserInfo', loginTokenRx.data)
        customSetStorageSync('rx-loginState', 1)

        try {
          if ((loginTokenRx?.data?.user_flag & 1) == 1) {
            this.is_promoter = true
            this.game_id = loginTokenRx?.data?.cp_user_id
          }
        } catch (e) {
        }

        callback.complete(loginTokenRx)
      } else {
        const { platformVersionCode } = qg.getSystemInfoSync()
        if (platformVersionCode < 1063) {
          callback.complete(handleTrackError(PLATFORM, '', {
            code: 408,
            msg: '支持最低平台版本号 1063'
          }))
          return
        }
        const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
        reqLogin = reflowEnabled ? { ...reqLogin, device: source_ad } : { ...reqLogin }
        let loginRx = await loginByCredentialApi(this.ActivePrefix(reqLogin))
        Object.assign(USER_INFO, loginRx.data)
        customSetStorageSync('rxToken', loginRx.data.token)
        customSetStorageSync('rxUserInfo', loginRx.data)
        customSetStorageSync('rx-loginState', 1)

        try {
          if ((loginRx?.data?.user_flag & 1) == 1) {
            this.is_promoter = true
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

  // 支付
  public async pay(params: H5VivoPayParam, callback: H5MethodParams) {
    const { exchange, ...rest } = params
    if(exchange) {
      this.exchangeItemProp(rest, callback)
      return
    }
    try {
      if (params.indulge_auth == 1 && !params.age) {
        throw Error('when indulge_auth equal 1,the age must be required')
      }
      let reqOrder = {
        ...params,
        currency: params.currency || 'CNY',
        openid: USER_INFO.openid,
        sub_channel_id: USER_INFO?.subchannelid,
        is_debug: params.is_debug || 0,
        env: params.env || 0
      }
      const result = await orderApi(reqOrder)
      //unity 兼容逻辑
      if (params.onlyGetOrder) {
        callback.complete({ code: 0, data: result })
        return
      }

      const payResult = await asyncFunc(qg.pay, {
        orderInfo: {
          appId: result.data?.ext?.appId,
          cpOrderNumber: result.data?.ext?.cpOrderNumber,
          productName: result.data?.ext?.productName,
          orderAmount: result.data?.ext?.orderAmount,
          productDesc: result.data?.ext?.productDesc,
          notifyUrl: result.data?.ext?.notifyUrl,
          vivoSignature: result.data?.ext?.sign
        }
      })
      if (payResult.code === -1) {
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
          code: COMMON_ERROR_CODE.CANCEL_PAY,
          msg: '取消支付',
          thirdcode: -1
        }))
        return
      }
      if (payResult.code === -2) {
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
          code: COMMON_ERROR_CODE.PAY_ERROR,
          msg: '支付错误',
          thirdcode: -2
        }))
        return
      }
      callback.complete({ code: 0 })
    } catch (err: any) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err))
    }
  }

  public async share(callback: IMethodParams) {
    qg.share({
      success() {
        callback.complete({ code: 0 })
      },
      fail(err: any) {
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', err))
      },
      cancel() {
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', {
          code: -1,
          msg: '取消分享'
        }))
      }
    })
  }

  public async schedulingAction(params: any, callback: H5MethodParams) {
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
          {
            complete:
            // @ts-ignore
              (args: any) => {
                callback.complete({
                  scheduling_type: 'share',
                  ...(args || {})
                })
              }
          }
        )
      }
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', err))
    }
  }

  //获得分享内容
  public async getAdShareData(
    params: H5getShareData,
    callback?: H5MethodParams
  ) {
    try {
      const region = params?.region || USER_INFO.region || ''
      const { productId, channelId } = SYSTEM_INFO
      const platform = 'vivo'
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
        custom_ext: params.custom_ext || {}
      })
      callback && callback.complete(shareData)
      return shareData
    } catch (err: any) {
      callback && callback.complete(handleTrackError(PLATFORM, '', err))
      return err
    }
  }

  // 激励广告
  public async rewardedVideoAd(data: any, {
    complete,
    fail: failCallback
  }: IMethodParams) {
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
          // @ts-ignore
          ad.destroy()
          this._ad = null
        }
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
      if (!this._ad) {
        ad = qg.createRewardedVideoAd({
          adUnitId
        })
        await new Promise<void>((resolve, reject) => {
          let timer: NodeJS.Timeout | null = setTimeout(() => {
            reject({ code: 1000000, msg: 'adLoadTimeout' })
            clearTimeout(timer as NodeJS.Timeout)
            timer = null
          }, 10000)
          ad.onLoad(() => {
            this._ad = ad
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
      ad = this._ad as any
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
                // 失败重试
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
            // 失败重试
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
    params: H5getShareData,
    callback: H5MethodParams,
    stopCallback?: boolean
  ) {
    try {
      await pubCheck(H5ShareCheckParams, callback, params)
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
      const platform = 'vivo'
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
  public async shareSchedulingInit(params: H5ReqShareScheduleInit, callback: H5MethodParams) {
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
  public async shareSchedulingReport(params: H5ReqShareScheduleReport, callback: H5MethodParams) {
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

  private async getInitConfig(callback: H5MethodParams) {
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

      setupStOffsetRefreshForH5(getServerTime)

      // 检查是否需要激活
      this.checkNeedActivate()
      this.loopGetPublicProps()

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
    const source_ad: any = {}
    if (universal?.ad_platform) {
      source_ad.ad_rawargs = omit(universal, ['ad_platform'])
      source_ad.ad_platform = universal.ad_platform
    }

    return source_ad
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
  public async getAllBusinessData(callback: H5MethodParams) {
    try {
      const data = omit(this.businessRulesInfo, 'timerId')
      let result = { code: 0, data }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  // 条件获取商业化窗口数据
  public async getBusinessData(params: H5ReqBusinessData, callback: H5MethodParams) {
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
              // daily_limit 存在说明是自动弹窗
              const key = `${window_key}_${event}_${matWindow.window_key}`
              const count = cache[key] || 0
              if (matWindow?.day_limit === count) return
              cache[key] = count + 1
              // console.log(key, cache[key])
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
  public async refreshBusinessData(callback?: H5MethodParams, isRecord?: boolean) {
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
  public async requestBusinessOrder(params: H5ReqBusinessOrder, callback: H5MethodParams) {
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
  private startPromoterTimer(callback?: H5MethodParams, autoRefresh = true) {
    const delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000)
    console.log('startPromoterTimer', delay)
    this.promoInfo.timer = setTimeout(() => {
      this.getPromoDisplayKEY(callback, autoRefresh, false)
    }, delay)
  }

  // 获取福利码
  private getPromoDisplayKEY(callback?: H5MethodParams, autoRefresh = false, immediately = true) {
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
  private exchangePromoCDKEY(cdkey: string, callback: H5MethodParams) {
    exchangePromoterCodeApi(cdkey).then(res => {
      callback.complete(res)
    }).catch((err) => {
      callback.complete(handleTrackError(PLATFORM, '', err))
    })
  }

  private checkIsPromoter(): boolean {
    return this.is_promoter
  }
}

export default SdkH5Vivo
