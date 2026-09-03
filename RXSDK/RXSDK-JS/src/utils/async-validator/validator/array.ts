import { ExecuteValidator } from '../interface'
import rules from '../rule'

const array: ExecuteValidator = (rule, value, source) => {
  const errors: string[] = []
  const validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field!))
  if (validate) {
    // 值为null/undefined 并且 不是必填 直接返回
    if ((value === undefined || value === null) && !rule.required) {
      return true
    }
    // 是必填 检验required
    rules.required(rule, value, source, errors, 'array')
    // 不是必填，但是值不为空，校验类型
    if (value !== undefined && value !== null) {
      rules.type(rule, value, source, errors)
    }
  }
  // console.log('string: ', errors)
  return errors
}

export default array
