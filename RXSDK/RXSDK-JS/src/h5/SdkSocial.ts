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
  updateremarksApi
} from './apis'
import { handleError } from '@/utils/utils'
import { pubCheck } from '@/utils/paramsValid'

//社交关系
class SdkSocial {
  public static instance: SdkSocial

  static get I(): SdkSocial {
    return this.instance || (this.instance = new SdkSocial())
  }

  private refreshSession = 0 //用于记录刷新session

  //用户管理
  public async setcustom(params: { custom: string }, { complete }: H5MethodParams) {
    try {
      await pubCheck(setcustomCheck, { complete }, params)
      let result = await setcustomApi({ custom: params.custom })
      console.log(result)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //添加自定义关系
  public async addRelation(params: H5addRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(addRelationCheck, { complete }, params)
      let result = await addRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //删除自定义关系
  public async deleteRelation(params: H5deleteRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(deleteRelationCheck, { complete }, params)
      let result = await deleteRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //更新自定关系备注
  public async updateremarks(params: H5updateremarks, { complete }: H5MethodParams) {
    try {
      await pubCheck(updateremarksCheck, { complete }, params)
      let result = await updateremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //判断两用户是否存在某自定关系
  public async hasRelation(params: H5HasRelation, { complete }: H5MethodParams) {
    try {
      await pubCheck(hasRelationCheck, { complete }, params)
      let result = await hasrelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //获取自定关系列表
  public async relationList(params: H5relationlists, { complete }: H5MethodParams) {
    try {
      await pubCheck(relationListCheck, { complete }, params)
      let result = await relationListApi({ type: params.type })
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //添加好友关系
  public async addFriend(params: H5addFriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(addFriendCheck, { complete }, params)
      let result = await addfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //删除好友关系
  public async delfriend(params: H5deleFriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await delfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //更新好友备注
  public async updatefriendremarks(params: H5updatefriendremarks, { complete }: H5MethodParams) {
    try {
      await pubCheck(updatefriendremarksCheck, { complete }, params)
      let result = await updatefriendremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //判断两用户是否为好友
  public async isfriend(params: H5isfriend, { complete }: H5MethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await isfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //获取好友关系列表
  public async friends({ complete }: H5MethodParams) {
    try {
      let result = await friendsApi()
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  /**
   * 排行榜相关接口
   */

  //增加用户分数
  public async addscore(params: H5addscroe, { complete }: H5MethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await addscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //设置用户分数
  public async setscore(params: H5addscroe, { complete }: H5MethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await setscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //查询用户分数
  public async queryuserrank(params: queryuserrank, { complete }: H5MethodParams) {
    try {
      await pubCheck(queryuserrankCheck, { complete }, params)
      let result = await queryuserrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //获取排行榜列表
  public async getranklist(params: H5getranklistLimit, { complete }: H5MethodParams) {
    try {
      await pubCheck(getranklimitlistCheck, { complete }, params)
      let result = await getranklistApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //获取好友排行榜列表
  public async friendsrank(params: H5getranklist, { complete }: H5MethodParams) {
    try {
      await pubCheck(getranklistCheck, { complete }, params)
      let result = await friendsrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
}

export default SdkSocial
