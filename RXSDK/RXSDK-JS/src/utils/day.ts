// var padStart = function padStart(string: string | number, length: number, pad: string) {
//   var s = String(string)
//   if (!s || s.length >= length) return string
//   return '' + Array(length + 1 - s.length).join(pad) + string
// }

function utcOffset(data: Date) {
  // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
  // https://github.com/moment/moment/pull/1871
  return -Math.round(data.getTimezoneOffset() / 15) * 15
}

const padZoneStr = (data: Date) => {
  const negMinutes = -utcOffset(data)
  const minutes = Math.abs(negMinutes)
  const hourOffset = Math.floor(minutes / 60)
  const minuteOffset = minutes % 60
  // console.log(1111, negMinutes)
  return `${negMinutes <= 0 ? '+' : '-'}${String(hourOffset).padStart(2, '0')}:${String(minuteOffset).padStart(2, '0')}`
}

export function formatDate(format: string, data: Date = new Date()) {
  const $Y = String(data.getFullYear())
  const $M = String(data.getMonth() + 1)
  const $D = String(data.getDate())
  const $H = String(data.getHours())
  const $m = String(data.getMinutes())
  const $s = String(data.getSeconds())
  const $ms = String(data.getMilliseconds())
  const zoneStr = padZoneStr(data)
  let matchs: any = {
    YY: $Y.slice(-2),
    YYYY: $Y,
    M: $M,
    MM: $M.padStart(2, '0'),
    D: $D,
    DD: $D.padStart(2, '0'),
    H: $H,
    HH: $H.padStart(2, '0'),
    m: $m,
    mm: $m.padStart(2, '0'),
    s: $s,
    ss: $s.padStart(2, '0'),
    SSS: $ms.padStart(3, '0'),
    Z: zoneStr,
  }

  return format.replace(/Y{1,4}|M{1,4}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|S{3}|Z{1}/g, (match) => {
    return matchs[match]
  })
}

// export function localISOTime() {
//   // 当前时间
//   const date = new Date()
//   const time = date.getTime()
//   // 与格林威治时时差,并转换为毫秒
//   const offset = date.getTimezoneOffset() * 60 * 1000 // => 假设当前时区时区为东八区，-480 因为格林尼治时间比本地时间小8h
//   //算出对应的格林尼治时间
//   // const GMTDate = time + offset
//   return new Date(time - offset).toISOString()
// }
