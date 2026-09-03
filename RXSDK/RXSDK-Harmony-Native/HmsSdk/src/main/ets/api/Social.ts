import { RXRequest } from '../net/RXRequest';
import { RCallback } from '../types/Index'
import { ISocial } from './ISocial'

/**
 * 上报/更新经纬度坐标
 */
const LBS_UPDATE = "v1/social/lbs/update";
/**
 * 给用户设置CP的自定义信息
 */
const USER_SET_CUSTOM = "v1/social/user/setcustom";
/**
 * 获取指定半径内的其他用户信息
 */
const LBS_RADIUS = "v1/social/lbs/radius";
/**
 * 删除经纬度坐标
 */
const LBS_DELETE = "v1/social/lbs/delete";

/**
 * 添加自定关系
 */
const RELATION_ADD = "v1/social/relation/add";
/**
 * 删除自定关系
 */
const RELATION_DELETE = "v1/social/relation/delete";

/**
 * 更新自定关系备注
 */
const RELATION_UPDATE_REMARKS = "v1/social/relation/updateremarks";

/**
 * 判断两用户是否存在某自定关系
 */
const RELATION_HAS_RELATION = "v1/social/relation/hasrelation";
/**
 * 获取自定关系列表
 */
const RELATION_LIST = "v1/social/relation/list";


/**
 * 添加好友列表
 */
const RELATION_ADD_FRIEND = "v1/social/relation/addfriend";
/**
 * 删除好友列表
 */
const RELATION_DEL_FRIEND = "v1/social/relation/delfriend";
/**
 * 更新好友关系备注
 */
const RELATION_UPDATE_FRIEND_REMARKS = "v1/social/relation/updatefriendremarks";
/**
 * 判断两用户是否为好友
 */
const RELATION_IS_FRIEND = "v1/social/relation/isfriend";


/**
 * 获取好友列表
 */
const RELATION_FRIENDS = "v1/social/relation/friends";
/**
 * 排行榜
 */
const RANK_ADDSCORE = "v1/social/rank/addscore";
const RANK_SETSCORE = "v1/social/rank/setscore";
const RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
const RANK_GETRANKLIST = "v1/social/rank/getranklist";
const RANK_FRIENDSRANK = "v1/social/rank/friendsrank";

class Social implements ISocial {
  lbsRadius(args: { types: string; lon: number; lat: number; radius: number; count: number; page: number; page_size: number; }, callback?: RCallback) {
    return RXRequest.post(LBS_RADIUS, args, null, callback)
  }

  lbsDelete(args: { types: string[]; }, callback?: RCallback) {
    return RXRequest.post(LBS_DELETE, args, null, callback)
  }

  userSetCustom(args: { custom: string; }, callback?: RCallback) {
    return RXRequest.post(USER_SET_CUSTOM, args, null, callback)
  }

  relationAdd(args: { target: string; types: Record<string, any>; target_remarks: string; user_remarks: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_ADD, args, null, callback)
  }

  relationDelete(args: { target: string; types: Record<string, any>; }, callback?: RCallback) {
    return RXRequest.post(RELATION_DELETE, args, null, callback)
  }

  updateRemarks(args: { target: string; type: string; target_remark: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_UPDATE_REMARKS, args, null, callback)
  }

  hasRelation(args: { target: string; type: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_HAS_RELATION, args, null, callback)
  }

  relationList(args: { type: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_LIST, args, null, callback)
  }

  addFriends(args: { target: string; target_remarks: string; user_remarks: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_ADD_FRIEND, args, null, callback)
  }

  removeFriends(args: { target: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_DEL_FRIEND, args, null, callback)
  }

  updateFriendRemarks(args: { target: string; target_remarks: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_UPDATE_FRIEND_REMARKS, args, null, callback)
  }

  isFriend(args: { target: string; }, callback?: RCallback) {
    return RXRequest.post(RELATION_IS_FRIEND, args, null, callback)
  }

  relationFriends(args?: Record<string, any>, callback?: RCallback) {
    return RXRequest.post(RELATION_FRIENDS, args, null, callback)
  }

  lbsUpdate(args: { types: string[], lon: number, lat: number }, callback?: RCallback) {
    return RXRequest.post(LBS_UPDATE, args, null, callback)
  }
}

export default new Social()