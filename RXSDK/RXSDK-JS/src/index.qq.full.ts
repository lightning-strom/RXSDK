import SdkSocial from './index.social'
import SdkQQ from './index.qq'

//QQ小游戏sdk-全量
class SdkQQFull extends SdkQQ {
  constructor(initParams: ISdkInitParams) {
    super(initParams)
    console.log('QQ小游戏sdk-全量API')
  }

  //社交关系
  public static get social(): SdkSocial {
    return SdkSocial.I
  }

  public async setcustom(params: { custom: string }, callback: IMethodParams) {
    return SdkQQFull.social.setcustom(params, callback)
  }

  public async addRelation(params: IaddRelation, callback: IMethodParams) {
    return SdkQQFull.social.addRelation(params, callback)
  }

  public async deleteRelation(params: IdeleteRelation, callback: IMethodParams) {
    return SdkQQFull.social.deleteRelation(params, callback)
  }

  public async updateremarks(params: Iupdateremarks, callback: IMethodParams) {
    return SdkQQFull.social.updateremarks(params, callback)
  }

  public async hasRelation(params: IHasRelation, callback: IMethodParams) {
    return SdkQQFull.social.hasRelation(params, callback)
  }

  public async relationList(params: Irelationlists, callback: IMethodParams) {
    return SdkQQFull.social.relationList(params, callback)
  }

  public async addFriend(params: IaddFriend, callback: IMethodParams) {
    return SdkQQFull.social.addFriend(params, callback)
  }

  public async delfriend(params: IdeleFriend, callback: IMethodParams) {
    return SdkQQFull.social.delfriend(params, callback)
  }

  public async updatefriendremarks(params: Iupdatefriendremarks, callback: IMethodParams) {
    return SdkQQFull.social.updatefriendremarks(params, callback)
  }

  public async isfriend(params: Iisfriend, callback: IMethodParams) {
    return SdkQQFull.social.isfriend(params, callback)
  }

  public async friends(callback: IMethodParams) {
    return SdkQQFull.social.friends(callback)
  }

  public async addscore(params: Iaddscroe, callback: IMethodParams) {
    return SdkQQFull.social.addscore(params, callback)
  }

  public async setscore(params: Iaddscroe, callback: IMethodParams) {
    return SdkQQFull.social.setscore(params, callback)
  }

  public async queryuserrank(params: queryuserrank, callback: IMethodParams) {
    return SdkQQFull.social.queryuserrank(params, callback)
  }

  public async getranklist(params: IgetranklistLimit, callback: IMethodParams) {
    return SdkQQFull.social.getranklist(params, callback)
  }

  public async friendsrank(params: Igetranklist, callback: IMethodParams) {
    return SdkQQFull.social.friendsrank(params, callback)
  }

}

export default SdkQQFull
