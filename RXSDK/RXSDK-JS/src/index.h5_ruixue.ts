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
  asyncFunc, handleError
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
  schedulingInitApi,
  schedulingReportApi,
  getShareDataApi,
  getAdShareDataApi,
  trackApi
} from '@/h5/apis'
// import SdkCommon from './h5/SdkCommon'
import { useNativeMode } from './utils/useNativeMode'
import { setupStOffsetRefreshForH5 } from '@/utils/stOffset'

const PLATFORM = 'ruixue'

declare global {
  var qg: any
}

class SdkH5Ruixue {
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
    // super(PLATFORM)
    Object.assign(SYSTEM_INFO, SYSTEM_INFO_H5, { ...initParams })
    this.getInitConfig({ complete: initParams.complete })
    console.log('getSearchQueries', getSearchQueries())
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
      let platform_id: 3 = 3
      let { cpid: copyCpid, productId: product_id, channelId: channel_id } = SYSTEM_INFO
      let cpid = Number(copyCpid)
      const publicProps = customGetStorageSync('rx_public_props')
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

  private async login(params: H5RuixueLoginParam, callback?: H5MethodParams) {
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
        method: params.method || 'minigame_aiweiyou',
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

        const login_info: any = getSearchQueries()

        const { custom_ext, ...rest_ext } = reqLogin.ext || {}
        reqLogin.custom_ext = custom_ext || {}
        reqLogin.ext = {
          ...(rest_ext || {}),
          access_token: login_info.access_token
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
      callback && callback.complete(user_info)

      // @ts-ignore
      window.receiveMessage = () => {
        this.login(params)
      }

    } catch (err: any) {
      console.log(JSON.stringify(err))
      callback && callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
    }
  }

  public async openHelpCenter() {
    const { handleInteractive } = useNativeMode()
    handleInteractive({
      eventName: 'openHelpCenter',
      eventParams: JSON.stringify({
        userInfo: USER_INFO,
        systemInfo: SYSTEM_INFO,
        initConfig: this.initConfig
      })
    })
  }

  public async openCustomerService() {
    const { handleInteractive } = useNativeMode()
    handleInteractive({
      eventName: 'openCustomerService',
      eventParams: JSON.stringify({
        userInfo: USER_INFO,
        systemInfo: SYSTEM_INFO,
        initConfig: this.initConfig
      })
    })
  }

  public async openUserCenter() {
    const { handleInteractive } = useNativeMode()
    handleInteractive({
      eventName: 'openUserCenter',
      eventParams: JSON.stringify({
        userInfo: USER_INFO,
        systemInfo: SYSTEM_INFO,
        initConfig: this.initConfig
      })
    })
  }

  public async share(callback: IMethodParams) {

  }

  // 激励广告
  public async rewardedVideoAd(data: any, callback: H5MethodParams) {

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

      if (SYSTEM_INFO.need_active) {
        // 检查是否需要激活
        this.checkNeedActivate()
      }
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
}

export default SdkH5Ruixue
