import SdkCommon from './index.common'
import { doRequest, clearAllQueuesAndCache } from './api/request'
import { invalidInitParams, pubCheck } from '@/utils/paramsValid'
import {
  initParamsCheck,
  checkTrackParams,
  shareScheduleInitParams,
  shareScheduleReportParams,
} from '@/utils/checkConfig'
import {
  compensateOrderCheckParams,
  DeleteLoactionCheckParams2,
  getNearlyRediusCheckParams,
  mediaCheckAsyncCheck,
  msgSecCheck,
  ReportLoactionCheckParams,
  wegamePayCheckParams,
  wegameShareCheckParams,
} from '@/utils/checkConfig/wegame'
import { getSearchQueries } from '@/utils/wegame/utils'
import { useSupplementOrder } from '@/utils/wegame/order'
import {
  getShareDataApi,
  getAdShareDataApi,
  orderApi,
  payCallback,
  loginByCredentialApi,
  loginByTokenApi,
  refreshUserInfo,
  reportLocationUpdata,
  deleteReportLocation,
  getNearlyPeasonByRadius,
  trackApi,
  trackCompressedApi,
  msgSecCheckApi,
  activated,
  schedulingReportApi,
  mediaCheckAsyncApi,
  getInitConf,
  getServerTime,
  schedulingInitApi,
  getPromoterCodeApi,
  exchangePromoterCodeApi,
  getNoticeApi,
  createFeedbackApi,
  getFeedbackListApi,
  getFeedbackDetailApi,
  collectPropsApi,
  getPhoneNumberApi,
  changePhoneNumberApi,
  getAdSourceApi,
  requestSubscribeMessageApi,
  getGameAreaApi,
  putGameAreaApi,
  createGameAreaApi,
  delGameAreaApi,
  getGameAreaListApi,
  createGameCharacterApi,
  putGameCharacterApi,
  delGameCharacterApi,
  getGameCharacterAccountApi,
  getGameCharacterApi,
  getGameAccountAreaCharacterApi,
  itemRedemptionApi,
  getEmailListApi,
  getEmailDetailApi,
  receiveEmailApi,
  delEmailApi,
  createActivityIdApi,
  setDynamicMsgApi,
  setShortTextApi,
  getShortTextApi,
  _getInfoApi,
  searchGameAccountApi,
  setChatToolMsgApi,
  getIpApi,
  getOrderStatusApi,
  getUrlParseApi,
  uploadGameInteractionInfoApi
} from '@/api/api'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { SYSTEM_INFO as SYSTEM_INFO_WEGAME } from '@/config/wegame'
import { setupStOffsetRefreshForMiniGame } from '@/utils/stOffset'
import { isEmpty, omit, isObject, pick, isArray } from '@/utils/is'
import {
  asyncFunc,
  handleError,
  qs,
  formatTrackParams,
  customGetStorageSync,
  customSetStorageSync,
  removeStorageByPrefix,
  removeStorageSync,
  printLog,
  customRemoveStorageSync,
  saveTrackDataToStorage,
  startTrackReportTimer,
  updateTrackReportInterval,
  updateMaxCacheCount,
  shouldTriggerImmediateReport,
  triggerImmediateReport
} from '@/utils/utils'
import { AD_ERROR_MAP, COMMON_ERROR_CODE, MODAL_TITLE, MATERIAL_TYPE, TM_TYPE } from '@/config/const'
import { formatDate } from '@/utils/day'
import v4 from 'uuid/v4'
import { PLATFORM } from '@/config/enum'
import { opendataAesdecodeApi } from './api/social'
import { Rules } from '@/utils/async-validator'

const showMap: any = {}

function arrayBufferToJson(arrayBuffer: any) {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    for (let i = 0; i < uint8Array.length; i++) {
      text += String.fromCharCode(uint8Array[i]);
    }
    try {
      return JSON.parse(text)
    } catch (error) {
      return {}
    }
  } catch (err) {
    return {}
  }
}

function minutesToDays(minutes: number) {
  // 一天有 24 小时，一小时有 60 分钟，所以一天有 24 * 60 分钟
  const minutesInADay = 24 * 60;
  // 使用 Math.floor 向下取整
  return Math.floor(minutes / minutesInADay);
}

