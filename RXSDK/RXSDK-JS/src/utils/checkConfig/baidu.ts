import { InternalRuleItem, Rules } from '@/utils/async-validator'
import { forEach, isArray, isFunction, isObject } from 'lodash-es'
import { checkParamsValid } from '../paramsValid'
function TypeOfValue(value: any) {
  let type = Object.prototype.toString.call(value)
  return type.substring(8, type.length - 1).toLowerCase()
}

export const PubCallBack = {
  complete: {
    require: true,
    asyncValidator: (rule: InternalRuleItem, value: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (isFunction(value)) {
          resolve(1)
        } else {
          reject(`callback complete property must be function type but got ${TypeOfValue(value)}`)
        }
      })
    },
  },
}

export const baiduPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    required: true,
    enum: ['minigame_baidu']
  },
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

export const initParamsCheck: Rules = {
  productId: {
    type: 'string',
    required: true,
  },
  channelId: {
    type: 'string',
    required: true,
  },
  cpid: {
    type: 'string',
    required: true,
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
    },
  },
}

export const baiduLoginParamsCheck: Rules = {
  method: {
    type: 'enum',
    enum: ['minigame_baidu'],
  },
  login_openid:{
    type:'string'
  }
}

export const checkTrackParams:Rules = {
  event:{
    type:'string',
    required:true
  },
  properties:{
    type:'object'
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

export const baiduShareScheduleInitParams: Rules = {
  funcs: {
    type: 'array'
  }
}

export const baiduShareScheduleReportParams: Rules = {
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

export function pubCheck(paramsCheck: any, callback: IMethodParams, params: any) {
  return new Promise((resolve, reject) => {
    if (!isObject(callback) || !callback.hasOwnProperty('complete')) {
      console.error('callback must be Object and had complete property')
      reject()
      return
    }
    checkParamsValid(PubCallBack, callback)
      .then(() => {
        checkParamsValid(paramsCheck, params)
          .then(() => {
            //passed check
            resolve(1)
          })
          .catch(({ errors }) => {
            console.log(errors)
            //params is invalid callback to cp
            callback?.complete({ code: -1, data: null, errorMsg: ThrowError(errors, true) })
          })
      })
      .catch(({ errors }) => {
        //callback is not function or struct passed is wrong
        ThrowError(errors)
      })
  })
}
