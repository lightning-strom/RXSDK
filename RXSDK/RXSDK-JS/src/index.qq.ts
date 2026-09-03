import axios from 'axios'
import myAdapter from 'axios-miniprogram-adapter'
import SdkCommon from './index.common'
import { invalidInitParams, pubCheck } from '@/utils/paramsValid'
import {
  initParamsCheck,
  checkTrackParams,
  checkIReqBusinessData,
  checkIReqBusinessOrder,
  shareScheduleInitParams,
  shareScheduleReportParams,
} from '@/utils/checkConfig'
import {
  qqgameLoginParamsCheck,
  qqgamePayCheckParams,
  qqgameShareCheckParams,
  DeleteLoactionCheckParams2,
  ReportLoactionCheckParams,
  getNearlyRediusCheckParams,
} from '@/utils/checkConfig/qq'
import { asyncFunc, formatTrackParams, handleError, qs } from '@/utils/utils'
import { getSearchQueries, getUserInfo, removeStorageByPrefix } from '@/utils/qq/utils'
import {
  activated,
  businessOrderApi,
  getBusinessRules,
  getInitConf,
  getServerTime,
  deleteReportLocation,
  getNearlyPeasonByRadius,
  reportLocationUpdata,
  getPublicProps,
  getShareDataApi,
  loginByCredentialApi,
  loginByTokenApi,
  orderApi,
  refreshUserInfo,
  schedulingInitApi,
  schedulingReportApi,
  trackApi,
  getNoticeApi,
  getPromoterCodeApi,
  exchangePromoterCodeApi, createFeedbackApi, getFeedbackListApi, getFeedbackDetailApi, collectPropsApi
} from '@/api/api'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { SYSTEM_INFO as SYSTEM_INFO_QQ } from '@/config/qq'
import { setupStOffsetRefreshForMiniGame } from '@/utils/stOffset'
import { compact, isArray, isEmpty, isNil, omit, pick, isObject } from '@/utils/is'
import { AD_ERROR_MAP, COMMON_ERROR_CODE } from '@/config/const'
// import dayjs from 'dayjs'
import { formatDate } from '@/utils/day'
import v4 from 'uuid/v4'

import { PLATFORM } from '@/config/enum'

axios.defaults.adapter = myAdapter as any

