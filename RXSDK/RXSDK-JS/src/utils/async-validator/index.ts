import {
  InternalRuleItem,
  RuleItem,
  RuleValuePackage,
  Rules,
  ValidateError,
  Values,
} from './interface'
import { AsyncValidationError } from './utils'
import validators from './validator/index'

export * from './interface'

class Schema {
  static validators = validators

  rules: Record<string, RuleItem> = {}

  constructor(descriptor: Rules) {
    this.define(descriptor)
  }

  define(rules: Rules) {
    if (!rules) {
      throw new Error('Cannot configure a schema with no rules')
    }
    if (typeof rules !== 'object' || Array.isArray(rules)) {
      throw new Error('Rules must be an object')
    }

    this.rules = rules
  }

  validate(source: Values): Promise<Values> {
    if (!this.rules || Object.keys(this.rules).length === 0) {
      return Promise.resolve(source)
    }

    const series: Record<string, RuleValuePackage> = {}
    const keys = Object.keys(this.rules)
    let total = 0
    const length = keys.length
    let results: ValidateError[] = []

    keys.forEach((z) => {
      let rule: InternalRuleItem = this.rules[z]
      let value = source[z]
      rule = { ...rule }

      rule.validator = this.getValidationMethod(rule)
      if (!rule.validator) {
        return
      }

      rule.field = z
      rule.type = this.getType(rule)
      series[z] = {
        ...series[z],
        rule,
        value,
        source,
        field: z,
      }
    })
    // console.log('series: ', series)

    return new Promise((resolve, reject) => {
      keys.forEach((key) => {
        let res: any
        const data = series[key]
        const rule = data.rule

        function cb(e: any = []) {
          total++
          let errorList = Array.isArray(e) ? e : [e]
          // console.log('cb:', total, data, errorList)

          results = results.concat(
            errorList.map((error) => {
              return {
                message: error,
                field: data.field,
                fieldValue: data.value,
              }
            })
          )

          if (total === length) {
            console.log('validate finished: ', results, source)
            return results.length ? reject(new AsyncValidationError(results)) : resolve(source)
          }
        }

        if (rule.asyncValidator) {
          res = rule.asyncValidator(rule, data.value, data.source)
        } else if (rule.validator) {
          try {
            res = rule.validator(rule, data.value, data.source)
          } catch (error) {
            console.error?.('validator error:', error)
            throw error
          }
          if (res === true) {
            cb()
          } else if (res === false) {
            cb(`${rule.field} fails`)
          } else if (res instanceof Array) {
            cb(res)
          } else if (res instanceof Error) {
            cb(res.message)
          }
        }
        if (res && (res as Promise<void>).then) {
          ;(res as Promise<void>).then(
            () => cb(),
            (e) => cb(e)
          )
        }
      })
    })
  }

  getType(rule: InternalRuleItem) {
    if (
      typeof rule.validator !== 'function' &&
      rule.type &&
      !validators.hasOwnProperty(rule.type)
    ) {
      throw new Error(`Unknown rule type ${rule.type}`)
    }
    return rule.type || 'string'
  }

  getValidationMethod(rule: InternalRuleItem) {
    if (typeof rule.validator === 'function') {
      return rule.validator
    }
    const keys = Object.keys(rule)

    if (keys.length === 1 && keys[0] === 'required') {
      return validators.required
    }
    // @ts-ignore
    return validators[this.getType(rule)] || undefined
  }
}

export default Schema
