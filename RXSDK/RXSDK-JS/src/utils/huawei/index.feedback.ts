import {
  getFeedbackApi,
  createFeedbackApi,
  feedbackEvalApi,
} from '@/api/huawei/feedback'
import { handleError } from '@/utils/utils'
import { SYSTEM_INFO } from '@/config'

// 意见反馈
class SdkFeedback {
  public static instance: SdkFeedback
  static get I(): SdkFeedback {
    return this.instance || (this.instance = new SdkFeedback())
  }

  public async getFeedbackKindList({ complete }: IMethodParams) {
    try {
      let result = await getFeedbackApi()
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  public async createFeedback(params: IReqCreateFeedback,{ complete }: IMethodParams) {
    try {
      let result = await createFeedbackApi(
        {
          ...params,
          product_id: SYSTEM_INFO.productId,
          channel_id: SYSTEM_INFO.channelId,
        }
      )
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  public async satisfactionEvaluation(params: IReqFeedbackEval,{ complete }: IMethodParams) {
    try {
      let result = await feedbackEvalApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

}
export default SdkFeedback
