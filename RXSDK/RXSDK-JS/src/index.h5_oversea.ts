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
  handleError, qs
} from '@/utils/utils'
import {
  formatDate
} from '@/utils/day'
import {
  isEmpty,
  omit,
  isObject,
  isArray,
  pick
} from '@/utils/is'
import {
  getSearchQueries,
  customSetStorageSync,
  customGetStorageSync,
  handleTrackError,
  removeStorageByPrefix,
  removeStorageSync
} from '@/h5/utils'
import {
  getPublicProps,
  activated,
  getInitConf,
  getServerTime,
  loginByCredentialApi,
  getShareDataApi,
  trackApi,
  schedulingInitApi,
  schedulingReportApi
} from '@/h5/apis'
import { googleInit } from '@/oversea/google'
import { appleLogin } from '@/oversea/apple'
import { facebookInit, facebookLogin, facebookShare } from '@/oversea/facebook'
import { pubCheck } from '@/utils/paramsValid'
import {
  shareScheduleInitParams,
  shareScheduleReportParams,
  H5ShareCheckParams
} from '@/h5/checkConfig'
import { tiktokAuthByCode, tiktokLogin } from '@/oversea/tiktok'
import { checkInstagramRedirect, instagramAuthByCode, instagramLogin } from '@/oversea/instagram'
import { zaloLogin } from '@/oversea/zalo'
import { setupStOffsetRefreshForH5 } from '@/utils/stOffset'

const PLATFORM = 'oversea'

declare global {
  var AppleID: any
}

class SdkH5Oversea {
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

  constructor(initParams: InitOverseaH5Params) {
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

  private checkInstagramRedirect(callback: H5MethodParams) {
    const result = checkInstagramRedirect()
    callback.complete({
      code: result ? 0 : -1
    })
  }

  private async login(params: H5OverseaLoginParam, callback?: H5MethodParams) {
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
        method: params.method,
        distinct_id,
        ...user_source,
        ...(params.custom_params || {})
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

      let login_info: any = {}
      switch (params.method) {
        case 'apple':
          login_info = await appleLogin(params.apple_config)
          break
        case 'zalo':
          login_info = await zaloLogin(params.zalo_config)
          break
        case 'google':
          login_info = {
            idToken: params.idToken
          }
          break
        case 'facebook':
          login_info = await facebookLogin(params.facebook_config)
          break
        case 'instagram':
          login_info = await instagramAuthByCode()
          if (login_info.code === -1) {
            instagramLogin(params.instagram_config)
            return
          }
          break
        case 'tiktok':
          login_info = await tiktokAuthByCode()
          if (login_info.code === -1) {
            tiktokLogin(params.tiktok_config)
            return
          }
          break
      }

      // 投放开关 1开启，2关闭, 开启后传入归因数据，用于投放统计用户回流信息
      const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
      const source_ad = this.getAttributionData()
      const reqLogin = reflowEnabled ? {
        ...requestParams,
        device: source_ad
      } : requestParams

      const { custom_ext, ...rest_ext } = reqLogin.ext || {}
      reqLogin.custom_ext = custom_ext || {}
      reqLogin.ext = {
        ...(rest_ext || {}),
        ...login_info
      }
      user_info = await loginByCredentialApi(this.ActivePrefix(reqLogin))

      Object.assign(USER_INFO, user_info.data)
      if ((user_info?.data?.user_flag & 1) == 1) {
        this.is_promoter = true
        this.game_id = user_info?.data?.cp_user_id || ''
      }
      customSetStorageSync('rx-loginState', 1)
      customSetStorageSync('rxToken', user_info.data.token)
      customSetStorageSync('rxUserInfo', user_info.data)
      callback && callback.complete(user_info)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
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
        type: 'app',
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
        type: 'app',
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

  //获得分享内容
  public async getShareData(
    params: H5getShareData & { platform: string },
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
      const platform = params.platform
      const transmits = encodeURI(params.transmits || '')
      const func = params.func
      const type = 'app'
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

  public shareTo(platform: string, params: { title: string, description: string, image: string }) {
    let url = encodeURIComponent(window.location.href)
    let text = encodeURIComponent('分享内容') // 替换为您想分享的内容
    let shareUrl = ''

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'zalo':
        shareUrl = `https://zalo.me/share?link=${url}`
        break
      case 'line':
        shareUrl = `https://line.me/R/msg/text/?${text} ${url}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank')
  }

  private facebookInit(params: {
    appId: string,
    cookie: boolean,
    xfbml: boolean, // 禁用 XFBML 解析
    version: string
  }) {
    facebookInit(params)
  }

  private googleInit(params: {
    client_id: string,
    triggerGoogleBtnId: string,
    callback: {
      loginCallback: any
      initCallback: any
    },
    attrs?: any
  }) {
    googleInit(params)
  }


  public async share(params: H5OverseaShareParams, callback: IMethodParams) {
    let shareData: any = params.shareData || { code: 0 }
    let query = params.query
    if (params.func) {
      shareData = await this.getShareData(params, callback, true)
    }

    let href = params.href
    if (params.href || shareData?.data?.content?.material_type === 'link' || shareData?.data?.content?.material_type === 'image' || shareData?.data?.content?.url) {
      const [_href, _query] = (params.href || shareData?.data?.content?.url).split('?')
      href = _href
      if (_query) {
        query = query ? `${query}&${_query}` : _query
      }
    }

    const shareUrl = href + (query ? `?${query}` : '')
    const title = params.title || shareData?.data?.content?.title || ''
    const description = params.desc || shareData?.data?.content?.content || ''
    const image = params.imageUrl || shareData?.data?.content?.image || ''

    let shareText = ''

    if (title && description) {
      shareText = `${title} ${description}`
    } else if (title && !description) {
      shareText = title
    } else if (description && !title) {
      shareText = description
    }

    console.info({
      href: shareUrl,
      title,
      description,
      image
    })

    try {
      switch (params.platform) {
        case 'facebook':
          // @ts-ignore
          facebookShare({
            href: shareUrl,
            title,
            description,
            image
          })
          callback.complete(shareData)
          break
        case 'whatsapp':
          // @ts-ignore
          const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
          window.open(whatsappShareUrl, '_blank')
          callback.complete(shareData)
          break
        case 'line':
          const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(`${shareText} ${shareUrl}`)}`
          window.open(lineShareUrl, '_blank')
          callback.complete(shareData)
          break
        case 'zalo':
          const zaloShareUrl = `https://zalo.me/share?link=${encodeURIComponent(shareUrl)}`
          window.open(zaloShareUrl, '_blank')
          callback.complete(shareData)
          break
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

export default SdkH5Oversea
