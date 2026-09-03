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
} from '@/rpk/utils'
import {
  checkIReqBusinessData,
  checkIReqBusinessOrder,
  shareScheduleInitParams,
  shareScheduleReportParams,
  ShareCheckParams,
  ksLoginParamsCheck,
  ksPayCheckParams
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
  postPayData,
  getAdShareDataApi,
  refreshUserInfo
} from '@/rpk/apis'
import SdkCommon from '@/rpk/SdkCommon'
import { setupStOffsetRefreshForMiniGame } from '@/utils/stOffset'

const PLATFORM = 'minigame_kuaishou'

declare global {
  var ks: any
}
// 自定义的 Base64 字符集
const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// 将字符串转换为字节数组
function stringToBytes(str: any) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      bytes.push(charCode);
    } else if (charCode < 0x800) {
      bytes.push(0xc0 | (charCode >> 6));
      bytes.push(0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      bytes.push(0xe0 | (charCode >> 12));
      bytes.push(0x80 | ((charCode >> 6) & 0x3f));
      bytes.push(0x80 | (charCode & 0x3f));
    } else {
      i++;
      const surrogate = ((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff);
      bytes.push(0xf0 | (surrogate >> 18));
      bytes.push(0x80 | ((surrogate >> 12) & 0x3f));
      bytes.push(0x80 | ((surrogate >> 6) & 0x3f));
      bytes.push(0x80 | (surrogate & 0x3f));
    }
  }
  return bytes;
}

// 将字节数组转换为 Base64 字符串
function bytesToBase64(bytes: any) {
  let base64 = '';
  const padding = bytes.length % 3;
  for (let i = 0; i < bytes.length; i += 3) {
    const chunk = (bytes[i] << 16) | ((i + 1 < bytes.length ? bytes[i + 1] : 0) << 8) | (i + 2 < bytes.length ? bytes[i + 2] : 0);
    base64 += base64Chars[(chunk >> 18) & 0x3f];
    base64 += base64Chars[(chunk >> 12) & 0x3f];
    base64 += i + 1 < bytes.length ? base64Chars[(chunk >> 6) & 0x3f] : '=';
    base64 += i + 2 < bytes.length ? base64Chars[chunk & 0x3f] : '=';
  }
  return base64;
}

// 将 Base64 字符串转换为字节数组
function base64ToBytes(base64: any) {
  const bytes = [];
  const base64Length = base64.length;
  let padding = 0;
  if (base64[base64Length - 1] === '=') {
    padding++;
    if (base64[base64Length - 2] === '=') {
      padding++;
    }
  }
  for (let i = 0; i < base64Length; i += 4) {
    const chunk = (base64Chars.indexOf(base64[i]) << 18) |
      (base64Chars.indexOf(base64[i + 1]) << 12) |
      ((base64[i + 2] === '=' ? 0 : base64Chars.indexOf(base64[i + 2])) << 6) |
      (base64[i + 3] === '=' ? 0 : base64Chars.indexOf(base64[i + 3]));
    bytes.push((chunk >> 16) & 0xff);
    if (i + 2 < base64Length - padding) {
      bytes.push((chunk >> 8) & 0xff);
    }
    if (i + 3 < base64Length - padding) {
      bytes.push(chunk & 0xff);
    }
  }
  return bytes;
}

