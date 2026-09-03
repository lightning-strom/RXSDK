// import { InternalRuleItem, Rules } from 'async-validator'
import { InternalRuleItem, Rules } from '@/utils/async-validator'

export const wegameLoginParamsCheck: Rules = {
  desc: {
    type: 'string',
  },
  version: {
    required: true,
    asyncValidator: (rule: InternalRuleItem, value: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (value == 'base' || value == 'normal') {
          resolve(true)
        } else {
          reject(`Login function version params Expecting  base or normal ,but got ${value} `)
        }
      })
    },
  },
  method: {
    required: true,
    asyncValidator: (rule: InternalRuleItem, value: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (value == 'virtual' || value == 'minigame') {
          resolve(true)
        } else {
          reject(`Login function method params Expecting  virtual or minigame ,but got ${value} `)
        }
      })
    },
  },
  login_openid: {
    type: 'string',
  },
  sign_fields: {
    type: 'array',
  },
  reconnect_login: {
    type: 'boolean',
  }
}
export const wegameShareCheckParams: Rules = {
  func: {
    type: 'string',
    required: true,
  },
}
export const compensateOrderCheckParams: Rules = {
  notify_url: {
    type: 'string',
  },
  wx_openid: {
    type: 'string',
    required: true,
  },
  order_no: {
    type: 'string',
    required: true,
  },
  amount: {
    type: 'number',
    required: true,
  },
  env: {
    type: 'enum',
    enum: [0, 1],
  },
  zone_id: {
    type: 'string',
    required: true,
  },
  pf: {
    type: 'enum',
    required: true,
    enum: ['android'],
  },
}
export const ReportLoactionCheckParams: Rules = {
  types: {
    type: 'array',
    required: true,
  },
  reportSpace: {
    //上报的时间间隔
    type: 'number',
    required: true,
  },
}
export const DeleteLoactionCheckParams2: Rules = {
  types: {
    type: 'array',
    required: true,
  },
}
export const getNearlyRediusCheckParams: Rules = {
  radius: {
    type: 'number',
    required: true,
  }, //限定半径距离，单位：米
  count: {
    type: 'number',
    required: true,
  }, //获取数量，0表示获取全部
  page: {
    type: 'number',
    required: true,
  }, //获取第几页的数据 从1开始
  page_size: {
    type: 'number',
    required: true,
  }, //每页数量
  type: {
    type: 'string',
    required: true,
  }, //坐标分组，由 CP 自定义
  lon: {
    type: 'number',
  }, //WGS84 经度
  lat: {
    type: 'number',
  }, //WGS84 纬度
}

export const msgSecCheck: Rules = {
  content: {
    type: 'string',
    required: true,
  },
  scene: {
    type: 'enum',
    required: true,
    enum: [1, 2, 3, 4],
  },
  title: {
    type: 'string',
  },
  nickname: {
    type: 'string',
  },
  signature: {
    type: 'string',
  },
}

export const mediaCheckAsyncCheck: Rules = {
  urls: {
    type: 'array',
    required: true,
  },
  scenes: {
    type: 'array',
    required: true,
  },
}

export const wegamePayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame', 'minigame_friend', 'wxpub', 'minigame_v2', 'midas_game_item', 'aums', 'jump_miniprogram', 'wechath5', 'minigame_meituan', 'midas_payment_game_item'],
  },
  goods_tag: {
    type: 'string',
    required: true,
  },
  trade_no: {
    type: 'string',
    required: true,
  },
  is_debug: {
    type: 'enum',
    enum: [0, 1],
  },
  mode: {
    type: 'enum',
    enum: ['coins', 'goods'],
  },
  indulge_auth: {
    type: 'enum',
    enum: [0, 1],
  },
  env: {
    type: 'enum',
    enum: [0, 1],
  },
  callback_from: {
    type: 'enum',
    enum: [0, 1],
  },
  notify_url: {
    type: 'string',
  },
  noreply: {
    type: 'boolean',
  },
  ext: {
    type: 'object',
  },
  sessionFromExt: {
    type: 'object',
  },
}

