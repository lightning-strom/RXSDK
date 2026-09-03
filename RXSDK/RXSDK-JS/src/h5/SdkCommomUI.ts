import {
  bindEmail,
  bindPhone,
  checkActivityVersion,
  checkGameVersion,
  checkVersionGameLobbyByGet,
  checkVersionGameLobbyByPost,
  deregister,
  deregisterCancel,
  getInfoApi,
  getUserInfoByFieldApi,
  sendCaptcha,
  UnbindEmail,
  unBindPhone,
  updateInfoApi,
  getNoticeApi,
  collectPropsApi,
  createFeedbackApi,
  getFeedbackDetailApi,
  getFeedbackListApi,
  getInfolayoutApi,
  getListlayoutApi,
  getMainlayoutApi,
  postResolutionApi,
  setcustomApi,
  addRelationApi,
  deleteRelationApi,
  hasrelationApi,
  relationListApi,
  addfriendApi,
  delfriendApi,
  updatefriendremarksApi,
  isfriendApi,
  friendsApi,
  addscoreApi,
  setscoreApi,
  queryuserrankApi,
  getranklistApi,
  friendsrankApi,
  updateremarksApi,
  trackApi,
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
  updateGameVersionApi,
  searchGameAccountApi,
  getH5LoginConfigApi,
  getTempNoticeApi,
  tradeQueryApi
} from './apis'
import {
  bindEmailParamsCheck,
  bindPhoneParamsCheck,
  sendCaptchaParamsCheck,
  unbindemailParamsCheck,
  unBindPhoneParamsCheck
} from '@/utils/checkConfig/common'
import { handleError } from '@/utils/utils'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { pubCheck } from '@/utils/paramsValid'
import {
  checkActivityVersionParams,
  checkAppVersionParams,
  checkGameVersionParams
} from '@/utils/checkConfig'
import {
  addFriendCheck,
  addRelationCheck,
  addscoreCheck,
  deleteRelationCheck,
  delfriendCheck,
  getranklimitlistCheck,
  getranklistCheck,
  hasRelationCheck,
  queryuserrankCheck,
  relationListCheck,
  setcustomCheck,
  updatefriendremarksCheck,
  updateremarksCheck
} from '@/utils/checkConfig/social'
import {
  customGetStorageSync,
  customSetStorageSync,
  getDevicecode,
  handleTrackError,
  removeStorageSync
} from '@/h5/utils'
import v4 from 'uuid/v4'
import { formatDate } from '@/utils/day'

class SdkCommonUI {
  private platform: any

  constructor(platform: string) {
    this.platform = platform
  }

  public initConfig: any = {}

  private getDeviceCode() {
    return getDevicecode()
  }

  /**
   * 检测是否是微信浏览器
   */
  isWeChatBrowser(): boolean {
    return /MicroMessenger/i.test(navigator.userAgent)
  }

  isMobileWechat(): boolean {
    const isWeixin = this.isWeChatBrowser()
    const isMobile = this.isMobile()
    return isWeixin && isMobile
  }

  private orientation = window.orientation

  private isMobile(): boolean {
    return typeof window.orientation !== 'undefined' || 'ontouchstart' in window
  }

  // 检测横竖屏并显示提示
  private checkOrientation() {
    // 小于这个值认为是竖屏
    const portraitRatio = 0.75
    // 获取当前窗口的宽高比
    const ratio = window.innerWidth / window.innerHeight
    return ratio < portraitRatio
  }

  private getIframeSrc({ path, base }: { path: string, base: string }) {
    // // 本地测试
    // if(base == 'pay') {
    //   return `http://10.10.3.156:666/static/${base}/${path}`
    // } else {
    //   return `${SYSTEM_INFO.baseUrlList[0]}/static/${base}#/${path}`
    // }
    return `${SYSTEM_INFO.baseUrlList[0]}/static/${base}#/${path}`
  }

