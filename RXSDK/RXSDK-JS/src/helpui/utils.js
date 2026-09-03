import { __env } from '../index.helpui.js'

export const wrapText = (text, fontSize, maxWidth) => {
  const canvas = __env.createCanvas()
  const context = canvas.getContext('2d')

  const lines = []
  let line = ''

  const words = text.split('')
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const width = (context.measureText(word).width) * (fontSize / 10)
    const widthSoFar = context.measureText(line).width * (fontSize / 10)

    if (widthSoFar + width > maxWidth) {
      lines.push(line)
      line = ''
    }

    line += word
  }

  lines.push(line) // 添加最后一行
  return lines
}

export function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

export const splitData = (arr, len) => {
  const aLen = arr.length
  const result = []
  for (let i = 0; i < aLen; i += len) {
    result.push(arr.slice(i, i + len))
  }

  return result.length > 0 ? result : [[]]
}

export function stripHTMLTags(html) {
  // 使用正则表达式匹配所有 HTML 标签并替换为空字符串
  return html.replace(/<[^>]*>/g, '')
}
