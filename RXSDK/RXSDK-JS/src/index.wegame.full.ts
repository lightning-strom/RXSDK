import SdkSocial from './index.social'
import SdkWegame from './index.wegame'
import SdkHelpcenter from './index.helpcenter'

//微信小游戏sdk-全量
class SdkWegameFull extends SdkWegame {
  constructor(initParams: ISdkInitParams) {
    super(initParams)
    console.log('微信小游戏sdk-全量API')
  }

  //社交关系
  public static get social(): SdkSocial {
    return SdkSocial.I
  }

  //帮助中心
  public static get helpcenter(): SdkHelpcenter {
    return SdkHelpcenter.I
  }

  public async setcustom(params: { custom: string }, callback: IMethodParams) {
    return SdkWegameFull.social.setcustom(params, callback)
  }

  public async addRelation(params: IaddRelation, callback: IMethodParams) {
    return SdkWegameFull.social.addRelation(params, callback)
  }

  public async deleteRelation(params: IdeleteRelation, callback: IMethodParams) {
    return SdkWegameFull.social.deleteRelation(params, callback)
  }

  public async updateremarks(params: Iupdateremarks, callback: IMethodParams) {
    return SdkWegameFull.social.updateremarks(params, callback)
  }

  public async hasRelation(params: IHasRelation, callback: IMethodParams) {
    return SdkWegameFull.social.hasRelation(params, callback)
  }

  public async relationList(params: Irelationlists, callback: IMethodParams) {
    return SdkWegameFull.social.relationList(params, callback)
  }

  public async addFriend(params: IaddFriend, callback: IMethodParams) {
    return SdkWegameFull.social.addFriend(params, callback)
  }

  public async delfriend(params: IdeleFriend, callback: IMethodParams) {
    return SdkWegameFull.social.delfriend(params, callback)
  }

  public async updatefriendremarks(params: Iupdatefriendremarks, callback: IMethodParams) {
    return SdkWegameFull.social.updatefriendremarks(params, callback)
  }

  public async isfriend(params: Iisfriend, callback: IMethodParams) {
    return SdkWegameFull.social.isfriend(params, callback)
  }

  public async friends(callback: IMethodParams) {
    return SdkWegameFull.social.friends(callback)
  }

  public async addscore(params: Iaddscroe, callback: IMethodParams) {
    return SdkWegameFull.social.addscore(params, callback)
  }

  public async setscore(params: Iaddscroe, callback: IMethodParams) {
    return SdkWegameFull.social.setscore(params, callback)
  }

  public async queryuserrank(params: queryuserrank, callback: IMethodParams) {
    return SdkWegameFull.social.queryuserrank(params, callback)
  }

  public async getranklist(params: IgetranklistLimit, callback: IMethodParams) {
    return SdkWegameFull.social.getranklist(params, callback)
  }

  public async friendsrank(params: Igetranklist, callback: IMethodParams) {
    return SdkWegameFull.social.friendsrank(params, callback)
  }

  public async getUserInteractiveStorage(
    params: FriendInteractionStorage,
    callback: IMethodParams
  ) {
    return SdkWegameFull.social.getUserInteractiveStorage(params, callback)
  }
  public async getGameClubData(
    params: GameClubDataParams,
    callback: IMethodParams
  ) {
    return SdkWegameFull.social.getGameClubData(params, callback)
  }

  public async setUserCloudStorage(params: { KVDataList: KVData[] }, callback: IMethodParams) {
    return SdkWegameFull.social.setUserCloudStorage(params, callback)
  }

  public async getUserCloudStorage(params: FriendInteractionStorage, callback: IMethodParams) {
    return SdkWegameFull.social.getUserCloudStorage(params, callback)
  }

  public async removeUserCloudStorage(params: FriendInteractionStorage, callback: IMethodParams) {
    return SdkWegameFull.social.removeUserCloudStorage(params, callback)
  }

  public async getUserCloudStorageKeys(callback: IMethodParams) {
    return SdkWegameFull.social.getUserCloudStorageKeys(callback)
  }

  public async getFriendCloudStorage(params: FriendInteractionStorage, callback: IMethodParams) {
    return SdkWegameFull.social.getFriendCloudStorage(params, callback)
  }

  public async getPotentialFriendList(callback: IMethodParams) {
    return SdkWegameFull.social.getPotentialFriendList(callback)
  }

  public async getHelpcenterMainLayout(callback: IMethodParams) {
    return SdkWegameFull.helpcenter.getHelpcenterMainLayout(callback)
  }

  public async getHelpcenterQuestionLayout(params: HelpcenterQuestionReq, callback: IMethodParams) {
    return SdkWegameFull.helpcenter.getHelpcenterQuestionLayout(params, callback)
  }

  public async getHelpcenterInfoLayout(params: HelpcenterQuestionReq, callback: IMethodParams) {
    return SdkWegameFull.helpcenter.getHelpcenterInfoLayout(params, callback)
  }

  public async helpcenterResolution(params: HelpcenterResolution, callback: IMethodParams) {
    return SdkWegameFull.helpcenter.helpcenterResolution(params, callback)
  }
}

export default SdkWegameFull
