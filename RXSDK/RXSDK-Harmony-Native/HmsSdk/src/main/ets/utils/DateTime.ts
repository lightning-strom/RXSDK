class DateTime {
  //yyMMddHHmmssSSS
  getFormattedDate(currentDate = new Date()): string {
    return this.getFormatDate("yyMMddHHmmssSSS", currentDate)
  }

  public getFormatDate(format: string, date: Date = new Date()): string {
    const map: { [key: string]: string } = {
      'yyyy': date.getFullYear().toString(),
      'yy': (date.getFullYear() % 100).toString().padStart(2, '0'), // 两位年份
      'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
      'dd': date.getDate().toString().padStart(2, '0'),
      'HH': date.getHours().toString().padStart(2, '0'),
      'mm': date.getMinutes().toString().padStart(2, '0'),
      'ss': date.getSeconds().toString().padStart(2, '0'),
      'SSS': date.getMilliseconds().toString().padStart(3, '0'), // 毫秒，补足为3位
    };

    return format.replace(/yyyy|yy|MM|dd|HH|mm|ss|SSS/g, (match) => map[match]);
  }

  get currentTimeSecond() {
    //四舍五入到最接近的整数
    return Math.round(Date.now() / 1000)
  }

  //Day, DD Mon YYYY HH:MM:SS GMT , Tue, 18 Dec 2024 09:30:45 GMT
  getUTCString(date: Date = new Date()) {
    return date.toUTCString()
  }

  // 获取当前时间戳（秒或毫秒），默认为秒级时间戳
  public getTimestamp(inMilliseconds: boolean = false, date: Date = new Date()): number {
    const timestamp = date.getTime(); // 获取毫秒级时间戳
    return inMilliseconds ? timestamp : Math.floor(timestamp / 1000); // 根据 inMilliseconds 参数返回秒级或毫秒级时间戳
  }

  // 将时间戳转为日期格式，自动判断是秒级还是毫秒级
  public timestampToDate(timestamp: number): Date {
    // 判断时间戳长度，如果长度为13位，则认为是毫秒级时间戳，否则是秒级
    if (timestamp.toString().length === 13) {
      return new Date(timestamp); // 毫秒级时间戳直接转换
    } else {
      return new Date(timestamp * 1000); // 秒级时间戳转换为毫秒
    }
  }

  // 获取当前时区的十进制小时数（偏移量，精确到小数点后两位）
  public getTimezoneDecimal(): string {
    return (-new Date().getTimezoneOffset() / 60).toFixed(2);
  }

  // 获取当前时区的字符串表示形式，例如 "+08:00" 或 "-05:00"
  public getTimezoneString(): string {
    let offset = -new Date().getTimezoneOffset();
    return (offset > 0 ? "+" : "-") + ("00" + (Math.floor(offset / 60))).substr(-2) + ":" + ("00" + (offset % 60)).substr(-2);
  }

  // 获取当前时间的 RFC 3339 格式（ISO 8601），根据 rpz 参数决定是否替换时区
  getRFC3339(rpz: boolean = true): string {
    let str = new Date().toISOString()
    // new RegExp()
    return rpz ? str.replace('/Z/', this.getTimezoneString()) : str;
  }
}

export default new DateTime()