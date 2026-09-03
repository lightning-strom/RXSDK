import { doRequest as requestAxios } from './requestAxios'

let request: any

switch (process.env.TYPE) {
  default:
    request = requestAxios
}

export function createFeedbackApi(data: any): Promise<any> {
  return request({
    url: '/v1/feedbackapi/player_feedback/create',
    method: 'POST',
    data
  }) as any
}

export function getFeedbackListApi(params: any): Promise<any> {
  return request({
    url: '/v1/feedbackapi/player_feedback/list',
    method: 'GET',
    params
  }) as any
}

export function getFeedbackDetailApi(params: any): Promise<any> {
  return request({
    url: '/v1/feedbackapi/player_feedback/detail',
    method: 'GET',
    params
  }) as any
}

export function collectPropsApi(data: any): Promise<any> {
  return request({
    url: '/v1/feedbackapi/player_feedback/getprop',
    method: 'PUT',
    data
  }) as any
}

export function getNoticeApi(params: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/maintain/get',
    method: 'GET',
    params
  }) as any
}

export function getPromoterCodeApi(game_id: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/exchange/game_display',
    method: 'GET',
    params: { game_id }
  }) as any
}

export function exchangePromoterCodeApi(cdkey: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/exchange/exchange',
    method: 'POST',
    data: { cdkey }
  }) as any
}

export function loginByCredentialApi(data: any): Promise<any> {
  return request({
    url: '/v1/passport/account/login_by_credential',
    method: 'POST',
    data
  }) as any
}

export function loginByTokenApi(data: any): Promise<any> {
  return request({
    url: '/v1/passport/account/login_by_token',
    method: 'POST',
    data
  }) as any
}

export function getShareDataApi(data: any): Promise<any> {
  return request({
    url: '/v1/operationapi/share/data',
    method: 'POST',
    data
  }) as any
}

export function getAdShareDataApi(data: any): Promise<any> {
  return request({
    url: '/v1/operationapi/ad/data',
    method: 'POST',
    data
  }) as any
}

export function orderApi(data: any) {
  return request({
    url: '/v1/ke/order',
    method: 'POST',
    data
  }) as any
}
// 获取vng网页充值地址
export function getMinigameVngWebshop(): Promise<any> {
  return request({
    url: '/v1/ke/minigame_vng_webshop',
    method: 'GET'
  }) as any
}

//发送验证码
export const sendCaptcha = (data: any): Promise<any> =>
  request({
    url: '/v1/passport/sms/send_captcha',
    method: 'POST',
    data
  }) as any
//绑定手机
export const bindPhone = (data: any): Promise<any> =>
  request({
    url: '/v1/passport/user/bind_phone',
    method: 'POST',
    data
  }) as any
//解绑手机
export const unBindPhone = (data: any): Promise<any> =>
  request({
    url: '/v1/passport/user/unbind_phone',
    method: 'POST',
    data
  }) as any
//换绑手机
export const changePhone = (data: any): Promise<any> =>
  request({
    url: '/v1/passport/user/change_phone',
    method: 'POST',
    data
  }) as any
//换绑邮箱
export const changeEmail = (data: any): Promise<any> =>
  request({
    url: '/v1/passport/user/change_email',
    method: 'POST',
    data
  }) as any
//绑定邮箱
export const bindEmail = (data: any): Promise<any> =>
  request({
    url: '/v1/passport/user/bind_email',
    method: 'POST',
    data
  }) as any
//解绑邮箱
export const UnbindEmail = (data: any): Promise<any> =>
  request({
    url: '/v1/passport/user/unbind_email',
    method: 'POST',
    data
  }) as any
//客户端支付成功回调给服务端
export const payCallback = (url: string, data: any) =>
  request({
    method: 'POST',
    url,
    data
  })
//刷新token
export const refreshTokenReq = (): Promise<any> =>
  request({
    method: 'POST',
    url: '/v1/passport/token/refresh'
  })

//申请注销
export function deregister(data: any): Promise<any> {
  return request({
    url: '/v1/passport/user/deregister',
    method: 'POST',
    data
  }) as any
}

