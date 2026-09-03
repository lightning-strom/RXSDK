function generateState() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let state = ''
  for (let i = 0; i < 16; i++) {
    state += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return state
}

export const instagramLogin = (params: {
  clientId: string
  redirectUri?: string
}) => {
  return new Promise((resolve, reject) => {
    const state = generateState()

    // 存储 state 用于后续验证
    localStorage.setItem('instagram_state', state)
    // window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${params.clientId}&redirect_uri=${params.redirectUri}&scope=instagram_business_basic,instagram_business_content_publish&response_type=code`
    window.location.href = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${params.clientId}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${params.redirectUri}&response_type=token&scope=instagram_basic,instagram_content_publish`
  })
}

export const checkInstagramRedirect = () => {
  const storedState = localStorage.getItem('instagram_state')
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (storedState && code) {
    return true
  }
}

// 处理授权回调
export const instagramAuthByCode = () => {
  return new Promise((resolve, reject) => {
    const storedState = localStorage.getItem('instagram_state')

    if (!storedState) {
      resolve({
        code: -1
      })
    }

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const error_reason = urlParams.get('error_reason')
    localStorage.removeItem('instagram_state')
    if (code) {
      resolve({
        code: code
      })
    } else if (error === 'access_denied') {
      reject({
        code: 3001,
        msg: '取消登录'
      })
    } else {
      reject({
        code: 3002,
        msg: error_reason
      })
    }
  })
}

