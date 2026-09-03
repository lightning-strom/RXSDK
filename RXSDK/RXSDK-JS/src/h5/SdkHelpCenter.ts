import {
  getMainlayoutApi,
  getListlayoutApi,
  getInfolayoutApi,
  postResolutionApi
} from '@/api/helpcenter'
import { handleError } from '@/utils/utils'

// 意见反馈
class SdkHelpCenter {
  public static instance: SdkHelpCenter

  static get I(): SdkHelpCenter {
    return this.instance || (this.instance = new SdkHelpCenter())
  }

  public async getHelpcenterMainLayout({ complete }: H5MethodParams) {
    try {
      const result = await getMainlayoutApi()
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  public async getHelpcenterQuestionLayout(
    params: HelpcenterQuestionReq,
    { complete }: H5MethodParams
  ) {
    try {
      const result = await getListlayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  public async getHelpcenterInfoLayout(params: H5HelpcenterQuestionReq, { complete }: H5MethodParams) {
    try {
      const result = await getInfolayoutApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  public async helpcenterResolution(params: H5HelpcenterResolution, { complete }: H5MethodParams) {
    try {
      const result = await postResolutionApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
}

export default SdkHelpCenter
