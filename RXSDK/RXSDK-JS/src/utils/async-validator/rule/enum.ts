import { ExecuteRule } from '../interface'
import { format } from '../utils'
import { messages } from '../messages'

const ENUM = 'enum' as const;

const enumerable: ExecuteRule = (rule, value, source, errors) => {
  rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : []
  if (rule[ENUM]?.indexOf(value) === -1) {
    errors.push(format(messages[ENUM], rule?.field, rule[ENUM]?.join(', ')))
  }
}

export default enumerable