  private getInitParams(): any {
    const { token } = USER_INFO

    const {
      timezone,
      channelId,
      productId,
      cpid,
      __RX_SDK_VERSION: version,
      baseUrlList,
      CP_OF: cpof,
      region_tag,
      cp_role_id,
      language
    } = SYSTEM_INFO

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isWechat: this.isWeChatBrowser(),
      isMobile: this.isMobile(),
      isMobileWechat: this.isMobileWechat(),
      isVertical: this.checkOrientation(),
      orientation: this.orientation,
      initConfig: this.initConfig,
      devicecode: getDevicecode(),
      timezone,
      channelId,
      productId,
      cpid,
      version,
      baseUrlList,
      cpof,
      language: language || 'zh',
      ...(region_tag && { region_tag: `${region_tag}` }),
      ...(cp_role_id && { cp_role_id: `${cp_role_id}` }),
      ...(token?.access && { accesstoken: token.access }),
      loginData: USER_INFO
    }
  }

  async createModalIframe(params: {
    path: string
    base?: string
    initParams?: any
    loginParams?: any
    backgroundColor?: string
    theme?: string
    game_user_id?: string
    protocol?: any
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      // 常量定义
      const CONTAINER_ID = 'sdk-container' // 容器元素ID
      const IFRAME_ID = 'dynamic-iframe'   // iframe元素ID
      const IFRAME_NAME = 'dynamicFrame'   // iframe名称

      // 获取目标容器元素
      const container = document.getElementById(CONTAINER_ID)
      if (!container) {
        reject(new Error('未找到sdk-container元素'))
        return
      }

      // 保存原始body样式以便后续恢复
      const originalBodyStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        height: document.body.style.height
      }

      // 禁止body滚动
      document.body.style.overflow = 'hidden'

      // 设置容器样式 - 固定定位、居中显示
      const updateContainerStyle = () => {
        const width = window.innerWidth
        const height = window.innerHeight

        Object.assign(container.style, {
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: `${width}px`,
          height: `${height}px`,
          zIndex: '9999',
          backgroundColor: params.backgroundColor || 'rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          transform: 'translate(-50%, -50%)',
          margin: '0',
          padding: '0'
        })
      }

      updateContainerStyle()

      // 创建iframe元素
      let iframe = document.createElement('iframe')
      // 保存当前路径参数以便重载
      let currentPathParams = {
        path: params.path,
        base: params.base || 'passporth5'
      }

      // 初始化iframe
      const initIframe = () => {
        iframe.src = this.getIframeSrc(currentPathParams)
        iframe.frameBorder = '0'
        iframe.id = IFRAME_ID
        iframe.name = IFRAME_NAME

        Object.assign(iframe.style, {
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        })

        container.appendChild(iframe)
      }

      // 重载iframe
      const reloadIframe = () => {
        if (container.contains(iframe)) {
          container.removeChild(iframe)
        }
        iframe = document.createElement('iframe')
        initIframe()
      }

      initIframe()

      // 清理函数 - 移除事件监听、iframe和恢复样式
      const cleanup = () => {
        window.removeEventListener('message', handleMessage)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('resize', handleMobileResize)
        // 移除移动端方向变化监听
        if (typeof window.orientation !== 'undefined') {
          window.removeEventListener('orientationchange', handleOrientationChange)
        }
        if (container.contains(iframe)) {
          container.removeChild(iframe)
        }
        container.style.cssText = ''
        // 恢复body原始样式
        Object.assign(document.body.style, originalBodyStyle)
      }

      // 防抖函数
      const debounce = (func: Function, delay: number) => {
        let timer: number
        return function (this: any, ...args: any[]) {
          clearTimeout(timer)
          timer = window.setTimeout(() => func.apply(this, args), delay)
        }
      }

      // 处理屏幕方向/尺寸变化
      const handleViewportChange = debounce(() => {
        originHeight = window.innerHeight
        updateContainerStyle()
        reloadIframe()
      }, 200)

      // PC端窗口大小变化处理
      const handleResize = () => {
        handleViewportChange()
      }

      let originHeight = window.innerHeight
      // 移动端窗口大小变化处理
      const handleMobileResize = () => {
        if (currentPathParams.base === 'passporth5') {
          if (window.innerHeight < originHeight) {
            container.style.top = `calc(50% + ${originHeight - container.getBoundingClientRect().bottom}px)`
          } else {
            container.style.top = '50%'
          }

          iframe.contentWindow?.postMessage(
            {
              type: 'KEY_BOARD_CHANGE_PASSPORT',
              data: container.getBoundingClientRect().top
            },
            '*'
          )
        }

        if (currentPathParams.base === 'service') {
          iframe.contentWindow?.postMessage(
            {
              type: 'KEY_BOARD_CHANGE_SERVICE',
              data: window.innerHeight < originHeight ? container.getBoundingClientRect().bottom : 0
            },
            '*'
          )
        }
      }

      // 移动端方向变化处理
      const handleOrientationChange = () => {
        handleViewportChange()
      }

      // 消息处理器 - 处理来自iframe的各种消息
      const handleMessage = (event: MessageEvent) => {
        console.log('收到来自iframe的消息:', event.data)

        // 处理iframe加载完成消息
        if (event.data?.type === 'LOADED') {
          const initParams = this.getInitParams()
          if (params.theme) {
            initParams.theme = params.theme
          }
          if (params.game_user_id) {
            initParams.game_user_id = params.game_user_id
          }
          if (params.protocol) {
            initParams.protocol = params.protocol
          }
          // 发送初始化参数
          iframe.contentWindow?.postMessage(
            {
              type: 'INIT_PARAMS',
              data: initParams
            },
            '*'
          )

          // 根据路径发送不同参数
          if (['login'].includes(params.path)) {
            iframe.contentWindow?.postMessage(
              {
                type: 'LOGIN_PARAMS',
                data: params.loginParams
              },
              '*'
            )
          } else {
            iframe.contentWindow?.postMessage(
              {
                type: 'LOGIN_DATA',
                data: USER_INFO || {}
              },
              '*'
            )
          }
        }

        // 处理登录成功消息
        if (event.data?.type === 'login_success') {
          cleanup()
          resolve(event.data)
        }

        // 处理登录关闭消息
        if (event.data?.type === 'login_close') {
          reject(event.data)
          cleanup()
        }

        // 处理实名认证完成消息
        if (event.data?.type === 'real_name_complete') {
          getInfoApi()
            .then((res: any) => {
              if (res.code === 0) {
                // 更新用户信息
                USER_INFO.attr = res.data?.attr
                USER_INFO.age = res.data?.age
                USER_INFO.sex = res.data?.sex
                USER_INFO.ext = {
                  ...USER_INFO.ext,
                  idcard: res.data?.idCard,
                  realname: res.data?.realName
                }
              }
            })
            .catch(console.error)
            .finally(() => {
              resolve(event.data)
            })
          cleanup()
        }

        // 处理实名认证关闭消息
        if (event.data?.type === 'real_name_close') {
          reject(event.data)
          cleanup()
        }

        // 处理注销完成消息
        if (event.data?.type === 'log_off_complete') {
          resolve(event.data)
          cleanup()
        }

        // 处理注销关闭消息
        if (event.data?.type === 'log_off_close') {
          reject(event.data)
          cleanup()
        }

        // 处理忘记密码关闭消息
        if (event.data?.type === 'close_forget') {
          reject(event.data)
          cleanup()
        }

        // 处理修改密码关闭消息
        if (event.data?.type === 'close_reset') {
          reject(event.data)
          cleanup()
        }

        // 处理重置密码成功消息
        if (event.data?.type === 'reset_password_success') {
          reject(event.data)
          cleanup()
        }

        // 处理帮助中心关闭消息
        if (event.data?.type === 'close_help_center') {
          cleanup()
        }

        // 处理跳转客服中心消息
        if (event.data?.type === 'open_service') {
          cleanup()
          this.openService({
            ...event.data.data
          })
        }

        // 处理客服中心关闭消息
        if (event.data?.type === 'close_service') {
          cleanup()
        }

        // 处理协议弹窗关闭消息
        if (event.data?.type === 'close_agreement') {
          cleanup()
        }

        // 处理返回帮助中心消息
        if (event.data?.type === 'close_service_from_help') {
          cleanup()
          this.openHelpCenter({
            theme: this.theme,
            game_user_id: this.game_user_id
          })
        }

        // 处理取消支付消息
        if (event.data?.type === 'close_pay') {
          reject(event.data)
          cleanup()
        }
      }

      // 添加事件监听
      window.addEventListener('message', handleMessage)

      // 根据设备类型添加不同的事件监听
      if (this.isMobile()) {
        // 移动设备 - 监听方向变化
        window.addEventListener('orientationchange', handleOrientationChange)
        window.addEventListener('resize', handleMobileResize)
      } else {
        // PC设备 - 监听窗口大小变化
        window.addEventListener('resize', handleResize)
      }

      // iframe加载完成回调
      iframe.onload = () => console.log('iframe加载完成')

      // iframe加载错误处理
      iframe.onerror = () => {
        reject({
          code: 1000,
          msg: 'iframe加载失败'
        })
        cleanup()
      }
    })
  }

  async openAgreement(params: {
    agreementKey: string
    agreementTitle: string
  }): Promise<any> {
    return this.createModalIframe({
      path: `agreement?agreementKey=${params.agreementKey}&agreementTitle=${params.agreementTitle}`,
      backgroundColor: '#fff'
    })
  }

  async openProtocol(params: {
    protocol: any
  }): Promise<any> {
    return this.createModalIframe({
      path: `protocol/protocollist`,
      base: 'helpcenterh5',
      backgroundColor: '#fff',
      protocol: params.protocol || {}
    })
  }

  async openPay(params: {
    url: string
    hq_type?: string
    pay_type?: string
  }): Promise<any> {
    return this.createModalIframe({
      path: params.hq_type === 'qrcode' && params.pay_type === 'aums' ? `pcPay?url=${encodeURIComponent(params.url)}` : `pay?url=${encodeURIComponent(params.url)}`
    })
  }

  private game_user_id = ''
  private theme = 'light'

  async openHelpCenter(params: {
    theme?: string
    game_user_id?: string
  }): Promise<any> {
    this.theme = params.theme || 'light'
    this.game_user_id = params.game_user_id || ''

    return this.createModalIframe({
      path: 'helpcenter/questioncatalogue-new',
      base: 'helpcenterh5',
      backgroundColor: '#fff',
      theme: params.theme || 'light',
      game_user_id: params.game_user_id || ''
    })
  }

  async openService(params: {
    from_application?: string
    theme?: string
    game_user_id?: string
    default_lang?: string
  }): Promise<any> {
    this.theme = params.theme || 'light'
    this.game_user_id = params.game_user_id || ''

    const {
      channelId,
      productId,
      cpid,
      cpof,
      region_tag,
      cp_role_id,
      accesstoken,
      devicecode,
      isMobileWechat
    } = this.getInitParams()

    const searchQuery: any = {
      devicecode,
      minimized: 0,
      region_tag: region_tag || '',
      theme: params.theme || 'light',
      game_user_id: cp_role_id || params.game_user_id || '',
      'ruixue-language': params.default_lang || 'zh',
      'ruixue-accesstoken': accesstoken || '',
      'ruixue-cpid': cpid || '',
      'ruixue-productid': productId || '',
      'ruixue-channelid': channelId || '',
      'ruixue-region': region_tag || '',
      'ruixue-cp-role-id': cp_role_id || '',
      ...(cpof ? { cpof: '1' } : {})
    }

    searchQuery.from_application = params.from_application || 'sdkh5'
    /*const queryParams = new URLSearchParams(searchQuery)
    return this.createModalIframe({
      path: `?${queryParams.toString()}`,
      base: 'service',
      backgroundColor: '#fff',
      theme: params.theme || 'light',
      game_user_id: cp_role_id || params.game_user_id || ''
    })*/
    if (isMobileWechat) {
      searchQuery.from_application = params.from_application || 'sdkh5'
      const queryParams = new URLSearchParams(searchQuery)
      return this.createModalIframe({
        path: `?${queryParams.toString()}`,
        base: 'service',
        backgroundColor: '#fff',
        theme: params.theme || 'light',
        game_user_id: cp_role_id || params.game_user_id || ''
      })
    } else {
      searchQuery.from_application = 'browser'
      const queryParams = new URLSearchParams(searchQuery)
      window.open(this.getIframeSrc({
        path: `?${queryParams.toString()}`,
        base: 'service'
      }))
    }
  }

  async h5Login(loginParams: any): Promise<any> {
    return this.createModalIframe({
      path: 'login',
      loginParams
    })
  }

  async realName(callback?: H5MethodParams): Promise<any> {
    return this.createModalIframe({
      path: 'realname?form_application=sdkh5'
    }).then(res => {
      callback && callback.complete(res)
    }).catch(err => {
      callback && callback.complete(err)
    })
  }

  async forgetPassword(callback?: H5MethodParams): Promise<any> {
    return this.createModalIframe({
      path: 'forget?from_application=sdkh5'
    }).then(res => {
      callback && callback.complete(res)
    }).catch(err => {
      callback && callback.complete(err)
    })
  }

  async resetPassword(callback?: H5MethodParams): Promise<any> {
    return this.createModalIframe({
      path: 'reset?from_application=sdkh5'
    }).then(res => {
      callback && callback.complete(res)
    }).catch(err => {
      callback && callback.complete(err)
    })
  }

  async logoffH5Preview(callback?: H5MethodParams): Promise<any> {
    try {
      const res = await getInfoApi()
      if ((res.data?.user_state & 1) === 1) {
        this.createModalIframe({
          path: 'user/unregistercondition?flag=1&type=logoff&isPreview=true',
          base: 'passport',
          backgroundColor: '#fff'
        }).then(res => {
          callback && callback.complete(res)
        }).catch(err => {
          callback && callback.complete(err)
        })
        return
      }
    } catch (error) {
      console.log(error)
    }

    return this.createModalIframe({
      path: 'user/unregistercondition?type=logoff&isPreview=true',
      base: 'passport',
      backgroundColor: '#fff'
    }).then(res => {
      callback && callback.complete(res)
    }).catch(err => {
      callback && callback.complete(err)
    })
  }

  async logoff(callback?: H5MethodParams): Promise<any> {
    try {
      const res = await getInfoApi()
      if ((res.data?.user_state & 1) === 1) {
        this.createModalIframe({
          path: 'logoff?flag=1',
          backgroundColor: '#fff'
        }).then(res => {
          callback && callback.complete(res)
        }).catch(err => {
          callback && callback.complete(err)
        })
        return
      }
    } catch (error) {
      console.log(error)
    }

    return this.createModalIframe({
      path: 'logoff',
      backgroundColor: '#fff'
    }).then(res => {
      callback && callback.complete(res)
    }).catch(err => {
      callback && callback.complete(err)
    })
  }

  // 用户管理
  public async setcustom(params: { custom: string }, { complete }: H5MethodParams) {
    try {
      await pubCheck(setcustomCheck, { complete }, params)
      let result = await setcustomApi({ custom: params.custom })
      console.log(result)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 添加自定义关系
  public async addRelation(params: H5addRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(addRelationCheck, { complete }, params)
      let result = await addRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 删除自定义关系
  public async deleteRelation(params: H5deleteRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(deleteRelationCheck, { complete }, params)
      let result = await deleteRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 更新自定关系备注
  public async updateremarks(params: H5updateremarks, { complete }: H5MethodParams) {
    try {
      await pubCheck(updateremarksCheck, { complete }, params)
      let result = await updateremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 判断两用户是否存在某自定关系
  public async hasRelation(params: H5HasRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(hasRelationCheck, { complete }, params)
      let result = await hasrelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取自定关系列表
  public async relationList(params: H5relationlists, { complete }: H5MethodParams) {
    try {
      await pubCheck(relationListCheck, { complete }, params)
      let result = await relationListApi({ type: params.type })
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 添加好友关系
  public async addFriend(params: H5addFriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(addFriendCheck, { complete }, params)
      let result = await addfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 删除好友关系
  public async delfriend(params: H5deleFriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await delfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 更新好友备注
  public async updatefriendremarks(params: H5updatefriendremarks, { complete }: H5MethodParams) {
    try {
      await pubCheck(updatefriendremarksCheck, { complete }, params)
      let result = await updatefriendremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 判断两用户是否为好友
  public async isfriend(params: H5isfriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await isfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取好友关系列表
  public async friends({ complete }: H5MethodParams) {
    try {
      let result = await friendsApi()
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  /**
   * 排行榜相关接口
   */

  // 增加用户分数
  public async addscore(params: H5addscroe, { complete }: H5MethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await addscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 设置用户分数
  public async setscore(params: H5addscroe, { complete }: H5MethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await setscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 查询用户分数
  public async queryuserrank(params: queryuserrank, { complete }: H5MethodParams) {
    try {
      await pubCheck(queryuserrankCheck, { complete }, params)
      let result = await queryuserrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取排行榜列表
  public async getranklist(params: H5getranklistLimit, { complete }: H5MethodParams) {
    try {
      await pubCheck(getranklimitlistCheck, { complete }, params)
      let result = await getranklistApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取好友排行榜列表
  public async friendsrank(params: H5getranklist, { complete }: H5MethodParams) {
    try {
      await pubCheck(getranklistCheck, { complete }, params)
      let result = await friendsrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  /**
   * 帮助中心
   */
  public async getHelpcenterMainLayout({ complete }: H5MethodParams) {
    try {
      const result = await getMainlayoutApi()
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async getHelpcenterQuestionLayout(
    params: H5HelpcenterQuestionReq,
    { complete }: H5MethodParams
  ) {
    try {
      const result = await getListlayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async getHelpcenterInfoLayout(params: H5HelpcenterQuestionReq, { complete }: H5MethodParams) {
    try {
      const result = await getInfolayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  public async helpcenterResolution(params: HelpcenterResolution, { complete }: H5MethodParams) {
    try {
      const result = await postResolutionApi(params)
      complete(result)
    } catch (err) {
      complete(handleTrackError(this.platform, '', err))
    }
  }

  /**
   * 玩家意见反馈
   */
  private async addFeedback(params: any, callback?: H5MethodParams) {
    try {
      const res = await createFeedbackApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  private async getFeedbackList(params: any, callback?: H5MethodParams) {
    try {
      const res = await getFeedbackListApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  private async getFeedbackDetail(params: any, callback?: H5MethodParams) {
    try {
      const res = await getFeedbackDetailApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 领取道具
  private async collectProps(params: any, callback?: H5MethodParams) {
    try {
      const res = await collectPropsApi(params)
      console.log(res)
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 获取公告列表
  private async getAnnouncement(limit: number, callback?: H5MethodParams) {
    if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
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
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
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

  // 发送验证码
  public async sendCaptcha(params: H5sendCaptcha, callback: H5MethodParams) {
    try {
      // await pubCheck(sendCaptchaParamsCheck, callback, params)
      let result = await sendCaptcha(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 绑定手机
  public async bindPhone(params: H5BindPhone, callback: H5MethodParams) {
    try {
      // await pubCheck(bindPhoneParamsCheck, callback, params)
      let result = await bindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 解绑手机
  public async unBindPhone(params: H5unBindPhone, callback: H5MethodParams) {
    try {
      // await pubCheck(unBindPhoneParamsCheck, callback, params)
      let result = await unBindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 绑定邮箱
  public async bindEmail(params: H5BindEmail, callback: H5MethodParams) {
    try {
      // await pubCheck(bindEmailParamsCheck, callback, params)
      let data = await bindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 解绑邮箱
  public async UnbindEmail(params: H5unBindEmail, callback: H5MethodParams) {
    try {
      // await pubCheck(unbindemailParamsCheck, callback, params)
      let data = await UnbindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 注销账号
  async deregister(params: any, callback: H5MethodParams) {
    try {
      let result = await deregister(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 撤销账号注销申请
  async deregisterCancel(callback: H5MethodParams) {
    try {
      let result = await deregisterCancel()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 获得用户信息
  async getInfo(callback: H5MethodParams) {
    try {
      let result = await getInfoApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 获取指定用户信息
  async getUserInfoByField(params: any, callback: H5MethodParams) {
    try {
      let result = await getUserInfoByFieldApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 修改瑞雪通行证用户信息。
  async updateInfo(params: any, callback: H5MethodParams) {
    try {
      let result = await updateInfoApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 游戏大厅版本检查-get
  async checkAppVersion(params: H5CheckAppVersion, callback: H5MethodParams) {
    try {
      await pubCheck(checkAppVersionParams, callback, params)
      const req = {
        ...params,
        productid: SYSTEM_INFO.productId,
        channelid: SYSTEM_INFO.channelId,
        type: params?.type || 'js',
        format: params?.format || 'json',
        region: params?.region || 0
      }
      let result = await checkVersionGameLobbyByGet(req)
      try {
        if (result.code === 0) {
          const data: any = JSON.parse(result.data)
          const region_tag = data.login_config?.[0]?.region_tag
          if (region_tag) {
            SYSTEM_INFO.region_tag = region_tag
          }
        }
      } catch (e) {

      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 游戏大厅版本检查-post
  async checkVersion(params: H5CheckVersion, callback: H5MethodParams) {
    try {
      await pubCheck(checkAppVersionParams, callback, params)
      const req = {
        ...params,
        productid: SYSTEM_INFO.productId,
        channelid: SYSTEM_INFO.channelId,
        type: params?.type || 'js',
        format: params?.format || 'json',
        region: params?.region || 0
      }
      let result = await checkVersionGameLobbyByPost(req)
      try {
        if (result.code === 0) {
          const data: any = JSON.parse(result.data)
          const region_tag = data.login_config?.[0]?.region_tag
          if (region_tag) {
            SYSTEM_INFO.region_tag = region_tag
          }
        }
      } catch (e) {

      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 游戏版本检查
  async checkGameVersion(params: H5CheckGameVersion, callback: H5MethodParams) {
    try {
      await pubCheck(checkGameVersionParams, callback, params)
      const req = {
        ...params,
        gamecheckversion: params?.gamecheckversion || 0,
        type: params?.type || 'lua',
        format: params?.format || 'lua'
      }
      let result = await checkGameVersion(req)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
    }
  }

  // 活动版本检查
  async checkActivityVersion(params: H5CheckActivityVersion, callback: H5MethodParams) {
    try {
      await pubCheck(checkActivityVersionParams, callback, params)
      const req = {
        ...params,
        activitycheckversion: params?.activitycheckversion || 0,
        type: params?.type || 'lua',
        format: params?.format || 'lua'
      }
      let result = await checkActivityVersion(req)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleTrackError(this.platform, '', error))
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
      let platform_id: 4 = 4
      let { cpid: copyCpid, productId: product_id, channelId: channel_id } = SYSTEM_INFO
      let cpid = Number(copyCpid)
      const publicProps = customGetStorageSync('rx_public_props')
      const new_properties: any = {}

      if (SYSTEM_INFO.region_tag) {
        new_properties.rx_region_tag = `${SYSTEM_INFO.region_tag}`
      }

      if (SYSTEM_INFO.cp_role_id) {
        new_properties['#role_id'] = `${SYSTEM_INFO.cp_role_id}`
      }

      if (SYSTEM_INFO.third_channel_code) {
        new_properties.third_channel = `${SYSTEM_INFO.third_channel_code}`
      }

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

  public async multipleTrack() {
    try {
      let rx_track_queue = customGetStorageSync('rx_track_queue') || []
      if (rx_track_queue.length) {
        console.log('批量补上报大数据')
        await trackApi(rx_track_queue)
        removeStorageSync('rx_track_queue')
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 获取商业化接口
  public async getOperationScene(callback: H5MethodParams) {
    try {
      const res = await getOperationSceneApi()
      callback && callback.complete(res)
    } catch (err: any) {
      callback && callback.complete(handleTrackError(this.platform, '', err))
    }
  }

  // 商业化上报接口
  public async reportWindowExposure(properties: {
    [key: string]: any
  }, callback: H5MethodParams) {
    this.track(
      {
        complete: (data: any) => {
          callback && callback.complete(data)
        }
      },
      {
        event: '#window_exposure',
        properties: properties
      }
    )
  }

  // 游戏区服信息查询
  async getGameArea(params: { area_id: string }, callback: H5MethodParams) {
    try {
      let result = await getGameAreaApi(params.area_id)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 游戏区服信息修改
  async putGameArea(params: any, callback: H5MethodParams) {
    try {
      let result = await putGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建游戏区服
  async createGameArea(params: any, callback: H5MethodParams) {
    try {
      let result = await createGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏区服
  async delGameArea(params: any, callback: H5MethodParams) {
    try {
      let result = await delGameAreaApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询区服列表信息
  async getGameAreaList(callback: H5MethodParams) {
    try {
      let result = await getGameAreaListApi()
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 创建角色
  async createGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await createGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 修改游戏角色信息
  async putGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await putGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 删除游戏角色
  async delGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await delGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下角色信息列表
  async getGameCharacterAccount(params: any, callback: H5MethodParams) {
    try {
      let result = await getGameCharacterAccountApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询账号下某个区服下的角色信息列表
  async getGameCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await getGameCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 查询具体角色信息
  async getGameAccountAreaCharacter(params: any, callback: H5MethodParams) {
    try {
      let result = await getGameAccountAreaCharacterApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  public async exchangeItemProp(params: any, callback: H5MethodParams) {
    try {
      const result = await itemRedemptionApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  public getDevicecode() {
    try {
      const devicecode = customGetStorageSync('rx_devicecode')
      if (devicecode) {
        // @ts-ignore
        return devicecode.code
      } else {
        let code = v4()
        customSetStorageSync('rx_devicecode', { code, openIds: {} })
        return code
      }
    } catch (err) {
      return v4()
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

  // 新版通用版本检查 v2
  async updateGameVersion(params: any, callback: IMethodParams) {
    try {
      let result = await updateGameVersionApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  private setCpOf(bool: boolean) {
    SYSTEM_INFO.CP_OF = bool
  }

  private getCpOf() {
    return SYSTEM_INFO.CP_OF || false
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

  async getTempNotice(callback: IMethodParams) {
    try {
      let result = await getTempNoticeApi(SYSTEM_INFO.productId, SYSTEM_INFO.channelId)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async getH5LoginConfig(callback: IMethodParams) {
    try {
      let result = await getH5LoginConfigApi(SYSTEM_INFO.productId, SYSTEM_INFO.channelId)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  async tradeQuery(params: any, callback: IMethodParams) {
    try {
      let result = await tradeQueryApi(params.order_no)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  public setLanguage(language = 'zh-CN') {
    SYSTEM_INFO.language = language
  }
}

export default SdkCommonUI
