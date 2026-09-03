import {
  getMainlayoutApi,
  getListlayoutApi,
  getInfolayoutApi,
  postResolutionApi,
} from '@/api/helpcenter'
import { handleError } from '@/utils/utils'

// 意见反馈
class SdkHelpcenter {
  public static instance: SdkHelpcenter
  static get I(): SdkHelpcenter {
    return this.instance || (this.instance = new SdkHelpcenter())
  }

  public async getHelpcenterMainLayout({ complete }: IMethodParams) {
    try {
      const result = await getMainlayoutApi()
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  public async getHelpcenterQuestionLayout(
    params: HelpcenterQuestionReq,
    { complete }: IMethodParams
  ) {
    try {
      const result = await getListlayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  public async getHelpcenterInfoLayout(params: HelpcenterQuestionReq, { complete }: IMethodParams) {
    try {
      const result = await getInfolayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  public async helpcenterResolution(params: HelpcenterResolution, { complete }: IMethodParams) {
    try {
      const result = await postResolutionApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
}
export default SdkHelpcenter
