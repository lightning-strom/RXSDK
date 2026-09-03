import { InternalRuleItem, Rules } from '@/utils/async-validator'
import { forEach, isArray, isObject } from 'lodash-es'

function TypeOfValue(value: any) {
  let type = Object.prototype.toString.call(value)
  return type.substring(8, type.length - 1).toLowerCase()
}

export const initParamsCheck: Rules = {
  productId: {
    type: 'string',
    required: true
  },
  channelId: {
    type: 'string',
    required: true
  },
  cpid: {
    type: 'string',
    required: true
  },
  baseUrlList: {
    asyncValidator: (rule: InternalRuleItem, value: any) => {
      return new Promise((resolve, reject) => {
        if (isArray(value)) {
          if (value.length == 0) {
            reject(` params can not an empty Array`)
          } else {
            resolve()
          }
        } else {
          reject(` params Expecting string[],but got ${TypeOfValue(value)}`)
        }
      })
    }
  }
}

export const H5UCLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_uc']
  },
  login_openid: {
    type: 'string'
  }
}

export const checkTrackParams: Rules = {
  event: {
    type: 'string',
    required: true
  },
  properties: {
    type: 'object'
  }
}

export function ThrowError(errors: any, isJoin?: Boolean) {
  let str = ''
  if (isArray(errors)) {
    forEach(errors, (o: any) => {
      if (isJoin) {
        str += `${o.message}; \n`
      } else {
        console.error(o.message)
      }
    })
  }
  if (isJoin) {
    return str
  }
}

export const compensateOrderCheckParams: Rules = {
  notify_url: {
    type: 'string'
  },
  wx_openid: {
    type: 'string',
    required: true
  },
  order_no: {
    type: 'string',
    required: true
  },
  amount: {
    type: 'number',
    required: true
  },
  env: {
    type: 'enum',
    enum: [0, 1]
  },
  zone_id: {
    type: 'string',
    required: true
  },
  pf: {
    type: 'enum',
    required: true,
    enum: ['android']
  }
}

export const shareScheduleInitParams: Rules = {
  funcs: {
    type: 'array'
  }
}

export const shareScheduleReportParams: Rules = {
  func: {
    type: 'string',
    required: true
  },
  scheduling_type: {
    type: 'enum',
    enum: ['share', 'ad'],
    required: true
  },
  scheduling_event: {
    type: 'boolean',
    required: true
  },
  properties: {
    type: 'object'
  }
}

export const checkIReqBusinessData: Rules = {
  window_key: {
    type: 'string',
    required: true
  },
  event: {
    type: 'string',
    required: true
  },
  before_event: {
    type: 'string'
  }
}

export const checkIReqBusinessOrder: Rules = {
  trade_no: {
    type: 'string',
    required: true
  },
  sign: {
    type: 'string',
    required: true
  }
}

const H5PayCheckParams: Rules = {
  goods_tag: {
    type: 'string',
    required: true
  },
  age: {
    type: 'number'
  },
  trade_no: {
    type: 'string',
    required: true
  },
  is_debug: {
    type: 'enum',
    enum: [0, 1]
  },
  indulge_auth: {
    type: 'enum',
    enum: [0, 1]
  },
  env: {
    type: 'enum',
    enum: [0, 1]
  }
}

export const H5UCPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_uc']
  },
  ...H5PayCheckParams
}

export const H54399PayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_4399h5']
  },
  ...H5PayCheckParams
}

export const H5QunheiPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_qunhei']
  },
  ...H5PayCheckParams
}

export const H5XunleiPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_xunlei']
  },
  ...H5PayCheckParams
}

export const H5VngPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_vng']
  },
  ...H5PayCheckParams
}

export const H5QuickPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_quick']
  },
  ...H5PayCheckParams
}
export const H5GankPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['unicornh5']
  },
  ...H5PayCheckParams
}

export const H5QiqiPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_77']
  },
  ...H5PayCheckParams
}

export const H5GametokPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['gametokh5']
  },
  ...H5PayCheckParams
}

export const H5AwyPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_aiweiyou']
  },
  ...H5PayCheckParams
}

export const H5SimoPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_007']
  },
  server_id: {
    type: 'string',
    required: true
  },
  server_name: {
    type: 'string',
    required: true
  },
  role_id: {
    type: 'string',
    required: true
  },
  role_name: {
    type: 'string',
    required: true
  },
  role_level: {
    type: 'number',
    required: true
  },
  ...H5PayCheckParams
}

export const H5ZuiyouPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_zuiyou']
  },
  ...H5PayCheckParams
}

export const H5HaluoPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_haluo']
  },
  ...H5PayCheckParams
}

export const H5LenovoPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_lenovo']
  },
  ...H5PayCheckParams
}


export const H5BaiduPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_baiduh5']
  },
  ...H5PayCheckParams
}

export const H5NewBaiduPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['baiduh5']
  },
  ...H5PayCheckParams
}

export const H5IQiYiPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_iqiyi']
  },
  ...H5PayCheckParams
}

export const H5RemianPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['remianh5']
  },
  ...H5PayCheckParams
}

export const H5TestPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['h5_test']
  },
  ...H5PayCheckParams
}

export const H5ShandwPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_shandw']
  },
  ...H5PayCheckParams
}

export const H5ShareCheckParams: Rules = {
  func: {
    type: 'string',
    required: true
  }
}
