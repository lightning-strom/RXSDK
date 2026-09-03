import { getInfoApi } from './apis'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { getDevicecode } from '@/h5/utils'
import SdkCommon from './SdkCommon'

class SDKUI extends SdkCommon {
  constructor(platform: string) {
    super(platform)
  }

  public initConfig: any = {}

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

  private checkOrientation() {
    const portraitRatio = 0.75
    const ratio = window.innerWidth / window.innerHeight
    return ratio < portraitRatio
  }

  private getIframeSrc({ path, base }: { path: string, base: string }) {
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
      const CONTAINER_ID = 'sdk-container'
      const IFRAME_ID = 'dynamic-iframe'
      const IFRAME_NAME = 'dynamicFrame'

      const container = document.getElementById(CONTAINER_ID)
      if (!container) {
        reject(new Error('未找到sdk-container元素'))
        return
      }

      const originalBodyStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        height: document.body.style.height
      }

      document.body.style.overflow = 'hidden'

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

      let iframe = document.createElement('iframe')
      let currentPathParams = {
        path: params.path,
        base: params.base || 'passporth5'
      }

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

      const reloadIframe = () => {
        if (container.contains(iframe)) {
          container.removeChild(iframe)
        }
        iframe = document.createElement('iframe')
        initIframe()
      }

      initIframe()

      const cleanup = () => {
        window.removeEventListener('message', handleMessage)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('resize', handleMobileResize)
        if (typeof window.orientation !== 'undefined') {
          window.removeEventListener('orientationchange', handleOrientationChange)
        }
        if (container.contains(iframe)) {
          container.removeChild(iframe)
        }
        container.style.cssText = ''
        Object.assign(document.body.style, originalBodyStyle)
      }

      const debounce = (func: Function, delay: number) => {
        let timer: number
        return function (this: any, ...args: any[]) {
          clearTimeout(timer)
          timer = window.setTimeout(() => func.apply(this, args), delay)
        }
      }

      const handleViewportChange = debounce(() => {
        originHeight = window.innerHeight
        updateContainerStyle()
        reloadIframe()
      }, 200)

      const handleResize = () => {
        handleViewportChange()
      }

      let originHeight = window.innerHeight
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

      const handleOrientationChange = () => {
        handleViewportChange()
      }

      const handleMessage = (event: MessageEvent) => {
        console.log('收到来自iframe的消息:', event.data)

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
          iframe.contentWindow?.postMessage(
            {
              type: 'INIT_PARAMS',
              data: initParams
            },
            '*'
          )

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

        if (event.data?.type === 'login_success') {
          cleanup()
          resolve(event.data)
        }

        if (event.data?.type === 'login_close') {
          reject(event.data)
          cleanup()
        }

        if (event.data?.type === 'real_name_complete') {
          getInfoApi()
            .then((res: any) => {
              if (res.code === 0) {
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

        if (event.data?.type === 'real_name_close') {
          reject(event.data)
          cleanup()
        }

        if (event.data?.type === 'log_off_complete') {
          resolve(event.data)
          cleanup()
        }

        if (event.data?.type === 'log_off_close') {
          reject(event.data)
          cleanup()
        }

        if (event.data?.type === 'close_forget') {
          reject(event.data)
          cleanup()
        }

        if (event.data?.type === 'close_reset') {
          reject(event.data)
          cleanup()
        }

        if (event.data?.type === 'reset_password_success') {
          reject(event.data)
          cleanup()
        }

        if (event.data?.type === 'close_help_center') {
          cleanup()
        }

        if (event.data?.type === 'open_service') {
          cleanup()
          this.openService({
            ...event.data.data
          })
        }

        if (event.data?.type === 'close_service') {
          cleanup()
        }

        if (event.data?.type === 'close_agreement') {
          cleanup()
        }

        if (event.data?.type === 'close_service_from_help') {
          cleanup()
          this.openHelpCenter({
            theme: this.theme,
            game_user_id: this.game_user_id
          })
        }

        if (event.data?.type === 'close_pay') {
          reject(event.data)
          cleanup()
        }
      }

      window.addEventListener('message', handleMessage)

      if (this.isMobile()) {
        window.addEventListener('orientationchange', handleOrientationChange)
        window.addEventListener('resize', handleMobileResize)
      } else {
        window.addEventListener('resize', handleResize)
      }

      iframe.onload = () => console.log('iframe加载完成')

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
}

export default SDKUI