//取消注销
export function deregisterCancel(): Promise<any> {
  return request({
    url: '/v1/passport/user/cancel_deregister',
    method: 'POST',
    data: {}
  }) as any
}

//同步用户信息
export function refreshUserInfo(data: any) {
  return request({
    url: '/v1/passport/user/sync_info',
    method: 'POST',
    data
  })
}

//修改用户信息
export function updateInfoApi(data: any) {
  return request({
    url: '/v1/passport/user/update_info',
    method: 'POST',
    data
  })
}

export function reportLocationUpdata(data: any) {
  return request({
    url: '/v1/social/lbs/update',
    method: 'POST',
    data
  })
}

export function deleteReportLocation(data: any) {
  return request({
    url: '/v1/social/lbs/delete',
    method: 'POST',
    data
  })
}

export function getNearlyPeasonByRadius(data: any) {
  return request({
    url: '/v1/social/lbs/radius',
    method: 'POST',
    data
  })
}

//上报大数据
export const trackApi = (data: any) =>
  request({
    method: 'POST',
    url: '/v1/data/api/track',
    data
  })
export const getInfoApi = () =>
  request({
    method: 'POST',
    url: '/v1/passport/user/get_info',
    data: {}
  })

export const getUserInfoByFieldApi = (data: any = {}) =>
  request({
    method: 'POST',
    url: '/v1/passport/user/info_by_field',
    data
  })

export const msgSecCheckApi = (data: any) =>
  request({
    method: 'POST',
    url: '/v1/risk/sensitive/weixin_content/scan',
    data
  })

export const mediaCheckAsyncApi = (data: any) =>
  request({
    method: 'POST',
    url: '/v1/risk/sensitive/media/check',
    data
  })

export const activated = (data: any) =>
  request({
    method: 'POST',
    url: '/v1/attribution/user/activated',
    data
  })

// 获取商业化弹窗信息
export const getBusinessRules = (version: string): Promise<any> =>
  request({
    url: '/v1/business/rule',
    method: 'GET',
    params: {
      version
    }
  }) as any

// 商业化下单
export const businessOrderApi = (data: any) =>
  request({
    method: 'POST',
    url: '/v1/business/p',
    data
  }) as any

//产品包版本检查
export const checkVersionGameLobbyByGet = (data: any): Promise<any> =>
  request({
    url: `/v1/vcapi/update/${data.productid}/${data.channelid}/${data.clientversion}/${data.devicecode}/${data.region}`,
    method: 'GET',
    params: {
      type: data.type,
      format: data.format
    }
  }) as any

//产品包版本检查
export const checkVersionGameLobbyByPost = (data: any): Promise<any> =>
  request({
    url: `/v1/vcapi/update/${data.productid}/${data.channelid}/${data.clientversion}/${data.devicecode}/${data.region}?type=${data.type || ''}&format=${data.format || ''}`,
    method: 'POST',
    data: {
      games: data.games,
      activities: data.activities
    }
  }) as any

//游戏版本检查
export const checkGameVersion = (data: any): Promise<any> =>
  request({
    url: `/v1/vcapi/update_game/${data.gameid}/${data.gameversion}/${data.gamecheckversion}`,
    method: 'GET',
    data: {
      type: data.type,
      format: data.format
    }
  }) as any

//活动版本检查
export const checkActivityVersion = (data: any): Promise<any> =>
  request({
    url: `/v1/vcapi/update_activity/${data.activityshortname}/${data.activityversion}/${data.activitycheckversion}`,
    method: 'GET',
    data: {
      type: data.type,
      format: data.format
    }
  }) as any

//分享/广告结果上报
export const schedulingReportApi = (data: any): Promise<any> =>
  request({
    url: '/v1/operationapi/scheduling_report',
    method: 'POST',
    data
  }) as any

//分享调度初始化
export const schedulingInitApi = (data: any): Promise<any> =>
  request({
    url: '/v1/operationapi/scheduling/init',
    method: 'POST',
    data
  }) as any

