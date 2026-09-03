// use for check params is valid

// import Schema, { Rule, RuleItem, Rules, Values } from 'async-validator';
import Schema, { Rule, RuleItem, Rules, Values } from '@/utils/async-validator';
import { isArray, isFunction, isNil, isObject } from '@/utils/is';
import { COMMON_ERROR_CODE } from '@/config/const';
import { TypeOfValue } from './checkConfig';

export function checkParamsValid(rules:Rules,checkValue:{[key:string]:any}):Promise<Values>{
    const checkSchema = new Schema(rules)
    return checkSchema.validate(checkValue)
}

export function invalidInitParams(params: {[key:string]: any}, rules: Rules) {
  const entries: [string, Rule][] = Object.entries(rules)
  for(const [key, rule] of entries) {
    if(isArray(rule)){
      rule.forEach(ruleItem => checkRule(ruleItem, params[key], key))
    } else {
      checkRule(rule, params[key], key)
    }
  }

  /**
   * 查找规则中的字段
   * 如果字段是必传的，看parmas中是否传, 传了校验类型是否正确, 校验是否有validaror，有执行
   * 如果不是必传的，看params中传的类型是否正确, 校验是否有validaror，有执行
   */
  function checkRule(rule: RuleItem, value: any, key: string) {

    if (rule?.required) {
      if (isNil(value)) {
        throw Error(`${key} is required`)
      }
    }

    if (rule?.type && typeof value !== rule?.type) throw Error(`${key} is not a ${rule.type}`)

    if (rule?.validator) {
      // const res = rule.validator(rule, value, () => {}, {}, {})
      const res = rule.validator(rule, value, {})

      if(res === true) return

      throw res
    }
  }
}

export function ThrowError(errors: any, isJoin?: Boolean) {
  let str = ''
  if (isArray(errors)) {
    errors.forEach((o: any) => {
      if (isJoin) {
        str += `${o.message}; \n`
      } else {
        console.error(o.message)
      }
    })
  }
  console.log(str)
  if (isJoin) {
    return str
  }
}

export function pubCheck(paramsCheck: any, callback: IMethodParams, params: any) {
  // console.log('pubCheck rules: ', paramsCheck)
  return new Promise((resolve, reject) => {
    if (!isObject(callback) || !callback.hasOwnProperty('complete')) {
      console.error('callback must be Object and had complete property')
      // reject()
      return
    }

    if (!isFunction(callback.complete)) {
      console.error(`callback complete property must be function type but got ${TypeOfValue(callback.complete)}`)
      return
    }

    checkParamsValid(paramsCheck, params)
      .then(() => {
        console.log('sdk 参数检查通过')
        //passed check
        resolve(1)
      })
      .catch(({ errors }) => {
        console.error('sdk 参数检查报错：', errors)
        //params is invalid callback to cp
        callback?.complete({
          code: COMMON_ERROR_CODE.PARAMS_ERROR,
          data: null,
          errorMsg: ThrowError(errors, true),
        })
      })
  })
}
