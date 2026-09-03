import v4 from 'uuid/v4'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { SYSTEM_INFO as SYSTEM_INFO_H5 } from '@/h5/config'
import { COMMON_ERROR_CODE } from '@/config/const'
import { handleError } from '@/utils/utils'
import { formatDate } from '@/utils/day'
import { isEmpty, omit, isObject } from '@/utils/is'
import {
  getSearchQueries,
  customSetStorageSync,
  customGetStorageSync,
  handleTrackError,
  getDevicecode
} from '@/h5/utils'
import {
  activated,
  getInitConf,
  getServerTime,
  loginByTokenApi,
  trackApi,
  orderApi,
  loginByCredentialApi
} from '@/h5/apis'
import SdkCommonUI from '@/h5/SdkCommomUI'
import { setupStOffsetRefreshForH5 } from '@/utils/stOffset'

const PLATFORM = 'ruixue'

declare global {
  var qg: any
}

// @ts-ignore
class SdkH5Ruixue extends SdkCommonUI {
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

  // 支付消息监听器引用（用于清理）
  private payMessageHandler: ((event: MessageEvent) => void) | null = null

  // private initConfig: any = {}
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

  /**
   * H5瑞雪登录方法
   * @param params 登录参数
   * @param callback 可选回调函数
   */
  private async login(params: H5RuixueLoginParam, callback?: H5MethodParams) {
    try {
      // 1. 准备基础请求参数
      const user_source = this.getLoginQsAndGenerateStruct()
      const now = Date.now()
      const distinct_id = customGetStorageSync('rx_distinct_id') || v4() // 获取或生成设备唯一ID

      // 如果本地没有存储过distinct_id，则进行存储
      if (!customGetStorageSync('rx_distinct_id')) {
        customSetStorageSync('rx_distinct_id', distinct_id)
      }

      // 构造请求参数
      const requestParams: any = {
        ts: now,
        method: params?.method,
        distinct_id,
        ext: {...params?.ext, captcha_code: params?.captcha_code || ''},
        ...user_source
      }

      // 如果方法为captchacode，则添加用户名
      if(params.method == 'captchacode' && params?.username){
        requestParams.username = params?.username || ''
      }

      // 2. 处理子渠道信息
      try {
        if (this.subChannelId !== null) {
          const queryJson = getSearchQueries()
          requestParams.user_source = {
            guide: { ...user_source, subchannelid: this.subChannelId }
          }

          // 合并查询参数
          if (queryJson) {
            requestParams.user_source.guide = {
              ...requestParams.user_source.guide,
              ...queryJson
            }
          }
        }
      } catch (err) {
        // 子渠道信息处理出错时忽略，不影响主流程
      }

      // 3. 执行登录逻辑
      let user_info: any = {}

      if (params.login_openid) {
        // 3.1 使用openid登录
        requestParams.login_openid = params.login_openid
        user_info = await loginByTokenApi(this.ActivePrefix(requestParams))
      } else {
        // 3.2 普通H5登录
        const reflowEnabled = this.initConfig?.advertise_switch?.switch === 1 // 投放开关检查
        const source_ad = this.getAttributionData()

        // 根据投放开关决定是否添加设备信息
        const reqLogin = reflowEnabled ? {
          ...requestParams,
          device: source_ad
        } : requestParams

        // 处理扩展参数
        const { custom_ext, ...rest_ext } = reqLogin.ext || {}
        reqLogin.custom_ext = custom_ext || {}
        reqLogin.ext = { ...(rest_ext || {}) }
        console.log('reqLogin', reqLogin)
        // 如果方法为captchacode或guest，则使用loginByCredentialApi登录
        if (params.method == 'ruixue') {
          user_info = await this.h5Login(this.ActivePrefix(reqLogin))
        } else {
          user_info = await loginByCredentialApi(this.ActivePrefix(reqLogin))
        }
      }

      // 4. 处理登录结果
      Object.assign(USER_INFO, user_info.data)

      // 检查是否为推广员
      if ((user_info?.data?.user_flag & 1) === 1) {
        this.is_promoter = true
        this.game_id = user_info?.data?.cp_user_id || ''
      }

      // 5. 持久化登录状态
      customSetStorageSync('rx-loginState', 1)
      customSetStorageSync('rxToken', user_info.data.token)

      // 6. 执行回调
      callback?.complete(user_info)
    } catch (err: any) {
      console.error('登录失败:', err)
      // 错误处理回调
      callback?.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err))
    }
  }

  /**
   * H5瑞雪支付方法（复用 createModalIframe）
   * @param params 支付参数
   * @param callback 回调函数
   * 
   * 整体流程：
   * 1. 构建支付参数 payParams（模拟假数据）
   * 2. 注册 message 监听器（先注册，保证不丢消息）
   * 3. 调用 createModalIframe 创建模态框
   * 4. iframe 加载完成后发送 PAY_IFRAME_READY
   * 5. SDK 收到 READY 后发送 payParams 给 iframe
   * 6. 用户完成支付后，iframe 发送 PAY_RESULT
   * 7. SDK 收到结果，调用 callback，清理资源
   */
  public async pay(params: H5RUIXUEPayParam, callback: H5MethodParams) {
    try {
      if (params.indulge_auth == 1 && !params.age) {
        throw Error('when indulge_auth equal 1,the age must be required')
      }
      // 收银台
      if(params?.pay_type == 'checkstand') {
        // url 配置
        const PATH_URL = 'pay'
        const BASE_URL = 'pay'

        // 获取当前系统参数
        const {
          timezone,
          channelId,
          productId,
          cpid,
          __RX_SDK_VERSION: version,
          baseUrlList,
          language
        } = SYSTEM_INFO

        const devicecode = getDevicecode()
        const accesstoken = USER_INFO.token?.access || ''

        //支付参数
        const payParams = {
          type: 'INIT_PAY_PARAMS',
          api_params: {
            country_code: language || 'zh',
            productid: productId || '',
            devicecode: devicecode || '',
            cpid: cpid || '',
            domain: baseUrlList?.[0] || '',
            language: language || 'zh',
            platformid: SYSTEM_INFO_H5.platformid || '1',
            version: version || '',
            channelid: channelId || '',
            tzoffset: timezone ? `${timezone}` : '8.00'
          },
          request_headers: {
            'ruixue-channelid': channelId || '',
            'ruixue-accesstoken': accesstoken || '',
            'ruixue-devicecode': devicecode || '',
            'ruixue-traceid': v4(),
            'ruixue-language': language || 'zh',
            'ruixue-platformid': SYSTEM_INFO_H5.platformid || '1',
            'ruixue-tzoffset': timezone ? `${timezone}` : '8.00',
            'ruixue-cpid': cpid || '',
            'ruixue-version': version || '',
            'ruixue-productid': productId || ''
          },
          order_info: {
            ...params,
            currency: params.currency || 'CNY',
            openid: USER_INFO.openid,
            sub_channel_id: USER_INFO?.subchannelid,
            is_debug: params.is_debug || 0,
            env: params.env || 0,
            ext: {
              ...params.ext || {}
            }
          }
        }

        // 移除之前的监听器（防止累积）
        if (this.payMessageHandler) {
          window.removeEventListener('message', this.payMessageHandler)
          this.payMessageHandler = null
        }

        // 消息处理
        const messageHandler = (event: MessageEvent) => {
          const { type } = event.data || {}
          console.log('[Pay] message:', type)

          // iframe 准备好了，发送支付参数
          if (type === 'PAY_IFRAME_READY') {
            console.log('[Pay] → 发送 payParams')
            const iframe = document.getElementById('dynamic-iframe') as HTMLIFrameElement
            iframe?.contentWindow?.postMessage(payParams, '*')
          }

          // 支付关闭
          if (type === 'close_pay') {
            console.log('[Pay] ← 用户关闭支付')
            // 清理监听器
            if (this.payMessageHandler) {
              window.removeEventListener('message', this.payMessageHandler)
              this.payMessageHandler = null
            }
          }
        }

        // 保存引用
        this.payMessageHandler = messageHandler

        // Step 1: 先注册监听器（保证不丢消息）
        window.addEventListener('message', messageHandler)

        // Step 2: 调用 createModalIframe 创建模态框
        this.createModalIframe({
          path: PATH_URL,
          base: BASE_URL
        }).then(() => {
          callback.complete({ code: 0 })
        }).catch(err => {
          callback.complete(err)
        })
      } else {
        // 其他支付方式
        let reqOrder = {
          ...params,
          currency: params.currency || 'CNY',
          openid: USER_INFO.openid,
          sub_channel_id: USER_INFO?.subchannelid,
          is_debug: params.is_debug || 0,
          env: params.env || 0,
          ext: {
            ...params.ext || {}
          }
        }
        switch (params.pay_type) {
          case 'aums':
            reqOrder.ext.hq_type = params?.ext?.hq_type || 'minih5'
            break
        }
        const result = await orderApi(reqOrder)
  
        if (params?.webview === 1) {
          if (result.data.ext.url) {
            window.location.href = result.data.ext.url
            callback.complete({ code: 0 })
            return
          } else {
            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
              code: COMMON_ERROR_CODE.PAY_ERROR,
              msg: '支付错误',
            }))
          }
        }

        this.openPay({
          url: params?.ext?.hq_type === 'qrcode' && params?.pay_type === 'aums' ? result.data.ext.qrcode_url : result.data.ext.url,
          hq_type: params?.ext?.hq_type || 'minih5',
          pay_type: params?.pay_type
        }).then(() => {
          callback.complete({ code: 0 })
        }).catch(err => {
          callback.complete(err)
        })
      }
    } catch (err: any) {
      console.info(err)
      callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', {
        code: err.code || COMMON_ERROR_CODE.PAY_ERROR,
        msg: err.msg || '支付错误',
        thirdcode: err.code,
        thirdmsg: err.msg
      }))
    }
  }

  public async share(callback: IMethodParams) {
    // 分享功能实现
  }

  // 关闭支付窗口
  public closePay() {
    try {
      window?.parent?.postMessage(
        {
          type: "close_pay",
          code: -1,
          msg: "关闭支付窗口",
        },
        "*"
      )
    } catch (err) {
      console.error('关闭支付窗口失败:', err)
    }
  }

  // 激励广告
  public async rewardedVideoAd(data: any, callback: H5MethodParams) {
    // 激励广告功能实现
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

      // 检查是否需要激活
      this.checkNeedActivate()

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
      // 忽略错误
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
