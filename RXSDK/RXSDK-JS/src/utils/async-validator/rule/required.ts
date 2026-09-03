import { ExecuteRule } from '../interface'
import { format, isEmptyValue } from '../utils'
import { messages } from '../messages'

const required: ExecuteRule = (rule, value, source, errors, type) => {
  if (
    rule.required &&
    (!source.hasOwnProperty(rule?.field!) ||
      isEmptyValue(value, type || rule.type))
  ) {
    errors.push(format(messages.required, rule?.field))
  }
}

export default required
