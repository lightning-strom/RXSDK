import { RXRequest } from '../net/RXRequest'
import { FeedbackItemBean, IFeedback, RCallback } from '../types/Index'

enum FBAPI {
  Create = "v1/feedbackapi/player_feedback/create",
  List = "v1/feedbackapi/player_feedback/list",
  Detail = "v1/feedbackapi/player_feedback/detail",
  GetProp = "v1/feedbackapi/player_feedback/getprop",
}

// https://doc.ruixueyun.com/#/view?path=fe0b478f-15a1-4680-81de-8d9db2efc6c7&title=%25E7%258E%25A9%25E5%25AE%25B6%25E5%258F%258D%25E9%25A6%2588%25E5%2588%2597%25E8%25A1%25A8&tab=undefined&timestamp=1729041192964
export interface FeedbackListBean {
  page: number,
  size: number,
  total: number,
  list: FeedbackItemBean[]
}

export interface FeedbackPropBean {
  name: string, //道具名
  tag: string, //道具标识
  num: string, //道具数量
  time_limit: number, //有效期（天）0永久有效
  icon: string,
  count: string, //道具数量字符串
  describe: string //描述
}

/**
 *https://doc.ruixueyun.com/#/view?viewPath=0df8e106-be3d-4df1-97fe-cf6129ea811c&title=%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84(JSON)&tab=&index=3
 */
export interface FeedbackDetailBean {
  id: number,
  content: string,
  attachments: string[], //反馈附件
  created_at: string, //反馈时间
  status: number, //1未处理 2已处理
  recover_at: string, //回复时间
  recover_attachments: string[], //回复道具
  recover_content: string, //回复内容
  is_prop: number, //0无道具 1有道具
  prop: FeedbackPropBean[], //道具
  get_prop: number //1 已领取
}

interface FeedBackArgs {
  content: string
  attachments?: string[]
  phone: string
  tags?: String[]
}

interface FeedBackListArgs {
  page: number,
  size: number,
  status?: number
}

class Feedback implements IFeedback {
  /**
   * 创建意见反馈
   * @param content 返回内容
   * @param attachments 上传附件
   * @param phone 电话号
   * @param tags 标签标识， 游戏透传
   * @param callback 回调
   */
  public async feedbackCreate(content: string, attachments: string[], phone: string, tags?: string[]) {
    return await RXRequest.post<object>(FBAPI.Create, {
      content,
      attachments,
      phone,
      tags
    })
  }

  /**
   * 获取列表T
   * @param page 页数， 从1开始
   * @param size 每页大小
   * @param status 1 未处理 2已处理
   * @param callback 回调
   */
  public async getFeedbackList(page: number = 1, size: number = 20, status?: number, callback?: RCallback) {
    let parm = {
      page,
      size
    }
    if (status && status != 0) {
      parm["status"] = status
    }
    return await RXRequest.get<object>(FBAPI.List, parm, null, callback)
  }


  /**
   * 获取反馈详情
   * @param id 反馈id
   * @param callback 回调
   */
  public async getFeedbackDetail(id: number, callback?: RCallback) {
    return await RXRequest.get<object>(FBAPI.Detail, {
      id
    }, null, callback)
  }


  /**
   * 领取道具
   * @param id 反馈id
   * @param callback 回调
   */
  public async feedbackGetprop(id: number, callback?: RCallback) {
    return await RXRequest.post<object>(FBAPI.GetProp, {
      id
    }, null, callback)
  }
}

export default new Feedback()