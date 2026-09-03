import { ExecuteValidator } from '../interface'
import rules from '../rule'
import { isEmptyValue } from '../utils'

const object: ExecuteValidator = (rule, value, source) => {
  // console.log('object rule: ', isEmptyValue(value))
  const errors: string[] = []
  const validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field!))
  if (validate) {
    // 值为空 并且 不是必填 直接返回
    if (isEmptyValue(value) && !rule.required) {
      return true
    }
    // 是必填 检验required
    rules.required(rule, value, source, errors)
    // 不是必填，但是值不为空，校验类型
    if (value !== undefined) {
      rules.type(rule, value, source, errors)
    }
  }
  return errors
}

export default object