function timestampToDateTime(timestamp: number) {
  // 创建一个 Date 对象，将时间戳作为参数传入
  let date: any = new Date(timestamp);
  // 获取年
  let year = date.getFullYear();
  // 月份从 0 开始，所以要加 1
  let month = date.getMonth() + 1;
  // 获取日
  let day = date.getDate();
  // 获取小时
  let hour = date.getHours();
  // 获取分钟
  let minute = date.getMinutes();
  // 获取秒
  let second = date.getSeconds();
  // 为了保证月份、日期、小时、分钟、秒的显示格式，小于 10 的数字前面添加 0
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  // 拼接成字符串
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function formatTime(milliseconds: any) {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds = totalSeconds % 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${hours}小时${minutes}分${seconds}秒`;
}

const { expiredVoucherCode, isDropOrder, handleDynamicSupplementOrder } = useSupplementOrder()

const getDevicecode = () => {
  let devicecode = customGetStorageSync('rx_devicecode')
  if (devicecode) {
    return devicecode.code
  } else {
    let code = v4()
    customSetStorageSync('rx_devicecode', { code, openIds: {} })
    return code
  }
}

function validateNumber(num: number) {
  const numStr = num.toString();
  const isSixDigits = /^\d{6}$/.test(numStr);
  if (!isSixDigits) {
    return false;
  }
  const thirdDigit = parseInt(numStr[2]);
  const fourthDigit = parseInt(numStr[3]);
  return `${thirdDigit}${fourthDigit}` === '20';
}


const handleTrackError = (error_action: '' | 'rxlog_error_pay' | 'rxlog_error_login' | 'rxlog_error_share' | 'rxlog_error_init' | 'rxlog_error_ad' | 'requestMerchantTransfer' = '', error: any, code?: any, type?: string) => {
  let error_exception = ''
  try {
    error_exception = JSON.stringify(error.exception || {})
  } catch (e) {

  }
  const handle_error: any = handleError(error, code)
  if (validateNumber(handle_error.code) || !handle_error.isServerError) {
    // 使用实例的 subChannelId
    const sub_channel_id = sdkWegameInstance?.subChannelId || ''
    trackApi([
      {
        event: '#rx_error',
        type: 'track',
        time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        uuid: v4(),
        sub_channel_id: sub_channel_id,
        distinct_id: USER_INFO.openid,
        platform_id: 4,
        product_id: SYSTEM_INFO.productId,
        cpid: Number(SYSTEM_INFO.cpid),
        channel_id: SYSTEM_INFO.channelId,
        devicecode: getDevicecode(),
        properties: {
          ...(type ? { type } : {}),
          error_action,
          error_exception,
          error_type: 'sdk',
          trace_id: v4(),
          rx_version: SYSTEM_INFO.__RX_SDK_VERSION,
          type_tripartite: PLATFORM.WECHAT,
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
    ]).catch((e) => {
      console.log(e)
    })
  }
  return {
    code: handle_error.code,
    msg: handle_error.msg,
    ...(handle_error.thirdcode !== undefined ? { thirdcode: handle_error.thirdcode } : {}),
    ...(handle_error.thirdmsg !== undefined ? { thirdmsg: handle_error.thirdmsg } : {}),
    thirdexception: error.exception || {},
  }
}

const onReportFail = (result: any) => {
  console.error('onReportFail', result)
  handleTrackError('rxlog_error_ad', { ...result, exception: result }, undefined, 'rxlog_error_gdt')
}

const handleGdtTrackResult = (result: any) => {
  console.log('handleGdtTrackResult', result)
  if (result && result.code !== 0) {
    onReportFail(result)
  }
  return result
}

let tencent_sdk: any = null
// 存储 SdkWegame 实例，供 handleTrackError 使用
let sdkWegameInstance: any = null

//微信小游戏sdk
class SdkWegame extends SdkCommon {
  private _ad: WechatMinigame.RewardedVideoAd | null = null
  private _bannerAd: WechatMinigame.BannerAd | null = null
  private _interstitialAd: WechatMinigame.InterstitialAd | null = null
  private _hasAd: { [key in AdTypes]: boolean | undefined } = {
    banner: undefined,
    interstitial: undefined,
    rewarded: undefined,
  }
  private locationInfomation: IlocationInfomation | null = null
  private reportLocationTimer: any = null
  private refreshSession = 0 //用于记录刷新session

  // 上报公共属性接口失败次数
  private trackPublicPropsFailCount = 0
  private funcs: string[] = []

  private back_flow_day: number = 0
  private directAdStatus: any = {}
  private directAdGdtReportQueue: Array<() => void | Promise<void>> = []
  private initConfig: any = {}
  // 调度埋点
  private scheduleInitMap: any = {}
  // 获取分享数据缓存调度上报参数
  private scheuleReportProps: any = {}
  // 将请求实例暴露
  public requestInstance = doRequest
  // 海报分享参数
  private queryPoster: any = {}
  // 是否支持支付广点通上报
  private isSupportGDTReport: boolean = true
  //子渠道id
  public subChannelId: any = null
  // 上报大数据类型
  private dataTrackType: any = []
  private deviceInfo: any = null
  /**
   * 是否登录
   * 使用场景：登录后不允许通过SDK设置子渠道id
   */
  private isLogin: boolean = false
  private isPromoter: boolean = false
  private game_id: string = ''
  private promoInfo: any = {
    timer: null,
    refresh_period_exp: 0,
    polling: 0,
    promo_code: ''
  }
  private saveDeviceInfo() {
    try {
      // @ts-ignore
      this.deviceInfo = wx.getDeviceInfo()
    } catch (e) {
      return
    }
  }
  constructor(initParams: ISdkInitParams) {
    super(initParams)
    try {
      // 保存实例到全局变量，供 handleTrackError 使用
      sdkWegameInstance = this
      wx.setStorageSync('check_support_setStorageSync', 'Support setStorageSync')
      printLog('Support setStorageSync')
      SYSTEM_INFO.isWxAvailable = true
    } catch (e: any) {
      SYSTEM_INFO.isWxAvailable = false
      printLog('Not supported setStorageSync', e)
    }
    console.log('微信小游戏sdk-基础API')
    invalidInitParams(initParams, initParamsCheck)
    console.info('channel sdk check params passed')

    Object.assign(SYSTEM_INFO, SYSTEM_INFO_WEGAME, { ...initParams, index: 0 })
    this.isSupportGDTReport = SYSTEM_INFO?.isSupportGDTReport ?? true

    try {
      const accountInfo = wx.getAccountInfoSync()
      console.info(accountInfo?.miniProgram)
      if (accountInfo?.miniProgram?.version) {
        SYSTEM_INFO.miniVersion = accountInfo?.miniProgram?.version
      }
    } catch (e) {

    }

    // 获取初始化配置
    this.getInitConfig({ complete: initParams.complete })
  }

  private async addFeedback(params: any, callback?: IMethodParams) {
    try {
      const res = await createFeedbackApi(params)
      console.log(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  private getPhoneNumber(params: { isRealtime: boolean, phoneNumberNoQuotaToast: boolean }, callback: IMethodParams) {
    // @ts-ignore
    wx.getPhoneNumber({
      isRealtime: params.isRealtime || false,
      phoneNumberNoQuotaToast: params.phoneNumberNoQuotaToast || true,
      complete: (res: any) => {
        if (res.code) {
          getPhoneNumberApi(res.code).then((res: any) => {
            callback && callback.complete(res)
          }).catch((err: any) => {
            callback && callback.complete(handleTrackError('', err))
          })
        } else {
          callback && callback.complete(handleTrackError('', res))
        }
      }
    })
  }

  private changePhoneNumber(params: { isRealtime: boolean, phoneNumberNoQuotaToast: boolean }, callback: IMethodParams) {
    // @ts-ignore
    wx.getPhoneNumber({
      isRealtime: params.isRealtime || false,
      phoneNumberNoQuotaToast: params.phoneNumberNoQuotaToast || true,
      complete: (res: any) => {
        if (res.code) {
          changePhoneNumberApi(res.code).then((res: any) => {
            callback && callback.complete(res)
          }).catch((err: any) => {
            callback && callback.complete(handleTrackError('', err))
          })
        } else {
          callback && callback.complete(handleTrackError('', res))
        }
      }
    })
  }

  private async getFeedbackList(params: any, callback?: IMethodParams) {
    try {
      const res = await getFeedbackListApi(params)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  private async getFeedbackDetail(params: any, callback?: IMethodParams) {
    try {
      const res = await getFeedbackDetailApi(params)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError('', err))
    }
  }

  private async collectProps(params: any, callback?: IMethodParams) {
    try {
      const res = await collectPropsApi(params)
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
      callback && callback.complete(res)
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
                  console.log(this.subChannelId)
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

  public getDirectAdStatusSync(): any {
    const wxInstance: any = typeof wx !== 'undefined' ? wx : null
    if (typeof wxInstance?.getDirectAdStatusSync !== 'function') return
    return wxInstance.getDirectAdStatusSync()
  }

  public onDirectAdStatusChange(listener: (res: any) => void): void {
    const wxInstance: any = typeof wx !== 'undefined' ? wx : null
    if (typeof wxInstance?.onDirectAdStatusChange !== 'function') return
    wxInstance.onDirectAdStatusChange(listener)
  }

  private normalizeDirectAdStatus(statusInfo: any) {
    const status: any = {}
    const keys = ['isInMask', 'isInDirectGameAd', 'isEndByAbnormal']
    keys.forEach((key) => {
      if (typeof statusInfo?.[key] === 'boolean') {
        status[key] = statusInfo[key]
      }
    })
    return status
  }

  private getDirectAdStatusParams(statusInfo: any = this.directAdStatus) {
    const status = this.normalizeDirectAdStatus(statusInfo)
    const params: any = {}
    const keyMap: any = {
      isInMask: 'is_in_mask',
      isInDirectGameAd: 'is_in_direct_game_ad',
      isEndByAbnormal: 'is_end_by_abnormal',
    }
    Object.keys(status).forEach((key) => {
      params[keyMap[key]] = status[key] ? '1' : '0'
    })
    return params
  }

  private withDirectAdStatus(params: any) {
    const directAdStatus = this.getDirectAdStatusParams()
    if (Object.keys(directAdStatus).length === 0) return params
    return {
      ...params,
      ext: {
        ...(params?.ext || {}),
        custom_ext: {
          ...(params?.ext?.custom_ext || {}),
          bigdata_ext: {
            ...(params?.ext?.custom_ext?.bigdata_ext || {}),
            ...directAdStatus,
          },
        },
      },
    }
  }

  private withDirectAdBigdataExt(params: any) {
    const directAdStatus = this.getDirectAdStatusParams()
    if (Object.keys(directAdStatus).length === 0) return params
    return {
      ...params,
      custom_ext: {
        ...(params?.custom_ext || {}),
        bigdata_ext: {
          ...(params?.custom_ext?.bigdata_ext || {}),
          ...directAdStatus,
        },
      },
    }
  }

  private trackDirectAdStatus(statusInfo: any) {
    if (!statusInfo || typeof statusInfo !== 'object') return
    this.track(
      {
        complete: () => { },
      },
      {
        event: '#direct_ad',
        properties: this.getDirectAdStatusParams(statusInfo),
      }
    )
  }

  private async reportOrQueueDirectAdGdtEvent(report: () => void | Promise<void>) {
    if (this.directAdStatus.isInMask && this.directAdStatus.isInDirectGameAd) {
      this.directAdGdtReportQueue.push(report)
      return
    }
    await report()
  }

  private async flushDirectAdGdtReportQueue() {
    const reports = this.directAdGdtReportQueue.splice(0)
    for (const report of reports) {
      try {
        await report()
      } catch (e) {
        console.error('direct ad gdt report error:', e)
      }
    }
  }

  private handleDirectAdStatus(statusInfo: any, isStatusChange = false) {
    if (!statusInfo || typeof statusInfo !== 'object') return
    this.directAdStatus = this.normalizeDirectAdStatus(statusInfo)
    this.trackDirectAdStatus(statusInfo)
    const isMaskBroken = !this.directAdStatus.isInMask && this.directAdStatus.isInDirectGameAd
    const isContinuePlaying = isStatusChange
      && statusInfo.isInMask === false
      && statusInfo.isInDirectGameAd === false
      && statusInfo.isEndByAbnormal === false
    if (isMaskBroken || isContinuePlaying) {
      this.flushDirectAdGdtReportQueue()
    }
  }

  private setupDirectAdStatus() {
    try {
      const statusInfo = this.getDirectAdStatusSync()
      if (statusInfo) {
        console.log('getDirectAdStatusSync:', statusInfo)
        this.handleDirectAdStatus(statusInfo)
      }
    } catch (e) {
      console.error('getDirectAdStatusSync error:', e)
    }

    try {
      this.onDirectAdStatusChange((res) => {
        console.log('onDirectAdStatusChange:', res)
        this.handleDirectAdStatus(res, true)
      })
    } catch (e) {
      console.error('onDirectAdStatusChange error:', e)
    }
  }

  private async getInitConfig(callback: IMethodParams) {
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
      // console.info('SDK initConfig: ', this.initConfig)

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
      setupStOffsetRefreshForMiniGame(typeof wx !== 'undefined' ? wx : null, getServerTime)
      this.setupDirectAdStatus()
      this.saveDeviceInfo()

      if (!SYSTEM_INFO.isWxAvailable) {
        this.track(
          {
            complete: (data) => {
              console.log(data);
            },
          },
          {
            event: "#storage_error",
            properties: {},
          }
        )
      }
      // 检查是否需要激活
      this.checkNeedActivate()

      // this.loopGetPublicProps()

      // 非服务端上报，初始化广点通sdk, 上报小游戏启动  0服务端上报 1客户端上报
      if (this.initConfig?.advertise_channel?.gdt?.tm == TM_TYPE.CLIENT) {
        try {
          if (this.initConfig?.advertise_switch?.switch == 1) {
            this.back_flow_day = this.initConfig?.advertise_switch?.window_days || 0
          }
          await this.initTencentSdk()
          await this.reportOrQueueDirectAdGdtEvent(() => {
            handleGdtTrackResult(tencent_sdk?.onAppStart())
          })
        } catch (e) {
          console.log(e)
        }
      }

      // 启动定时上报定时器，默认每隔1分钟上报一次收集的数据（使用压缩）
      startTrackReportTimer(trackCompressedApi)

      // 小程序隐藏时触发一次上报（切后台、退出等场景）
      try {
        wx.onHide(() => {
          triggerImmediateReport()
        })
      } catch (e) {
        console.error('注册 onHide 上报失败:', e)
      }

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
      // data: 保留原始错误
      error.data = {
        data: err
      }
      callback.complete(handleTrackError('rxlog_error_init', error))
    }
  }

  private setCpOf(bool: boolean) {
    SYSTEM_INFO.CP_OF = bool
  }

  private getCpOf() {
    return SYSTEM_INFO.CP_OF || false
  }

  // 获取归因数据
  private getAttributionData() {
    const universal: any = getSearchQueries()
    const source_ad: any = {}
    let deviceInfo: any = {}
    try {
      // @ts-ignore
      deviceInfo = wx.getDeviceInfo()
      source_ad.device_info = deviceInfo
    } catch (e) {

    }
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
        default:
          source_ad.ad_rawargs = omit(universal, ['ad_platform'])
          source_ad.ad_platform = universal.ad_platform
      }
      source_ad.ad_platform = universal.ad_platform
    } else {
      return {
        device_info: deviceInfo,
        ad_rawargs: universal
      }
    }

    return source_ad
  }

  private async checkNeedActivate() {
    const activeResult = customGetStorageSync('rx-active-result')
    if (!activeResult) {
      const source_ad: any = this.getAttributionData()
      const user_source: any = this.getAttributionData()
      const distinct_id = v4()
      customSetStorageSync('rx_distinct_id', distinct_id)
      const req: any = {
        stage: 'init',
        distinct_id,
        source_ad,
        user_source,
      }
      try {
        const result = await activated(req)
        customSetStorageSync('rx-active-result', { isSuccess: true, activeResult: result.data })
      } catch (err) {
        customSetStorageSync('rx-active-result', { isSuccess: false, activeResult: req })
      }
    }
  }
  //格式化queryString
  private getLoginQsAndGenerateStruct(query = '') {
    const universal: any = query || getSearchQueries()
    console.info('===============queryString', universal)
    let user_source: any = {}
    if (universal.hasOwnProperty('user_source')) {
      const omitKeys = universal?.user_source === 'transmits' ? ['user_source'] : ['user_source', 'type', 'transmits']
      const leftProps = {
        ...omit(universal, omitKeys),
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
              [universal['user_source']]: leftProps,
            },
          }
        }
        return user_source
      }
    }
    const subPackageInfo: any = customGetStorageSync('rx_sub_package_info')
    if (!isEmpty(subPackageInfo)) {
      user_source = {
        user_source: {
          sub_package: subPackageInfo,
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
  public setSubChannelId(subChannelId: string) {
    try {
      // 登录后不允许设置子渠道id
      if (this.isLogin) {
        return { code: -1, msg: '登录后不允许设置子渠道id' }
      }
      customSetStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId })
      return { code: 0 }
    } catch (error) {
      return handleTrackError('', error)
    }
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

  public login(params: WegameLogin, callback: IMethodParams) {
    return this.authorize(params, callback)
  }

  //授权接口
  async authorize(params: WegameLogin, callback: IMethodParams) {
    let user_source = this.getLoginQsAndGenerateStruct()
    const source_ad = this.getAttributionData()
    try {
      const messageToFriendQuery = this.getMessageToFriendQuery().query
      if (messageToFriendQuery) {
        const queryResult = await getShortTextApi(messageToFriendQuery)
        if (queryResult.code === 0 && queryResult.data.text) {
          // @ts-ignore
          user_source = this.getLoginQsAndGenerateStruct(qs.parse(queryResult.data.text))
        }
      }
    } catch (e) {
      console.log(e)
    }
    try {
      // await pubCheck(wegameLoginParamsCheck, callback, params)
      params.version = params.version || 'normal'
      const { version, desc, sign_fields } = params
      const now = new Date().getTime()
      let distinct_idLocal = customGetStorageSync('rx_distinct_id')
      let distinct_id = distinct_idLocal || v4()
      if (!distinct_idLocal) {
        customSetStorageSync('rx_distinct_id', distinct_id)
      }
      const { custom_ext, ...rest_ext } = params.ext || {}
      let reqLoginData: any = {
        ts: now,
        method: 'minigame',
        distinct_id,
        ...user_source,
        sign_fields,
        migrate_args: params?.migrate_args,
        custom_ext: custom_ext || {},
        ext: {
          ...(rest_ext || {}),
          version,
        },
      }

      try {
        if (this.subChannelId !== null) {
          const queryJson = getSearchQueries()
          if (user_source?.user_source === 'guide' || !user_source?.user_source) {
            reqLoginData.user_source = {
              guide: { ...user_source, subchannelid: this.subChannelId }
            }
            if (queryJson) {
              reqLoginData.user_source.guide = { ...reqLoginData.user_source.guide, ...queryJson }
            }
          }
        }
      } catch (err) {

      }
      if (!params.login_openid) {
        const { code } = await asyncFunc(wx.login)
        reqLoginData.ext.code = code
      }
      //如果是需要拉取信息
      if (version == 'normal') {
        const data = await asyncFunc((wx as any).getUserProfile, {
          lang: 'zh_CN',
          desc: desc || '用于获取昵称和头像',
        })
        reqLoginData.ext.encryptedData = data.encryptedData
        reqLoginData.ext.iv = data.iv
      }
      let userInfo: any = null

      try {
        //把场景值带到登陆接口中 2024-4-16 新增功能
        const getLaunchParams = wx.getLaunchOptionsSync()
        reqLoginData.open_source = getLaunchParams?.scene ? getLaunchParams?.scene + '' : undefined
      } catch (err: any) { }

      /**
       * 20251127 
       * 判断 query scene 字段中是否有 rx 参数, 如果存在代表是海报分享过来的，需要携带参数到登录接口中
       * 不能排除完全是海报场景，如果其他场景在参数中有相关参数也会进入到这个逻辑，但rx参数是唯一标识
       */
      try {
        // 在登录接口中通过 wx.getLaunchOptionsSync 接口获取参数
        const { query } = wx.getLaunchOptionsSync();
        const scene = decodeURIComponent(query?.scene || '');

        // 将 scene 字符串（query 格式）解析成对象
        const sceneParams = scene ? qs?.parse(scene) : {};

        // 检查是否有 key 为 rx 的参数
        if ('rx' in sceneParams) {
          const rxValue = sceneParams?.rx
          // 可以将 rxValue 存储到 reqLoginData 中
          try {
            this.queryPoster = await getUrlParseApi({ identity: rxValue })
            reqLoginData.user_source = {
              ...reqLoginData?.user_source,
              ...this.queryPoster?.data
            }
          } catch (error: any) {
          }
        }
      } catch (err: any) {
      }

      try {
        // 2024-12-18 新增功能
        const query: any = getSearchQueries()
        if (query.subscribetaskid) {
          reqLoginData.async_msg = {
            minigame_subscribe: {
              subscribe_task_id: query.subscribetaskid
            }
          }
        }
      } catch (err: any) {

      }

      reqLoginData = this.withDirectAdBigdataExt(reqLoginData)

      //判断是否需要二次登录
      if (params.login_openid) {
        //二次登录
        reqLoginData.login_openid = params.login_openid
        console.info('double login req: ', reqLoginData)
        userInfo = await loginByTokenApi(this.ActivePrefix(reqLoginData))
        customSetStorageSync('rx-loginState', 1)
      } else {
        //正常登录
        // 投放开关 1开启，2关闭, 开启后传入归因数据，用于投放统计用户回流信息
        const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
        const reqLogin = reflowEnabled ? { ...reqLoginData, device: source_ad } : { ...reqLoginData }

        userInfo = await loginByCredentialApi(this.ActivePrefix(reqLogin))
        customSetStorageSync('rx-loginState', 1)
      }
      Object.assign(USER_INFO, userInfo.data)
      customSetStorageSync('rxToken', userInfo.data.token)

      handleDynamicSupplementOrder()

      try {
        if ((userInfo?.data?.user_flag & 1) == 1) {
          this.isPromoter = true
          this.game_id = userInfo?.data?.cp_user_id
        }
      } catch (e) { }
      // 上报小游戏  0服务端上报 1客户端上报
      if (this.initConfig?.advertise_channel?.gdt?.tm == TM_TYPE.CLIENT) {
        // 判断新用户自动上报广点通
        try {
          await this.reportGdtLogin(userInfo.data?.tid)
        } catch (e) {
          console.log(e)
        }

        // 判断新用户自动上报广点通
        try {
          if ((userInfo.data?.flag & (1 << 0)) == 1) {
            await this.reportRegister()
          }
        } catch (e) {
          console.log(e)
        }


        try {
          console.log('距离上次登录相差：', formatTime(Math.floor((Date.now() - (userInfo.data?.last_login_time || 0) * 1000))))
          // 如果回流周期大于等于1，且当前时间-最后登录时间大于等于回流周期，则按回流周期上报
          if (userInfo.data?.last_login_time && this.back_flow_day && (Date.now() - (userInfo.data?.last_login_time || 0) * 1000) >= (this.back_flow_day * 3600 * 24 * 1000)) {
            await this.reportReActive(this.back_flow_day)
          }
        } catch (e) {
          console.log(e)
        }
      }

      callback.complete(userInfo)

      try {
        this.reportPurchaseByCache()
      } catch (e) {
      }

      try {
        // 更改登录状态为已登录
        this.isLogin = true
      } catch (error) {

      }

      return userInfo
    } catch (err: any) {
      callback.complete(handleTrackError('rxlog_error_login', err, err.errMsg?.includes('fail auth deny') ? COMMON_ERROR_CODE.LOGIN_DENY : COMMON_ERROR_CODE.LOGIN_FAIL))
      this.track(
        {
          complete: (data: any) => {

          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'authorize',
          reqParams: params,
          errorInfo: err,
          loginInfo: USER_INFO,
        })
      )
    } finally {
      // 清理上报支付订单接口所有队列和缓存
      clearAllQueuesAndCache()
      // 清空rx_sub_package_info
      customRemoveStorageSync('rx_sub_package_info')
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
      platform: data?.platform || PLATFORM.WECHAT,
    }
  }

  // 获得海报分享参数
  public getQueryPoster(callback: IMethodParams) {
    try {
      callback.complete(this.queryPoster)
    } catch (error) {
      callback.complete(error)
    }
  }

  //获得分享内容
  public async getShareData(
    params: IgetShareData,
    callback: IMethodParams,
    stopCallback?: boolean
  ) {
    try {
      await pubCheck(wegameShareCheckParams, callback, params)

      const region = params?.region || USER_INFO.region || ''
      const cacheShareData = customGetStorageSync(`rx_schedule_${USER_INFO.tid}_${params.func}_${region}`)
      const { readCache = false } = params
      if (readCache && cacheShareData) {
        const cShareData: any = JSON.parse(cacheShareData)
        console.info('sdk 缓存分享数据：', cShareData)
        this.setScheuleReportProps(cShareData?.data)
        !stopCallback && callback.complete(cShareData)
        return cShareData
      }

      const { productId, channelId } = SYSTEM_INFO
      const platform = PLATFORM.WECHAT
      const transmits = encodeURI(params.transmits || '')
      const func = params.func
      const type = 'mini'
      const sub_channel_id = this.subChannelId || ''
      const open_id = USER_INFO.openid
      const shareData = await getShareDataApi(this.withDirectAdStatus({
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
      }))
      const remaining_share_count = shareData?.data?.scheduling?.remaining_share_count || 0
      console.log('getShareData剩余次数为' + remaining_share_count)
      if (remaining_share_count <= 0) {
        await this.shareSchedulingInit({}, {
          complete: () => {
            if (!stopCallback) {
              callback.complete(shareData)
            }
            this.setScheuleReportProps(shareData?.data)
          }
        })
        return shareData
      }
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
              callback.complete(handleTrackError('rxlog_error_share', err))
            }
          }
        })
      } else {
        if (!stopCallback) {
          callback.complete(handleTrackError('rxlog_error_share', err))
        }
      }
      this.track(
        {
          complete: (data: any) => {
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'getShareData',
          reqParams: params,
          errorInfo: err,
          loginInfo: USER_INFO,
        })
      )
      return handleTrackError('rxlog_error_share', err)
    }
  }

  public isImageUrl(url: any) {
    // 定义常见图片文件扩展名的正则表达式
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    // 定义 URL 协议的正则表达式，通常为 http 或 https
    const urlProtocol = /^(http|https):\/\//i;

    // 先检查是否有有效的协议
    if (!urlProtocol.test(url)) {
      return false;
    }

    // 再检查是否包含图片扩展名
    return imageExtensions.test(url);
  }

  public downloadImage(imageUrl: string) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        // @ts-ignore
        url: imageUrl,
        success: (res) => {
          resolve(res.tempFilePath)
        },
        fail(err: any) {
          reject(err)
        }
      })
    })
  }

  public getMessageToFriendQuery() {
    const query: any = getSearchQueries()
    return {
      query: query.query,
      shareMessageToFriendScene: query.shareMessageToFriendScene
    }
  }

  public async fetchMessageToFriendQuery(callback: IMethodParams) {
    try {
      const messageToFriendQuery = this.getMessageToFriendQuery().query
      const shareMessageToFriendScene = this.getMessageToFriendQuery().shareMessageToFriendScene
      if (messageToFriendQuery) {
        const queryResult = await getShortTextApi(messageToFriendQuery)
        if (queryResult.code === 0 && queryResult.data.text) {
          callback.complete({
            code: 0,
            data: {
              query: qs.parse(queryResult.data.text),
              shareMessageToFriendScene
            }
          })
          return
        }
      }

      callback.complete({
        code: 0,
        data: {
          query: {},
          shareMessageToFriendScene: ''
        }
      })
    } catch (err) {
      callback.complete(handleTrackError('', err))
    }
  }

  public async shareMessageToFriend(params: IgetShareData & { openId?: string, shareMessageToFriendScene: number }, callback: IMethodParams) {
    try {
      const shareCheckParams: Rules = {
        func: {
          type: 'string',
          required: true,
        },
        shareMessageToFriendScene: {
          type: 'number',
          required: true,
        }
      }
      await pubCheck(shareCheckParams, callback, params)
      let shareData = await this.getShareData(params, callback, true)
      console.log('sdk getShareData:', shareData)
      const imageUrl = params.imageUrl || shareData?.data?.content?.image
      const image = this.isImageUrl(imageUrl) ? await this.downloadImage(imageUrl) : imageUrl
      wx.updateShareMenu({
        isUpdatableMessage: false
      })

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
        inviter_subchannelid: this.subChannelId || '',
      })
      query = params.query ? `${query}&${params.query}` : query


      try {
        const queryResult = await setShortTextApi(query)
        query = queryResult.data.short_name
        console.log('queryResult', queryResult)
      } catch (e) {
        query = ''
      }

      wx.setMessageToFriendQuery({
        shareMessageToFriendScene: params.shareMessageToFriendScene,
        // @ts-ignore
        query
      })
      const ctx = wx.getOpenDataContext()
      ctx.postMessage({
        event: 'rx_shareMessageToFriend',
        openid: params.openId || '',
        imageUrl: image,
        title: params.title || shareData?.data?.content?.content
      })
      const onShareMessageToFriend = (res: any) => {
        console.log(res)
        // @ts-ignore
        wx.offShareMessageToFriend(onShareMessageToFriend)
        if (res.success) {
          callback.complete(shareData)
          this.reportShareAppMessage('APP_MESSAGE')
        } else {
          if (res.errMsg.includes('cancel')) {
            callback.complete(handleTrackError('rxlog_error_share', res, 5001))
          } else {
            callback.complete(handleTrackError('rxlog_error_share', res))
          }
        }
      }

      wx.onShareMessageToFriend(onShareMessageToFriend)
    } catch (err) {
      callback.complete(handleTrackError('rxlog_error_share', err))
    }
  }

  public async showShareImageMenu(params: IgetShareData & { needShowEntrance: boolean, style: 'default' | 'v2' }, callback: IMethodParams) {
    try {
      await pubCheck(wegameShareCheckParams, callback, params)
      let shareData = await this.getShareData(params, callback, true)
      console.log('sdk getShareData:', shareData)
      const imageUrl = params.imageUrl || shareData?.data?.content?.image
      const image = this.isImageUrl(imageUrl) ? await this.downloadImage(imageUrl) : imageUrl
      wx.updateShareMenu({
        isUpdatableMessage: false
      })
      wx.showShareImageMenu({
        path: image,
        needShowEntrance: params.needShowEntrance || true,
        style: params.style || 'default',
        success: (res) => {
          callback.complete(shareData)
          this.reportShareAppMessage('APP_MESSAGE')
        },
        fail(err: any) {
          console.log(err)
          if (err.errMsg.includes('cancel')) {
            callback.complete(handleTrackError('rxlog_error_share', err, 5001))
          } else {
            callback.complete(handleTrackError('rxlog_error_share', err))
          }
        }
      })
    } catch (err) {
      callback.complete(handleTrackError('rxlog_error_share', err))
    }
  }

  //分享接口
  public async share(params: IgetShareData, callback: IMethodParams) {
    try {
      if (params.func) {
        await pubCheck(wegameShareCheckParams, callback, params)
      }
      const key = Date.now() + ''

      for (let key in showMap) {
        try {
          wx.offShow(showMap[key])
        } catch (e) {
          console.log(e)
        }
      }

      const shareData: any = params.func
        ? await this.getShareData(params, callback, true)
        : { code: 0 }
      console.log('sdk getShareData:', shareData)
      const autoReport = params.autoReport ?? params.auto_report ?? true
      wx.updateShareMenu({
        isUpdatableMessage: false
      })
      const onHide = () => {
        wx.offHide(onHide)
      }
      const onShow = async () => {
        wx.offShow(onShow)
        callback.complete(shareData)
        if (params.func && autoReport) {
          this.shareSchedulingReport({
            func: params.func,
            region: params.region,
            transmits: params.transmits,
            scheduling_event: true,
            scheduling_type: 'share',
            properties: params.properties
          }, {
            complete(res) {
              console.log(res)
            }
          })
        }
      }
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
        inviter_subchannelid: this.subChannelId || '',
      })
      query = params.query ? `${query}&${params.query}` : query
      wx.onHide(onHide)
      wx.onShow(onShow)
      showMap[key] = onShow
      this.reportShareAppMessage('APP_MESSAGE')
      wx.shareAppMessage({
        title: params.title || params.content || shareData?.data?.content?.content,
        imageUrl: params.imageUrl || params.image || shareData?.data?.content?.image,
        query,
      })
    } catch (err) {
      callback.complete(handleTrackError('rxlog_error_share', err))
      this.track(
        {
          complete: (data: any) => {
            console.info('share error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'share',
          reqParams: params,
          errorInfo: err,
          loginInfo: USER_INFO,
        })
      )
    }
  }

  //分享海报接口
  public async sharePoster(params: IgetShareData, callback: IMethodParams) {
    try {
      // 判断params中至少存在func或者imageUrl中的一个
      if (!params?.func && !params?.imageUrl) {
        callback.complete({ code: 5000, msg: '参数错误 至少存在func或者imageUrl中的一个' })
        return
      }
      // 一键分享需要调用获取分享数据接口，使用shareData中的分享图片
      if (params?.func) {
        let shareData = await this.getShareData({ ...params, get_qrcode: true }, callback, true)
        wx.downloadFile({
          url: shareData?.data?.content?.image,
          success: (res: any) => {
            this.handleShareImageMenu(res?.tempFilePath, params?.needShowEntrance, callback)
          }
        })
      } else {
        // 使用传入的图片url，url需要时本地地址或者微信下载的临时地址
        this.handleShareImageMenu(params?.imageUrl, params?.needShowEntrance, callback)
      }
    } catch (err) {
      callback.complete(handleTrackError('rxlog_error_share', err))
      this.track(
        {
          complete: (data: any) => {
            console.info('share error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'share',
          reqParams: params,
          errorInfo: err,
          loginInfo: USER_INFO,
        })
      )
    }
  }

  // 海报分享图片
  public handleShareImageMenu(imageUrl: any, needShowEntrance: boolean = false, callback: IMethodParams) {
    wx.showShareImageMenu({
      path: imageUrl,
      needShowEntrance: needShowEntrance,
      success: (data: any) => {
        callback.complete({ code: 0, msg: '分享成功', data: data })
      },
      fail: (err: any) => {
        handleTrackError('rxlog_error_share', err)
        if (err?.errMsg?.includes('fail cancel')) {
          callback.complete({ code: 5001, msg: '取消分享' })
        } else {
          callback.complete({ code: 5002, msg: '三方分享错误', thirdmsg: err?.errMsg, ...(err?.errno && { thirdcode: err.errno }) })
        }
      }
    })
  }
  //cp方主动补单
  public async compensatePayOrder(params: any, callback: IMethodParams) {
    try {
      await pubCheck(compensateOrderCheckParams, callback, params)
      let { notify_url, wx_openid, order_no, amount, env, zone_id, pf } = params
      await payCallback(notify_url, {
        wx_openid,
        order_no,
        amount,
        env,
        zone_id,
        pf,
      })
      removeStorageSync(`rx_${USER_INFO.tid}`)
      callback.complete({ code: 0 })
    } catch (err: any) {
      if (expiredVoucherCode.includes(err?.code)) {
        // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证
        removeStorageSync(`rx_${USER_INFO.tid}`)
        callback.complete({ code: 0, originErr: handleTrackError('rxlog_error_pay', err) })
        return
      }
      callback.complete(handleTrackError('rxlog_error_pay', err))
    }
  }
  //查询是否需要补单
  public checkHasCompensatePayOrder() {
    let check = customGetStorageSync(`rx_${USER_INFO.tid}`)
    if (isEmpty(check)) {
      return { code: -1, msg: 'null', data: null }
    } else {
      return { code: 0, msg: 'had', check }
    }
  }

  public async exchangeItemProp(params: any, callback: IMethodParams) {
    try {
      const result = await itemRedemptionApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  public requestMerchantTransfer(params: any, callback: IMethodParams) {
    try {
      // @ts-ignore
      wx.requestMerchantTransfer({
        mchId: params.mchId,
        appId: params.appId || wx.getAccountInfoSync().miniProgram.appId,
        package: params.package,
        success: (res: any) => {
          console.log('success:', res)
          callback.complete({
            code: 0,
            msg: res.errMsg
          })
        },
        fail: (err: any) => {
          handleTrackError('requestMerchantTransfer', err)
          callback.complete({
            code: err.errno,
            msg: err.errMsg,
            thirdcode: err.errno,
            thirdmsg: err.errMsg,
          })
        }
      })
    } catch (err: any) {
      callback.complete(handleTrackError('requestMerchantTransfer', err))
    }
  }

  // 获取同玩互动好友列表
  public getRelationFriendList(
    params: {
      // 是否在用户拒绝授权时自动弹窗引导前往设置页开启授权，默认 true
      guideAuthWhenDeny?: boolean
      // 引导弹窗标题
      authModalTitle?: string
      // 引导弹窗内容
      authModalContent?: string
      // CP 用户 ID，可替代 openid
      cp_user_id?: string
      // 微信签名校验原始字符串；回调无 rawData 时传空字符串
      raw_data?: string
    } = {},
    callback: IMethodParams
  ) {
    const {
      guideAuthWhenDeny = true,
      authModalTitle = '授权提示',
      authModalContent = '需要获取互动好友信息，请在设置中开启授权',
    } = params || {}
    // getRelationFriendList 需基础库 3.16.0 及以上，低版本需做兼容处理
    // @ts-ignore
    if (typeof wx.getRelationFriendList !== 'function') {
      const errMsg = 'getRelationFriendList:fail 当前微信版本过低，请升级到最新微信版本后重试（需基础库 3.16.2 及以上）'
      console.warn(errMsg)
      callback.complete(handleTrackError('', { errMsg }))
      return
    }

    // @ts-ignore
    wx.getRelationFriendList({
      success: async (res: any) => {
        console.log('getRelationFriendList success:', res)
        try {
          const result = await uploadGameInteractionInfoApi({
            iv: res.iv,
            encrypted_data: res.encryptedData,
            signature: res.signature,
            raw_data: res.rawData || params.raw_data || '',
            cp_user_id: params.cp_user_id,
          })
          callback.complete(result)
        } catch (err: any) {
          callback.complete(handleTrackError('', err))
        }
      },
      fail: (err: any) => {
        console.log('getRelationFriendList fail:', err)
        // 判断是否为用户拒绝授权导致的失败，引导用户前往设置页面重新开启授权
        if (guideAuthWhenDeny && err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
          // @ts-ignore
          wx.showModal({
            title: authModalTitle,
            content: authModalContent,
            success: (modalRes: any) => {
              if (modalRes.confirm) {
                // @ts-ignore
                wx.openSetting()
              }
            },
          })
        }
        callback.complete(handleTrackError('', err))
      },
    })
  }

  //支付接口
  public async pay(params: Ipay, callback: IMethodParams) {
    console.log(SYSTEM_INFO.baseUrlList[SYSTEM_INFO.reqUrlIndex])
    let orderReq: any, requestMidasPaymentReq: any, compensateOrderReq: any
    const sessionOverdue = async (err: any, trackEvent?: string) => {
      // 152413 微信小游戏sessionkey过期
      if (err?.code == 152413 && this.refreshSession < 2) {
        this.refreshSession++
        let result = await this.refreshSessionFunc()
        if (result == 1) {
          this.pay(params, callback)
        } else {
          callback.complete(handleTrackError('rxlog_error_pay', err))
          this.track(
            {
              complete: (data: any) => {
                console.info('refresh sessionKey fail when sessionKey expires in pay :', data)
              },
            },
            formatTrackParams({
              eventName: trackEvent || 'track_err',
              apiName: 'pay',
              reqParams: params,
              errorInfo: err,
              loginInfo: USER_INFO,
              orderReq,
              requestMidasPaymentReq,
              compensateOrderReq,
            })
          )
        }
      } else {
        console.log('err 123')
        console.log(err)
        if (err.errCode == -2) {
          err.code = 4001
          err.thirdcode = -2
          callback.complete(handleTrackError('rxlog_error_pay', err))
          return
        }
        callback.complete(handleTrackError('rxlog_error_pay', err, COMMON_ERROR_CODE.PAY_ERROR))
        this.track(
          {
            complete: (data: any) => {
              console.info('pay error add complete func when tracked:', data)
            },
          },
          formatTrackParams({
            eventName: trackEvent || 'track_err',
            apiName: 'pay',
            reqParams: params,
            errorInfo: err,
            loginInfo: USER_INFO,
            orderReq,
            requestMidasPaymentReq,
            compensateOrderReq,
          })
        )
      }
    }
    try {
      await pubCheck(wegamePayCheckParams, callback, params)
      if (params.indulge_auth == 1 && !params.age) {
        throw Error('when indulge_auth equal 1,the age must be required')
      }
      const { pay_type } = params
      let reqOrder = {
        ...params,
        currency: 'CNY',
        openid: USER_INFO.openid,
        sub_channel_id: this.subChannelId,
        is_debug: params.is_debug || 0,
        env: params.env || 0,
        ...(!isEmpty(this.deviceInfo) ? { device_info: this.deviceInfo } : {}),
      }

      switch (pay_type) {
        //米大师虚拟支付
        case 'minigame':
        case 'minigame_v2':
          const isHasCompensateOrder = customGetStorageSync(`rx_${USER_INFO.tid}`)
          if (isHasCompensateOrder) {
            console.info('sdk 支付pay进入补单')
            //补单逻辑
            try {
              let { notify_url, wx_openid, order_no, amount, env, zone_id, pf } =
                isHasCompensateOrder
              let orderForTrack = customGetStorageSync(`rx_${USER_INFO.tid}_track`)
              compensateOrderReq = isHasCompensateOrder
              try {
                this.track(
                  {
                    complete: () => { },
                  },
                  formatTrackParams({
                    eventName: 'notify',
                    apiName: 'pay_callback',
                    reqParams: params,
                    errorInfo: {},
                    loginInfo: USER_INFO,
                    payCallbackReq: {
                      ...compensateOrderReq
                    },
                    state: '开始验证',
                    desc: 'enter supplement order process from invoking pay',
                    ...orderForTrack
                  })
                )
              } catch (err: any) { }


              await payCallback(notify_url, {
                wx_openid,
                order_no,
                amount,
                env,
                zone_id,
                pf,
              })

              try {
                this.track(
                  {
                    complete: () => { },
                  },
                  formatTrackParams({
                    eventName: 'removeTransactionObserver',
                    apiName: 'pay_success',
                    reqParams: params,
                    errorInfo: {},
                    loginInfo: USER_INFO,
                  })
                )
              } catch (err: any) { }

              removeStorageSync(`rx_${USER_INFO.tid}`)
              callback.complete({ code: 0 })
            } catch (err: any) {
              if (expiredVoucherCode.includes(err?.code)) {
                // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证，直接下单
                removeStorageSync(`rx_${USER_INFO.tid}`)
                this.pay(params, callback)
                return
              }
              //新加入的逻辑
              await sessionOverdue(err, 'payresult')
              //新加入的逻辑
              return
            }
          } else {
            reqOrder.callback_from = 1
            reqOrder.ext = {
              ...reqOrder.ext,
              ...{
                wx_openid: USER_INFO.tid,
                zone_id: '1',
                pf: 'android',
              },
            }
            orderReq = reqOrder

            const result = await orderApi(this.withDirectAdStatus(reqOrder))

            this.track(
              {
                complete: () => { },
              },
              formatTrackParams({
                eventName: 'requestproduct',
                apiName: 'pay_order',
                state: '下单成功',
                reqParams: params,
                errorInfo: {},
                loginInfo: USER_INFO,
                orderReq,
                orderRes: result?.data || {},
                ...(result?.data || {})
              })
            )

            const res = result.data
            const { ext, notify_url, order_no, price } = res

            if (ext.amount > ext.balance) {
              const requestMidasPaymentParams = {
                mode: 'game',
                offerId: ext.offer_id,
                currencyType: 'CNY',
                platform: 'android',
                buyQuantity: ext.amount,
                zoneId: params.zoneId || '1',
                env: params.env || 0,
                outTradeNo: order_no,
              } as any

              console.info('wx.requestMidasPayment params: ', requestMidasPaymentParams)
              requestMidasPaymentReq = requestMidasPaymentParams
              await asyncFunc(wx.requestMidasPayment, requestMidasPaymentParams)
              this._reportPurchase(price)
            }

            // 支付成功后发货前的回调函数
            if (callback.paySuccCallback) {
              await Promise.resolve(callback.paySuccCallback())
            }

            try {
              const payCallbackReq = {
                wx_openid: USER_INFO.tid,
                order_no,
                amount: ext.amount,
                env: params.env || 0,
                zone_id: params.zoneId || '1',
                pf: 'android',
              }
              this.track(
                {
                  complete: () => { },
                },
                formatTrackParams({
                  eventName: 'notify',
                  apiName: 'pay_callback',
                  reqParams: params,
                  errorInfo: {},
                  loginInfo: USER_INFO,
                  payCallbackReq: {
                    notify_url,
                    ...payCallbackReq,
                  },
                  state: '开始验证',
                  ...(result?.data || {})
                })
              )
              await payCallback(notify_url, payCallbackReq)

            } catch (err: any) {
              if (isDropOrder(err?.code)) {
                const key = `rx_${USER_INFO.tid}`
                const payParams = {
                  notify_url: notify_url,
                  wx_openid: USER_INFO.tid,
                  order_no,
                  amount: ext.amount,
                  env: params.env || 0,
                  zone_id: params.zoneId || '1',
                  pf: 'android',
                }
                this.track(
                  {
                    complete: () => { },
                  },
                  formatTrackParams({
                    eventName: 'payresult',
                    apiName: 'pay_callback_fail',
                    reqParams: params,
                    errorInfo: err,
                    loginInfo: USER_INFO,
                    payCallbackReq: {
                      ...payParams,
                    },
                    ...(result?.data || {}),
                    desc: 'paycallback dropped order, about to enter the automatic supplement order process'
                  })
                )
                customSetStorageSync(key, payParams)
                try {
                  customSetStorageSync(key + '_track', result?.data)
                } catch (err: any) {
                }
                err.data = err.data || {}
                err.data = {
                  ...err.data,
                  payParams,
                }
                handleDynamicSupplementOrder()
                callback.complete(handleTrackError('rxlog_error_pay', err))
                // await sessionOverdue(err)
                return
              } else {
                //非补单的逻辑
                await sessionOverdue(err, 'payresult')
                return
              }
            }
          }

          break

        case 'midas_game_item':
          reqOrder.callback_from = 1
          reqOrder.ext = {
            ...reqOrder.ext,
            ...{
              wx_openid: USER_INFO.tid,
              zone_id: '1',
              pf: 'android',
            },
          }
          orderReq = reqOrder

          const result = await orderApi(this.withDirectAdStatus(reqOrder))

          this.track(
            {
              complete: () => { },
            },
            formatTrackParams({
              eventName: 'requestproduct',
              apiName: 'pay_order',
              state: '下单成功',
              reqParams: params,
              errorInfo: {},
              loginInfo: USER_INFO,
              orderReq,
              orderRes: result?.data || {},
              ...(result?.data || {})
            })
          )

          try {
            const res = result.data
            const { ext, price } = res

            const requestMidasPaymentParams = {
              paySig: ext.paySig,
              signData: ext.signData,
              signature: ext.signature
            } as any

            console.info('wx.requestMidasPaymentGameItem params: ', requestMidasPaymentParams)
            requestMidasPaymentReq = requestMidasPaymentParams
            // @ts-ignore
            await asyncFunc(wx.requestMidasPaymentGameItem, requestMidasPaymentParams)
            this._reportPurchase(price)
            // 支付成功后发货前的回调函数
            if (callback.paySuccCallback) {
              await Promise.resolve(callback.paySuccCallback())
            }
          } catch (err: any) {
            //非补单的逻辑
            await sessionOverdue(err, 'payresult')
            return
          }

          break
        //米大师索要礼物（朋友代付）
        case 'minigame_friend':
          reqOrder.ext = {
            ...reqOrder.ext,
            ...{
              wx_openid: USER_INFO.tid, //这个地方需要登录获得wx的openid
              zone_id: '1',
              pf: 'android',
            },
          }
          orderReq = reqOrder
          const {
            data: {
              ext: { miniorder },
            },
          } = await orderApi(this.withDirectAdStatus(reqOrder))
          let changeNumberKey = ['env', 'buyQuantity', 'timeStamp']
          for (let key in miniorder) {
            if (changeNumberKey.includes(key)) {
              miniorder[key] = Number(miniorder[key])
            }
          }
          await asyncFunc(wx.requestMidasFriendPayment, {
            ...miniorder,
          })
          break
        //公众号支付
        case 'wxpub':
          if (params.direct_send) {
            reqOrder.ext = {
              customer: 1,
              'direct_send': params.direct_send,
              'title': params.title,
              'desc': params.desc,
              'image': params.image,
              'latest_order_valid': params?.latest_order_valid || false
            }
          } else {
            reqOrder.ext = {
              customer: 1
            }
          }
          orderReq = reqOrder
          const {
            data: { goods_tag, order_no: order_nos, price },
          } = await orderApi(this.withDirectAdStatus(reqOrder))
          const path =
            SYSTEM_INFO.baseUrlList[SYSTEM_INFO.reqUrlIndex] +
            `/v1/ke/wa/wxpub/order?order_no=${order_nos}&channel_id=${SYSTEM_INFO.channelId}&money=${price}&product_id=${SYSTEM_INFO.productId}&time=` +
            Math.ceil(new Date().getTime() / 1000) +
            `&rx_openid=${USER_INFO.openid}&goods_tag=${goods_tag}`

          console.info('sdk 跳转链接: ', path)

          try {
            // 获取现有的缓存数据
            const existingData = customGetStorageSync('rx_cache_order_price')
            let cacheList: any[] = []

            // 如果存在数据，确保是数组格式
            if (existingData) {
              cacheList = Array.isArray(existingData) ? existingData : [existingData]
            }

            // 将新数据插入到数组最前面
            cacheList.unshift({
              order_nos,
              price
            })
            // 如果超过5条数据，只保留前5条
            if (cacheList.length > 5) {
              cacheList = cacheList.slice(0, 5)
            }

            // 保存更新后的数据
            customSetStorageSync('rx_cache_order_price', cacheList)
            const onHide = () => {
              wx.offHide(onHide)
            }
            const onShow = async () => {
              wx.offShow(onShow)
              this.reportPurchaseByCache()
            }
            wx.onHide(onHide)
            wx.onShow(onShow)
          } catch (e) {

          }


          const shareInfo = await this._openCustomerServiceConversation(
            {},
            {
              params: ``,
              desc: '充值',
              func: params.func,
              reconfirm: true,
              sessionFrom: JSON.stringify({
                ...params?.sessionFromExt,
                ruixue_openid: USER_INFO.openid,
                sub_channel_id: this.subChannelId,
                url: path,
                ui: 'ruixue_pay_wxpub',
                goods_tag: goods_tag,
                order_no: order_nos,
                price: String(price),
                priceYuan: String(price / 100),
              }),
            },
            !!params.func
          )
          try {
            this.track(
              {
                complete: () => { },
              },
              formatTrackParams({
                eventName: 'opencustomer',
                apiName: 'pay_callback',
                reqParams: {
                  params: ``,
                  desc: '客服调用参数上报',
                  func: params.func,
                  reconfirm: true,
                  sessionFrom: JSON.stringify({
                    ...params?.sessionFromExt,
                    ruixue_openid: USER_INFO.openid,
                    sub_channel_id: this.subChannelId,
                    url: path,
                    ui: 'ruixue_pay_wxpub',
                    goods_tag: goods_tag,
                    order_no: order_nos,
                    price: String(price),
                    priceYuan: String(price / 100),
                  }),
                  shareInfo: JSON.stringify(shareInfo)
                },

                errorInfo: {},
                loginInfo: USER_INFO,
                payCallbackReq: {},
                order_no: order_nos,
                goods_tag: goods_tag,
                goods_price: String(price),
              })
            )
          } catch (err: any) { }
          break

        case 'jump_miniprogram':
          const short_url = SYSTEM_INFO.short_domain || params.short_url
          if (params.preview_image && !short_url) {
            throw Error('when preview_image is true,the short_domain must be required')
          }
          if (!params.miniprogram_name) {
            throw Error('when pay_type is jump_miniprogram,the miniprogram_name must be required')
          }

          let appId = wx.getAccountInfoSync().miniProgram.appId
          reqOrder.ext = {
            ...reqOrder.ext,
            short_url: short_url || '',
            miniprogram_appid: appId,
            miniprogram_args: params.miniprogram_args || {},
            miniprogram_name: params.miniprogram_name || ''
          }
          console.log('order params')
          console.log(reqOrder)
          const res: any = await orderApi(this.withDirectAdStatus(reqOrder))

          const onShow = async ({ referrerInfo }: any) => {
            console.log('---referrerInfo---', referrerInfo)
            wx.offShow(onShow)
            const appid = referrerInfo?.appId
            const status = referrerInfo?.extraData?.status
            const err: any = {}
            if (appid == res.data.ext.jump_appid) {
              if (status === 0) {
                callback.complete({
                  code: 0
                })
              } else if (status == 4002) {
                err.code = COMMON_ERROR_CODE.PAY_ERROR
                err.thirdcode = -1
                err.msg = '支付失败'
                callback.complete(handleTrackError('rxlog_error_pay', err))
              } else if (status == 4001) {
                err.code = 4001
                err.thirdcode = -2
                err.msg = '取消支付'
                callback.complete(handleTrackError('rxlog_error_pay', err))
              } else {
                err.code = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR
                err.thirdcode = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR
                err.msg = '未知支付状态'
                callback.complete(handleTrackError('rxlog_error_pay', err))
              }
            } else {
              err.code = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR
              err.thirdcode = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR
              err.msg = '未知支付状态'
              callback.complete(handleTrackError('rxlog_error_pay', err))
            }
          }

          if (params.preview_image) {
            wx.previewImage({
              current: 'data:image/png;base64,' + res.data?.ext?.wxacode_base64,
              urls: ['data:image/png;base64,' + res.data?.ext?.wxacode_base64],
              success() {
                wx.onShow(onShow)
              },
              fail: (err: any) => {
                callback.complete(handleTrackError('rxlog_error_pay', err))
              }
            })
          } else {
            try {
              wx.navigateToMiniProgram({
                appId: res.data?.ext?.jump_appid,
                path: `pages/order/order-detail/index?data=${res.data.ext.data}&domain=${encodeURIComponent(SYSTEM_INFO.baseUrlList[SYSTEM_INFO.reqUrlIndex])}&goods_name=${res.data.goods_name}&price=${res.data.price}&name=${params.miniprogram_name}`,
                envVersion: params.envVersion || 'release',
                success() {
                  wx.onShow(onShow)
                },
                fail: (e: any) => {
                  console.log(e)
                  wx.offShow(onShow)
                  if (e.errMsg == 'navigateToMiniProgramWithoutTapCheck:fail cancel') {
                    callback.complete(handleTrackError('rxlog_error_pay', {
                      code: COMMON_ERROR_CODE.CANCEL_JUMP_MINIGAME,
                      msg: '取消跳转小程序支付',
                      thirdcode: COMMON_ERROR_CODE.CANCEL_JUMP_MINIGAME
                    }))
                  } else {
                    callback.complete(handleTrackError('rxlog_error_pay', e))
                  }
                }
              })
            } catch (e) {
              console.log(e)
              wx.offShow(onShow)
              callback.complete(handleTrackError('rxlog_error_pay', e))
            }
          }
          return

        case 'wechath5':
          reqOrder.ext = {
            "miniprogram": true
          }
          orderReq = reqOrder
          const resData = await orderApi(this.withDirectAdStatus(reqOrder))

          callback.complete({
            code: 0,
            pay_url: resData.data?.ext?.pay_url
          })
          return

        // 银联云闪付h5支付
        case 'aums':
          reqOrder.ext = {
            pay_type: 'h5',
          }
          orderReq = reqOrder
          const {
            data: { goods_tag: goods_tags, order_no, price: priceFen, ext: { url } },
          } = await orderApi(this.withDirectAdStatus(reqOrder))

          const sessionFromStr = JSON.stringify({
            ...params?.sessionFromExt,
            url,
            ui: 'ruixue_pay_aums_h5',
            ruixue_openid: USER_INFO.openid,
            goods_tag: goods_tags,
            order_no,
            price: String(priceFen),
            priceYuan: String(priceFen / 100)
          })
          console.log('sdk 打开客服 sessionFrom参数', sessionFromStr)
          try {
            this.track(
              {
                complete: () => { },
              },
              formatTrackParams({
                eventName: 'opencustomer',
                apiName: 'pay_callback',
                reqParams: {
                  params: ``,
                  desc: '云闪付 客服调用参数上报',
                  func: params.func,
                  reconfirm: true,
                  sessionFrom: JSON.stringify({
                    ...params?.sessionFromExt,
                    ruixue_openid: USER_INFO.openid,
                    url,
                    ui: 'ruixue_pay_wxpub',
                    goods_tag: goods_tag,
                    order_no: order_nos,
                    price: String(price),
                    priceYuan: String(price / 100),
                  }),
                },
                errorInfo: {},
                loginInfo: USER_INFO,
                payCallbackReq: {},
                order_no: order_nos,
                goods_tag: goods_tag,
                goods_price: String(price),
              })
            )
          } catch (err: any) { }

          await this._openCustomerServiceConversation(
            {},
            {
              params: ``,
              desc: '充值',
              func: params.func,
              reconfirm: true,
              sessionFrom: sessionFromStr,
            }
          )
          break

        // wx.requestMidasPaymentGameItem 支持ios ， 道具直购、游戏币购买
        case 'midas_payment_game_item':
          // 判断是否支持 Ios wx.requestMidasPaymentGameItem
          try {
            // @ts-ignore
            if (wx.checkIsSupportMidasPayment) {
              // @ts-ignore
              wx.checkIsSupportMidasPayment({
                success: async (res: any) => {
                  if (res.data.allow_pay) {
                    reqOrder.callback_from = 1
                    reqOrder.ext = {
                      ...reqOrder.ext,
                      ...{
                        wx_openid: USER_INFO.tid,
                        zone_id: '1',
                        pf: 'android',
                      },
                    }
                    orderReq = reqOrder

                    // mode 为 coins 时，使用 minigame_v2 支付，否则使用 midas_game_item 支付
                    reqOrder.pay_type = params?.mode === 'coins' ? 'minigame_v2' : 'midas_game_item'

                    const result_order = await orderApi(this.withDirectAdStatus(reqOrder))

                    this.track(
                      {
                        complete: () => { },
                      },
                      formatTrackParams({
                        eventName: 'requestproduct',
                        apiName: 'pay_order',
                        state: '下单成功',
                        reqParams: params,
                        errorInfo: {},
                        loginInfo: USER_INFO,
                        orderReq,
                        orderRes: result_order?.data || {},
                        ...(result_order?.data || {})
                      })
                    )

                    try {
                      const res = result_order.data
                      const { ext, price } = res

                      const requestMidasPaymentParams = {
                        paySig: ext.paySig,
                        signData: { mode: params?.mode, ...ext.signData },
                        signature: ext.signature
                      } as any

                      console.info('wx.requestMidasPaymentGameItem params: ', requestMidasPaymentParams)
                      requestMidasPaymentReq = requestMidasPaymentParams
                      // @ts-ignore
                      await asyncFunc(wx.requestMidasPaymentGameItem, requestMidasPaymentParams)
                      this._reportPurchase(price)
                      // 支付成功后发货前的回调函数
                      if (callback.paySuccCallback) {
                        await Promise.resolve(callback.paySuccCallback())
                      }
                    } catch (err: any) {
                      //非补单的逻辑
                      await sessionOverdue(err, 'payresult')
                      return
                    }
                  } else {
                    callback.complete({ code: COMMON_ERROR_CODE.PAY_TYPE_ERROR, msg: '当前环境不支持该支付方式', data: params })
                  }
                },
                fail: (err: any) => {
                  callback.complete({ code: -1, msg: 'requestMidasPaymentGameItem 支付方式支付失败', data: params })
                }
              })
            } else {
              callback.complete({ code: COMMON_ERROR_CODE.PAY_TYPE_ERROR, msg: '当前环境不支持该支付方式', data: params })
            }
          } catch (error) {
            callback.complete({ code: -1, msg: '支付失败' })
          }
          break
        default:
          callback.complete(handleTrackError('rxlog_error_pay', { code: 4000, msg: `未知的支付方式 ${pay_type}` }))
          return
      }
      callback.complete({ code: 0 })
      this.refreshSession = 0

    } catch (err) {
      //新加入的逻辑
      await sessionOverdue(err, 'payresult')
    } finally {
      // 清理上报支付订单接口所有队列和缓存
      clearAllQueuesAndCache()
    }
  }
  public async _openCustomerServiceConversation(
    { complete }: Partial<IMethodParams>,
    { params, desc = '', func, title, image, reconfirm, sessionFrom = "{}" }: ConversationParams,
    showMessageCard = true
  ) {
    let shareInfo = {}
    let infoResult: any = {}
    let ip = ''
    let access_token = ''
    const devicecode = getDevicecode()

    if (desc !== '充值') {
      try {
        await getIpApi()
      } catch (e: any) {
        ip = e.client_ip
      }
      try {
        infoResult = await _getInfoApi()
      } catch (e) {
        console.log(e)
      }

      try {
        access_token = customGetStorageSync('rxToken').access
      } catch (e) {
        console.log(e)
      }

      console.log('sessionFrom', sessionFrom)

      if (typeof sessionFrom === 'object') {
        sessionFrom = {
          // @ts-ignore
          ...sessionFrom,
          r_mode: `${infoResult?.data.r_mode || 0}`,
          ip,
          devicecode,
          access_token
        }
      } else {
        try {
          sessionFrom = {
            ...JSON.parse(sessionFrom),
            r_mode: `${infoResult?.data.r_mode || 0}`,
            ip,
            devicecode,
            access_token
          }
          sessionFrom = JSON.stringify(sessionFrom)
        } catch (e) {
          console.log(e)
        }
      }
    }

    try {
      console.info(JSON.parse(sessionFrom))
    } catch (e) {
      console.info(sessionFrom)
    }
    try {
      if (func) {
        const { data } = await getShareDataApi(this.withDirectAdStatus({
          product_id: SYSTEM_INFO.productId,
          channel_id: SYSTEM_INFO.channelId,
          sub_channel_id: this.subChannelId || '',
          region: USER_INFO.region || '',
          func,
          platform: PLATFORM.WECHAT,
          type: 'mini',
        }))
        if (data) {
          title = data.content?.content
          image = data.content?.image
          shareInfo = data.content || {}
        }
      }
      // await asyncFunc(wx.showModal, {
      //   title: MODAL_TITLE,
      //   content: `请点击确定进入[客服会话]${desc}!`,
      //   showCancel: false,
      // })
      const openConversation = async () => {
        try {
          const result = await asyncFunc(wx.openCustomerServiceConversation, {
            showMessageCard,
            sessionFrom: sessionFrom,
            sendMessageTitle: title,
            sendMessagePath: params,
            sendMessageImg: image,
          })
          //新增逻辑
          complete && complete({ code: 0, data: { ...result, params: params } })
        } catch (error) {
          const { errMsg } = error as any
          if (errMsg && !errMsg.includes('cancel')) {
            if (complete) {
              complete(handleTrackError('', error))
            } else {
              throw error
            }
          }
          let confirm
          if (reconfirm) {
            ; ({ confirm: confirm } = await asyncFunc(wx.showModal, {
              title: MODAL_TITLE,
              content: `因版本限制, 需通过[客服会话]${desc}, 请您谅解!`,
              cancelText: '我知道了',
              confirmText: '立即前往',
            }))
          }
          if (confirm) {
            await openConversation()
          } else {
            if (complete) {
              console.log('触发2')
              complete(handleTrackError('', error))
            } else {
              throw new Error('用户取消')
            }
          }
        }
      }
      await openConversation()
    } catch (error) {
      if (complete) {
        complete(handleTrackError('', error))
      } else {
        handleTrackError('', error)
      }
      this.track(
        {
          complete: (data: any) => {
            console.info('_openCustomerServiceConversation error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: '_openCustomerServiceConversation',
          reqParams: {
            params,
            desc,
            func,
            title,
            image,
            reconfirm,
            sessionFrom,
          },
          errorInfo: error,
          loginInfo: USER_INFO,
        })
      )
    }

    return shareInfo
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
        const ad_type = params.adUnitId || shareData?.data?.ad_content?.ad_type

        switch (ad_type) {
          case 'custom_cell':
            this.createCustomAd({
              adUnitId,
              custom_ext: params.custom_ext,
              style: params.cellStyle || params.style || {}
            },
              {
                complete:
                  // @ts-ignore
                  (args: any) => {
                    callback.complete({
                      scheduling_type: 'ad',
                      ad_type,
                      ...(args || {})
                    })
                  }
              })
            break
          case 'custom_cells':
            this.createCustomAd({
              adUnitId,
              custom_ext: params.custom_ext,
              style: params.cellsStyle || params.style || {}
            },
              {
                complete:
                  // @ts-ignore
                  (args: any) => {
                    callback.complete({
                      scheduling_type: 'ad',
                      ad_type,
                      ...(args || {})
                    })
                  }
              })
            break
          case 'custom_matrix':
            this.createCustomAd({
              adUnitId,
              custom_ext: params.custom_ext,
              style: params.matrixStyle || params.style || {}
            },
              {
                complete:
                  // @ts-ignore
                  (args: any) => {
                    callback.complete({
                      scheduling_type: 'ad',
                      ad_type,
                      ...(args || {})
                    })
                  }
              })
            break
          case 'custom_banner':
            this.createCustomAd({
              adUnitId,
              custom_ext: params.custom_ext,
              style: params.bannerStyle || params.style || {}
            },
              {
                complete:
                  // @ts-ignore
                  (args: any) => {
                    callback.complete({
                      scheduling_type: 'ad',
                      ad_type,
                      ...(args || {})
                    })
                  }
              })
            break
          case 'interstitial':
            this.interstitialAd({
              adUnitId,
              custom_ext: params.custom_ext
            },
              {
                complete:
                  // @ts-ignore
                  (args: any) => {
                    callback.complete({
                      scheduling_type: 'ad',
                      ad_type,
                      ...(args || {})
                    })
                  }
              })
            break
          default:
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
                      ad_type,
                      ...(args || {})
                    })
                  }
              })
        }
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
      const platform = 'wechat'
      const transmits = encodeURI(params.transmits || '')
      const func = params.func
      const type = 'mini'
      const sub_channel_id = this.subChannelId || ''
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

  public async createCustomAd(data: any, { complete, fail: failCallback }: IMethodParams) {
    console.log('createCustomAd')
    let adShareData: any = {}
    if (!data.adUnitId && data.func) {
      adShareData = await this.getAdShareData({
        func: data.func,
        custom_ext: data.custom_ext || {}
      })
      console.log('ad share data', adShareData)
    }
    const adUnitId = data.adUnitId || adShareData?.data?.ad_content?.identify

    console.log('adUnitId:', adUnitId)
    // @ts-ignore
    const customAd: any = wx.createCustomAd({ adUnitId, style: data.style })
    if (customAd) {
      customAd.onClose((res: any) => {
        customAd.destroy()
        // complete({
        //   code: 1,
        //   msg: '原生模板广告关闭'
        // })
      })
      customAd.onError((err: any) => {
        console.log(err)
        customAd.destroy()
      })
      let p = customAd.show()
      p.then(() => {
        complete && complete({
          code: 0,
          msg: '原生模板广告显示',
          ad: customAd
        })
      }).catch((error: any) => {
        console.log(`show custom ad failed, error`)
        console.log(error)
        const _error = handleTrackError('rxlog_error_ad', {
          code: -1,
          msg: error.errMsg,
          thirdcode: error.errCode,
          thirdmsg: error.errMsg,
        })
        complete(_error)
        failCallback && failCallback(_error)
      })
    } else {
      const _error = handleTrackError('rxlog_error_ad', {
        code: -1,
        msg: '创建广告组件失败'
      })
      complete(_error)
      failCallback && failCallback(_error)
    }
  }

  //激励广告
  public async rewardedVideoAd(data: IRequestAdData, { complete, fail: failCallback }: IMethodParams) {
    console.log('rewardedVideoAd')

    let adShareData: any = {}
    if (!data.adUnitId && data.func) {
      adShareData = await this.getAdShareData({
        func: data.func,
        custom_ext: data.custom_ext || {}
      })
      console.log('ad share data', adShareData)
    }
    const adUnitId = data.adUnitId || adShareData?.data?.ad_content?.identify
    console.log('adUnitId:', adUnitId)

    const fail = (error: any) => {
      /**
       * 广告错误码两种字段
       * 字段1: err_code
       * errMsg: "operateWXDataForAd:fail invalid scope"
       * err_code: -12001
       *
       * 字段2: errCode
       * errMsg: "广告单元无效"
       * errCode: 1002
       */
      error.message = AD_ERROR_MAP[error.errCode] || error.message || error.errMsg
      const err: any = new Error(error.message)
      // data: 保留原始错误
      err.data = {
        data: error
      }
      const handle_err = handleTrackError('rxlog_error_ad', error)
      complete(handle_err)
      failCallback && failCallback(handle_err)
      this.track(
        {
          complete: (data: any) => {
            console.info('rewardedVideoAd error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'rewardedVideoAd',
          reqParams: data,
          errorInfo: error,
          loginInfo: USER_INFO,
        })
      )
    }
    try {
      let ad: WechatMinigame.RewardedVideoAd
      const onClose: any = async ({ isEnded }: { isEnded: boolean }) => {
        ad.offClose(onClose)
        if (isEnded) {
          complete({
            code: 0,
            data: null,
            msg: isEnded,
            isEnded,
          })
        } else {
          complete({
            code: -1,
            data: null,
            msg: isEnded,
            isEnded,
          })
        }

        try {
          if (data.destroyAd) {
            ad.destroy()
            console.info('destroy ad')
            this._ad = null
            // @ts-ignore
            ad = null
          }
        } catch (e) {

        }
      }
      if (!this._ad) {
        ad = wx.createRewardedVideoAd({
          adUnitId,
          multiton: data.multiton || false
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
          ad.onError((error) => {
            this._hasAd.rewarded = false
            reject(error)

            try {
              if (data.destroyAd) {
                ad.destroy()
                console.info('destroy ad')
                this._ad = null
                // @ts-ignore
                ad = null
              }
            } catch (e) {

            }
          })
          ad.load()
        })
        console.info(this._ad)
      }
      ad = this._ad as WechatMinigame.RewardedVideoAd
      if (data.isCheck) {
        complete({
          code: 0,
          ...data,
          adUnitId,
          isEnded: false,
          ad,
        })
      } else {
        ad.onClose(onClose)
        // try {
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
  //插入广告
  public async interstitialAd(data: any, { complete }: IMethodParams) {
    console.log('interstitialAd')

    let adShareData: any = {}
    if (!data.adUnitId && data.func) {
      adShareData = await this.getAdShareData({
        func: data.func,
        custom_ext: data.custom_ext || {}
      })
      console.log('ad share data', adShareData)
    }
    const adUnitId = data.adUnitId || adShareData?.data?.ad_content?.identify
    console.log('adUnitId:', adUnitId)
    try {
      let ad: WechatMinigame.InterstitialAd
      if (this._interstitialAd) {
        ad = this._interstitialAd
      } else {
        ad = wx.createInterstitialAd({
          adUnitId,
        })
        await new Promise((resolve, reject) => {
          ad.onLoad(() => {
            this._interstitialAd = ad
            this._hasAd.interstitial = true
            resolve(undefined)
          })
          ad.onError((error) => {
            this._hasAd.interstitial = false
            reject(error)
          })
        })
      }
      if (!data.isCheck) {
        await ad.show()
      }
      complete({
        code: 0,
        ...data,
        ad,
      })
    } catch (error: any) {
      error.message = AD_ERROR_MAP[error.errCode] || error.message || error.errMsg
      const err: any = new Error(error.message)
      // data: 保留原始错误
      err.data = {
        data: error
      }
      complete(handleTrackError('rxlog_error_ad', error))
      this.track(
        {
          complete: (data: any) => {
            console.info('interstitialAd error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'interstitialAd',
          reqParams: data,
          errorInfo: error,
          loginInfo: USER_INFO,
        })
      )
    }
  }

  //banner 广告
  public async bannerAd(data: IRequestBannerAd, { complete }: IMethodParams) {
    try {
      let ad: WechatMinigame.BannerAd
      if (this._bannerAd) {
        ad = this._bannerAd
      } else {
        ad = wx.createBannerAd({
          adIntervals: data.adIntervals,
          adUnitId: data.adUnitId,
          style: data.style,
        })
        await new Promise((resolve, reject) => {
          ad.onLoad(() => {
            this._bannerAd = ad
            this._hasAd.banner = true
            resolve(undefined)
          })
          ad.onError((error) => {
            this._hasAd.banner = false
            reject(error)
          })
        })
      }
      if (!data.isCheck) {
        await ad.show()
      }
      complete({
        code: 0,
        ...data,
        ad,
      })
    } catch (error: any) {
      error.message = AD_ERROR_MAP[error.errCode] || error.message || error.errMsg
      const err: any = new Error(error.message)
      // data: 保留原始错误
      err.data = {
        data: error
      }
      complete(handleTrackError('rxlog_error_ad', error))
      this.track(
        {
          complete: (data: any) => {
            console.info('bannerAd error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'bannerAd',
          reqParams: data,
          errorInfo: error,
          loginInfo: USER_INFO,
        })
      )
    }
  }

  // 分享调度初始化
  public async shareSchedulingInit(params: IReqShareScheduleInit, callback: IMethodParams) {
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

  // 看广告完成上报
  public async shareSchedulingReport(params: IReqShareScheduleReport, callback: IMethodParams) {
    try {
      await pubCheck(shareScheduleReportParams, callback, params)
      const func = params.func
      const region = params?.region || USER_INFO.region || ''
      const sub_channel_id = this.subChannelId || ''
      const open_id = USER_INFO.openid || ''
      const scheduling_event = params?.scheduling_event === true ? 'done' : 'fail'
      const Iparams = this.withDirectAdBigdataExt({
        platform: PLATFORM.WECHAT,
        type: 'mini',
        sub_channel_id,
        open_id,
        ...params,
        region,
        scheduling_event,
        properties: {
          region,
          ...params?.properties,
        }
      })
      //ad不上报上一次的分享数据
      if (params.scheduling_type == 'share') {
        Iparams.properties = { ...this.scheuleReportProps, ...Iparams.properties }
      }

      let result = await schedulingReportApi(Iparams)
      if (isEmpty(result?.data)) {
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
      callback.complete(handleTrackError('', error))
    }
  }

  async refreshSessionFunc() {
    try {
      const { code } = await asyncFunc(wx.login)
      await refreshUserInfo({
        version: 'base',
        code,
      })
      return 1
    } catch (err: any) {
      return -1
    }

  }
  //同步用户信息
  async infoSync(CPcallback: IMethodParams, info: any) {
    try {
      const { code } = await asyncFunc(wx.login)
      const { encryptedData, iv } = await asyncFunc(wx.getUserProfile, {
        lang: 'zh_CN',
        desc: info?.desc || '用于获取昵称和头像',
      })
      let result = await refreshUserInfo({
        code,
        encryptedData,
        iv,
        version: info?.version || 'normal'
      })
      CPcallback.complete(result)
    } catch (error) {
      CPcallback.complete(handleTrackError('', error))
    }
  }

  async userInfoSilentSync(CPcallback: IMethodParams, info: any) {
    try {
      let { authSetting } = await asyncFunc(wx.getSetting)
      // console.info('======scope.userInfo======', authSetting['scope.userInfo'])
      const methodParams: any = CPcallback?.complete ? { complete: CPcallback.complete } : {}
      if (authSetting['scope.userInfo'] === true) {
        // 允许授权过
        await this._userInfoSilentSync(methodParams, info)
      } else {
        // 从未进入过小游戏（authSetting['scope.userInfo'] === undefined） 和 拒绝授权过（authSetting['scope.userInfo'] === false）
        // 小游戏内使用 wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口(本地开发者工具会弹出来，真机调试不行)
        await this.infoSync(methodParams, info)
      }

    } catch (error) {
      CPcallback?.complete && CPcallback.complete(handleTrackError('', error))
    }
  }

  async _userInfoSilentSync(callback: IMethodParams, info: any) {
    try {
      const { code } = await asyncFunc(wx.login)
      let { encryptedData, iv } = await asyncFunc(wx.getUserInfo, {
        lang: 'zh_CN',
      })
      let result = await refreshUserInfo({
        code,
        encryptedData,
        iv,
        version: info?.version || 'normal'
      })
      callback?.complete && callback.complete(result)
    } catch (error) {
      callback?.complete && callback.complete(handleTrackError('', error))
    }
  }
  //获得wx的地理位置
  async handleLoacation() {
    if (!((wx as any).getFuzzyLocation)) {
      const error: any = new Error('wx.getFuzzyLocation not exist')
      error.code = COMMON_ERROR_CODE.API_NOT_EXIST
      throw error
    }
    try {
      let result = await asyncFunc((wx as any).getFuzzyLocation, { type: 'wgs84' })
      this.locationInfomation = { longitude: result.longitude, latitude: result.latitude }
      return result
    } catch (err: any) {
      const error: any = new Error(err?.errMsg || 'wx.getLocation fail')
      if (err?.errMsg.includes('deny')) {
        error.code = COMMON_ERROR_CODE.LOCATION_AUTH_DENY
      } else {
        error.code = COMMON_ERROR_CODE.LOCATION_FAIL
      }
      throw error
    }
  }
  //获得地理位置授权 (获得地理位置公共方法)
  async authorizeLocation(callback?: Partial<IMethodParams>) {
    try {
      let { authSetting } = await asyncFunc(wx.getSetting)
      if (authSetting['scope.userFuzzyLocation'] === true) {
        const location = await this.handleLoacation()
        callback?.complete && callback.complete({ code: 0, data: location })
        return location
      }
      else if (authSetting['scope.userFuzzyLocation'] === undefined) {
        const location = await this.handleLoacation()
        callback?.complete && callback.complete({ code: 0, data: location })
        return location
      }
      if (
        authSetting['scope.userFuzzyLocation'] != undefined &&
        authSetting['scope.userFuzzyLocation'] != true
      ) {
        let res = await asyncFunc(wx.showModal, {
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则无法相关功能！',
        })
        if (res.cancel) {
          wx.showToast({
            title: '您已拒绝授权!',
            icon: 'none',
          })
        } else if (res.confirm) {
          let openSetting = await asyncFunc(wx.openSetting)
          if (openSetting.authSetting['scope.userFuzzyLocation'] === true) {
            wx.showToast({
              title: '授权成功!',
              icon: 'none',
            })
            const location = await this.handleLoacation()
            callback?.complete && callback.complete({ code: 0, data: location })
            return location
          } else {
            wx.showToast({
              title: '授权失败!',
              icon: 'none',
            })
          }
        }
        const error: any = new Error('您已拒绝授权')
        error.code = COMMON_ERROR_CODE.LOCATION_AUTH_DENY
        throw error
      }
    } catch (error) {
      // 传了回调函数就不往后透传错误
      if (callback?.complete) {
        callback.complete(handleTrackError('', error))
      } else {
        throw error
      }

    }
  }
  //上报的http接口
  public async reportLocationHttpFun(params: IreportLoaction, callback?: Partial<IMethodParams>) {
    try {
      let result = await this.authorizeLocation()
      let report = await reportLocationUpdata({
        lon: result.longitude,
        lat: result.latitude,
        types: params.types,
      })
      return report
    } catch (error) {
      if (callback?.complete) {
        callback.complete(handleTrackError('', error))
      } else {
        throw error
      }
    }
  }
  //开始上报经纬度坐标
  public async startReportLoaction(params: IreportLoaction, { complete }: IMethodParams) {
    try {
      await pubCheck(ReportLoactionCheckParams, { complete }, params)
      if (this.reportLocationTimer != null) return
      params.reportSpace =
        params.reportSpace < 30000 || params.reportSpace == undefined ? 30000 : params.reportSpace
      let resReport = await this.reportLocationHttpFun(params)
      complete(resReport)
      this.reportLocationTimer = setInterval(async () => {
        await this.reportLocationHttpFun(params)
      }, params.reportSpace)
    } catch (error) {
      complete(handleTrackError('', error))
    }
  }
  //停止上报经纬度
  public stopReportLocation() {
    clearInterval(this.reportLocationTimer)
    this.reportLocationTimer = null
  }
  //删除经纬度坐标
  public async deleteReportLocation(params: IreqdeleteReportLocation, { complete }: IMethodParams) {
    try {
      await pubCheck(DeleteLoactionCheckParams2, { complete }, params)
      let result = await deleteReportLocation(params)
      complete(result)
    } catch (error) {
      complete(handleTrackError('', error))
    }
  }
  //获得半径内用户
  public async getNearlyPeasonByRadius(params: IreqNearlyPeason, { complete }: IMethodParams) {
    try {
      let location = this.locationInfomation
      if (location == null) {
        location = await this.authorizeLocation()
      }
      await pubCheck(getNearlyRediusCheckParams, { complete }, params)
      let result = await getNearlyPeasonByRadius({
        lon: location!.longitude,
        lat: location!.latitude,
        ...params,
      })
      complete(result)
    } catch (error) {
      complete(handleTrackError('', error))
    }
  }

  //大数据上报
  //数据上报
  public async track(callback: IMethodParams, params: trackParams) {
    try {
      await pubCheck(checkTrackParams, callback, params)

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
      // let time = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
      let time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ')
      let uuids = v4()
      let platform_id: 4 = 4
      let { cpid: copyCpid, productId: product_id } = SYSTEM_INFO
      let cpid = Number(copyCpid)
      // 根据 event 获得当前 event 下的公共属性
      const publicPropskey = this.initConfig?.event_public_attr?.public_attr?.[params.event] || []
      const publicPropsByCache = customGetStorageSync('rx_public_props')
      const publicProps = pick(publicPropsByCache, publicPropskey)
      const new_properties: any = {}

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

      new_properties.st_offset = `${SYSTEM_INFO.st_offset || ''}`

      let reqarr: douyinTrackForReq[] = [
        {
          type,
          time,
          uuid: uuids,
          sub_channel_id: this.subChannelId || '',
          distinct_id: USER_INFO.openid,
          platform_id,
          product_id,
          cpid,
          channel_id: SYSTEM_INFO.channelId,
          devicecode,
          ...{
            ...params,
            properties: {
              ...new_properties,
              ...publicProps,
              ...params.properties,
              ...this.getDirectAdStatusParams(),
            }
          },
        },
      ]
      !this.subChannelId || (reqarr[0].sub_channel_id = this.subChannelId)

      let result = await trackApi(reqarr)
      callback.complete({ ...result, data: null, msg: 'track success' })
    } catch (err) {
      callback.complete(handleError(err))
    }
  }

  //大数据上报 数据上报 V2
  public async dataTrack(callback: IMethodParams, params: trackParams) {
    try {
      await pubCheck(checkTrackParams, callback, params)

      // 如果传递了flushInterval参数，动态更新上报间隔
      // flushInterval单位是秒，需要转换成毫秒，只能是正整数
      if (params?.flushInterval !== undefined) {
        const flushIntervalNum = Number(params.flushInterval)
        // 检查是否可以转换为有效数字且为正数
        if (!isNaN(flushIntervalNum) && isFinite(flushIntervalNum) && flushIntervalNum > 0) {
          // 四舍五入转换为正整数，然后乘以1000转换为毫秒
          const intervalMs = Math.round(flushIntervalNum) * 1000
          updateTrackReportInterval(intervalMs)
        }
        // 如果无法转换或值不符合条件，不更新间隔，使用默认值
      }

      // 如果传递了maxCacheCount参数，更新缓存数据上限
      // maxCacheCount只能是正整数，范围100-1000
      if (params?.maxCacheCount !== undefined) {
        const maxCacheCountNum = Number(params.maxCacheCount)
        // 检查是否可以转换为有效数字且为正数
        if (!isNaN(maxCacheCountNum) && isFinite(maxCacheCountNum) && maxCacheCountNum > 0) {
          // 四舍五入转换为正整数
          updateMaxCacheCount(Math.round(maxCacheCountNum))
        }
        // 如果无法转换或值不符合条件，不更新，使用默认值
      }

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
      // 判断类型必须在dataTrackType中，如果不在或者没有传递，默认是track
      let type: string = (params?.type && this.dataTrackType.includes(params?.type)) ? params?.type : 'track'
      let time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ')
      let uuids = v4()
      let platform_id: 4 = 4
      let { cpid: copyCpid, productId: product_id } = SYSTEM_INFO
      let cpid = Number(copyCpid)
      // 根据 event 获得当前 event 下的公共属性
      const publicPropskey = this.initConfig?.event_public_attr?.public_attr?.[params.event] || []
      const publicPropsByCache = customGetStorageSync('rx_public_props')
      const publicProps = pick(publicPropsByCache, publicPropskey)
      const new_properties: any = {}

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

      new_properties.st_offset = `${SYSTEM_INFO.st_offset || ''}`

      let reqarr: douyinTrackForReq[] = [
        {
          type,
          time,
          uuid: uuids,
          sub_channel_id: this.subChannelId || '',
          distinct_id: USER_INFO.openid,
          platform_id,
          product_id,
          cpid,
          channel_id: SYSTEM_INFO.channelId,
          devicecode,
          ...{
            ...params,
            properties: {
              ...new_properties,
              ...publicProps,
              ...params.properties,
              ...this.getDirectAdStatusParams(),
            }
          },
        },
      ]
      !this.subChannelId || (reqarr[0].sub_channel_id = this.subChannelId)

      // let result = await trackApi(reqarr)
      // 收集reqarr数据，用于后续上报
      saveTrackDataToStorage(reqarr[0])

      // 检查缓存数据是否达到上限，如果达到则立即上报
      if (shouldTriggerImmediateReport()) {
        triggerImmediateReport()
      }

      callback.complete({ code: 0, data: null, msg: 'trackDelay success' })
    } catch (err) {
      callback.complete(handleError(err))
    }
  }


  //内容安全
  public async msgSecCheck(params: OmitMegSecCheck, callback: IMethodParams) {
    try {
      await pubCheck(msgSecCheck, callback, params)
      params = Object.assign(params, { openid: USER_INFO.tid, version: 2 })
      const result = await msgSecCheckApi(params)
      callback.complete(result)
    } catch (err) {
      callback.complete(handleTrackError('', err))
    }
  }

  // 内容安全 - 异步校验图片/音频是否含有违法违规内容。
  public async mediaCheckAsync(params: IReqMediaCheckAsync, callback: IMethodParams) {
    try {
      await pubCheck(mediaCheckAsyncCheck, callback, params)
      const result = await mediaCheckAsyncApi(params)
      callback.complete(result)
    } catch (err) {
      callback.complete(handleTrackError('', err))
    }
  }

  /**
   * 设置公共属性
   * 设置后CP无需每次上报都传，由SDK填入properties中。
   */
  public setPublicProperties(params: { [key: string]: any }) {
    if (!isObject(params) || Array.isArray(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PARAMS_ERROR

      return handleTrackError('', error)
    }

    try {
      customSetStorageSync('rx_public_props', params)
      return { code: 0 }
    } catch (error) {
      return handleTrackError('', error)
    }
  }
  /**
   * 修改设置的公共数据。
   */
  public updatePublicProperties(params: { [key: string]: any }) {
    if (!isObject(params) || Array.isArray(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PARAMS_ERROR

      return handleTrackError('', error)
    }

    try {
      const cache = customGetStorageSync('rx_public_props')
      customSetStorageSync('rx_public_props', { ...cache, ...params })
      return { code: 0 }
    } catch (error) {
      return handleTrackError('', error)
    }
  }
  /**
   * 删除公共属性
   */
  public deletePublicProperties(params: string[]) {
    if (!Array.isArray(params)) {
      const error: any = new Error('params must be array')
      error.code = COMMON_ERROR_CODE.PARAMS_ERROR

      return handleTrackError('', error)
    }

    try {
      const cache = customGetStorageSync('rx_public_props')
      const rest = omit(cache, params)
      customSetStorageSync('rx_public_props', rest)
      return { code: 0 }
    } catch (error) {
      return handleTrackError('', error)
    }
  }

  public getPublicProperties() {
    let data = customGetStorageSync(`rx_public_props`)

    return { code: 0, data }
  }
  //公共的解密接口
  public async decryptionDate(params: { encrypted_data: string, iv: string }, { complete }: IMethodParams) {
    const sessionOverdue = async (err: any) => {
      // 192802 微信小游戏sessionkey过期
      if (err?.code == 192802 && this.refreshSession < 2) {
        this.refreshSession++
        let result = await this.refreshSessionFunc()
        if (result == 1) {
          this.decryptionDate(params, { complete })
        } else {
          complete(handleTrackError('', err))
        }
      } else {
        complete(handleTrackError('', err))
      }
    }
    try {
      const res = await opendataAesdecodeApi({ iv: params.iv, encrypted_data: params.encrypted_data })
      this.refreshSession = 0
      complete(res)
    } catch (err) {
      sessionOverdue(err)
    }
  }
  //获得设备码接口
  public getUserDeviceCode() {
    try {
      var devicecode = customGetStorageSync('rx_devicecode')
      if (devicecode) {
        return { code: 0, data: devicecode.code }
      } else {
        let devicecode = v4()
        customSetStorageSync('rx_devicecode', { code: devicecode, openIds: {} })
        return { code: 0, data: devicecode }
      }
    } catch (err) {
      return v4()
    }
  }

  // 腾讯广告sdk实例
  tencent_sdk: any = null

  private getHeaders() {
    return {
      ['ruixue-language']: 'zh-CN',
      ['ruixue-cpid']: SYSTEM_INFO.cpid,
      ['ruixue-productid']: SYSTEM_INFO.productId,
      ['ruixue-channelid']: SYSTEM_INFO.channelId,
      ['ruixue-platformid']: '4',
      ['ruixue-devicecode']: getDevicecode(),
      ['ruixue-version']: SYSTEM_INFO.__RX_SDK_VERSION,
      ['ruixue-traceid']: v4(),
      ['ruixue-tzoffset']: SYSTEM_INFO.timezone + '',
      ['ruixue-accesstoken']: USER_INFO.token?.access
    }
  }

  private initTencentSdk() {
    return new Promise((resolve) => {
      // 0服务端上报 1客户端上报
      if (this.initConfig?.advertise_channel?.gdt?.tm == TM_TYPE.CLIENT || this.create_conn) {
        // @ts-ignore
        if (!tencent_sdk && wx.TencentSDK && this.initConfig?.advertise_channel?.gdt?.sid) {
          const params: any = {
            user_action_set_id: Number(this.initConfig?.advertise_channel?.gdt.sid),
            secret_key: this.initConfig?.advertise_channel?.gdt.sk,
            appid: this.initConfig?.advertise_channel?.gdt.wxid,
            auto_track: true,
            on_report_fail: onReportFail
          }
          if (USER_INFO.tid) {
            params.openid = USER_INFO.tid
          }
          // @ts-ignore
          tencent_sdk = new wx.TencentSDK(params)
          const initResult = tencent_sdk?.getInitResult()
          if (initResult && !initResult.inited) {
            handleTrackError('rxlog_error_ad', {
              ...initResult,
              message: initResult.initErrMsg,
              exception: initResult
            }, undefined, 'rxlog_error_gdt')
          }

          setTimeout(() => {
            resolve(true)
          }, 100)
        } else {
          resolve(true)
        }
      } else {
        resolve(true)
      }
    })
  }

  private async reportAddToFavorites(type: 'default' | 'my' | 'desktop' | 'others') {
    await this.initTencentSdk()
    await this.reportOrQueueDirectAdGdtEvent(() => {
      handleGdtTrackResult(tencent_sdk?.track('ADD_TO_WISHLIST', {
        type,
      }))
    })
  }

  private async reportShareAppMessage(target: 'APP_MESSAGE' | 'TIME_LINE') {
    await this.initTencentSdk()
    await this.reportOrQueueDirectAdGdtEvent(() => {
      handleGdtTrackResult(tencent_sdk?.track('SHARE', {
        target,
      }))
    })
  }

  private async reportPurchase(amount: number, needReportMidas = false) {
    if (needReportMidas) {
      await this._reportPurchase(amount)
      return
    }
  }

  private async _reportPurchase(amount: number) {
    try {
      await this.initTencentSdk()
      await this.reportOrQueueDirectAdGdtEvent(() => {
        handleGdtTrackResult(tencent_sdk?.onPurchase(amount))
      })
    } catch (e) {
    }
  }

  private compareVersions(version1: string, version2: string) {
    // 将版本号字符串按 . 分割成数组
    const v1Parts = version1.replace('v', '').split('.').map(Number);
    const v2Parts = version2.replace('v', '').split('.').map(Number);

    // 获取两个版本号数组的最大长度
    const maxLength = Math.max(v1Parts.length, v2Parts.length);

    // 逐位比较版本号
    for (let i = 0; i < maxLength; i++) {
      // 如果某个版本号数组已经遍历完，对应位置的值视为 0
      const num1 = i < v1Parts.length ? v1Parts[i] : 0;
      const num2 = i < v2Parts.length ? v2Parts[i] : 0;

      if (num1 > num2) {
        return 1; // version1 大于 version2
      } else if (num1 < num2) {
        return -1; // version1 小于 version2
      }
      // 如果当前位相等，继续比较下一位
    }

    return 0; // 两个版本号相等
  }

  private async getOrderStatus(order_nos: string) {
    try {
      const res = await getOrderStatusApi(order_nos)
    } catch (e) {

    }
  }

  private async reportPurchaseByCache() {
    try {
      if (!this.isSupportGDTReport) return;
      await this.initTencentSdk()
      const rx_cache_order = customGetStorageSync(`rx_cache_order_price`) || []
      // 验证数据格式并限制处理数量，防止死循环
      if (!rx_cache_order || !Array.isArray(rx_cache_order) || rx_cache_order.length === 0) {
        // removeStorageSync('rx_cache_order_price')
        return
      }
      // 去除rx_cache_order中重复的订单
      const uniqueOrders = rx_cache_order?.filter?.((order: any, index: number, self: any) =>
        index === self?.findIndex((t: any) => t?.order_nos === order?.order_nos)
      )
      // 限制最多处理5条订单，防止缓存无限增长导致死循环
      const MAX_PROCESS_COUNT = 5
      const ordersToProcess = uniqueOrders?.slice?.(0, MAX_PROCESS_COUNT)

      // 创建新数组用于存储需要保留的数据
      const remainingOrders: any[] = []

      // 按顺序处理每条订单数据
      for (const order of ordersToProcess) {
        // 验证订单数据格式，防止无效数据导致错误
        if (!order || typeof order !== 'object' || !order?.order_nos || !order?.price) {
          // 无效数据不保留，直接丢弃
          continue
        }

        try {
          // 查询订单状态
          const res = await getOrderStatusApi(order?.order_nos)
          // 订单支付成功
          if (res && res?.code === 0 && res?.data?.status && res?.data?.status > 1) {
            try {
              this._reportPurchase(order?.price)
              // 支付成功，不添加到保留数组中（即从缓存中移除）
            } catch (reportError) {
              // 上报失败不影响其他订单处理，但保留当前订单
              remainingOrders?.push?.(order)
            }
          } else {
            // 支付未成功，保留订单
            if (res && res?.code !== 101) {
              remainingOrders?.push?.(order)
            }
          }
        } catch (error) {
          // 查询失败，保留在数组中（单个订单失败不影响其他订单）
          remainingOrders?.push?.(order)
        }
      }

      // 保存剩余数据，添加容错处理
      try {
        if (remainingOrders?.length > 0) {
          // 有剩余订单数据，保留剩余数据
          console.info('有剩余订单数据，保留剩余数据', remainingOrders)
          customSetStorageSync('rx_cache_order_price', remainingOrders?.slice?.(0, MAX_PROCESS_COUNT))
        } else {
          // 如果没有剩余数据，清除缓存
          removeStorageSync('rx_cache_order_price')
        }
      } catch (saveError) {
        // 保存失败不影响其他功能，只记录日志
        console.info('保存缓存订单失败', saveError)
      }
    } catch (e) {
      // 外层异常捕获，确保不影响其他功能
      console.info('reportPurchaseByCache 执行异常', e)
    } finally {
      // console.info('清除缓存订单')
      // removeStorageSync('rx_cache_order_price')
    }
  }

  private async reportRegister() {
    await this.reportOrQueueDirectAdGdtEvent(async () => {
      await this.initTencentSdk()
      console.log('on_register')
      handleGdtTrackResult(tencent_sdk?.onRegister())
    })
  }

  private async reportGdtLogin(openid: string) {
    await this.reportOrQueueDirectAdGdtEvent(() => {
      console.log('set_open_id:', openid)
      handleGdtTrackResult(tencent_sdk?.setOpenId(openid))
    })
  }

  private async reportGdt(key: string, object?: any) {
    await this.initTencentSdk()
    await this.reportOrQueueDirectAdGdtEvent(() => {
      if (object) {
        handleGdtTrackResult(tencent_sdk?.track(key, object))
      } else {
        handleGdtTrackResult(tencent_sdk?.track(key))
      }
    })
  }

  private async reportCreateRole(role_id: string) {
    await this.initTencentSdk()
    await this.reportOrQueueDirectAdGdtEvent(() => {
      console.log('on_create_role:', role_id)
      handleGdtTrackResult(tencent_sdk?.onCreateRole(role_id))
    })
  }

  private async reportTutorialFinish() {
    await this.initTencentSdk()
    await this.reportOrQueueDirectAdGdtEvent(() => {
      console.log('on_tutorial_finish')
      handleGdtTrackResult(tencent_sdk?.onTutorialFinish())
    })
  }

  private async reportReActive(back_flow_day: number) {
    await this.reportOrQueueDirectAdGdtEvent(async () => {
      await this.initTencentSdk()
      console.log('on_re_active:', back_flow_day)
      handleGdtTrackResult(tencent_sdk?.track('RE_ACTIVE', { backFlowDay: back_flow_day }))
    })
  }

  private async reportUpdateLevel(data: any) {
    await this.initTencentSdk()
    await this.reportOrQueueDirectAdGdtEvent(() => {
      console.log('on_update_level:', data)
      handleGdtTrackResult(tencent_sdk?.track('UPDATE_LEVEL', data))
    })
  }

  private async reportViewContent(item: 'Mall' | 'Activity') {
    await this.initTencentSdk()
    await this.reportOrQueueDirectAdGdtEvent(() => {
      console.log('on_view_content:', item)
      handleGdtTrackResult(tencent_sdk?.track('VIEW_CONTENT', {
        // 关键场景访问：商城
        item
      }))
    })
  }

  create_conn: boolean = false
  // 定义全局的SocketTask实例
  socket_task: any = null
  // 心跳检测的时间间隔（单位：毫秒）
  HEARTBEAT_INTERVAL: number = 3 * 60 * 1000
  // 存储心跳定时器的标识
  heartbeat_timer: any = null
  // 最大重连次数
  MAX_CONNECT_NUMBER: number = 20
  // 已经连接次数
  socket_connect_number: number = 1
  // 重连时间间隔（单位：毫秒）
  RECONNECT_INTERVAL: number = 5000

  // socket游标
  socket_index: number = 0
  // socket游标列表
  socket_ws_list: string[] = []
  // socket是否正在发起重连中
  reconnecting: boolean = false
  // socket是否断开不再重连
  no_more_reconnection: boolean = false

  private async initWebSocket() {
    getAdSourceApi().then(async (ad_source: any) => {
      this.create_conn = ad_source?.data?.create_conn || false

      if (ad_source?.data?.create_conn && this.initConfig?.advertise_channel?.gdt?.sid && this.initConfig?.websocket?.ws_list?.length) {
        this.socket_index = 0
        this.socket_ws_list = this.initConfig?.websocket?.ws_list
        this.socket_connect_number = 1
        this.reconnecting = false
        this.no_more_reconnection = false
        this.connectWebSocket()
      }
    }).catch(e => {
      console.log(e)
    })
  }

  // 连接WebSocket服务器
  private connectWebSocket() {
    // WebSocket已设置断开不再重连，后续不做处理
    if (this.no_more_reconnection) {
      console.log('WebSocket已设置断开不再重连')
      return
    }
    // WebSocket连接次数已到20次，后续不做处理
    if (this.socket_connect_number > this.MAX_CONNECT_NUMBER) {
      console.log('WebSocket连接次数已到20次')
      return
    }
    const socket_header = this.getHeaders()
    const socket_url = this.socket_ws_list[this.socket_index]
    console.log('WebSocket连接次数：', this.socket_connect_number)
    console.log('WebSocket连接参数：', {
      socket_url,
      socket_header
    })
    this.no_more_reconnection = false
    this.socket_task = wx.connectSocket({
      url: socket_url,
      header: socket_header,
      success: (res) => {
        console.log('WebSocket连接创建成功：', res)
      },
      fail: () => { }
    })

    // 监听WebSocket连接打开事件
    this.socket_task.onOpen((res: any) => {
      console.log('WebSocket连接打开：', res)
      // 开启心跳检测
      this.startHeartbeat()
    })

    // 监听WebSocket连接错误事件
    this.socket_task.onError((err: any) => {
      console.log('WebSocket连接错误：', err)
      this.reconnectWebSocket(err)
    })

    // 监听WebSocket连接关闭事件
    this.socket_task.onClose((err: any) => {
      console.log('WebSocket连接已关闭：', err)
      // WebSocket已设置断开不再重连，后续不做处理
      if (this.no_more_reconnection) {
        console.log('WebSocket已设置断开不再重连')
        return
      }
      this.reconnectWebSocket(err, false)
    })

    // 监听WebSocket接收到消息事件
    this.socket_task.onMessage(async (res: any) => {
      try {
        const data: any = arrayBufferToJson(res.data)
        console.log('收到服务端消息data：', data)
        if (data?.msg_type === 1) {
          const uuid = data.uuid
          console.log('收到服务端消息uuid：', uuid, customGetStorageSync('rx_socket_uuid'))
          if (['start', 're_active', 'tutorial_finish', 'pay', 'register'].includes(data.body?.event)) {
            await this.initTencentSdk()
          }
          if (customGetStorageSync('rx_socket_uuid') != uuid) {
            // 在这里可以根据收到的消息进行相应处理
            switch (data.body?.event) {
              case 'start':
                await this.reportOrQueueDirectAdGdtEvent(() => {
                  handleGdtTrackResult(tencent_sdk?.onAppStart())
                })
                this.socketTaskSend('on_app_start')
                break
              case 're_active':
                await this.reportOrQueueDirectAdGdtEvent(() => {
                  handleGdtTrackResult(tencent_sdk?.track('RE_ACTIVE', { backFlowDay: parseInt(data.body?.info?.back_flow_day) }))
                })
                this.socketTaskSend('on_re_active')
                break
              case 'tutorial_finish':
                await this.reportOrQueueDirectAdGdtEvent(() => {
                  handleGdtTrackResult(tencent_sdk?.onTutorialFinish())
                })
                this.socketTaskSend('on_tutorial_finish')
                break
              case 'pay':
                await this.reportOrQueueDirectAdGdtEvent(() => {
                  handleGdtTrackResult(tencent_sdk?.onPurchase(parseInt(data.body?.info?.amount)))
                })
                this.socketTaskSend('on_purchase')
                break
              case 'register':
                await this.reportOrQueueDirectAdGdtEvent(() => {
                  handleGdtTrackResult(tencent_sdk?.onRegister())
                })
                this.socketTaskSend('on_register')
                break
              case 'create_game_role':
                await this.reportOrQueueDirectAdGdtEvent(() => {
                  handleGdtTrackResult(tencent_sdk?.onCreateRole(data.body?.info?.role_id))
                })
                this.socketTaskSend('create_game_role')
                break
              default:
                this.socketTaskSend('on_other_event')
                await this.reportOrQueueDirectAdGdtEvent(() => {
                  handleGdtTrackResult(tencent_sdk?.track(data.body?.event, data.body?.info))
                })
            }
          } else {
            this.socketTaskSend('on_not_handled')
          }
          customSetStorageSync('rx_socket_uuid', uuid)
        } else if (data?.msg_type === -1) {
          this.socketTaskSend('on_close')
          this.disconnectWebSocket()
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

  // 开启心跳检测
  private startHeartbeat() {
    clearTimeout(this.heartbeat_timer)
    this.heartbeat_timer = setInterval(() => {
      this.socket_task.send({
        data: JSON.stringify({
          msg_type: 1000,
          msg: 'on_heartbeat'
        })
      })
    }, this.HEARTBEAT_INTERVAL)
  }

  // 断开存在的WebSocket连接
  private disconnectWebSocket(no_more_reconnection = true) {
    this.no_more_reconnection = no_more_reconnection
    clearTimeout(this.heartbeat_timer)
    try {
      if (this.socket_task) {
        this.socket_task.close()
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 断开WebSocket后主动重连
  private activeWebSocket() {
    if (!this.no_more_reconnection) {
      return
    }
    this.no_more_reconnection = false
    this.connectWebSocket()
  }

  private reconnectWebSocket(err: any, plus_socket_index = true) {
    // 如果重连中，不做处理
    if (this.reconnecting) {
      return
    }
    // socket正在发起重连中
    this.reconnecting = true
    // 关闭心跳检测定时器
    clearInterval(this.heartbeat_timer)
    // 连接失败后可以设置重试机制，比如延迟一段时间后重新连接
    setTimeout(() => {
      if (plus_socket_index) {
        // 连接游标加一，如果游标越界则上报
        this.socket_index++
        if (this.socket_index > this.socket_ws_list.length - 1) {
          this.track(
            {
              complete: (data: any) => {
                console.info(data)
              },
            },
            formatTrackParams({
              eventName: 'wssFail',
              apiName: 'connectWebSocket',
              errorInfo: err,
              loginInfo: USER_INFO,
            })
          )
          return
        }
      }
      // socket连接次数加一
      this.socket_connect_number++
      // 重新发起连接
      this.connectWebSocket()
      // socket已发起重连
      this.reconnecting = false
    }, this.RECONNECT_INTERVAL)
  }

  // 通知服务端当前消息已处理
  private socketTaskSend(msg: string = '') {
    this.socket_task.send({
      data: JSON.stringify({
        msg_type: 99,
        msg
      })
    })
  }

  // 调起客户端订阅消息界面
  private requestSubscribeMessage(params: { tmplIds: string[] }, callback: IMethodParams) {
    wx.requestSubscribeMessage({
      tmplIds: params.tmplIds,
      success: (res: any) => {
        console.log(res)
        const { errMsg, ..._template_map } = res
        wx.getSetting({
          withSubscriptions: true,
          success(res: any) {
            console.log(res)
            console.log(res.subscriptionsSetting?.itemSettings)
            const template_map = {
              ..._template_map,
              ...(res.subscriptionsSetting?.itemSettings || {})
            }
            requestSubscribeMessageApi({
              rx_open_id: USER_INFO.openid,
              template_map
            }).then(() => {
              callback && callback.complete({
                code: 0,
                data: template_map
              })
            }).catch(err => {
              callback && callback.complete(handleTrackError('', err))
            })
          },
          fail(err: any) {
            callback && callback.complete(handleTrackError('', err))
          }
        })
      },
      fail(err: any) {
        callback && callback.complete(handleTrackError('', err))
      }
    })
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
      let result = await createGameCharacterApi({
        ...params,
        rx_openid: params.rx_openid || USER_INFO.openid
      })
      try {
        await this.reportCreateRole(params.character_id)
      } catch (e) {
        console.log(e)
      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 修改游戏角色信息
  async putGameCharacter(params: any, callback: IMethodParams) {
    try {
      let result = await putGameCharacterApi({
        ...params,
        rx_openid: params.rx_openid || USER_INFO.openid
      })
      try {
        const { extension, ...rest } = params
        if (params.character_level || params.character_vip_level) {
          await this.reportUpdateLevel({
            ...rest,
            rx_openid: params.rx_openid || USER_INFO.openid
          })
        }
      } catch (e) {
        console.log(e)
      }
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

  public getDynamicShareActivityId(callback: IMethodParams) {
    const query: any = getSearchQueries()
    return query.activityId
  }

  async setDynamicShareMsg(params: {
    activity_id: string,
    target_state: 0 | 1,
    isPrivateMessage: boolean,
    withShareTicket: boolean,
    member_count: number,
    room_limit: number,
    path: string,
    version_type: 'develop' | 'trial' | 'release'
  }, callback: IMethodParams) {
    try {
      const checkParams: Rules = {
        target_state: {
          type: 'enum',
          required: true,
          enum: [0, 1],
        },
        activity_id: {
          type: 'string',
          required: true,
        },
        member_count: {
          type: 'number',
          required: params.target_state === 0,
        },
        room_limit: {
          type: 'number',
          required: params.target_state === 0,
        },
        version_type: {
          type: 'enum',
          required: params.target_state === 1,
          enum: ['develop', 'trial', 'release'],
        }
      }
      await pubCheck(checkParams, callback, params)

      if (params.target_state == 0 && params.member_count > params.room_limit) {
        throw Error('room_limit 不可小于 member_count')
      }

      const parameter_list = []

      if (params.member_count) {
        parameter_list.push({
          name: 'member_count',
          value: `${params.member_count}`
        })
      }

      if (params.room_limit) {
        parameter_list.push({
          name: 'room_limit',
          value: `${params.room_limit}`
        })
      }

      if (params.target_state === 1) {
        parameter_list.push({
          name: 'path',
          value: params.path || '?foo=bar'
        })
      }

      if (params.version_type) {
        parameter_list.push({
          name: 'version_type',
          value: params.version_type
        })
      }

      let result = await setDynamicMsgApi({
        activity_id: params.activity_id,
        target_state: params.target_state,
        template_info: {
          parameter_list
        }
      })
      callback.complete({
        ...result,
        msg: result.msg || result.message
      })
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async createActivityId(params: { isPrivateMessage: boolean }, callback: IMethodParams) {
    try {
      const reqParam: any = {}
      if (params.isPrivateMessage) {
        reqParam.openid = USER_INFO.tid
      }
      let result = await createActivityIdApi(reqParam)
      callback.complete({
        ...result,
        msg: result.msg || result.message
      })
    } catch (err) {
      callback.complete(handleError(err))
    }
  }

  async dynamicShare(params: IgetShareData & {
    activity_id: string,
    withShareTicket: boolean,
    member_count: number,
    room_limit: number
  }, callback: IMethodParams) {
    const key = Date.now() + ''

    for (let key in showMap) {
      try {
        wx.offShow(showMap[key])
      } catch (e) {
        console.log(e)
      }
    }

    try {
      const checkParams: Rules = {
        activity_id: {
          type: 'string',
          required: true,
        },
        member_count: {
          type: 'number',
          required: true,
        },
        room_limit: {
          type: 'number',
          required: true,
        }
      }
      await pubCheck(checkParams, callback, params)
      let shareData = await this.getShareData(params, callback, true)

      if (params.member_count > params.room_limit) {
        throw Error('room_limit 不可小于 member_count')
      }

      wx.updateShareMenu({
        withShareTicket: params.withShareTicket || true,
        isUpdatableMessage: true,
        activityId: params.activity_id,
        templateInfo: {
          parameterList: [{
            name: 'member_count',
            value: `${params.member_count}`
          }, {
            name: 'room_limit',
            value: `${params.room_limit}`
          }]
        }
      })

      console.log('sdk getShareData:', shareData)
      const onHide = () => {
        wx.offHide(onHide)
      }
      const onShow = async () => {
        wx.offShow(onShow)
        callback.complete(shareData)
      }
      let query = qs.stringify({
        type: 'rx',
        user_source: 'share',
        activityId: params.activity_id, // 活动 ID
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
        inviter_subchannelid: this.subChannelId || '',
      })
      query = params.query ? `${query}&${params.query}` : query
      wx.onHide(onHide)
      wx.onShow(onShow)
      showMap[key] = onShow

      wx.shareAppMessage({
        title: params.title || shareData?.data?.content?.content,
        imageUrl: params.imageUrl || shareData?.data?.content?.image,
        query
      })
      this.reportShareAppMessage('APP_MESSAGE')
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

  private openChatTool(params: { roomid?: string, chatType?: number }, callback: IMethodParams) {
    const _params: any = {}

    if (params.roomid) {
      _params.roomid = params.roomid
    }
    if (params.chatType) {
      _params.chatType = params.chatType
    }

    // @ts-ignore
    wx.openChatTool({
      ..._params,
      success() {
        callback.complete({
          code: 0
        })
      },
      fail(err: any) {
        callback.complete(handleError(err))
      }
    })
  }

  private isChatTool() {
    // @ts-ignore
    const result = wx.isChatTool()
    return result
  }

  private exitChatTool(callback: IMethodParams) {
    // @ts-ignore
    wx.exitChatTool({
      success() {
        callback.complete({
          code: 0
        })
      },
      fail(err: any) {
        callback.complete(handleError(err))
      }
    })
  }

  async chatToolShare(params: IgetShareData & {
    activity_id: string,
    title?: string,
    imageUrl?: string,
    path?: string,
    withShareTicket?: boolean,
    chooseType?: number,
    members?: any[],
    templateId?: ''
  }, callback: IMethodParams) {
    try {
      let shareData = await this.getShareData(params, callback, true)
      const _params: any = {
        withShareTicket: params.withShareTicket || true,
        isUpdatableMessage: true,
        useForChatTool: true,
        activityId: params.activity_id,
        chooseType: params.chooseType || 1,
        participant: params.members || [],
        templateInfo: {
          // @ts-ignore
          templateId: params.templateId || '4A68CBB88A92B0A9311848DBA1E94A199B166463'
        }
      }

      wx.updateShareMenu({
        ..._params,
        success(res: any) {
          let query = qs.stringify({
            type: 'rx',
            user_source: 'share',
            is_chat_tool: '1',
            activityId: params.activity_id, // 活动 ID
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
            inviter_subchannelid: this.subChannelId || '',
          })
          query = params.query ? `${query}&${params.query}` : query
          // @ts-ignore
          wx.shareAppMessageToGroup({
            title: params.title || shareData?.data?.content?.content,
            imageUrl: params.imageUrl || shareData?.data?.content?.image,
            path: params.path || `?${query}`,
            success(res: any) {
              callback.complete(shareData)
            },
            fail(err: any) {
              callback.complete(handleError(err))
            }
          })
          this.reportShareAppMessage('APP_MESSAGE')
        }
      })
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  private selectGroupMembers(params: { maxSelectCount?: number }, callback: IMethodParams) {
    const _params: any = {}

    if (params.maxSelectCount != null) {
      _params.maxSelectCount = params.maxSelectCount
    }

    // @ts-ignore
    wx.selectGroupMembers({
      ..._params,
      success(res: any) {
        callback.complete({
          code: 0,
          data: res.members
        })
      },
      fail(err: any) {
        callback.complete(handleError(err))
      }
    })
  }

  public checkIsChatToolEnter(callback: IMethodParams) {
    const query: any = getSearchQueries()
    return !!query.is_chat_tool
  }

  private getGroupEnterInfo(params: { allowSingleChat?: boolean, needGroupOpenID?: boolean }, callback: IMethodParams) {

    const _params: any = {}

    if (params.allowSingleChat != null) {
      _params.allowSingleChat = params.allowSingleChat
    }

    if (params.needGroupOpenID != null) {
      _params.needGroupOpenID = params.needGroupOpenID
    }

    // @ts-ignore
    wx.getGroupEnterInfo({
      ..._params,
      success(res: any) {
        callback.complete({
          code: 0
        })
      },
      fail(err: any) {
        callback.complete(handleError(err))
      }
    })
  }

  private getChatToolInfo(callback: IMethodParams) {
    const that = this
    // @ts-ignore
    wx.getChatToolInfo({
      success(res: any) {
        that.decryptionDate({
          encrypted_data: res.encryptedData,
          iv: res.iv
        }, {
          complete(res: any) {
            callback.complete({
              code: 0,
              data: JSON.parse(res.data.decode_data)
            })
          }
        })
      },
      fail(err: any) {
        callback.complete(handleError(err))
      }
    })
  }

  private async chatToolMsgSend(params: {
    activity_id: string,
    target_state: 0 | 1,
    version_type: 0 | 1 | 2,
    participator_info_list?: any[],
    template_id?: string
  }, callback: IMethodParams) {
    try {
      const _params: any = {
        activity_id: params.activity_id,
        target_state: params.target_state,
        version_type: params.version_type,
        template_id: params.template_id || '4A68CBB88A92B0A9311848DBA1E94A199B166463',
      }

      if (params.participator_info_list) {
        _params.participator_info_list = params.participator_info_list
      }

      if (params.template_id) {
        _params.template_id = params.template_id
      }

      let result = await setChatToolMsgApi(_params)
      callback.complete({
        ...result,
        msg: result.msg || result.message
      })
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

}

// 通过Object.getOwnPropertyNames获取wx对象所有自身属性名（包括方法和非方法属性）
try {
  Object.getOwnPropertyNames(wx).forEach((key) => {
    // @ts-ignore
    const value = wx[key]
    if (typeof value === 'function') {
      // 如果是函数类型，就在MyWxWrapper类的原型上添加对应的方法
      // @ts-ignore
      if (SdkWegame.prototype[key] || SdkWegame[key]) {
        // @ts-ignore
        wx[`ori${key}`] = function (...args) {
          return value.apply(wx, args);
        };
        // @ts-ignore
        SdkWegame.prototype[`ori${key}`] = function (...args) {
          return value.apply(wx, args);
        };
      } else {
        // @ts-ignore
        SdkWegame.prototype[key] = function (...args) {
          return value.apply(wx, args);
        };
      }
    }
  });
} catch (e) {

}

export default SdkWegame