// 将字节数组转换为字符串
function bytesToString(bytes: any) {
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    if (byte < 0x80) {
      str += String.fromCharCode(byte);
    } else if (byte < 0xe0) {
      const charCode = ((byte & 0x1f) << 6) | (bytes[++i] & 0x3f);
      str += String.fromCharCode(charCode);
    } else if (byte < 0xf0) {
      const charCode = ((byte & 0x0f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f);
      str += String.fromCharCode(charCode);
    } else {
      const surrogate = ((byte & 0x07) << 18) | ((bytes[++i] & 0x3f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f);
      const high = 0xd800 | ((surrogate >> 10) & 0x3ff);
      const low = 0xdc00 | (surrogate & 0x3ff);
      str += String.fromCharCode(high, low);
    }
  }
  return str;
}

// 将 JSON 对象转换为 Base64 字符串
function jsonToBase64(jsonObj: any) {
  const jsonStr = JSON.stringify(jsonObj);
  const bytes = stringToBytes(jsonStr);
  return bytesToBase64(bytes);
}

// 将 Base64 字符串转换为 JSON 对象
function base64ToJson(base64: any) {
  const bytes = base64ToBytes(base64);
  const jsonStr = bytesToString(bytes);
  return JSON.parse(jsonStr);
}

let _ad: any | null = null

class SdkKs extends SdkCommon {
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

  constructor(initParams: InitRpkParams) {
    super(PLATFORM)
    Object.assign(SYSTEM_INFO, SYSTEM_INFO_RPK, { ...initParams })
    this.getInitConfig({ complete: initParams.complete })
  }

  // 同步用户信息
  async infoSync(callback: RpkMethodParams) {
    try {
      ks.login({
        success: (res: any) => {
          ks.getUserInfo({
            success: async (userInfoResult: any) => {
              let result = await refreshUserInfo({
                code: res.code,
                raw_data :userInfoResult.rawData,
                signature : userInfoResult.signature
              })
              callback.complete(result)
            },
            fail: (error: any) => {
              callback.complete(handleTrackError(PLATFORM, '', error))
            }
          })
        },
        fail: function(err: any) {
          callback.complete(handleTrackError(PLATFORM, '', err))
        }
      })
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  public async login(params: RpkKuaishouLogin, callback: RpkMethodParams) {
    try {
      await pubCheck(ksLoginParamsCheck, callback, params)
      const user_source = this.getLoginQsAndGenerateStruct()
      const source_ad = this.getAttributionData()
      params.method = params.method || 'minigame_kuaishou'
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

      const _login = async (code: any, userInfoResult?: any) => {
        try {
          const { custom_ext, ...rest_ext } = reqLogin.ext || {}
          reqLogin.custom_ext = custom_ext || {}
          reqLogin.ext = {
            ...(rest_ext || {}),
            code: code
          }
          if (userInfoResult) {
            reqLogin.ext.raw_data = userInfoResult.rawData
            // reqLogin.ext.raw_data2 = jsonToBase64(userInfoResult.rawData)
            reqLogin.ext.signature = userInfoResult.signature
          }

          const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
          reqLogin = reflowEnabled ? { ...reqLogin, device: source_ad } : { ...reqLogin }
          let loginRx = await loginByCredentialApi(this.ActivePrefix(reqLogin))
          Object.assign(USER_INFO, loginRx.data)
          customSetStorageSync('rxToken', loginRx.data.token)
          customSetStorageSync('rxUserInfo', loginRx.data)
          customSetStorageSync('rx-loginState', 1)

          console.log('rxToken', customGetStorageSync('rxToken'))

          try {
            if ((loginRx?.data?.user_flag & 1) == 1) {
              this.isPromoter = true
              this.game_id = loginRx?.data?.cp_user_id
            }
          } catch (e) {
          }

          callback.complete(loginRx)
        } catch (err: any) {
          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err, COMMON_ERROR_CODE.LOGIN_FAIL))
        }
      }

      if (params.login_openid) {
        ks.login({
          success: async (res: any) => {
            try {
              const loginTokenRx = await loginByTokenApi(this.ActivePrefix(reqLogin))
              Object.assign(USER_INFO, loginTokenRx.data)
              customSetStorageSync('rx-loginState', 1)
              customSetStorageSync('rxToken', loginTokenRx.data.token)
              customSetStorageSync('rxUserInfo', loginTokenRx.data)
              try {
                if ((loginTokenRx?.data?.user_flag & 1) == 1) {
                  this.isPromoter = true
                  this.game_id = loginTokenRx?.data?.cp_user_id
                }
              } catch (e) {
              }
              callback.complete(loginTokenRx)
            } catch (err) {
              callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
            }
          },
          fail: (err: any) => {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
          }
        })
      } else {
        ks.login({
          success: (res: any) => {
            ks.authorize({
              scope: 'scope.userInfo',
              success: () => {
                console.log('授权获取用户信息成功')

                ks.getUserInfo({
                  success: async (userInfoResult: any) => {
                    _login(res.code, userInfoResult)
                  },
                  fail: (error: any) => {
                    _login(res.code)
                  }
                })
              },
              fail: () => {
                _login(res.code)
              }
            })
          },
          fail: (err: any) => {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err, COMMON_ERROR_CODE.LOGIN_FAIL))
          }
        })
      }
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
    }
  }

  public async pay(params: RpkKuaishouPayParam, callback: RpkMethodParams) {
    const { exchange, ...rest } = params
    if(exchange) {
      this.exchangeItemProp(rest, callback)
      return
    }
    try {
      await pubCheck(ksPayCheckParams, callback, params)
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
      console.log(JSON.stringify(result))

      if (result.data?.ext?.callback == 1) {
        await postPayData(result.data?.notify_url, {
          order_no: result.data?.order_no,
          os: result.data?.ext?.os
        })
        callback.complete({ code: 0 })
        return
      }

      const gamePayParams: any = {
        zone_id: result.data?.ext?.zone_id,
        os: result.data?.ext?.os,
        currency_type: result.data?.ext?.currency_type,
        buy_quantity: result.data?.ext?.buy_quantity,
        third_party_trade_no: result.data?.ext?.third_party_trade_no,
        extension: result.data?.ext?.extension,
        sign: result.data?.ext?.sign
      }

      if (result.data?.ext?.os == 'ios') {
        gamePayParams.product_type = result.data?.ext?.product_type
      }

      ks.requestGamePayment({
        ...gamePayParams,
        success(res: any) {
          callback.complete({ code: 0 })
        },
        fail(err: any) {
          console.log(err)
          if (err.errorCode == 3) {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
              code: 4001,
              msg: '取消支付',
              thirdcode: err.errorCode
            }))
            return
          }
          if (result.data?.ext?.os == 'ios' && err.errorCode == -1) {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
              code: 4001,
              msg: '取消支付',
              thirdcode: err.errorCode
            }))
            return
          }

          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err, COMMON_ERROR_CODE.PAY_ERROR))
        }
      })
    } catch (err: any) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err, COMMON_ERROR_CODE.PAY_ERROR))
    }
  }

  //分享
  public async share(params: { templateId?: string, query?: string }, callback: RpkMethodParams) {
    ks.shareAppMessage({
      templateId: params.templateId,
      query: params.query,
      success() {
        callback.complete({ code: 0 })
      },
      fail: (err: any) => {
        callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', err))
      }
    })
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
      const platform = 'kuaishou'
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
  public async rewardedVideoAd(data: any, { complete, fail }: RpkMethodParams) {
    let adShareData: any = {}
    if (!data.adUnitId && data.func) {
      adShareData = await this.getAdShareData({
        func: data.func,
        custom_ext: data.custom_ext || {}
      })
      console.log('ad share data', adShareData)
    }
    const adUnitId = data.adUnitId || adShareData?.data?.ad_content?.identify
    let rewardedVideoAd = ks.createRewardedVideoAd({
      adUnitId
    })
    if (rewardedVideoAd) {
      rewardedVideoAd.onClose((res: any) => {
        rewardedVideoAd.destroy()
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          complete({
            code: 0,
            data: null,
            msg: '正常播放结束，可以下发游戏奖励',
            isEnded: res.isEnded
          })
        } else {
          // 播放中途退出，不下发游戏奖励
          complete({
            code: -1,
            data: null,
            msg: '播放中途退出，不下发游戏奖励',
            isEnded: res.isEnded
          })
        }
      })
      rewardedVideoAd.onError((err: any) => {
        // 激励视频广告Error事件
        console.log(err)
        rewardedVideoAd.destroy()
      })
      let p = rewardedVideoAd.show()
      p.then(function(result: any) {
        // 激励视频展示成功
        console.log(`show rewarded video ad success, result is `)
        console.log(result)
      }).catch((error: any) => {
        // 激励视频展示失败
        console.log(`show rewarded video ad failed, error`)
        console.log(error)
        const _error = handleTrackError(PLATFORM, 'rxlog_error_ad', error)
        complete(_error)
        fail && fail(_error)
      })
    } else {
      console.log('创建激励视频组件失败')
      const _error = handleTrackError(PLATFORM, 'rxlog_error_ad', {
        code: -1,
        data: null,
        msg: '创建激励视频组件失败',
        isEnded: false
      })
      complete(_error)
      fail && fail(_error)
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
    params: RpkgetShareData,
    callback: RpkMethodParams,
    stopCallback?: boolean
  ) {
    try {
      await pubCheck(ShareCheckParams, callback, params)
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
      const platform = 'kuaishou'
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

      setupStOffsetRefreshForMiniGame(typeof ks !== 'undefined' ? ks : null, getServerTime)

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
}

export default SdkKs
