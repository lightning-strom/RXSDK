export const SDK_NAME = 'ChannelSDK'
export const ERROR_CODE = 1000000
export const MODAL_TITLE = '温馨提示'

export const AD_ERROR_MAP: { [key: number]: string } = {
  1000: '后端接口调用失败',
  1001: '参数错误',
  1002: '广告单元无效',
  1003: '内部错误',
  1004: '无合适的广告',
  1005: '广告组件审核中',
  1006: '广告组件被驳回',
  1007: '广告组件被封禁',
  1008: '广告单元已关闭',
}

/**
 * https://nctpoatgf0.feishu.cn/docx/WnVFdpQGcohpiLxd94zcDS9unfh
 */
export const COMMON_ERROR_CODE = {
  UNKNOW_NETWORK_ERROR: 1000,
  TIMEOUT: 1131,
  REQUEST_ABORTED: 1132,
  NETWORK_ERROR: 1100,
  NOT_FOUND: 1401,
  INTERNAL_SERVER_ERROR: 1500,
  PARAMS_ERROR: 2000,
  INIT_PARAMS_ERROR: 2001,
  API_NOT_EXIST: 2002,
  PAY_PARAMS_ERROR: 4000,
  SHARE_CANCEL: 5001,
  SHARE_TRIGGER_OVERTIME: 5003,
  USER_INFO_AUTH_DENY: 6003,
  LOCATION_FAIL: 6020,
  LOCATION_AUTH_DENY: 6021,
  FRIENDINTERACTION_AUTH_DENY: 6022,
  GAMECLUBDATA_AUTH_DENY: 6023,
  ADD_SHORT_CUT: 7000,
  AD_LOAD_OVERTIME: 10000,
  CANCEL_PAY: 4001,
  PAY_ERROR: 4002,
  UNKNOWN_PAY_ERROR: 4003,
  CANCEL_JUMP_MINIGAME: 4004,
  PAY_GIFT_FINISH: 4005,
  PAY_TYPE_ERROR: 4300,
  LOGIN_FAIL: 3002,
  LOGIN_DENY: 3001,
  UNKNOWN: 9000
}

export const COMMON_ERROR_CODE_MAP = {
  UNKNOW_NETWORK_ERROR: '未知网络错误',
}

export const MATERIAL_TYPE = {
  CARD: 'card', // 小卡片
  POSTER: 'poster', // 海报
}

export const TM_TYPE = {
  CLIENT: 1, // 客户端上报
  SERVER: 0, // 服务端上报
}