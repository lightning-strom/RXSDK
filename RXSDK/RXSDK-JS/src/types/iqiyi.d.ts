interface IqiyiQueries {
  user_id: string
  agent: 'pps'
  time: string
  /**
   * 加密字符串
   * user_id=&agent=&time=&key=
   * 对加密字符串进行MD5加密
   * 将加密后的字符串转换为小写字母
   */
  sign: string
}

interface APIIqiyiPayParams {
  game_id: string
  user_id: string
  server_id?: number
  money: number
  extra_param?: string
}
