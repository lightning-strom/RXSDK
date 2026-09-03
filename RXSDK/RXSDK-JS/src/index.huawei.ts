import {
  activated,
  getInitConf,
  getServerTime,
  getPublicProps,
  getShareDataApi,
  loginByCredentialApi,
  loginByTokenApi,
  orderApi,
  trackApi,
  postPayData,
  schedulingInitApi,
  schedulingReportApi,
  exchangePromoterCodeApi,
  getPromoterCodeApi,
  getNoticeApi,
  collectPropsApi,
  createFeedbackApi,
  getFeedbackDetailApi,
  getFeedbackListApi,
  getAdShareDataApi,
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
  refreshUserInfo,
  searchGameAccountApi
} from '@/api/huawei/apiForHuawei'
import {
  huaweiInitParamsCheck,
  shareScheduleInitParams
} from '@/utils/checkConfig'
import axios from 'axios'
import SdkCommon from './utils/huawei/index.common'
import { setupStOffsetRefreshForMiniGame } from '@/utils/stOffset'
import { huaweiQuickLoginParamsCheck } from '@/utils/checkConfig/huawei'
import { invalidInitParams, pubCheck } from '@/utils/paramsValid'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { SYSTEM_INFO as SYSTEM_INFO_TT } from '@/config/huawei'
import { isEmpty, isObject, omit, pick, isArray } from '@/utils/is'
import { PLATFORM } from '@/config/enum'
import { formatTrackParams, handleError, isDropOrder } from '@/utils/utils'
import { COMMON_ERROR_CODE } from '@/config/const'
import v4 from 'uuid/v4'
import { formatDate } from '@/utils/day'
import {
  getSearchQueries,
  storage,
  removeStorageByPrefix,
  asyncFunc,
  getCacheKey
} from './utils/huawei/utils'

// 华为错误code转换到公共code
const HUAWEIERRORCODEMAP: any = {
  '60000': '4001'//取消支付
}


declare global {
  var qg: any
}

const getDevicecode = () => {
  let devicecode = storage.get('rx_devicecode')
  if (devicecode) {
    return devicecode.code
  } else {
    let code = v4()
    storage.set('rx_devicecode', { code, openIds: {} })
    return code
  }
}

function validateNumber(num: number) {
  const numStr = num.toString()
  const isSixDigits = /^\d{6}$/.test(numStr)
  if (!isSixDigits) {
    return false
  }
  const thirdDigit = parseInt(numStr[2])
  const fourthDigit = parseInt(numStr[3])
  return `${thirdDigit}${fourthDigit}` === '20'
}

const handleTrackError = (error_action: '' | 'rxlog_error_pay' | 'rxlog_error_login' | 'rxlog_error_share' | 'rxlog_error_init' | 'rxlog_error_ad' = '', error: any, code?: any) => {
  const handle_error: any = handleError(error, code)
  if (validateNumber(handle_error.code) || !handle_error.isServerError) {
    trackApi([
      {
        event: '#rx_error',
        type: 'track',
        time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        uuid: v4(),
        sub_channel_id: USER_INFO.subchannelid,
        distinct_id: USER_INFO.openid,
        platform_id: 4,
        product_id: SYSTEM_INFO.productId,
        cpid: Number(SYSTEM_INFO.cpid),
        channel_id: SYSTEM_INFO.channelId,
        devicecode: getDevicecode(),
        properties: {
          error_action,
          error_type: 'sdk',
          trace_id: v4(),
          rx_version: SYSTEM_INFO.__RX_SDK_VERSION,
          type_tripartite: PLATFORM.MINIGAMEHUAWEI,
          request_address: handle_error.url || '',
          request_header: handle_error.request_header || '',
          request_body: handle_error.request_body || '',
          error_code: handle_error.code,
          error_message: handle_error.msg || '',
          error_code_tripartite: handle_error.thirdcode || '',
          error_message_tripartite: handle_error.thirdmsg || '',
          cp_userid: USER_INFO.cp_user_id,
          error_ext: '请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案'
        }
      }
    ]).catch((e: any) => {
      console.log(e)
    })
  }
  return {
    code: handle_error.code,
    msg: handle_error.msg,
    thirdcode: handle_error.thirdcode,
    thirdmsg: handle_error.thirdmsg
  }
}

