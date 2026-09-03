function generateState() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let state = ''
  for (let i = 0; i < 16; i++) {
    state += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return state
}

export const tiktokLogin = (params: {
  clientKey: string
  scope?: string
  redirectUri?: string
}) => {
  return new Promise((resolve, reject) => {
    const state = generateState()

    // 存储 state 用于后续验证
    localStorage.setItem('tiktok_state', state)

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
      `?client_key=${params.clientKey}` +
      `&scope=${params.scope || 'user.info.basic'}` +
      `&redirect_uri=${params.redirectUri || window.location.href}` +
      `&response_type=code` +
      `&state=${state}`

    window.location.href = authUrl
  })
}

// 处理授权回调
export const tiktokAuthByCode = () => {
  return new Promise((resolve, reject) => {
    const storedState = localStorage.getItem('tiktok_state')

    if (!storedState) {
      resolve({
        code: -1
      })
    }

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    localStorage.removeItem('tiktok_state')
    if (code && state) {
      if (state === storedState) {
        resolve({
          auth_code: code
        })
      } else {
        reject({
          code: 3002,
          msg: 'State mismatch'
        })
      }
    }
  })
}