// 获取公共属性
export const getInitConf = (data: any): Promise<any> =>
  request({
    url: '/v1/sdkconfig/init',
    method: 'POST',
    data
  }) as any

// 获取服务器时间（用于刷新 st_offset）
export const getServerTime = (data?: any): Promise<any> =>
  request({
    url: '/v1/sdkconfig/detection',
    method: 'POST',
    data: data || {}
  }) as any

// 获取公共属性
export const getPublicProps = (version: string): Promise<any> =>
  request({
    url: '/v1/sdkconfig/sync/event_attrs',
    method: 'GET',
    params: {
      version
    }
  }) as any

export const setcustomApi = (data: { custom: string }) =>
  request({
    url: '/v1/social/user/setcustom',
    method: 'POST',
    data
  })

export const addRelationApi = (data: any) =>
  request({
    url: '/v1/social/relation/add',
    method: 'POST',
    data
  })

export const deleteRelationApi = (data: any) =>
  request({
    url: '/v1/social/relation/delete',
    method: 'POST',
    data
  })

export const updateremarksApi = (data: any) =>
  request({
    url: '/v1/social/relation/updateremarks',
    method: 'POST',
    data
  })

export const hasrelationApi = (data: any) =>
  request({
    url: '/v1/social/relation/hasrelation',
    method: 'POST',
    data
  })

export const relationListApi = (data: any) =>
  request({
    url: '/v1/social/relation/list',
    method: 'POST',
    data
  })

export const addfriendApi = (data: any) =>
  request({
    url: '/v1/social/relation/addfriend',
    method: 'POST',
    data
  })

export const delfriendApi = (data: any) =>
  request({
    url: '/v1/social/relation/delfriend',
    method: 'POST',
    data
  })

export const updatefriendremarksApi = (data: any) =>
  request({
    url: '/v1/social/relation/updatefriendremarks',
    method: 'POST',
    data
  })

export const isfriendApi = (data: any) =>
  request({
    url: '/v1/social/relation/isfriend',
    method: 'POST',
    data
  })

export const friendsApi = () =>
  request({
    url: '/v1/social/relation/friends',
    method: 'POST'
  })

export const addscoreApi = (data: any) =>
  request({
    url: '/v1/social/rank/addscore',
    method: 'POST',
    data
  })

export const setscoreApi = (data: any) =>
  request({
    url: '/v1/social/rank/setscore',
    method: 'POST',
    data
  })

export const queryuserrankApi = (data: any) =>
  request({
    url: '/v1/social/rank/queryuserrank',
    method: 'POST',
    data
  })

export const getranklistApi = (data: any) =>
  request({
    url: '/v1/social/rank/getranklist',
    method: 'POST',
    data
  })

export const friendsrankApi = (data: any) =>
  request({
    url: '/v1/social/rank/friendsrank',
    method: 'POST',
    data
  })

export const opendataAesdecodeApi = (data: any) =>
  request({
    url: '/v1/social/wxrank/aesdecode',
    method: 'POST',
    data
  })

// 获取帮助中心首页信息
export const getMainlayoutApi = () =>
  request({
    url: '/v1/service/helpcenter/mainlayout',
    method: 'GET'
  })

// 获取帮助中心问题一级列表页
export const getListlayoutApi = (params: any) =>
  request({
    url: '/v1/service/helpcenter/listlayout',
    method: 'GET',
    params
  })

// 获取帮助中心问题详情
export const getInfolayoutApi = (params: any) =>
  request({
    url: '/v1/service/helpcenter/infolayout',
    method: 'GET',
    params
  })

// 设置帮助中心问题解决状态
export const postResolutionApi = (data: any) =>
  request({
    url: '/v1/service/helpcenter/resolution',
    method: 'POST',
    data
  })

// 获取窗口运营全部配置数据
export function getOperationSceneApi(): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/user_data_operation_platform/scene/all',
    method: 'POST',
    data: {}
  }) as any
}

// 游戏区服信息查询
export function getGameAreaApi(area_id: string): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_area',
    method: 'GET',
    params: {
      area_id
    }
  }) as any
}

