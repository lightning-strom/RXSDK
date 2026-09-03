// @ts-ignore
import md5 from 'blueimp-md5/js/md5.min'
import v4 from 'uuid/v4'

const encrypt = (data: any) => {
  return md5(data).toUpperCase()
}

export const getSignature = ({
  openid,
  token,
  appid,
}: {
  openid: string
  token: string
  appid: string
}) => {
  const nonce: string = v4()
  const ts: number = Math.floor(new Date().getTime() / 1000)
  const signTemp: string = `appid=${appid}&nonce=${nonce}&openid=${openid}&ts=${ts}`
  const sign: string = encrypt(`${signTemp}${token}`)

  return {
    sign,
    nonce,
    openid,
    ts,
    appid,
  }
}
