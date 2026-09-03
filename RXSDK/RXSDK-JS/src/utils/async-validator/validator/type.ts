import { ExecuteValidator } from '../interface';
import rules from '../rule';
import { isEmptyValue } from '../utils'

const type: ExecuteValidator = (rule, value, source) => {
  const ruleType = rule.type;
  const errors: string[] = [];
  const validate =
    rule.required || (!rule.required && source.hasOwnProperty(rule.field!));
  if (validate) {
    if (isEmptyValue(value, ruleType) && !rule.required) {
      return true
    }
    rules.required(rule, value, source, errors, ruleType);
    if (!isEmptyValue(value, ruleType)) {
      rules.type(rule, value, source, errors);
    }
  }
  return errors
};

export default type;