// 游戏区服信息修改
export function putGameAreaApi(data: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_area',
    method: 'PUT',
    data
  }) as any
}

// 创建游戏区服
export function createGameAreaApi(data: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_area',
    method: 'POST',
    data
  }) as any
}

// 删除游戏区服
export function delGameAreaApi(data: string): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_area',
    method: 'DELETE',
    data
  }) as any
}

// 查询区服列表信息
export function getGameAreaListApi(): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_area/list',
    method: 'GET'
  }) as any
}

// 创建角色
export function createGameCharacterApi(data: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_character',
    method: 'POST',
    data
  }) as any
}

// 修改游戏角色信息
export function putGameCharacterApi(data: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_character',
    method: 'PUT',
    data
  }) as any
}

// 删除游戏角色
export function delGameCharacterApi(data: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_character',
    method: 'DELETE',
    data
  }) as any
}

// 查询账号下角色信息列表
export function getGameCharacterAccountApi(params: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_character/account',
    method: 'GET',
    params
  }) as any
}

// 查询账号下某个区服下的角色信息列表
export function getGameCharacterApi(params: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_character/account/area',
    method: 'GET',
    params
  }) as any
}

// 查询具体角色信息
export function getGameAccountAreaCharacterApi(params: any): Promise<any> {
  return request({
    url: '/v1/report/sdk/cp/game_character/account/area/character',
    method: 'GET',
    params
  }) as any
}

// 兑换道具
export function itemRedemptionApi(data: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/user_data_operation_platform/item_redemption',
    method: 'POST',
    data
  }) as any
}

export const postPayData = (url: string, data: any) =>
  request({
    method: 'POST',
    url: url,
    data
  })

// 邮件列表
export function getEmailListApi(data: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/rxmail/cpuser/list',
    method: 'POST',
    data
  }) as any
}

// 邮件详情
export function getEmailDetailApi(data: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/rxmail/cpuser/detail',
    method: 'POST',
    data
  }) as any
}

// 邮件领取
export function receiveEmailApi(data: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/rxmail/cpuser/receive',
    method: 'POST',
    data
  }) as any
}

// 邮件删除
export function delEmailApi(data: any): Promise<any> {
  return request({
    url: '/v1/operationtoolsapi/rxmail/cpuser/delete',
    method: 'POST',
    data
  }) as any
}

// 调用渠道接口(需要登录) 闪电玩
export function channelGatewayAuthApi(data: any): Promise<any> {
  return request({
    url: '/v1/thirdparty/api/channel_gateway_auth?channel=minigame_shandw&action=post_game_info_s',
    method: 'POST',
    data
  }) as any
}

// 调用渠道接口(需要登录) OPPO
export function channelGatewayAuthApiOppo(data: any): Promise<any> {
  return request({
    url: '/v1/thirdparty/api/channel_gateway_auth?channel=minigame_oppo&action=report',
    method: 'POST',
    data
  }) as any
}


//新版通用版本检查 v2
export const updateGameVersionApi = (data: any): Promise<any> =>
  request({
    url: `/v1/vcapi/update_module_version`,
    method: 'POST',
    data,
  }) as any

export function searchGameAccountApi() {
  return request({
    url: '/v1/report/sdk/cp_role',
    method: 'get'
  })
}

export const getTempNoticeApi = (product_id: string, channel_id: string): Promise<any> =>
  request({
    url: `/v1/vcapi/maintain/${product_id}/${channel_id}`,
    method: 'GET'
  }) as any

export const getH5LoginConfigApi = (product_id: string, channel_id: string): Promise<any> =>
  request({
    url: `/v1/vcapi/h5_login_config/${product_id}/${channel_id}`,
    method: 'GET'
  }) as any

export const tradeQueryApi = (order_no: string): Promise<any> =>
  request({
    url: `/v1/ke/sdk/trade_query`,
    method: 'GET',
    params: {
      order_no
    }
  }) as any

// gank 创角上报
export const unicornRegisterReportApi = (data: any) =>
  request({
    url: `/v1/thirdparty/unicorn/report`,
    method: 'POST',
    data
  })