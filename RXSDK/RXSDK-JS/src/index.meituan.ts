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
  handleError,
  formatTrackParams, asyncFunc, qs
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
  ShareCheckParams
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
  refreshUserInfo,
  mtReport
} from '@/rpk/apis'
import SdkCommon from '@/rpk/SdkCommon'
import { setupStOffsetRefreshForMiniGame } from '@/utils/stOffset'

const PLATFORM = 'minigame_meituan'

declare global {
  var mt: any
  var GameSDK_AD: any
}

class SdkMeiTuan extends SdkCommon {
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
      mt.login({
        success: (res: any) => {
          mt.getUserInfo({
            success: async (userInfoResult: any) => {
              let result = await refreshUserInfo({
                code: res.code,
                gender: `${userInfoResult.gender}`,
                avatarUrl: `${userInfoResult.avatarUrl}`,
                nickName: `${userInfoResult.nickName}`,
              })
              callback.complete(result)
            },
            fail: (error: any) => {
              callback.complete(handleTrackError(PLATFORM, '', error))
            }
          })
        },
        fail: function(err: any) {
          callback.complete(handleError(err))
        }
      })
    } catch (error) {
      callback.complete(handleTrackError(PLATFORM, '', error))
    }
  }

  public async login(params: any, callback: RpkMethodParams) {
    try {
      const user_source = this.getLoginQsAndGenerateStruct()
      const source_ad = this.getAttributionData()
      params.method = params.method || 'minigame_meituan'
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
            reqLogin.ext.gender = userInfoResult.gender
            reqLogin.ext.avatarUrl = userInfoResult.avatarUrl
            reqLogin.ext.nickName = userInfoResult.nickName
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
              this.isPromoter = true
              this.game_id = loginRx?.data?.cp_user_id
            }
          } catch (e) {
          }
          console.log('登录成功' + JSON.stringify(loginRx))
          callback.complete(loginRx)
        } catch (err: any) {
          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err, COMMON_ERROR_CODE.LOGIN_FAIL))
        }
      }

      if (params.login_openid) {
        const loginTokenRx = await loginByTokenApi(this.ActivePrefix(reqLogin))
        Object.assign(USER_INFO, loginTokenRx.data)
        customSetStorageSync('rxToken', loginTokenRx.data.token)
        customSetStorageSync('rxUserInfo', loginTokenRx.data)
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
        mt.login({
          success: (res: any) => {

            mt.getUserInfo({
              success: async (userInfoResult: any) => {
                _login(res.code, userInfoResult)
                console.log('getUserInfoSuc = ' + JSON.stringify(userInfoResult))
              },
              fail: (error: any) => {
                _login(res.code)
                console.log('getUserInfoError = ' + JSON.stringify(error))
              }
            })
          },
          fail: function(err: any) {
            callback.complete(handleError(err))
          }
        })
      }
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
    }
  }

  public async pay(params: any, callback: RpkMethodParams) {
    console.log(SYSTEM_INFO.baseUrlList[SYSTEM_INFO.reqUrlIndex])
    let orderReq: any, requestMidasPaymentReq: any, compensateOrderReq: any

    try {
      if (params.indulge_auth == 1 && !params.age) {
        throw Error('when indulge_auth equal 1,the age must be required')
      }

      let reqOrder = {
        ...params,
        currency: 'CNY',
        openid: USER_INFO.openid,
        sub_channel_id: USER_INFO.subchannelid,
        is_debug: params.is_debug || 0,
        env: params.env || 0,
        pay_type: 'minigame_meituan'
      }

      reqOrder.callback_from = 1
      reqOrder.ext = {
        ...reqOrder.ext,
        ...{
          wx_openid: USER_INFO.tid,
          zone_id: '1',
          pf: 'android'
        }
      }
      orderReq = reqOrder

      const result = await orderApi(reqOrder)

      this.track(
        {
          complete: () => {
          }
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
      const { ext, order_no } = res

      const requestMidasPaymentParams = {
        appId: ext.appId,
        mgcId: ext.mgcId,
        accessToken: ext.accessToken,
        productId: ext.productId || '',
        productName: ext.productName || '',
        productDesc: ext.productDesc || '',
        productUrl: ext.productUrl || '',
        bizOrderNo: ext.bizOrderNo || order_no,
        needRefresh: params.needRefresh || 1
      } as any

      console.info('支付请求参数: ', JSON.stringify(requestMidasPaymentParams))
      requestMidasPaymentReq = requestMidasPaymentParams

      mt.requestMidasPayment({
        ...requestMidasPaymentParams,
        success(res: any) {
          callback.complete({ code: 0 })
        },
        fail(err: any) {
          console.log('支付失败' + JSON.stringify(err))
          if (JSON.stringify(err).includes('1001')) {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
              code: 4001,
              msg: '取消支付',
              thirdode: 1001
            }))
            return
          }
          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err, COMMON_ERROR_CODE.PAY_ERROR))
        }
      })

    } catch (err: any) {
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err))
    }
  }

  //分享
  public async share(params: any, callback: RpkMethodParams) {
    let shareData = await this.getShareData(params, callback, true)
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
    try {
      mt.shareAppMessage({
        title: params.title || shareData?.data?.content?.content,
        imageUrl: params.imageUrl || shareData?.data?.content?.image,
        query: query,
        success: () => {
          callback.complete(shareData)
        },
        fail: (err: any) => {
          callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', err))
        }
      })
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

  /**
   * 版本号比较函数
   * @param currentVersion 当前版本号，如 '12.37.200'
   * @param minVersion 最低要求版本号，如 '12.37.200'
   * @returns 如果当前版本小于最低要求版本，返回 true；否则返回 false
   */
  private versionCheck(currentVersion: string, minVersion: string): boolean {
    // 将版本号字符串按 . 分割成数组
    const v1Parts = currentVersion.split('.').map(Number)
    const v2Parts = minVersion.split('.').map(Number)

    // 获取两个版本号数组的最大长度
    const maxLength = Math.max(v1Parts.length, v2Parts.length)

    // 逐位比较版本号
    for (let i = 0; i < maxLength; i++) {
      // 如果某个版本号数组已经遍历完，对应位置的值视为 0
      const num1 = i < v1Parts.length ? v1Parts[i] : 0
      const num2 = i < v2Parts.length ? v2Parts[i] : 0

      if (num1 < num2) {
        return true // 当前版本小于最低要求版本
      } else if (num1 > num2) {
        return false // 当前版本大于最低要求版本
      }
      // 如果当前位相等，继续比较下一位
    }

    return false // 两个版本号相等，满足要求
  }

  // 激励视频兜底落地 当前美团版本不支持激励广告，所以需要兜底落地
  public supportedAdvertisingVideo(callback: RpkMethodParams) {
    try {
      let adStartTime = -1
      const defaultLink = 'imeituan://www.meituan.com/web?wkwebview=1&notitlebar=1&url=https%3A%2F%2Fgame.meituan.com%2Fcommercial%2Fhttp%2Factivity%2FqueryUrl%3FactivityId%3D10237'
      mt.openPage({
        url: defaultLink,
        success: () => {
          console.warn('打开兜底页面成功')
          adStartTime = Date.now()
          mt.onShow(onShow)
        },
        fail: () => {
          console.warn('打开广告失败')
        }
      });
      const onShow = () => {
        const duration = Date.now() - adStartTime;
        console.warn('onShow duration', duration, adStartTime)
        if (adStartTime > 0 && duration > 15 * 1000) { // 例如跳出时间大于 15 秒则完成奖励
          // 进行发奖
          callback.complete({
            code: 0,
            data: { adType: 'defaultLink' },
            msg: '',
          })
        } else {
        // 提示未满足发奖条件
          callback.complete({
            code: -1,
            data: { adType: 'defaultLink' },
            msg: '未浏览满15秒，无法领奖',
          })
        }
        // 重置
        adStartTime = -1
        mt.offShow(onShow)
      }
    } catch (error) {
      console.warn('supportedAdvertisingVideo error', JSON.stringify(error))
    }
  }

  // 激励视频
  public async advertisingVideo(params: any, callback: RpkMethodParams) {
    try {
      console.warn('SDKVersion', mt.getSystemInfoSync().SDKVersion)
      if(mt?.getSystemInfoSync()?.SDKVersion && this.versionCheck(mt?.getSystemInfoSync()?.SDKVersion, '12.45.200') && mt?.createCustomAd) {
        console.warn('当前版本不支持激励广告')
        this.supportedAdvertisingVideo(callback)
        return
      } else {
        // 创建美团广告
        const customAd = mt.createCustomAd({
          posId: params?.posId // 填入美团提供的 posId
        })

        console.warn('customAd', JSON.stringify(customAd))

        // 如果 posId 没传，customAd 可能为空
        if (!customAd) {
          console.warn('广告位实例创建失败')
          return
        }
        // 可以在 error 进行监听错误
        customAd.onError((res: any) => {
          console.warn('广告加载异常', JSON.stringify(res))
          // 广告加载异常，使用兜底方案
          this.supportedAdvertisingVideo(callback)
          // 异常需要上报大数据
          try {
            handleTrackError(PLATFORM, 'rxlog_error_ad', {...res, adErrorType: 'onError'})
          } catch (error) {}
        })

        // 可以在 onClose 进行监听关闭
        customAd.onClose(async (res: any) => {
          if (res && res.isRewarded) {
            console.warn('正常播放结束，可以下发游戏奖励')
            // 正常播放结束，可以下发游戏奖励
            callback.complete({
              code: 0,
              data: res,
              msg: '',
            })
          } else {
            // 播放中途退出，不下发游戏奖励
            console.warn('播放中途退出，不下发游戏奖励')
            callback.complete({
              code: -1,
              data: res,
              msg: '',
            })
          }
          // 广告位实例不再使用时销毁
          customAd && customAd.destroy()
        })

        // // create 时默认进行一次广告拉取，可以在 load 进行监听
        customAd.onLoad(async (res: any) => {
          try {
            // adList 不为空，则拉取的是自渲染广告；否则为非自渲染。
            if(res && res?.adList && res?.adList?.length > 0) {
              console.warn('自渲染广告, 不进行展示')
            } else {
              // 上报 mv 曝光 ， mc 点击
              try {
                let adReportParams = {
                  cid: params?.cid || '', 
                  bid: params?.bid || '',
                }
                customAd.adReport({...adReportParams, behaviorId: 'mv'})
                customAd.adReport({...adReportParams, behaviorId: 'mc'})
              } catch (error) {
                console.warn('广告上报失败', JSON.stringify(error))
              }

              // 展示广告
              try {
                customAd.show()
                .then((res: any) => {
                  console.warn('show == then', JSON.stringify(res))
                })
                .catch((err: any) => {
                  console.warn('广告展示失败', JSON.stringify(err))
                })
              } catch (error) {
                console.warn('广告展示失败', JSON.stringify(error))
              }
            }
          } catch (error) {
            console.warn('onLoad回调处理失败', JSON.stringify(error))
          }
        })
      }
    } catch (error) {
      console.warn('advertisingVideo error', JSON.stringify(error))
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_ad', error))
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
      const platform = 'meituan'
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

  //激励广告
  public async rewardedVideoAd(data: IRequestAdData, { complete }: IMethodParams) {
    // @ts-ignore
    // wx.openPage({ 'url': 'imeituan://www.meituan.com/web?wkwebview=1&notitlebar=1&url=https%3A%2F%2Fawp.meituan.com%2Fgame%2Ffeed%2Findex.html%3Fpage%3D102731004' })
    // return
    //
    // const fail = (error: any) => {
    //   /**
    //    * 广告错误码两种字段
    //    * 字段1: err_code
    //    * errMsg: "operateWXDataForAd:fail invalid scope"
    //    * err_code: -12001
    //    *
    //    * 字段2: errCode
    //    * errMsg: "广告单元无效"
    //    * errCode: 1002
    //    */
    //   error.message = error.message || error.errMsg
    //   const err: any = new Error(error.message)
    //   // data: 保留原始错误
    //   err.data = {
    //     data: error
    //   }
    //   complete(handleError(err))
    //   this.track(
    //     {
    //       complete: (data: any) => {
    //         console.info('rewardedVideoAd error add complete func when tracked:', data)
    //       }
    //     },
    //     formatTrackParams({
    //       eventName: 'track_err',
    //       apiName: 'rewardedVideoAd',
    //       reqParams: data,
    //       errorInfo: error,
    //       loginInfo: USER_INFO
    //     })
    //   )
    // }
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
      const platform = 'meituan'
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
      // //检查是否需要传递subchannleid
      this.publicSubchannelCheck(res)
      customSetStorageSync('rx-init-params', { version })
      SYSTEM_INFO.SDK_INIT_FINISHED = true
      SYSTEM_INFO.CP_OF = res?.data?.cp?.of || false
      const _serverTime = res?.data?.server?.time
      if (_serverTime) {
        SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now())
      }

      setupStOffsetRefreshForMiniGame(typeof mt !== 'undefined' ? mt : null, getServerTime)

      console.log('aaaaaaaa')
      // // 检查是否需要激活
      this.checkNeedActivate()
      this.loopGetPublicProps()

      callback.complete({ code: 0, data: this.initConfig })
      // callback.complete({ code: 0, data: res })
    } catch (err: any) {
      console.info('init err')
      console.info(err)
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

    let timerId: any
    const repeat = (ms: number) => {
      timerId && clearTimeout(timerId)
      timerId = setTimeout(() => getPublicPropsConfig(), ms || this.businessRuleDefaultRefreshTime)
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

  /**
   * 添加到桌面
   * @param params 说明如下
   * shortcutType 快捷方式类型 1: 动态快捷方式,Android版本大于24才支持,对应iOS的3D touch 2: 常规桌面快捷方式，会新增一个图标 3: 桌面小插件,常见墨迹天气的桌面插件
   * id 快捷方式唯一标识
   * label 快捷方式显示的名称（shortcutType=1 或 2时必填）
   * icon 快捷方式图片网络路径
   * target 快捷方式跳转目标页面（shortcutType=1 或 2时必填）
   * widgetProviderId 桌面小插件唯一标识
   * interceptSuccess 拦截添加快捷方式成功提示（目前只有addShortcut生效）
   * */
  public async addShortcut(params: any, callback: IMethodParams) {
    try {
      const result = await asyncFunc(mt.addShortcut, {
        shortcutType: params?.shortcutType || 2,
        id: params?.id || 'gameid_rx',
        label: params?.label || 'rx',
        icon: params?.icon || '',
        target: params?.target || '',
        widgetProviderId: params?.widgetProviderId || 'gameid_widget_rx',
        interceptSuccess: params?.interceptSuccess || false
      })

      if (result.value != null) {
        console.log('添加桌面原始错误' + JSON.stringify(result))
        callback.complete(handleError({
          code: COMMON_ERROR_CODE.ADD_SHORT_CUT,
          msg: '添加到桌面失败',
          thirdcode: result.code,
          thirdmsg: result.msg
        }))
      } else {
        callback.complete({ code: 0 })
      }

    } catch (err) {
      console.log('不支持添加到桌面')
    }
  }

  // 美团上报
  public async gameActionReport(params: any, callback: RpkMethodParams) {
    try {
      let reportParams = {
        ...params,
        openid: USER_INFO.openid,
      }
      const result = await mtReport(reportParams)
      callback.complete(result)
    } catch (err) {
      callback.complete(handleTrackError(PLATFORM, '', err))
    }
  }
}

export default SdkMeiTuan
