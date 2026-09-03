import { ExecuteValidator } from '../interface'
import rules from '../rule'

const required: ExecuteValidator = (rule, value, source) => {
  const errors: string[] = []
  const type = Array.isArray(value) ? 'array' : typeof value
  rules.required(rule, value, source, errors, type)
  return errors
}

export default required
