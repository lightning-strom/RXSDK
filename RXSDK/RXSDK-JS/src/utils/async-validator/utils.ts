import { ValidateError } from './interface'

const formatRegExp = /%[sdj%]/g

export function format(template: ((...args: any[]) => string) | string, ...args: any[]): string {
  let i = 0
  if (typeof template === 'function') {
    return template.apply(null, args)
  }
  if (typeof template === 'string') {
    let str = template.replace(formatRegExp, (x) => {
      switch (x) {
        case '%s':
          return String(args[i++])
        default:
          return x
      }
    })
    return str
  }
  return template
}

export class AsyncValidationError extends Error {
  errors: ValidateError[]
  // fields: Record<string, ValidateError[]>

  constructor(errors: ValidateError[]) {
    super('Async Validation Error')
    this.errors = errors
    // this.fields = fields
  }
}

function isNativeStringType(type: string) {
  return type === 'string' || type === 'email'
}


export function isEmptyValue<T = unknown>(val: T, type?: string): val is T {
  if (val == null) {
    return true
  }

  if (type === 'array' && Array.isArray(val) && !val.length) {
    return true;
  }

  if (type && isNativeStringType(type) && typeof val === 'string' && !val) {
    return true
  }

  return false
}
