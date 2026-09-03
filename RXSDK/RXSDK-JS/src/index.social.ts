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
  updateremarksCheck,
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
  updateremarksApi,
  opendataAesdecodeApi,
} from '@/api/social'
import { asyncFunc, handleError } from '@/utils/utils'
import { pubCheck } from '@/utils/paramsValid'
import { COMMON_ERROR_CODE } from '@/config/const'
import { refreshUserInfo } from './api/api'

//社交关系
class SdkSocial {
  public static instance: SdkSocial
  static get I(): SdkSocial {
    return this.instance || (this.instance = new SdkSocial())
  }
  private refreshSession = 0 //用于记录刷新session

  //用户管理
  public async setcustom(params: { custom: string }, { complete }: IMethodParams) {
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
  public async addRelation(params: IaddRelation, { complete }: IMethodParams) {
    try {
      await pubCheck(addRelationCheck, { complete }, params)
      let result = await addRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //删除自定义关系
  public async deleteRelation(params: IdeleteRelation, { complete }: IMethodParams) {
    try {
      await pubCheck(deleteRelationCheck, { complete }, params)
      let result = await deleteRelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //更新自定关系备注
  public async updateremarks(params: Iupdateremarks, { complete }: IMethodParams) {
    try {
      await pubCheck(updateremarksCheck, { complete }, params)
      let result = await updateremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //判断两用户是否存在某自定关系
  public async hasRelation(params: IHasRelation, { complete }: IMethodParams) {
    try {
      await pubCheck(hasRelationCheck, { complete }, params)
      let result = await hasrelationApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //获取自定关系列表
  public async relationList(params: Irelationlists, { complete }: IMethodParams) {
    try {
      await pubCheck(relationListCheck, { complete }, params)
      let result = await relationListApi({ type: params.type })
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //添加好友关系
  public async addFriend(params: IaddFriend, { complete }: IMethodParams) {
    try {
      await pubCheck(addFriendCheck, { complete }, params)
      let result = await addfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //删除好友关系
  public async delfriend(params: IdeleFriend, { complete }: IMethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await delfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //更新好友备注
  public async updatefriendremarks(params: Iupdatefriendremarks, { complete }: IMethodParams) {
    try {
      await pubCheck(updatefriendremarksCheck, { complete }, params)
      let result = await updatefriendremarksApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //判断两用户是否为好友
  public async isfriend(params: Iisfriend, { complete }: IMethodParams) {
    try {
      await pubCheck(delfriendCheck, { complete }, params)
      let result = await isfriendApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //获取好友关系列表
  public async friends({ complete }: IMethodParams) {
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
  public async addscore(params: Iaddscroe, { complete }: IMethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await addscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //设置用户分数
  public async setscore(params: Iaddscroe, { complete }: IMethodParams) {
    try {
      await pubCheck(addscoreCheck, { complete }, params)
      let result = await setscoreApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //查询用户分数
  public async queryuserrank(params: queryuserrank, { complete }: IMethodParams) {
    try {
      await pubCheck(queryuserrankCheck, { complete }, params)
      let result = await queryuserrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //获取排行榜列表
  public async getranklist(params: IgetranklistLimit, { complete }: IMethodParams) {
    try {
      await pubCheck(getranklimitlistCheck, { complete }, params)
      let result = await getranklistApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }
  //获取好友排行榜列表
  public async friendsrank(params: Igetranklist, { complete }: IMethodParams) {
    try {
      await pubCheck(getranklistCheck, { complete }, params)
      let result = await friendsrankApi(params)
      complete(result)
    } catch (err) {
      complete(handleError(err))
    }
  }

  /**
   * 开放数据相关接口
   */
  //是否授权使用你的微信朋友信息
  async authorizeWxFriendInteraction(callback?: Partial<IMethodParams>) {
    function authDenyed(err?: any) {
      const error: any = new Error(err?.errMsg || 'authorize WxFriendInteraction:fail auth deny')
      error.code = COMMON_ERROR_CODE.FRIENDINTERACTION_AUTH_DENY
      if (callback?.complete) {
        callback.complete(handleError(error))
        return
      }
      throw error
    }
    try {
      let { authSetting } = await asyncFunc(wx.getSetting)
      console.log('authSetting: ', authSetting['scope.WxFriendInteraction'])
      if (authSetting['scope.WxFriendInteraction'] === true) {
        //console.log('已经同意授权授权')
        callback?.complete && callback.complete({ code: 0 })
        return true
      } else if (authSetting['scope.WxFriendInteraction'] === undefined) {
        // scope.WxFriendInteraction === undefined代表用户未授权且第一次登陆
        //console.log('从未授权过')
        await asyncFunc(wx.authorize, { scope: 'scope.WxFriendInteraction' })
        callback?.complete && callback.complete({ code: 0 })
        return true
      } else if (
        authSetting['scope.WxFriendInteraction'] != undefined &&
        authSetting['scope.WxFriendInteraction'] != true
      ) {
        // console.log('拒绝过授权 重新去授权')
        let res = await asyncFunc(wx.showModal, {
          title: '申请使用你的微信朋友信息',
          // content: '需要获取您的微信朋友信息，请确认授权，否则无法相关功能！',
          cancelText: '拒绝',
          confirmText: '允许',
        })
        if (res.cancel) {
          wx.showToast({
            title: '您已拒绝授权!',
            icon: 'none',
          })
        } else if (res.confirm) {
          let openSetting = await asyncFunc(wx.openSetting)
          if (openSetting.authSetting['scope.WxFriendInteraction'] === true) {
            wx.showToast({
              title: '授权成功!',
              icon: 'none',
            })
            callback?.complete && callback.complete({ code: 0 })
            return true
          } else {
            wx.showToast({
              title: '授权失败!',
              icon: 'none',
            })
          }
        }
        return authDenyed()
      }
    } catch (err: any) {
      return authDenyed(err)
    }
  }

  async getUserInteractiveStorage(params: FriendInteractionStorage, { complete }: IMethodParams) {
    try {
      await this.authorizeWxFriendInteraction()
      const { iv, encryptedData } = await asyncFunc(wx.getUserInteractiveStorage, {
        keyList: params?.keyList || [],
      } as any)
      const res = await opendataAesdecodeApi({ iv, encrypted_data: encryptedData })
      complete(res)
    } catch (err) {
      complete(handleError(err))
    }
  }

  //是否授权使用你的游戏圈数据
  async authorizeWxGameClubData(callback?: Partial<IMethodParams>) {
    function authDenyed(err?: any) {
      const error: any = new Error(err?.errMsg || 'authorize gameClubData:fail auth deny')
      error.code = COMMON_ERROR_CODE.GAMECLUBDATA_AUTH_DENY
      if (callback?.complete) {
        callback.complete(handleError(error))
        return
      }
      throw error
    }
    try {
      let { authSetting } = await asyncFunc(wx.getSetting)
      console.log('authSetting: ', authSetting['scope.gameClubData'])
      if (authSetting['scope.gameClubData'] === true) {
        //console.log('已经同意授权授权')
        callback?.complete && callback.complete({ code: 0 })
        return true
      } else if (authSetting['scope.gameClubData'] === undefined) {
        //console.log('从未授权过')
        await asyncFunc(wx.authorize, { scope: 'scope.gameClubData' })
        callback?.complete && callback.complete({ code: 0 })
        return true
      } else if (
        authSetting['scope.gameClubData'] != undefined &&
        authSetting['scope.gameClubData'] != true
      ) {
        // console.log('拒绝过授权 重新去授权')
        let res = await asyncFunc(wx.showModal, {
          title: '申请使用你的游戏圈加入、发表、点赞数据',
          cancelText: '拒绝',
          confirmText: '允许',
        })
        if (res.cancel) {
          wx.showToast({
            title: '您已拒绝授权!',
            icon: 'none',
          })
        } else if (res.confirm) {
          let openSetting = await asyncFunc(wx.openSetting)
          if (openSetting.authSetting['scope.gameClubData'] === true) {
            wx.showToast({
              title: '授权成功!',
              icon: 'none',
            })
            callback?.complete && callback.complete({ code: 0 })
            return true
          } else {
            wx.showToast({
              title: '授权失败!',
              icon: 'none',
            })
          }
        }
        return authDenyed()
      }
    } catch (err: any) {
      return authDenyed(err)
    }
  }
  //获得游戏圈数据
  async getGameClubData(params: GameClubDataParams, { complete }: IMethodParams) {
    const sessionOverdue = async (err: any) => {
      // 192802 微信小游戏sessionkey过期
      if (err?.code == 192802 && this.refreshSession < 2) {
        this.refreshSession++
        let result = await this.refreshSessionFunc()
        if (result == 1) {
          this.getGameClubData(params, { complete })
        } else {
          complete(handleError(err))
        }
      } else {
        complete(handleError(err))
      }
    }
    try {
      await this.authorizeWxGameClubData()
      const { iv, encryptedData, signature } = await asyncFunc((wx as any).getGameClubData, {
        dataTypeList: params?.dataTypeList || [],
      } as any)
      const res = await opendataAesdecodeApi({ iv, encrypted_data: encryptedData })
      this.refreshSession = 0
      complete(res)
    } catch (err) {
      sessionOverdue(err)
    }
  }

  async setUserCloudStorage(params: { KVDataList: KVData[] }, { complete }: IMethodParams) {
    try {
      await asyncFunc(wx.setUserCloudStorage, {
        KVDataList: params?.KVDataList || [],
      } as any)
      complete({ code: 0 })
    } catch (err) {
      complete(handleError(err))
    }
  }

  async getUserCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams) {
    try {
      const res = await asyncFunc(wx.getUserCloudStorage, {
        keyList: params?.keyList || [],
      } as any)
      complete({ code: 0, data: res?.KVDataList || [] })
    } catch (err) {
      complete(handleError(err))
    }
  }

  async removeUserCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams) {
    try {
      await asyncFunc(wx.removeUserCloudStorage, {
        keyList: params?.keyList || [],
      } as any)
      complete({ code: 0 })
    } catch (err) {
      complete(handleError(err))
    }
  }

  async getUserCloudStorageKeys({ complete }: IMethodParams) {
    try {
      const res = await asyncFunc(wx.getUserCloudStorageKeys)
      complete({ code: 0, data: res?.keys || [] })
    } catch (err) {
      complete(handleError(err))
    }
  }

  async getFriendCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams) {
    try {
      const res = await asyncFunc(wx.getFriendCloudStorage, {
        keyList: params?.keyList || [],
      } as any)
      complete({ code: 0, data: res?.data || [] })
    } catch (err) {
      complete(handleError(err))
    }
  }

  async getPotentialFriendList({ complete }: IMethodParams) {
    try {
      const res = await asyncFunc(wx.getPotentialFriendList)
      complete({ code: 0, data: res?.list || [] })
    } catch (err) {
      complete(handleError(err))
    }
  }

  async refreshSessionFunc() {
    try {
      const { code } = await asyncFunc(wx.login)
      await refreshUserInfo({
        version: 'base',
        code,
      })
      return 1
    } catch (err: any) {
      return -1
    }

  }
}
export default SdkSocial
