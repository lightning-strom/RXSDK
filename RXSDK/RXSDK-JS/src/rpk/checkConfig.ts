import { InternalRuleItem, Rules } from '@/utils/async-validator'
import { forEach, isArray, isNumber, isObject, isString } from 'lodash-es'

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

const PayCheckParams: Rules = {
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

export const alipayPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_alipay', 'minigame_alipay_virtual']
  },
  ...PayCheckParams
}

export const taobaoPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_taobao']
  },
  ...PayCheckParams
}

export const ksPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_kuaishou']
  },
  ...PayCheckParams
}

export const bilibiliPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_bilibili']
  },
  ...PayCheckParams
}

export const mgtvPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_mgtv']
  },
  ...PayCheckParams
}

export const baiduPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_baidu']
  },
  ...PayCheckParams
}

export const jdPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_jd']
  },
  ...PayCheckParams
}

export const douyinPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['douyinh5']
  },
  ...PayCheckParams
}

export const haoyoukuaibaoPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_haoyou']
  },
  ...PayCheckParams
}

export const douyinServiceCheckParams: Rules = {
  type: {
    required: true,
    type: 'enum',
    enum: ['image', 'text']
  },
  style: {
    required: true,
    asyncValidator: (rule: InternalRuleItem, value: any) => {
      return new Promise((resolve, reject) => {
        let arrNumber = ['left', 'top', 'width', 'height', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight']
        let arrString = ['backgroundColor', 'borderColor', 'textAlign', 'textColor']
        if (isObject(value)) {
          for (let key in value) {
            let item = (value as any)[key]
            if (arrNumber.includes(key)) {
              if (!isNumber(item)) {
                reject(`params ${key} Expecting number,but got ${TypeOfValue(item)}`)
              }
            }
            if (arrString.includes(key)) {
              if (!isString(item)) {
                reject(`params ${key} Expecting string,but got ${TypeOfValue(item)}`)
              }
            }
          }
          resolve()
        } else {
          reject(`params Expecting Object,but got ${TypeOfValue(value)}`)
        }
      })
    }
  }
}

export const alipayLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_alipay']
  },
  login_openid: {
    type: 'string'
  }
}

export const taobaoLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_taobao']
  },
  login_openid: {
    type: 'string'
  }
}

export const ksLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_kuaishou']
  },
  login_openid: {
    type: 'string'
  }
}

export const bilibiliLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_bilibili']
  },
  login_openid: {
    type: 'string'
  }
}

export const mgtvLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_mgtv']
  },
  login_openid: {
    type: 'string'
  }
}

export const baiduLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_baidu']
  },
  login_openid: {
    type: 'string'
  }
}

export const baiduUserInfoCheckParams: Rules = {
  type: {
    required: true,
    type: 'enum',
    enum: ['image', 'text']
  },
  style: {
    required: true,
    asyncValidator: (rule: InternalRuleItem, value: any) => {
      return new Promise((resolve, reject) => {
        let arrNumber = ['left', 'top', 'width', 'height', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight']
        let arrString = ['backgroundColor', 'borderColor', 'textAlign', 'textColor']
        if (isObject(value)) {
          for (let key in value) {
            let item = (value as any)[key]
            if (arrNumber.includes(key)) {
              if (!isNumber(item)) {
                reject(`params ${key} Expecting number,but got ${TypeOfValue(item)}`)
              }
            }
            if (arrString.includes(key)) {
              if (!isString(item)) {
                reject(`params ${key} Expecting string,but got ${TypeOfValue(item)}`)
              }
            }
          }
          resolve()
        } else {
          reject(`params Expecting Object,but got ${TypeOfValue(value)}`)
        }
      })
    }
  }
}

export const jdLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_jd']
  },
  login_openid: {
    type: 'string'
  }
}

export const jdUserInfoCheckParams: Rules = {
  type: {
    required: true,
    type: 'enum',
    enum: ['image', 'text']
  },
  style: {
    required: true,
    asyncValidator: (rule: InternalRuleItem, value: any) => {
      return new Promise((resolve, reject) => {
        let arrNumber = ['left', 'top', 'width', 'height', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight']
        let arrString = ['backgroundColor', 'borderColor', 'textAlign', 'textColor']
        if (isObject(value)) {
          for (let key in value) {
            let item = (value as any)[key]
            if (arrNumber.includes(key)) {
              if (!isNumber(item)) {
                reject(`params ${key} Expecting number,but got ${TypeOfValue(item)}`)
              }
            }
            if (arrString.includes(key)) {
              if (!isString(item)) {
                reject(`params ${key} Expecting string,but got ${TypeOfValue(item)}`)
              }
            }
          }
          resolve()
        } else {
          reject(`params Expecting Object,but got ${TypeOfValue(value)}`)
        }
      })
    }
  }
}

export const douyinLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['douyinh5']
  },
  login_openid: {
    type: 'string'
  }
}

export const haoyoukuaibaoLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_haoyou']
  },
  login_openid: {
    type: 'string'
  }
}


export const ShareCheckParams: Rules = {
  func: {
    type: 'string',
    required: true
  }
}
