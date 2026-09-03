// 递归筛选出符合condition函数条件的数据 并扁平化
export function filterDeep<T extends { children?: T[] } = any>(
  source: T[],
  condition: (a: T) => boolean
) {
  const result: T[] = []
  source.forEach((item) => {
    if (condition(item)) {
      result.push(item)
    }
    if (Array.isArray(item.children)) {
      const resultChildren = filterDeep(item.children, condition)
      result.push(...resultChildren)
    }
  })
  return result
}

// 递归依次用元素调用处理函数fn
export function processDeep<T = any>(source: T[], fn: (a: T) => T, childrenKey = 'children') {
  source.forEach((item, index) => {
    source[index] = fn(item)
    if (Array.isArray(item[childrenKey as never])) {
      processDeep(item[childrenKey as never], fn, childrenKey)
    }
  })

  return source
}