class SdkClass extends SdkCommon {
  private initConfig: any = {}
  // 默认刷新时间 10 分钟
  private businessRuleDefaultRefreshTime = 600000
  // 上报公共属性接口失败次数
  private trackPublicPropsFailCount = 0
  private _hasAd: { ['rewarded']: boolean | undefined } = {
    rewarded: undefined
  }
  //激励广告对象
  private _rewardedVideoAd: any
  //子渠道id
  public subChannelId: any = null
  private _ad: any | null = null
  // 调度埋点
  private scheduleInitMap: any = {}
  // 获取分享数据缓存调度上报参数
  private scheuleReportProps: any = {}
  private GameRecorderManager = null
  private isPromoter: boolean = false
  private game_id: string = ''
  private promoInfo: any = {
    timer: null,
    refresh_period_exp: 0,
    polling: 0,
    promo_code: ''
  }

  constructor(initParams: ISdkInitParams & { publicKey: string; appid: string }) {
    super(initParams)
    invalidInitParams(initParams, huaweiInitParamsCheck)
    console.info('channel sdk check params passed')

    Object.assign(SYSTEM_INFO, SYSTEM_INFO_TT, { ...initParams, index: 0 })
    this.getInitConfig({ complete: initParams.complete })
  }

  private async addFeedback(params: any, callback?: IMethodParams) {
    try {
      const res = await createFeedbackApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  private async getFeedbackList(params: any, callback?: IMethodParams) {
    try {
      const res = await getFeedbackListApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  private async getFeedbackDetail(params: any, callback?: IMethodParams) {
    try {
      const res = await getFeedbackDetailApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  private async collectProps(params: any, callback?: IMethodParams) {
    try {
      const res = await collectPropsApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  private async getAnnouncement(limit: number, callback?: IMethodParams) {
    if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
      callback && callback.complete(handleTrackError('', {
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
      callback && callback.complete(handleTrackError('', err))
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
  private startPromoterTimer(callback?: IMethodParams, autoRefresh = true) {
    const delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000)
    console.log('startPromoterTimer', delay)
    this.promoInfo.timer = setTimeout(() => {
      this.getPromoDisplayKEY(callback, autoRefresh, false)
    }, delay)
  }

  private getPromoDisplayKEY(callback?: IMethodParams, autoRefresh = false, immediately = true) {
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
        callback && callback.complete(handleTrackError('', err))
      } else {
        if (autoRefresh) {
          this.startPromoterTimer(callback, autoRefresh)
        } else {
          callback && callback.complete(handleTrackError('', err))
        }
      }
    })
  }

  private exchangePromoCDKEY(cdkey: string, callback: IMethodParams) {
    exchangePromoterCodeApi(cdkey).then(res => {
      callback.complete(res)
    }).catch((err) => {
      callback.complete(handleTrackError('', err))
    })
  }

  private checkIsPromoter(): boolean {
    return this.isPromoter
  }

  /**
   * 用于设置自定义返回错误 Msg
   */
  public setErrorMsg(errMsg: any) {
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

  /**
   * 轮训获取公共属性
   *
   */
  private async loopGetPublicProps() {
    let event_public_attr = this.initConfig?.event_public_attr
    if (isEmpty(event_public_attr)) return

    const repeat = (ms: number) => {
      event_public_attr.timerId && clearTimeout(event_public_attr.timerId)
      event_public_attr.timerId = setTimeout(
        () => getPublicPropsConfig(),
        ms || this.businessRuleDefaultRefreshTime
      )
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

        const initParams = storage.get('rx-init-params')
        // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
        storage.set('rx-init-params', {
          ...initParams,
          version: { ...initParams.version, event_public_attr: version }
        })

        repeat(event_public_attr.refresh)
      } catch (error) {
        handleTrackError('', error)
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

    // getPublicPropsConfig()
  }

  // 获取归因数据
  private getAttributionData() {
    const universal: any = getSearchQueries()
    const source_ad: any = {}
    if (universal?.ad_platform) {
      switch (universal?.ad_platform) {
        case 'tencent':
          source_ad.click_id = universal.gdt_vid
          source_ad.ad_rawargs = omit(universal, ['ad_platform', 'gdt_vid'])
          break
        case 'oceanengine':
          source_ad.click_id = universal.req_id
          source_ad.ad_rawargs = omit(universal, ['ad_platform', 'req_id'])
          break
        case 'kuaishou':
          source_ad.ad_rawargs = omit(universal, ['ad_platform'])
          break
        case 'baidu':
          source_ad.click_id = universal.bd_vid
          source_ad.ad_rawargs = omit(universal, ['ad_platform', 'bd_vid'])
          break
        case 'bili':
          source_ad.click_id = universal.trackid
          break
        case 'xiaohongshu':
          source_ad.click_id = universal.click_id
          break
      }
      source_ad.ad_platform = universal.ad_platform
    }

    return source_ad
  }

  //检查是否需要更新
  private async checkNeedActivate() {
    const activeResult = storage.get('rx-active-result')
    if (!activeResult) {
      const source_ad: any = this.getAttributionData()
      const distinct_id = v4()
      storage.set('rx_distinct_id', distinct_id)
      const req: any = {
        stage: 'init',
        distinct_id,
        source_ad
      }
      try {
        const result = await activated(req)
        storage.set('rx-active-result', { isSuccess: true, activeResult: result.data })
      } catch (err) {
        storage.set('rx-active-result', { isSuccess: false, activeResult: req })
      }
    }
  }

  private ActivePrefix(reqParams: any) {
    const loginState = storage.get('rx-loginState')
    const activeSave = storage.get('rx-active-result')
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

  private publicSubchannelCheck(res: any) {
    try {
      const sub_channel = res?.data?.subcq?.subc

      const queryString = getSearchQueries(true)
      let query: any = queryString ? queryString.split('&') : []
      console.log(query)
      if (sub_channel?.length && query?.length) {
        for (let a = 0; a < sub_channel.length; a++) {
          let item = sub_channel[a]
          let reflectStringArr = item?.map
          if (reflectStringArr?.length) {
            let arr = item?.map
            let sub_channel_id = item?.id
            for (let k in arr) {
              let str = arr[k]
              console.log(str)
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

  private handleSdkInitCallback: any

  public async switchIsSinglePlayer(status: boolean) {
    SYSTEM_INFO.single_player_mode = status
    if (typeof this.handleSdkInitCallback == 'function') {
      if (!SYSTEM_INFO.single_player_mode && !SYSTEM_INFO.SDK_INIT_FINISHED) {
        this.getInitConfig({
          complete: (res) => {
            this.handleSdkInitCallback({
              code: res.code,
              single_player_mode: SYSTEM_INFO.single_player_mode
            })
          }
        })
      } else {
        this.handleSdkInitCallback({ code: 0, single_player_mode: SYSTEM_INFO.single_player_mode })
      }
    }

    if (!SYSTEM_INFO.single_player_mode) {
      this.multipleTrack()
    }
  }

  public async multipleTrack() {
    try {
      let rx_track_queue = storage.get('rx_track_queue') || []
      if (rx_track_queue.length) {
        console.log('批量补上报大数据')
        await trackApi(rx_track_queue)
        storage.remove('rx_track_queue')
      }
    } catch (err) {
      console.log(err)
    }
  }

  public async getInitConfig(callback: IMethodParams) {
    if (SYSTEM_INFO.single_player_mode) {
      callback.complete({
        code: 0,
        single_player_mode: SYSTEM_INFO.single_player_mode
      })
      setTimeout(() => {
        this.handleSdkInitCallback = callback.complete
      }, 50)
      return
    }
    const initParams = storage.get('rx-init-params')

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
      console.log('SDK initConfig: ', this.initConfig)

      // //检查是否需要传递subchannleid
      this.publicSubchannelCheck(res)
      // console.log('测试',this.subChannelId)
      storage.set('rx-init-params', JSON.stringify({ version }))
      SYSTEM_INFO.SDK_INIT_FINISHED = true
      SYSTEM_INFO.CP_OF = res?.data?.cp?.of || false
      const _serverTime = res?.data?.server?.time
      if (_serverTime) {
        SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now())
      }

      setupStOffsetRefreshForMiniGame(typeof qg !== 'undefined' ? qg : null, getServerTime)

      // 检查是否需要激活
      this.checkNeedActivate()
      this.loopGetPublicProps()

      callback.complete({ code: 0 })
    } catch (err: any) {
      const error: any = {
        ...(err || {}),
        msg: '初始化错误，或未初始化',
        code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
        thirdcode: err.code || err.errCode,
        message: err.message || err.msg || err.errMsg,
        thirdmsg: err.message || err.msg || err.errMsg
      }
      callback.complete(handleTrackError('rxlog_error_init', error))
    } finally {
      this.handleSdkInitCallback = callback.complete
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

  public getRxDevicecode() {
    try {
      const devicecode = storage.get('rx_devicecode')
      if (devicecode) {
        // @ts-ignore
        return devicecode.code
      } else {
        let code = v4()
        storage.set('rx_devicecode', { code, openIds: {} })
        return code
      }
    } catch (err) {
      return v4()
    }
  }

  // 同步用户信息
  async infoSync(callback: RpkMethodParams) {
    try {
      const loginResult: any = await asyncFunc(qg.gameLoginWithReal, {
        appid: SYSTEM_INFO.appid,
        forceLogin: 1
      })
      let result = await refreshUserInfo({
        ...loginResult
      })
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError('', error))
    }
  }

  //华为登录
  public async login(loginParams: huaweiQuickLogin, callback: IMethodParams) {
    if (SYSTEM_INFO.single_player_mode) {
      callback.complete({
        code: 0,
        data: {
          single_player_mode: true,
          nickname: '游客',
          devicecode: this.getRxDevicecode()
        }
      })
      return
    }
    try {
      const params = {
        appid: SYSTEM_INFO.appid,
        method: loginParams?.method || 'minigame_huawei',
        login_openid: loginParams.login_openid
      }

      await pubCheck(huaweiQuickLoginParamsCheck, callback, params)
      const user_source = this.getLoginQsAndGenerateStruct()
      const source_ad = this.getAttributionData()

      let distinct_idLocal = storage.get('rx_distinct_id')
      let distinct_id = distinct_idLocal || v4()
      if (!distinct_idLocal) {
        storage.set('rx_distinct_id', distinct_id)
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
      if (params.login_openid) {
        console.log('再次登录。。。。')
        const loginTokenRx = await loginByTokenApi(this.ActivePrefix(reqLogin))
        Object.assign(USER_INFO, loginTokenRx.data)
        storage.set('rxToken', loginTokenRx.data.token)
        storage.set('rx-loginState', 1)

        try {
          if ((loginTokenRx?.data?.user_flag & 1) == 1) {
            this.isPromoter = true
            this.game_id = loginTokenRx?.data?.cp_user_id
          }
        } catch (e) {
        }

        callback.complete(loginTokenRx)
      } else {
        const loginResult: any = await asyncFunc(qg.gameLoginWithReal, {
          appid: SYSTEM_INFO.appid,
          forceLogin: 1
        })
        const { custom_ext, ...rest_ext } = reqLogin.ext || {}
        reqLogin.custom_ext = custom_ext || {}
        reqLogin.ext = {
          ...(rest_ext || {}),
          ...loginResult
        }
        const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
        reqLogin = reflowEnabled ? { ...reqLogin, device: source_ad } : { ...reqLogin }
        let loginRx = await loginByCredentialApi(this.ActivePrefix(reqLogin))
        Object.assign(USER_INFO, loginRx.data)
        storage.set('rxToken', loginRx.data.token)
        storage.set('rx-loginState', 1)
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
      callback.complete(handleTrackError('rxlog_error_login', err, COMMON_ERROR_CODE.LOGIN_FAIL))
    }
  }

  //用户协议设置
  public async getIsAgree() {
    return storage.get('isAgree')
  }

  public async setIsAgree(flag: boolean) {
    return storage.set('isAgree', flag)
  }

  public getLoginQsAndGenerateStruct() {
    const universal: any = getSearchQueries()
    // console.log('===============queryString', universal)
    let user_source: any = {}
    if (universal.hasOwnProperty('user_source')) {
      const omitKeys =
        universal?.user_source === 'transmits'
          ? ['user_source']
          : ['user_source', 'type', 'transmits']
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
            user_transmits: Object.assign(leftProps, {
              transmits: decodeURIComponent((leftProps as any).transmits || '')
            })
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
    const subPackageInfo: any = storage.get('rx_sub_package_info')
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

  //数据上报
  public async track(params: any, callback: IMethodParams) {
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
        var devicecode = storage.get('rx_devicecode')
        if (devicecode) {
          return devicecode.code
        } else {
          let code = v4()
          storage.set('rx_devicecode', { code, openIds: {} })
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
      const publicProps = storage.get('rx_public_props')
      const new_properties: any = {}

      if (SYSTEM_INFO.region_tag) {
        new_properties.rx_region_tag = `${SYSTEM_INFO.region_tag}`
      }

      if (SYSTEM_INFO.cp_role_id) {
        new_properties['#role_id'] = `${SYSTEM_INFO.cp_role_id}`
      }

      let reqarr: douyinTrackForReq[] = [
        {
          type,
          time,
          uuid: uuids,
          distinct_id: USER_INFO.openid,
          sub_channel_id: USER_INFO?.subchannelid,
          platform_id,
          product_id,
          ip: '127.0.0.1',
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
        let rx_track_queue = storage.get('rx_track_queue') || []
        rx_track_queue = rx_track_queue.concat(reqarr)
        storage.set('rx_track_queue', rx_track_queue)
        p2.complete({ code: 0, data: null, msg: 'track cache' })
        return
      }
      let result = await trackApi(reqarr)
      p2.complete({ ...result, data: null, msg: 'track success' })
    } catch (err) {
      p2.complete(handleError(err))
    }
  }

  /**
   * 设置公共属性
   * 设置后CP无需每次上报都传，由SDK填入properties中。
   */
  public setPublicProperties(params: { [key: string]: any }) {
    if (!isObject(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR
      return handleTrackError('', error)
    }

    try {
      storage.set('rx_public_props', params)
      return { code: 0 }
    } catch (error) {
      return handleTrackError('', error)
    }
  }

  /**
   * 修改设置的公共数据。
   */
  public updatePublicProperties(params: { [key: string]: any }) {
    if (!isObject(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR

      return handleTrackError('', error)
    }

    try {
      const cache = storage.get('rx_public_props')
      storage.set('rx_public_props', { ...cache, ...params })
      return { code: 0 }
    } catch (error) {
      return handleTrackError('', error)
    }
  }

  /**
   * 删除公共属性
   */
  public deletePublicProperties(params: string[]) {
    try {
      const cache = storage.get('rx_public_props')
      const rest = omit(cache, params)
      storage.set('rx_public_props', rest)
      return { code: 0 }
    } catch (error) {
      return handleTrackError('', error)
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
      platform: data?.platform || PLATFORM.MINIGAMEHUAWEI
    }
  }

  //获得公共属性
  public getPublicProperties() {
    let data = storage.get(`rx_public_props`)

    return { code: 0, data }
  }

  public async exchangeItemProp(params: any, callback: IMethodParams) {
    try {
      const result = await itemRedemptionApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  /*支付*/
  //支付消耗型商品
  //华为支付
  public async pay(params: IpayForHuawei, callback: IMethodParams) {
    const _this = this
    try {
      console.log('进入支付。。。')
      let reqOrder = {
        ...params,
        currency: 'CNY',
        openid: USER_INFO.openid,
        sub_channel_id: USER_INFO?.subchannelid,
        is_debug: params.is_debug || 0,
        env: params.env || 0,
        ext: {}
      }
      const result = await orderApi(reqOrder)
      //unity 兼容逻辑
      if (params.onlyGetOrder) {
        callback.complete({ code: 0, data: result })
        return
      }

      //检查用户的登录态是否有效
      await asyncFunc(qg.isEnvReady, {
        isEnvReadyReq: {
          applicationID: SYSTEM_INFO.appid
        }
      })

      try {
        storage.set(getCacheKey('order_params', USER_INFO), result.data)
        const res = await asyncFunc(qg.createPurchaseIntent, {
          purchaseIntentReq: {
            applicationID: SYSTEM_INFO.appid,
            productId: result.data.ext.third_tag,
            publicKey: SYSTEM_INFO.publicKey,
            priceType: 0,
            developerPayload: result.data.order_no
          }
        })
        await postPayData(result.data.notify_url, {
          inAppDataSignature: res.inAppDataSignature,
          inAppPurchaseData: res.inAppPurchaseData
        })
        this.track(
          formatTrackParams({
            eventName: 'requestproduct',
            apiName: 'pay_order',
            state: '下单成功',
            reqParams: params,
            errorInfo: {},
            loginInfo: USER_INFO,
            orderRes: result?.data || {},
            ...(result?.data || {})
          }),
          {
            complete: () => {
            }
          }
        )
        storage.remove(getCacheKey('order_params', USER_INFO))
        callback.complete({ code: 0 })
      } catch (error: any) {
        const payErrorCode = [-1, 60051]
        storage.remove(getCacheKey('order_params', USER_INFO))
        if (payErrorCode.includes(error.code) && result.data.ext.third_tag) {
          console.log('开始补单')
          await _this.supplementaryOrder(result.data.ext.third_tag, {
            url: result.data.notify_url
          })
          console.log('补单成功')
          callback.complete({ code: 0 })
          return
        } else if (HUAWEIERRORCODEMAP[error.code]) {
          callback.complete({ ...error, code: HUAWEIERRORCODEMAP[error.code] })
          return
        } else if (isDropOrder(error.code)) {
          storage.set(getCacheKey('order_params', USER_INFO), result.data)
        }
        callback.complete(handleTrackError('rxlog_error_pay', error))
      }
    } catch (err) {
      callback.complete(handleTrackError('', err))
    }
  }

  //华为支付时掉单需要补单
  async supplementaryOrder(productId: string, params: any) {
    try {
      console.log('productId...', productId)
      const res = await asyncFunc(qg.obtainOwnedPurchases, {
        ownedPurchasesReq: {
          priceType: 0,
          publicKey: SYSTEM_INFO.publicKey,
          applicationID: SYSTEM_INFO.appid
        }
      })
      const index = res.inAppPurchaseDataList.findIndex((objstr: any) => {
        const item: any = JSON.parse(objstr)
        return item.productId == productId
      })
      const purchaseData =
        res.inAppPurchaseDataList[index] && JSON.parse(res.inAppPurchaseDataList[index])

      if (purchaseData?.purchaseState == 0) {
        const rest = await postPayData(params.url, {
          inAppDataSignature: res.inAppSignature[index],
          inAppPurchaseData: res.inAppPurchaseDataList[index]
        })
        return rest
      }
    } catch (error) {
      console.log('补单错误1', JSON.stringify(error))
      throw error
    }
  }

  //查询已购买商品
  private async obtainOwnedPurchases(
    params: {
      priceType: 0 | 1 | 2
      continuationToken?: string
    }
  ) {
    const data = await asyncFunc(qg.obtainOwnedPurchases, {
      ownedPurchasesReq: {
        ...params,
        publicKey: SYSTEM_INFO.publicKey,
        applicationID: SYSTEM_INFO.appid
      }
    })
    return data


    // qg.obtainOwnedPurchases({
    //   ownedPurchasesReq: {
    //     ...params,
    //     publicKey: SYSTEM_INFO.publicKey,
    //     applicationID: SYSTEM_INFO.appid,
    //   },
    //   success(data: any) {
    //     if (data.continuationToken) {
    //       this.obtainOwnedPurchases(
    //         {
    //           continuationToken: data.continuationToken,
    //           ...params,
    //         },
    //         callback
    //       )
    //     } else {
    //       callback.complete?.({code:0,data})
    //     }
    //   },
    //   fail(msg: any, code: any) {
    //     callback.complete?.({code,msg})
    //   },
    // })
  }


  //查询是否需要补单
  public checkHasCompensatePayOrder() {
    let check = storage.get(getCacheKey('order_params', USER_INFO))
    if (isEmpty(check)) {
      return { code: -1, msg: 'null', data: null }
    } else {
      return { code: 0, msg: 'had', check }
    }
  }

  // cp方主动补单
  public async compensatePayOrder(params: any, callback: {
    complete: (data: any) => void
  }) {
    console.log('开始主动补单')
    try {
      const data = await this.obtainOwnedPurchases({
        priceType: 0
      })
      if (!data.inAppPurchaseDataList || data.inAppPurchaseDataList.length == 0) {
        storage.remove(getCacheKey('order_params', USER_INFO))
        callback?.complete({ code: -1, msg: '不需要补单' })
        return
      }
      const order_params = storage.get(getCacheKey('order_params', USER_INFO))
      const notify_url = order_params.notify_url
      const reqList = []
      for (let i = 0; i < data.inAppPurchaseDataList.length; i++) {
        console.log('data[i]', data.inAppPurchaseDataList[i])
        const item: any = JSON.parse(data.inAppPurchaseDataList[i])

        reqList.push(
          this.supplementaryOrder(item.productId, {
            url: notify_url
          })
        )
      }
      const res = await Promise.all(reqList)
      storage.remove(getCacheKey('order_params', USER_INFO))
      callback?.complete({ code: 0, msg: '补单完成' })
    } catch (error) {
      callback.complete(handleTrackError('rxlog_error_pay', error))
    }

  }

  public async schedulingAction(params: any, callback: IMethodParams) {
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

      }
    } catch (err) {
      callback.complete(handleTrackError('rxlog_error_share', err))
    }
  }

  //获得分享内容
  public async getAdShareData(
    params: IgetShareData,
    callback?: IMethodParams
  ) {
    try {
      const region = params?.region || USER_INFO.region || ''
      const { productId, channelId } = SYSTEM_INFO
      const platform = 'huawei'
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
      callback && callback.complete(handleTrackError('', err))
      return err
    }
  }

  /*广告*/

  //激励广告
  async rewardedVideoAd(
    params: { adUnitId: string, destroyAd?: boolean, func?: string, custom_ext?: any },
    callback: {
      complete?: (data: any) => void
      fail?: (err: any) => void
    }
  ) {
    const RETRYMAX = 1
    let retryed = 0
    let adShareData: any = {}
    if (!params.adUnitId && params.func) {
      adShareData = await this.getAdShareData({
        func: params.func,
        custom_ext: params.custom_ext || {}
      })
      console.log('ad share data', adShareData)
    }
    const adUnitId = params.adUnitId || adShareData?.data?.ad_content?.identify

    if (!this._rewardedVideoAd) {
      this._rewardedVideoAd = qg.createRewardedVideoAd({
        adUnitId,
        fail: (data: any, code: string) => {
          callback.complete && callback.complete(handleTrackError('rxlog_error_ad', data, code))
          callback.fail && callback.fail(handleTrackError('rxlog_error_ad', data, code))
          this.track(
            formatTrackParams({
              eventName: 'track_err',
              apiName: 'rewardedVideoAd',
              reqParams: params,
              errorInfo: {
                code,
                data
              },
              loginInfo: USER_INFO
            }),
            {
              complete: (data: any) => {
                console.info('rewardedVideoAd error add complete func when tracked:', data)
              }
            }
          )
        }
      })
      this._rewardedVideoAd.onLoad(() => {
        this._rewardedVideoAd.show()
      })
      //视频加载失败
      this._rewardedVideoAd.onError((e: any) => {
        if (retryed >= RETRYMAX) {
          console.log('重新尝试加载视频')
          callback.complete && callback.complete(handleTrackError('rxlog_error_ad', e))
          return
        }
        retryed++
        load()
      })
      this._rewardedVideoAd.onClose((res: any) => {
        const isEnded = (res && res.isEnded) || res === undefined
        this._rewardedVideoAd.offLoad()
        this._rewardedVideoAd.destroy()
        this._rewardedVideoAd = null
        callback.complete?.({
          code: isEnded ? 0 : -1,
          data: null,
          msg: isEnded,
          isEnded
        })
      })
    }
    const load = () => {
      this._rewardedVideoAd.load()
    }
    load()
  }

  //获得分享内容
  public async getShareData(
    params: IgetShareData,
    callback: IMethodParams,
    stopCallback?: boolean
  ) {
    try {
      const region = params?.region || USER_INFO.region || ''
      const cacheShareData = storage.get(`rx_schedule_${USER_INFO.tid}_${params.func}_${region}`)
      const { readCache = true } = params
      if (readCache && cacheShareData) {
        const cShareData: any = JSON.parse(cacheShareData)
        console.info('sdk 缓存分享数据：', cShareData)
        this.setScheuleReportProps(cShareData?.data)
        !stopCallback && callback.complete(cShareData)
        return cShareData
      }

      const { productId, channelId } = SYSTEM_INFO
      const platform = 'huawei'
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
    } catch (err) {
      callback.complete(handleTrackError('', err))
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
    }
  }

  // 看广告完成上报
  public async shareSchedulingReport(params: IReqShareScheduleReport, callback: IMethodParams) {
    try {
      const func = params.func
      const region = params?.region || USER_INFO.region || ''
      const sub_channel_id = USER_INFO.subchannelid || ''
      const open_id = USER_INFO.openid || ''
      const scheduling_event = params?.scheduling_event === true ? 'done' : 'fail'
      const Iparams = {
        platform: PLATFORM.MINIGAMEHUAWEI,
        type: 'mini',
        sub_channel_id,
        open_id,
        ...params,
        region,
        scheduling_event,
        properties: {
          region,
          ...this.scheuleReportProps,
          ...params?.properties
        }
      }

      let result = await schedulingReportApi(Iparams)
      if (isEmpty(result?.data)) {
        this.scheduleInitMap = omit(this.scheduleInitMap, func)
        storage.remove(`rx_schedule_${USER_INFO.tid}_${func}_${region}`)
        await this.shareSchedulingInit({}, {
          complete: () => {
            console.log('shareSchedulingInit')
            callback.complete(result)
          }
        })
        return
      } else {
        const remaining_share_count = result?.data?.scheduling?.remaining_share_count || 0
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
        storage.set(`rx_schedule_${USER_INFO.tid}_${func}_${region}`, JSON.stringify(result))
      }

      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError('', error))
    }
  }

  // 分享调度初始化
  public async shareSchedulingInit(params: IReqShareScheduleInit, callback: IMethodParams) {
    try {
      await pubCheck(shareScheduleInitParams, callback, params)
      const req = {
        func: params?.funcs || [],
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

  // 获取埋点调度
  public getShareScheduling(params: { funcs?: string[] }) {
    const funcs = params?.funcs
    if (!funcs) return { code: 0, data: this.scheduleInitMap }
    if (funcs && !isArray(funcs)) {
      const error: any = new Error('funcs must be Array')
      error.code = COMMON_ERROR_CODE.PARAMS_ERROR
      return handleTrackError('', error)
    }
    try {
      console.log('sdk getShareScheduling: ', params, this.scheduleInitMap)
      const data = pick(this.scheduleInitMap, funcs)
      return { code: 0, data }
    } catch (error) {
      return handleTrackError('', error)
    }
  }

  // 获取商业化接口
  public async getOperationScene(callback: IMethodParams) {
    try {
      const res = await getOperationSceneApi()
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  // 商业化上报接口
  public async reportWindowExposure(properties: {
    [key: string]: any
  }, callback: IMethodParams) {
    this.track(
      {
        event: '#window_exposure',
        properties: properties
      },
      {
        complete: (data: any) => {
          callback && callback.complete(data)
        }
      }
    )
  }

  // 游戏区服信息查询
  async getGameArea(params: { area_id: string }, callback: IMethodParams) {
    try {
      let result = await getGameAreaApi(params.area_id)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 游戏区服信息修改
  async putGameArea(params: any, callback: IMethodParams) {
    try {
      let result = await putGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建游戏区服
  async createGameArea(params: any, callback: IMethodParams) {
    try {
      let result = await createGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏区服
  async delGameArea(params: any, callback: IMethodParams) {
    try {
      let result = await delGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询区服列表信息
  async getGameAreaList(callback: IMethodParams) {
    try {
      let result = await getGameAreaListApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建角色
  async createGameCharacter(params: any, callback: IMethodParams) {
    try {
      let result = await createGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 修改游戏角色信息
  async putGameCharacter(params: any, callback: IMethodParams) {
    try {
      let result = await putGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏角色
  async delGameCharacter(params: any, callback: IMethodParams) {
    try {
      let result = await delGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下角色信息列表
  async getGameCharacterAccount(params: any, callback: IMethodParams) {
    try {
      let result = await getGameCharacterAccountApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下某个区服下的角色信息列表
  async getGameCharacter(params: any, callback: IMethodParams) {
    try {
      let result = await getGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询具体角色信息
  async getGameAccountAreaCharacter(params: any, callback: IMethodParams) {
    try {
      let result = await getGameAccountAreaCharacterApi(params)
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

  public request = axios
  public SYSTEM_INFO = SYSTEM_INFO
}

export default SdkClass
