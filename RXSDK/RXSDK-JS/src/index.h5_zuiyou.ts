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
  formatTrackParams
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
  H5ShareCheckParams,
  H5ZuiyouPayCheckParams
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
  getAdShareDataApi
} from '@/h5/apis'
import SdkCommon from './h5/SdkCommon'
import { setupStOffsetRefreshForH5 } from '@/utils/stOffset'

const PLATFORM = 'minigame_zuiyou'

declare global {
  var __XCgs: any
}

class SdkH5Zuiyou extends SdkCommon {
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
    if (window.__XCgs) {
      this.getInitConfig({ complete: initParams.complete })
    } else {
      this.loadScript('https://static.ixiaochuan.cn/game-sdk/sdk.1.1.0.js')
        .then(() => {
          this.getInitConfig({ complete: initParams.complete })
        })
        .catch((err: any) => {
          initParams.complete(handleTrackError(PLATFORM, 'rxlog_error_init', {
            code: -1,
            msg: '最右 sdk 加载失败'
          }))
        })
    }
  }

  private async login(params: H5ZuiyouLoginParam, callback: H5MethodParams) {
    try {
      const user_source = this.getLoginQsAndGenerateStruct()
      const now = new Date().getTime()
      const distinct_idLocal = customGetStorageSync('rx_distinct_id')
      const distinct_id = distinct_idLocal || v4()
      if (!distinct_idLocal) {
        customSetStorageSync('rx_distinct_id', distinct_id)
      }
      const requestParams: any = {
        ts: now,
        method: params.method || 'minigame_zuiyou',
        distinct_id,
        ext: params.ext,
        ...user_source
      }

      try {
        if (this.subChannelId !== null) {
          const queryJson = getSearchQueries()
          requestParams.user_source = {
            guide: { ...user_source, subchannelid: this.subChannelId }
          }
          if (queryJson) {
            requestParams.user_source.guide = { ...requestParams.user_source.guide, ...queryJson }
          }
        }
      } catch (err) {

      }

      let user_info: any = {}

      if (params.login_openid) {
        requestParams.login_openid = params.login_openid
        user_info = await loginByTokenApi(this.ActivePrefix(requestParams))
      } else {
        // 投放开关 1开启，2关闭, 开启后传入归因数据，用于投放统计用户回流信息
        const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
        const source_ad = this.getAttributionData()
        const reqLogin = reflowEnabled ? {
          ...requestParams,
          device: source_ad
        } : requestParams

        const login_info: any = await this.zuiyouInit(SYSTEM_INFO.appkey)

        let nickname = ''
        let avatar = ''
        try {
          const extra_param: any = JSON.parse(login_info.extra_param)
          nickname = extra_param.nickname || ''
          avatar = extra_param.avatar || ''
        } catch (e) {

        }

        const { custom_ext, ...rest_ext } = reqLogin.ext || {}
        reqLogin.custom_ext = custom_ext || {}
        reqLogin.ext = {
          ...(rest_ext || {}),
          uid: login_info.uid,
          ts: `${login_info.ts}`,
          sign: login_info.sign,
          nickname,
          avatar
        }
        user_info = await loginByCredentialApi(this.ActivePrefix(reqLogin))
      }
      Object.assign(USER_INFO, user_info.data)
      if ((user_info?.data?.user_flag & 1) == 1) {
        this.is_promoter = true
        this.game_id = user_info?.data?.cp_user_id || ''
      }
      customSetStorageSync('rx-loginState', 1)
      customSetStorageSync('rxToken', user_info.data.token)
      customSetStorageSync('rxUserInfo', user_info.data)
      callback.complete(user_info)
    } catch (err: any) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
    }
  }

  private zuiyouInit(appkey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      __XCgs.call('init')(appkey, (err: any, res: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }

  // 支付
  public async pay(params: H5ZuiyouPayParam, callback: H5MethodParams) {
    const { exchange, ...rest } = params
    if(exchange) {
      this.exchangeItemProp(rest, callback)
      return
    }
    try {
      await pubCheck(H5ZuiyouPayCheckParams, callback, params)
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
      __XCgs.call('pay')(result?.data?.ext, (err: any, res: any) => {
        if (err) {
          if (err.code == 100000) {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
              code: COMMON_ERROR_CODE.CANCEL_PAY,
              msg: '取消支付',
              thirdcode: err.code
            }))
          } else {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err))
          }
          return
        }

        if (res && res.status == 1) {
          callback.complete({ code: 0 })
        } else {
          console.log(res)
          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
            code: COMMON_ERROR_CODE.PAY_ERROR,
            msg: '支付错误',
            ...res
          }))
        }
      })
    } catch (err: any) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err))
    }
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
        this.rewardedVideoAd(
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
      const platform = 'zuiyou'
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

  private rewardedVideoAd({ complete }: H5MethodParams) {
    /**
     * 是否可以播放广告，CP在设计广告播放场景时需要先确认是否有权限播放广告（每日广告有播放次数限制）
     *
     * @param callback 回调函数
     */
    __XCgs.call('playRewardAd')(function(err: any, res: any) {
      console.log('播放状态', res, err)
      if (err && err.code == 100000) {
        complete({
          code: -1,
          data: null,
          msg: '播放中途退出，不下发游戏奖励',
          isEnded: false
        })
        return
      }
      if (err) {
        complete(handleTrackError(PLATFORM, 'rxlog_error_ad', {
          ...err,
          msg: '获取广告结果异常'
        }))
        return
      }
      if (res && res.status == 1) {
        complete({
          code: 0,
          data: null,
          msg: '正常播放结束，可以下发游戏奖励',
          isEnded: true
        })
      }
    })
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
      const platform = 'zuiyou'
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

  private loadScript(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.onload = () => resolve(script)
      script.onerror = (error) => reject(error)
      document.head.appendChild(script)
    })
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

export default SdkH5Zuiyou