class SdkQQ extends SdkCommon {
  private _rewardAd: WechatMinigame.RewardedVideoAd | null = null
  private _bannerAd: WechatMinigame.BannerAd | null = null
  private _interstitialAd: WechatMinigame.InterstitialAd | null = null
  private _hasAd: { [key in AdTypes]: boolean | undefined } = {
    banner: undefined,
    interstitial: undefined,
    rewarded: undefined,
  }
  // private _shareMessageToFriendCallback?: WechatMinigame.OnShareMessageToFriendCallback
  private _userInfoButton: WechatMinigame.UserInfoButton | null = null
  private locationInfomation: WechatMinigame.GetLocationSuccessCallbackResult | null = null
  private reportLocationTimer: any = null
  //用于记录刷新session
  private refreshSession = 0
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
    hit_cache: false,
  }
  // 接口失败次数
  // private businessRuleFailCount = 0
  // test 轮询获取商业化接口数据
  // private intervalNum = 0
  // 商业化接口是否返回结果
  private businessRuleInvoking = false
  // 条件获取商业化窗口队列
  private businessWindowsQueue: any[] = []

  // 上报公共属性接口失败次数
  private trackPublicPropsFailCount = 0

  /**
    * initConfig: SDK初始化配置
    * {
    *    [configKey]: 后端配置结构
    * }
    *
    * 例如：sdkconfig/init
    * {
    * "event_public_attr": {
           "public_attr": {
             "pay_over": ["property1", "scenes_id", "a"],
             "event2": ["property1", "property2"],
             "event3": ["property1", "property2"]
           },
           "refresh": 6000,
           "version": "string"
       }
    *
    * */
  private initConfig: any = {}
  // 调度埋点
  private scheduleInitMap: any = {}
  // 获取分享数据缓存调度上报参数
  private scheuleReportProps:any = {}
  public subChannelId:any = null
  private isPromoter: boolean = false
  private game_id:string = ''
  private promoInfo: any = {
    timer: null,
    refresh_period_exp: 0,
    polling: 0,
    promo_code: ''
  }

  constructor(initParams: ISdkInitParams) {
    super(initParams)

    invalidInitParams(initParams, initParamsCheck)
    console.info('channel sdk check params passed')

    Object.assign(SYSTEM_INFO, SYSTEM_INFO_QQ, { ...initParams, index: 0 })
    console.info('SYSTEM_INFO: ', SYSTEM_INFO)

    // 获取初始化配置
    this.getInitConfig({ complete: initParams.complete })
  }

  private async addFeedback(params: any ,callback?: IMethodParams) {
    try {
      const res = await createFeedbackApi(params)
      console.log(res)
    }catch (err:any) {
      callback && callback.complete(handleError(err))
    }
  }

  private async getFeedbackList(params: any ,callback?: IMethodParams) {
    try {
      const res = await getFeedbackListApi(params)
      console.log(res)
    }catch (err:any) {
      callback && callback.complete(handleError(err))
    }
  }

  private async getFeedbackDetail(params: any ,callback?: IMethodParams) {
    try {
      const res = await getFeedbackDetailApi(params)
      console.log(res)
    }catch (err:any) {
      callback && callback.complete(handleError(err))
    }
  }

  private async collectProps(params: any ,callback?: IMethodParams) {
    try {
      const res = await collectPropsApi(params)
      console.log(res)
    }catch (err:any) {
      callback && callback.complete(handleError(err))
    }
  }

  private async getAnnouncement(limit: number ,callback?: IMethodParams) {
    if(!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
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
    }catch (err:any) {
      callback && callback.complete(handleError(err))
    }
  }

  private clearPromoterTimer() {
    console.log('clearPromoterTimer')
    if(this.promoInfo.timer) {
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

  private getPromoDisplayKEY(callback?: IMethodParams, autoRefresh= false, immediately = true) {
    this.clearPromoterTimer()
    let promo_code = this.promoInfo.promo_code
    getPromoterCodeApi(this.game_id).then(res=>{
      try {
        if(res.code == 0) {
          this.promoInfo.refresh_period_exp = res.data.refresh_period_exp || 0
          this.promoInfo.polling = res.data.polling || 0
          promo_code = res.data.promo_code
        }
      } catch (e: any) {
        this.promoInfo.refresh_period_exp = 0
        this.promoInfo.polling = 0
      }
      if(autoRefresh) {
        this.startPromoterTimer(callback, autoRefresh)
      }
      if(!immediately && promo_code == this.promoInfo.promo_code) {
        return
      }else {
        this.promoInfo.promo_code = promo_code
      }
      callback && callback.complete(res)
    }).catch((err:any)=> {
      if(err.isServerError) {
        this.clearPromoterTimer()
        callback && callback.complete(handleError(err))
      } else {
        if(autoRefresh){
          this.startPromoterTimer(callback, autoRefresh)
        }else {
          callback && callback.complete(handleError(err))
        }
      }
    })
  }

  private exchangePromoCDKEY(cdkey: string, callback: IMethodParams) {
    exchangePromoterCodeApi(cdkey).then(res=>{
      callback.complete(res)
    }).catch((err)=>{
      callback.complete(handleError(err))
    })
  }

  private publicSubchannelCheck(res:any){
    try{
      const sub_channel = res?.data?.subcq?.subc
      const queryString = getSearchQueries(true)
      let query:any = queryString?queryString.split('&'):[]
      console.log(query)
      if(sub_channel?.length && query?.length){
        for(let a=0;a<sub_channel.length;a++){
          let item = sub_channel[a]
          let reflectStringArr = item?.map
          if(reflectStringArr?.length){
            let arr = item?.map
            let sub_channel_id = item?.id
            for(let k in arr){
              let str = arr[k]
              console.log(str)
              for(let c in query){
                if(str.includes(query[c])){
                  this.subChannelId = sub_channel_id
                  return
                }
              }
            }
          }
        }

      }
    }catch(err){

    }
  }

  private async getInitConfig(callback: IMethodParams) {
    const initParams = qq.getStorageSync('rx-init-params') || {}
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
        this.initConfig[key] = { ...config[key], ...this.initConfig[key] }
      }
      console.info('SDK initConfig: ', this.initConfig)

      //检查是否需要传递subchannleid
      this.publicSubchannelCheck(res)
      qq.setStorageSync('rx-init-params', { version })
      SYSTEM_INFO.SDK_INIT_FINISHED = true
      const _serverTime = res?.data?.server?.time
      if (_serverTime) {
        SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now())
      }

      // 初始化成功后监听应用进入前台，刷新 st_offset
      setupStOffsetRefreshForMiniGame(typeof qq !== 'undefined' ? qq : null, getServerTime)

      // 检查是否需要激活
      this.checkNeedActivate()

      this.loopGetPublicProps()

      callback.complete({ code: 0 })
    } catch (err) {
      const error: any = new Error('初始化错误，或未初始化')
      error.code = COMMON_ERROR_CODE.INIT_PARAMS_ERROR
      // data: 保留原始错误
      error.data = {
        data: err,
      }
      callback.complete(handleError(error))
    }
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

  //检查是否需要激活
  private async checkNeedActivate() {
    const activeResult = qq.getStorageSync('rx-active-result')
    if (!activeResult) {
      const source_ad: any = this.getAttributionData()
      const distinct_id = v4()
      qq.setStorageSync('rx_distinct_id', distinct_id)
      const req: any = {
        stage: 'init',
        distinct_id,
        source_ad,
      }

      try {
        const result = await activated(req)
        qq.setStorageSync('rx-active-result', { isSuccess: true, activeResult: result.data })
      } catch (err) {
        qq.setStorageSync('rx-active-result', { isSuccess: false, activeResult: req })
      }
    }
  }

  //格式化queryString
  private getLoginQsAndGenerateStruct() {
    const universal: any = getSearchQueries()
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
            user_attrs: leftProps,
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
    const subPackageInfo: any = qq.getStorageSync('rx_sub_package_info')
    if(!isEmpty(subPackageInfo)) {
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
    const loginState = qq.getStorageSync('rx-loginState')
    const activeSave = qq.getStorageSync('rx-active-result')
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
  public setSubChannelId(subChannelId: string ) {
    try {
      qq.setStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId })
      return { code: 0 }
    } catch (error) {
      return handleError(error)
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

  // 登录接口
  public async login(params: ILoginQQ, callback: IMethodParams) {
    const needAuth = params?.version === 'normal'
    try {
      await pubCheck(qqgameLoginParamsCheck, callback, params)
      if (needAuth) {
        if (this._userInfoButton) return
        await this.authorize(params, callback)
        return
      }

      const reqLoginData: any = {
        ext: {},
      }
      if (!params.login_openid) {
        const { code } = await asyncFunc(qq.login)
        reqLoginData.ext.code = code
      }
      console.info('sdk login without authorize')
      console.info('=====================')
      let userInfo: any = await this._login(params, reqLoginData)
      try {
        if((userInfo?.data?.user_flag & 1) == 1) {
          this.isPromoter = true
          this.game_id = userInfo?.data?.cp_user_id
        }
      }catch (e) {}
      callback.complete(userInfo)
    } catch (error) {
      callback.complete(handleError(error))
      this.track(
        {
          complete: (data: any) => {
            console.info('login error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'login',
          reqParams: params,
          errorInfo: error,
          loginInfo: USER_INFO,
        })
      )
    }
  }

  // 授权登录接口
  public async authorize(params: ILoginQQ, callback: IMethodParams) {
    console.info('sdk trigger authorize: ', params)
    console.info('=====================')
    try {
      await pubCheck(qqgameLoginParamsCheck, callback, params)
      if (this._userInfoButton) return
      const reqLoginData: any = {
        ext: {},
      }

      if (!params.login_openid) {
        const { code } = await asyncFunc(qq.login)
        reqLoginData.ext.code = code
      }

      try {
        const data = await getUserInfo({
          screenWidth: SYSTEM_INFO.screenWidth,
          screenHeight: SYSTEM_INFO.screenHeight,
          button: params?.button,
          withCredentials: true,
          setInstance: (instance) => {
            this._userInfoButton = instance
            return instance
          },
          autoClose: params?.autoClose,
          isCheck: params?.isCheck,
        })
        reqLoginData.ext.encryptedData = data.encryptedData
        reqLoginData.ext.iv = data.iv
      } catch (error) {
        callback.complete(handleError(error))
        return
      }

      console.info('sdk login after authorize data: ', reqLoginData)
      console.info('=====================')
      let userInfo: any = await this._login(params, reqLoginData)
      callback.complete(userInfo)
      return userInfo
    } catch (error) {
      callback.complete(handleError(error))
      this.track(
        {
          complete: (data: any) => {
            console.info('authorize error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'authorize',
          reqParams: params,
          errorInfo: error,
          loginInfo: USER_INFO,
        })
      )
    }
  }

  private async _login(params: ILoginQQ, loginData?: any) {
    try {
      const user_source = this.getLoginQsAndGenerateStruct()
      const source_ad = this.getAttributionData()
      const { version, sign_fields } = params
      const now = new Date().getTime()
      let distinct_idLocal = qq.getStorageSync('rx_distinct_id')
      let distinct_id = distinct_idLocal || v4()
      if (!distinct_idLocal) {
        qq.setStorageSync('rx_distinct_id', distinct_id)
      }
      let reqLoginData: any = {
        ts: now,
        method: params?.method || 'mobileqq',
        distinct_id,
        ...user_source,
        sign_fields,
        ext: {
          ...loginData?.ext,
          version,
        },
      }

      let userInfo: any = null

      if (params.login_openid) {
        //二次登录
        reqLoginData.login_openid = params.login_openid
        console.info('sdk 二次登录 api req: ', reqLoginData)
        userInfo = await loginByTokenApi(this.ActivePrefix(reqLoginData))
        qq.setStorageSync('rx-loginState', 1)
      } else {
        //正常登录
        // 投放开关 1开启，2关闭, 开启后传入归因数据，用于投放统计用户回流信息
        const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1
        const reqLogin = reflowEnabled
          ? { ...reqLoginData, device: source_ad }
          : { ...reqLoginData }
        console.info('sdk normal login api req: ', reqLogin)
        userInfo = await loginByCredentialApi(this.ActivePrefix(reqLogin))
        qq.setStorageSync('rx-loginState', 1)
      }
      Object.assign(USER_INFO, userInfo.data)
      console.info('sdk USER_INFO :', USER_INFO)
      qq.setStorageSync('rxToken', userInfo.data.token)
      !params?.reconnect_login &&
        this.refreshBusinessData(
          {
            complete: () => {},
          },
          !params?.cancel_business_queue
        )
      return userInfo
    } catch (error) {
      throw error
    }
  }

  // 支付
  public async pay(params: IPayQQ, callback: IMethodParams) {
    try {
      await pubCheck(qqgamePayCheckParams, callback, params)
      if (params.indulge_auth == 1 && !params.age) {
        const error: any = new Error('when indulge_auth equal 1,the age must be required')
        error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR
        throw error
      }
      this.order(params, callback)
    } catch (error) {
      callback.complete(handleError(error))
      this.track(
        {
          complete: (data: any) => {
            console.info('pay error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'pay',
          reqParams: params,
          errorInfo: error,
          loginInfo: USER_INFO,
        })
      )
    }
  }

  public async order(params: IPayQQ, { complete }: IMethodParams) {
    try {
      params.ext = params?.ext || {}
      // const { pay_type } = params
      let reqOrder = {
        ...params,
        currency: 'CNY',
        openid: USER_INFO.openid,
        sub_channel_id: USER_INFO.subchannelid,
        is_debug: params.is_debug || 0,
        env: params.env || 0,
        callback_from: 0,
        ext: {
          ...params.ext,
          qq_openid: USER_INFO.tid,
        },
      }

      // if (pay_type === 'wxpub') {
      //   const { orderNo, price } = await orderApi(reqOrder)
      //   const orderParams = `?type=order&orderNo=${orderNo}`
      //   // ios
      //   await this.payIos(
      //     {
      //       params: `?type=order&order_no=${orderNo}&money=${price}&product_id=${
      //         SYSTEM_INFO.productId
      //       }&channel_id=${SYSTEM_INFO.channelId}&rx_openid=${USER_INFO.openid}&goods_tag=${
      //         params.goods_tag
      //       }&sdk_version=v3${params.noreply ? `&noreply=${params.noreply}` : ''}${
      //         params?.querystr ?? ''
      //       }`,
      //       desc: '充值',
      //       func: params.func,
      //       reconfirm: true,
      //       sessionFrom: JSON.stringify({
      //         ruixue_openid: USER_INFO.openid,
      //       }),
      //     },
      //     {}
      //   )
      // } else {
      // reqOrder.ext = {
      //   ...reqOrder.ext,
      //   qq_openid: USER_INFO.tid,
      // }
      const {
        data: { ext },
      } = await orderApi(reqOrder)
      const { amount, prepayId } = ext || {}

      await asyncFunc(qq.requestMidasPayment, {
        prepayId,
        setEnv: params.env || 0,
        starCurrency: amount,
      })

      complete({ code: 0 })
      this.refreshSession = 0
    } catch (error: any) {
      if (error?.code == 152413 && this.refreshSession < 2) {
        // session 过期处理
        this.refreshSession++
        this.refreshSessionFunc().then(() => {
          this.pay(params, { complete })
        })
      } else {
        if(error.errCode == -2) {
          error.code = 4001
          error.thirdcode = -2
        }
        if(error.errCode == -1 || error.errCode == -3 || error.errCode == -4) {
          error.code = COMMON_ERROR_CODE.PAY_ERROR
          error.thirdcode = -1
        }
        complete(handleError(error))
        this.track(
          {
            complete: (data: any) => {
              console.info('order error add complete func when tracked:', data)
            },
          },
          formatTrackParams({
            eventName: 'track_err',
            apiName: 'order',
            reqParams: params,
            errorInfo: error,
            loginInfo: USER_INFO,
          })
        )
      }
    }
  }

  // private async payIos(
  //   { params, desc = '', func, title, image, reconfirm, sessionFrom }: ConversationParams,
  //   { complete }: Partial<IMethodParams>
  // ) {
  //   if (func) {
  //     const { data } = await getShareDataApi({
  //       product_id: SYSTEM_INFO.productId,
  //       channel_id: SYSTEM_INFO.channelId,
  //       sub_channel_id: USER_INFO.subchannelid || '',
  //       region: USER_INFO.region || '',
  //       func,
  //       platform: 'wechat',
  //       type: 'mini',
  //     })
  //     if (data) {
  //       title = data.content?.content
  //       image = data.content?.image
  //     }
  //   }
  //   // await asyncFunc(qq.showModal, {
  //   //   title: MODAL_TITLE,
  //   //   content: '请点击确定进入[客服会话]进行充值!',
  //   //   showCancel: false,
  //   // })
  //   const openConversation = async () => {
  //     try {
  //       await asyncFunc(qq.openCustomerServiceConversation, {
  //         showMessageCard: true,
  //         sessionFrom: params,
  //         sendMessageTitle: title,
  //         sendMessagePath: params,
  //         sendMessageImg: image,
  //       })
  //     } catch (error: any) {
  //       const { errMsg } = error
  //       if (errMsg && !errMsg.includes('cancel')) {
  //         throw error
  //       }
  //       const { confirm } = await asyncFunc(qq.showModal, {
  //         title: MODAL_TITLE,
  //         content: `因版本限制, 需通过[客服会话]${desc}, 请您谅解!`,
  //         cancelText: '我知道了',
  //         confirmText: '前往充值',
  //       })
  //       if (confirm) {
  //         await openConversation()
  //       } else {
  //         throw new Error('用户取消')
  //       }
  //     }
  //   }
  //   await openConversation()
  // }

  public async refreshSessionFunc() {
    try {
      const { code } = await asyncFunc(qq.login)
      const res = await refreshUserInfo({
        version: 'base',
        code,
      })
      return res
    } catch (err: any) {
      this.track(
        {
          complete: (data: any) => {
            console.info('refreshSessionFunc error add complete func when tracked:', data)
          },
        },
        formatTrackParams({
          eventName: 'track_err',
          apiName: 'refreshSessionFunc',
          reqParams: {},
          errorInfo: err,
          loginInfo: USER_INFO,
        })
      )
      return
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
      platform: data?.platform || PLATFORM.QQ,
    }
  }

  //获得分享内容
  public async getShareData(
    params: IGetShareData,
    callback: IMethodParams,
    stopCallback?: boolean
  ) {
    try {
      await pubCheck(qqgameShareCheckParams, callback, params)

      const region = params?.region || USER_INFO.region || ''
      const cacheShareData = qq.getStorageSync(`rx_schedule_${USER_INFO.tid}_${params.func}_${region}`)
      const { readCache = true } = params
      if (readCache && cacheShareData) {
        const cShareData: any = JSON.parse(cacheShareData)
        console.info('sdk 缓存分享数据：', cShareData)
        this.setScheuleReportProps(cShareData?.data)
        !stopCallback && callback.complete(cShareData)
        return cShareData
      }

      const { productId, channelId } = SYSTEM_INFO
      const platform = PLATFORM.QQ
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
      })
      if(shareData?.data?.scheduling?.remaining_share_count <= 0) {
        this.shareSchedulingInit({}, {
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
    } catch (err) {
      callback.complete(handleError(err))
      this.track(
        {
          complete: (data: any) => {
            console.info('getShareData error add complete func when tracked:', data)
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
    }
  }

  //分享接口
  public async share(params: IGetShareData, { complete }: IMethodParams) {
    try {
      await pubCheck(qqgameShareCheckParams, { complete }, params)
      let shareData = await this.getShareData(params, { complete }, true)
      console.info('sdk getShareData info: ', shareData)
      const timeout = setTimeout(() => {
        const error: any = new Error('分享拉起超时')
        error.code = COMMON_ERROR_CODE.SHARE_TRIGGER_OVERTIME
        error.data = shareData
        complete(handleError(error))
      }, 2000)
      const onHide = () => {
        clearTimeout(timeout)
        qq.offHide(onHide)
      }

      const onShow = async () => {
        qq.offShow(onShow)
        complete(shareData)
      }

      let query = qs.stringify({
        type: 'rx',
        user_source: 'share',
        platform: shareData?.data?.platform || '',
        transmits: encodeURIComponent(params?.transmits || ''),
        landing_id: shareData?.data?.content?.landing_id,
        trigger_id: shareData?.data?.trigger?.id,
        trigger_tag: shareData?.data?.trigger?.tag,
        trigger_type: shareData?.data?.trigger?.type,
        material_type: shareData?.data?.content?.material_type,
        material_id: shareData?.data?.content?.material_id,
        strategy_type: shareData?.data?.strategy?.type,
        strategy_id: shareData?.data?.strategy?.id,
        share_time: Math.floor(new Date().getTime() / 1000),
        share_type: 'mini',
        inviter_region: USER_INFO.region || '',
        inviter_openid: USER_INFO.openid,
        inviter_productid: SYSTEM_INFO.productId,
        inviter_channelid: SYSTEM_INFO.channelId,
        inviter_subchannelid: USER_INFO?.subchannelid,
      })
      qq.onHide(onHide)
      qq.onShow(onShow)
      console.log('params: ', params)
      qq.shareAppMessage({
        title: params.title || shareData?.data?.content?.content,
        imageUrl: params.imageUrl || shareData?.data?.content?.image,
        query: params.query ? `${query}&${params.query}` : query,
        shareAppType: params.shareAppType || 'qq',
        complete: () => {
          clearTimeout(timeout)
        },
      })
    } catch (err) {
      complete(handleError(err))
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

  //数据上报
  public async track(callback: IMethodParams, params: trackParams) {
    try {
      await pubCheck(checkTrackParams, callback, params)

      const getDevicecode = () => {
        var devicecode = qq.getStorageSync('rx_devicecode')
        if (devicecode) {
          return devicecode.code
        } else {
          let code = v4()
          qq.setStorageSync('rx_devicecode', { code, openIds: {} })
          return code
        }
      }
      let devicecode = getDevicecode()
      let type: 'track' = 'track'
      let time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ')
      let uuids = v4()
      let platform_id: 4 = 4
      let { cpid: copyCpid, productId: product_id } = SYSTEM_INFO
      let cpid = Number(copyCpid)
      // 根据 event 获得当前 event 下的公共属性
      const publicPropskey = this.initConfig?.event_public_attr?.public_attr?.[params.event] || []
      const publicPropsByCache = qq.getStorageSync('rx_public_props')
      const publicProps = pick(publicPropsByCache, publicPropskey)
      console.log('公共属性:', publicProps)
      let reqarr: douyinTrackForReq[] = [
        {
          type,
          time,
          uuid: uuids,
          distinct_id: USER_INFO.openid,
          sub_channel_id: USER_INFO.subchannelid,
          platform_id,
          product_id,
          ip: '127.0.0.1',
          cpid,
          channel_id: SYSTEM_INFO.channelId,
          devicecode,
          ...{
            ...params,
            properties: {
              ...publicProps,
              ...params.properties,
            },
          },
        },
      ]
      !USER_INFO.subchannelid || (reqarr[0].sub_channel_id = USER_INFO.subchannelid)

      let result = await trackApi(reqarr)
      callback.complete({ ...result, data: null, msg: 'track success' })
    } catch (err) {
      callback.complete(handleError(err))
    }
  }

  //商业广告
  public async getAllBusinessData(callback: IMethodParams) {
    try {
      const data = omit(this.businessRulesInfo, 'timerId')
      let result = { code: 0, data }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 轮训商业化广告信息
  // private async loopGetBusinessRules() {
  //   const repeat = (ms: number) => {
  //     this.businessRulesInfo.timerId && clearTimeout(this.businessRulesInfo.timerId)
  //     this.businessRulesInfo.timerId = setTimeout(() => {
  //       // this.intervalNum++
  //       // console.log("setInterval", this.intervalNum);
  //       getRules()
  //       // repeat(ms)
  //     }, ms)
  //   }

  //   const getRules = async () => {
  //     try {
  //       const res = await getBusinessRules(this.businessRulesInfo.version)
  //       const {
  //         refresh_time = this.businessRuleDefaultRefreshTime,
  //         main_window_list = [],
  //         window_list = [],
  //       } = res?.data || {}
  //       this.businessRulesInfo.refresh_time = refresh_time
  //       this.businessRulesInfo.main_window_list = main_window_list
  //       this.businessRulesInfo.window_list = window_list
  //       repeat(this.businessRulesInfo.refresh_time)
  //     } catch (error) {
  //       handleError(error)
  //       if (this.businessRuleFailCount < 1) {
  //         // 首次获取失败3秒后重试
  //         this.businessRuleFailCount += 1
  //         repeat(3000)
  //       } else {
  //         // 再失败每十分钟后重试，直至成功
  //         this.businessRuleFailCount += 1
  //         repeat(600000)
  //       }
  //     }
  //   }

  //   getRules()
  // }

  // 条件获取商业化窗口数据
  public async getBusinessData(params: IReqBusinessData, callback: IMethodParams) {
    // console.log('sdk businessRulesInfo: ', this.businessRulesInfo)
    // 如果登录接口内部调用的商业化接口没有返回结果，将此接口按调用次序缓存起来，接口结果回来后一次返回
    // cp 主动调用商业化接口不管，需要他们自己在接口返回后条件获取商业化窗口数据
    if (this.businessRuleInvoking) {
      this.businessWindowsQueue.push(() => this.getBusinessData(params, callback))
      return
    }
    const checkCache = () => {
      const currentDate = formatDate('YYYY-MM-DD')
      const cacheKeyPrefix = 'rx_business_popup_'
      const cacheKey = `${cacheKeyPrefix}${currentDate}`
      let cache = qq.getStorageSync(cacheKey)
      if (!cache) {
        cache = {}
        qq.setStorageSync(cacheKey, {})
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
      // console.log('auto_popups: ', auto_popups)
      // console.log('manual_popups: ', manual_popups)

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
              qq.setStorageSync(cacheKey, cache)
            }
            return windowInfo
          }
        })
      )

      console.log('result windows: ', windows)

      const result = { code: 0, data: windows }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 更新商业化窗口数据
  public async refreshBusinessData(callback?: IMethodParams, isRecord?: boolean) {
    // this.loopGetBusinessRules()
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
      callback?.complete && callback.complete(handleError(error))
    } finally {
      isRecord && this.dispatchBusinessWindowsQueue()
    }
  }

  private async dispatchBusinessWindowsQueue() {
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
  public async requestBusinessOrder(params: IReqBusinessOrder, callback: IMethodParams) {
    try {
      await pubCheck(checkIReqBusinessOrder, callback, params)
      const result = await businessOrderApi(params)
      callback.complete(result)
    } catch (err) {
      callback.complete(handleError(err))
    }
  }

  //同步用户信息
  public async infoSync({ complete }: IMethodParams, params: ISyncUserInfo) {
    try {
      const { code } = await asyncFunc(qq.login)
      const { encryptedData, iv } = await getUserInfo({
        screenWidth: SYSTEM_INFO.screenWidth,
        screenHeight: SYSTEM_INFO.screenHeight,
        button: params?.button,
        withCredentials: true,
        lang: params?.lang,
        setInstance: (instance) => {
          this._userInfoButton = instance
          return instance
        },
        autoClose: params?.autoClose,
        isCheck: params?.isCheck,
      })
      let data = await refreshUserInfo({
        code,
        encryptedData,
        iv,
        version: params?.version || 'normal',
      })
      complete(data)
    } catch (error) {
      complete(handleError(error))
    }
  }

  // 检测是否授权用户信息
  public async isAuthorizeUserInfo({ complete }: IMethodParams) {
    try {
      qq.getSetting({
        success(res) {
          complete({
            code: 0,
            isAuthorize:
              res.authSetting['scope.userInfo'] === undefined
                ? false
                : res.authSetting['scope.userInfo'],
          })
        },
        fail(err) {
          complete({ code: 0, isAuthorize: false })
        },
      })
    } catch (error) {
      complete(handleError(error))
    }
  }

  // 取消用户授权
  public async cancelUserInfoAuthorize() {
    this._userInfoButton && this._userInfoButton.destroy()
    this._userInfoButton = null
  }

  /**
   * 广告相关接口
   */

  //激励广告
  public async rewardedVideoAd(data: IRequestAdData, { complete }: IMethodParams) {
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
      complete(handleError(err))
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

        complete({
          code: 0,
          isEnded,
        })
      }
      if (!this._rewardAd) {
        ad = qq.createRewardedVideoAd({
          adUnitId: data.adUnitId as string,
        })
        await new Promise<void>((resolve, reject) => {
          let timer: NodeJS.Timeout | null = setTimeout(() => {
            reject({ code: COMMON_ERROR_CODE.AD_LOAD_OVERTIME, msg: '广告加载超时' })
            clearTimeout(timer as NodeJS.Timeout)
            timer = null
          }, 10000)
          ad.onLoad(() => {
            this._rewardAd = ad
            this._hasAd.rewarded = true
            resolve()
          })
          ad.onError((error) => {
            this._hasAd.rewarded = false
            reject(error)
          })
          ad.load()
        })
      }
      ad = this._rewardAd as WechatMinigame.RewardedVideoAd
      if (data.isCheck) {
        complete({
          code: 0,
          ...data,
          isEnded: false,
          ad,
        })
      } else {
        ad.onClose(onClose)
        // try {
        let catchLoadAndShowError = async (error: any) => {
          fail(error)
        }
        // 前面广告如果没加载成功的话，先load加载广告，成功后调用show展示广告
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
        // 前面广告如果加载成功的话并且不是只检测是否有广告，调用show展示广告
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

  // banner 广告
  public async bannerAd(data: IRequestBannerAd, { complete }: IMethodParams) {
    try {
      let ad: WechatMinigame.BannerAd
      if (this._bannerAd) {
        ad = this._bannerAd
      } else {
        ad = qq.createBannerAd({
          adIntervals: data.adIntervals,
          adUnitId: data.adUnitId,
          style: data.style,
        })
        await new Promise<void>((resolve, reject) => {
          ad.onLoad(() => {
            this._bannerAd = ad
            this._hasAd.banner = true
            resolve()
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
      complete(handleError(err))
    }
  }

  public hasAd(type?: AdTypes) {
    if (!type) return this._hasAd.rewarded
    return this._hasAd[type]
  }

  public getAd(type?: AdTypes) {
    switch (type) {
      case 'banner':
        return this._bannerAd
      case 'interstitial':
        return this._interstitialAd
      default:
        return this._rewardAd
    }
  }

  // 分享调度初始化
  public async shareSchedulingInit(params: IReqShareScheduleInit, callback: IMethodParams) {
    try {
      await pubCheck(shareScheduleInitParams, callback, params)
      const req = {
        func: params?.funcs || [],
        type: 'mini',
        open_id: USER_INFO.openid || '',
      }
      let res = await schedulingInitApi(req)
      this.scheduleInitMap = res?.data || {}
      removeStorageByPrefix('rx_schedule')
      callback.complete(res)
    } catch (error) {}
  }

  // 获取埋点调度
  public getShareScheduling(params: { funcs?: string[] }) {
    const funcs = params?.funcs
    if (!funcs) return { code: 0, data: this.scheduleInitMap }
    if (funcs && !isArray(funcs)) {
      const error: any = new Error('funcs must be Array')
      error.code = COMMON_ERROR_CODE.PARAMS_ERROR
      return handleError(error)
    }
    try {
      console.log('sdk getShareScheduling: ', params, this.scheduleInitMap)
      const data = pick(this.scheduleInitMap, funcs)
      return { code: 0, data }
    } catch (error) {
      return handleError(error)
    }
  }

  // 看广告完成上报
  public async shareSchedulingReport(params: IReqShareScheduleReport, callback: IMethodParams) {
    try {
      await pubCheck(shareScheduleReportParams, callback, params)
      const func = params.func
      const region = params?.region || USER_INFO.region || ''
      const sub_channel_id = USER_INFO.subchannelid || ''
      const open_id = USER_INFO.openid || ''
      const scheduling_event = params?.scheduling_event === true ? 'done' : 'fail'
      const Iparams = {
        platform: PLATFORM.QQ,
        type: 'mini',
        sub_channel_id,
        open_id,
        ...params,
        region,
        scheduling_event,
        properties: {
          region,
          ...this.scheuleReportProps,
          ...params?.properties,
        }
      }

      let result = await schedulingReportApi(Iparams)
      if (isEmpty(result?.data)) {
        this.scheduleInitMap = omit(this.scheduleInitMap, func)
        qq.removeStorageSync(`rx_schedule_${USER_INFO.tid}_${func}_${region}`)
        this.shareSchedulingInit({}, {
          complete: () => {
            callback.complete(result)
          }
        })
        return
      } else {
        this.scheduleInitMap[func] = result?.data?.scheduling
        qq.setStorageSync(`rx_schedule_${USER_INFO.tid}_${func}_${region}`, JSON.stringify(result))
      }

      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  /**
   * 地理位置相关接口
   */

  //获得qq的地理位置
  async handleLocation() {
    try {
      let result = await asyncFunc(qq.getLocation, { type: 'wgs84' })
      this.locationInfomation = result
      return result
    } catch (err: any) {
      // qq.showModal({
      //   title: '提示',
      //   content: '请在系统设置中打开定位服务，重新进入小程序！',
      // })
      const error: any = new Error(err?.errMsg || 'qq.getLocation fail')
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
      let { authSetting } = await asyncFunc(qq.getSetting)
      if (authSetting['scope.userLocation'] === true) {
        //console.log('已经同意授权')
        const location = await this.handleLocation()
        callback?.complete && callback.complete({ code: 0, data: location})
        return location
      }
      // scope.userLocation === undefined代表用户未授权且第一次登陆
      else if (authSetting['scope.userLocation'] === undefined) {
        //console.log('第一次登陆且从未授权')
        const location = await this.handleLocation()
        callback?.complete && callback.complete({ code: 0, data: location})
        return location
      }
      if (
        authSetting['scope.userLocation'] != undefined &&
        authSetting['scope.userLocation'] != true
      ) {
        let res = await asyncFunc(qq.showModal, {
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则无法相关功能！',
        })
        if (res.cancel) {
          qq.showToast({
            title: '您已拒绝授权!',
            icon: 'none',
          })
        } else if (res.confirm) {
          let openSetting = await asyncFunc(qq.openSetting)
          if (openSetting.authSetting['scope.userLocation'] === true) {
            qq.showToast({
              title: '授权成功!',
              icon: 'none',
            })
            const location = await this.handleLocation()
            callback?.complete && callback.complete({ code: 0, data: location})
            return location
          } else {
            qq.showToast({
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
      if(callback?.complete) {
        callback.complete(handleError(error))
      } else {
        throw error
      }
    }
  }
  //上报的http接口
  public async reportLocationHttpFun(params: IReportLocation, callback?: Partial<IMethodParams>) {
    try {
      let location = await this.authorizeLocation()
      let report = await reportLocationUpdata({
        lon: location.longitude,
        lat: location.latitude,
        types: params.types,
      })
      return report
    } catch (error) {
      if(callback?.complete) {
        callback.complete(handleError(error))
      } else {
        throw error
      }
    }
  }
  //开始上报经纬度坐标
  public async startReportLoaction(params: IReportLocation, { complete }: IMethodParams) {
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
      complete(handleError(error))
    }
  }

  //停止上报经纬度
  public stopReportLocation() {
    clearInterval(this.reportLocationTimer)
    this.reportLocationTimer = null
  }

  //删除经纬度坐标
  public async deleteReportLocation(params: IReqDelReportLocation, { complete }: IMethodParams) {
    try {
      await pubCheck(DeleteLoactionCheckParams2, { complete }, params)
      let result = await deleteReportLocation(params)
      complete(result)
    } catch (error) {
      complete(handleError(error))
    }
  }
  //获得半径内用户
  public async getNearlyPeasonByRadius(params: IReqNearlyPeason, { complete }: IMethodParams) {
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
      complete(handleError(error))
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
      event_public_attr.timerId = setTimeout(() => getPublicPropsConfig(), ms)
    }

    const getPublicPropsConfig = async () => {
      try {
        const res = await getPublicProps(event_public_attr.version)
        const {
          refresh = this.businessRuleDefaultRefreshTime,
          public_attr,
          version = '',
        } = res?.data || {}

        event_public_attr.public_attr = public_attr || event_public_attr.public_attr
        event_public_attr.refresh = refresh
        event_public_attr.version = version

        const initParams = qq.getStorageSync('rx-init-params')
        // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
        qq.setStorageSync('rx-init-params', {
          ...initParams,
          version: { ...initParams.version, event_public_attr: version },
        })

        repeat(event_public_attr.refresh)
      } catch (error) {
        handleError(error)
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

  /**
   * 设置公共属性
   * 设置后CP无需每次上报都传，由SDK填入properties中。
   */
  public setPublicProperties(params: { [key: string]: any }) {
    if (!isObject(params) || Array.isArray(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR

      return handleError(error)
    }

    try {
      qq.setStorageSync('rx_public_props', params)
      return { code: 0 }
    } catch (error) {
      return handleError(error)
    }
  }
  /**
   * 修改设置的公共数据。
   */
  public updatePublicProperties(params: { [key: string]: any }) {
    if (!isObject(params) || Array.isArray(params)) {
      const error: any = new Error('params must be object')
      error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR

      return handleError(error)
    }

    try {
      const cache = qq.getStorageSync('rx_public_props')
      qq.setStorageSync('rx_public_props', { ...cache, ...params })
      return { code: 0 }
    } catch (error) {
      return handleError(error)
    }
  }
  /**
   * 删除公共属性
   */
  public deletePublicProperties(params: string[]) {
    if (!Array.isArray(params)) {
      const error: any = new Error('params must be array')
      error.code = COMMON_ERROR_CODE.PARAMS_ERROR

      return handleError(error)
    }

    try {
      const cache = qq.getStorageSync('rx_public_props')
      const rest = omit(cache, params)
      qq.setStorageSync('rx_public_props', rest)
      return { code: 0 }
    } catch (error) {
      return handleError(error)
    }
  }

  public getPublicProperties() {
    let data = qq.getStorageSync(`rx_public_props`)

    return { code: 0, data }
  }
}

export default SdkQQ
