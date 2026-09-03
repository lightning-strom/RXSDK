"use strict";
// var padStart = function padStart(string: string | number, length: number, pad: string) {
//   var s = String(string)
//   if (!s || s.length >= length) return string
//   return '' + Array(length + 1 - s.length).join(pad) + string
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
function utcOffset(data) {
    // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
    // https://github.com/moment/moment/pull/1871
    return -Math.round(data.getTimezoneOffset() / 15) * 15;
}
var padZoneStr = function (data) {
    var negMinutes = -utcOffset(data);
    var minutes = Math.abs(negMinutes);
    var hourOffset = Math.floor(minutes / 60);
    var minuteOffset = minutes % 60;
    // console.log(1111, negMinutes)
    return "".concat(negMinutes <= 0 ? '+' : '-').concat(String(hourOffset).padStart(2, '0'), ":").concat(String(minuteOffset).padStart(2, '0'));
};
function formatDate(format, data) {
    if (data === void 0) { data = new Date(); }
    var $Y = String(data.getFullYear());
    var $M = String(data.getMonth() + 1);
    var $D = String(data.getDate());
    var $H = String(data.getHours());
    var $m = String(data.getMinutes());
    var $s = String(data.getSeconds());
    var $ms = String(data.getMilliseconds());
    var zoneStr = padZoneStr(data);
    var matchs = {
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
    };
    return format.replace(/Y{1,4}|M{1,4}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|S{3}|Z{1}/g, function (match) {
        return matchs[match];
    });
}
exports.formatDate = formatDate;
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
//# sourceMappingURL=day.js.map