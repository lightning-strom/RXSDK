// import { InternalRuleItem, Rules } from 'async-validator'
import { InternalRuleItem, Rules } from '@/utils/async-validator'
import { isNumber ,isString} from 'lodash-es'
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

export const douyinLoginParamsCheck: Rules = {
  force: {
    required:true,
    type: 'boolean',
  },
  method: {
    type: 'enum',
    enum: ['douyinh5'],
  },
  login_openid:{
    type:'string'
  }
}

export const douyinPayCheckParams: Rules = {
  pay_type: {
    type: 'enum',
    enum: ['douyinh5'],
  },
  goods_tag: {
    type: 'string',
    required: true,
  },
  trade_no: {
    type: 'string',
    required: true,
  },
  notify_url: {
    type: 'string',
    required: true,
  },
  indulge_auth:{
    type: 'enum',
    enum: [0 | 1],
  },
  transmit_args: {
    type: 'string',
  },
  is_debug: {
    type: 'enum',
    enum: [0 | 1],
  },
  env: {
    type: 'enum',
    enum: [0 | 1],
  },
  callback_from: {
    type: 'enum',
    enum: [0 | 1],
  },
  ext: {
    type: 'object',
  },
}
export const serviceCheckParams: Rules = {
  type:{
    required:true,
    type:'enum',
    enum:["image","text"]
  },
  style:{
    required:true,
    asyncValidator: (rule: InternalRuleItem, value: any) => {
      return new Promise((resolve, reject) => {
        let arrNumber = ['left','top','width','height','borderWidth','borderRadius','fontSize','lineHeight']
        let arrString = ['backgroundColor','borderColor','textAlign','textColor']
        if(isObject(value)){
          for(let key in value){
            let item = (value as any)[key]
            if(arrNumber.includes(key)){
              if(!isNumber(item)){
                reject(`params ${key} Expecting number,but got ${TypeOfValue(item)}`)
              }
            }
            if(arrString.includes(key)){
              if(!isString(item)){
                reject(`params ${key} Expecting string,but got ${TypeOfValue(item)}`)
              }
            }
          }
          resolve()
        }else{
          reject(`params Expecting Object,but got ${TypeOfValue(value)}`)
        }
      })
    }

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
