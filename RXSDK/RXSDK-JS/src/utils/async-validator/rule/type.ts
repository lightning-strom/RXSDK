import { ExecuteRule, Value } from '../interface'
import { messages } from '../messages'
import { format } from '../utils'
import required from './required'


const pattern = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
};

const types: any = {
  array(value: Value) {
    return Array.isArray(value)
  },
  number(value: Value) {
    if (isNaN(value)) {
      return false
    }
    return typeof value === 'number'
  },
  object(value: Value) {
    return typeof value === 'object' && !types.array(value)
  },
  method(value: Value) {
    return typeof value === 'function'
  },
  email(value: Value) {
    return (
      typeof value === 'string' &&
      value.length <= 320 &&
      !!value.match(pattern.email)
    );
  },
}

const type: ExecuteRule = (rule, value, source, errors) => {
  if (rule.required && value === undefined) {
    required(rule, value, source, errors)
    return
  }
  const custom = [
    'array',
    'object',
    'method',
    'email',
    'number',
  ]

  const ruleType = rule.type as string
  if (custom.indexOf(ruleType) > -1) {
    if (!types[ruleType](value)) {
      errors.push(format(messages.types[ruleType], rule.field, rule.type))
    }
    // straight typeof check
  } else if (ruleType && typeof value !== rule.type) {
    errors.push(format(messages.types[ruleType], rule.field, rule.type))
  }
}

export default type
