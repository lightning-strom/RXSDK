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
  getH5LoginConfigApi,
  getTempNoticeApi,
  tradeQueryApi
} from '@/api/huawei/apiForHuawei'
import {
  bindEmailParamsCheck,
  bindPhoneParamsCheck,
  sendCaptchaParamsCheck,
  unbindemailParamsCheck,
  unBindPhoneParamsCheck
} from '@/utils/checkConfig/common'
import { handleError } from '@/utils/utils'
import {
  checkActivityVersionParams,
  checkAppVersionParams,
  checkGameVersionParams
} from '@/utils/checkConfig'
import { SYSTEM_INFO } from '@/config'
import { pubCheck } from '@/utils/paramsValid'
import SdkFeedback from './index.feedback'

class SdkCommon {
  // 意见反馈
  public static get feedback(): SdkFeedback {
    return SdkFeedback.I
  }

  constructor(initParams: ISdkInitParams) {
    // request.defaults.baseURL = initParams.baseUrlList[0]
    // axios.defaults.baseURL = initParams?.baseUrlList?.[0]
    // axios.defaults.timeout = 5000
  }

  //发送验证码
  public async sendCaptcha(params: IsendCaptcha, callback: IMethodParams) {
    try {
      await pubCheck(sendCaptchaParamsCheck, callback, params)
      let result = await sendCaptcha(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  //绑定手机
  public async bindPhone(params: IBindPhone, callback: IMethodParams) {
    try {
      await pubCheck(bindPhoneParamsCheck, callback, params)
      let result = await bindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  //解绑手机
  public async unBindPhone(params: IunBindPhone, callback: IMethodParams) {
    try {
      await pubCheck(unBindPhoneParamsCheck, callback, params)
      let result = await unBindPhone(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  //绑定邮箱
  public async bindEmail(params: IBindEmail, callback: IMethodParams) {
    try {
      await pubCheck(bindEmailParamsCheck, callback, params)
      let data = await bindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  //解绑邮箱
  public async UnbindEmail(params: IunBindEmail, callback: IMethodParams) {
    try {
      await pubCheck(unbindemailParamsCheck, callback, params)
      let data = await UnbindEmail(params)
      callback.complete(data)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  //注销账号
  async deregister(params: any, callback: IMethodParams) {
    try {
      let result = await deregister(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  //撤销账号注销申请
  async deregisterCancel(CPcallback: IMethodParams) {
    try {
      let result = await deregisterCancel()
      CPcallback.complete(result)
    } catch (error) {
      CPcallback.complete(handleError(error))
    }
  }

  //获得用户信息
  async getInfo(CPcallback: IMethodParams) {
    try {
      let result = await getInfoApi()
      CPcallback.complete(result)
    } catch (error) {
      CPcallback.complete(handleError(error))
    }
  }

  // 获取指定用户信息
  async getUserInfoByField(params: any, callback: IMethodParams) {
    try {
      let result = await getUserInfoByFieldApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  //修改瑞雪通行证用户信息。
  async updateInfo(params: any, callback: IMethodParams) {
    try {
      // await pubCheck(update_infoCheck, callback, params)
      let result = await updateInfoApi(params)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 游戏大厅版本检查-get
  async checkAppVersion(params: ICheckAppVersion, callback: IMethodParams) {
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
        if(result.code === 0) {
          const data: any = JSON.parse(result.data)
          const region_tag = data.login_config?.[0]?.region_tag
          if(region_tag) {
            SYSTEM_INFO.region_tag = region_tag
          }
        }
      } catch (e) {

      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 游戏大厅版本检查-post
  async checkVersion(params: ICheckVersion, callback: IMethodParams) {
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
        if(result.code === 0) {
          const data: any = JSON.parse(result.data)
          const region_tag = data.login_config?.[0]?.region_tag
          if(region_tag) {
            SYSTEM_INFO.region_tag = region_tag
          }
        }
      } catch (e) {

      }
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }

  // 游戏版本检查
  async checkGameVersion(params: ICheckGameVersion, callback: IMethodParams) {
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
      callback.complete(handleError(error))
    }
  }

  // 活动版本检查
  async checkActivityVersion(params: ICheckActivityVersion, callback: IMethodParams) {
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
      callback.complete(handleError(error))
    }
  }

  public async getFeedbackKindList(callback: IMethodParams) {
    return SdkCommon.feedback.getFeedbackKindList(callback)
  }

  public async createFeedback(params: IReqCreateFeedback, callback: IMethodParams) {
    return SdkCommon.feedback.createFeedback(params, callback)
  }

  public async satisfactionEvaluation(params: IReqFeedbackEval, callback: IMethodParams) {
    return SdkCommon.feedback.satisfactionEvaluation(params, callback)
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

  async tradeQuery(params:any, callback: IMethodParams) {
    try {
      let result = await tradeQueryApi(params.order_no)
      callback.complete(result)
    } catch (error) {
      callback.complete(handleError(error))
    }
  }
}

export default SdkCommon
