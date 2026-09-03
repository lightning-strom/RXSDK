// 处理登录响应
// @ts-ignore
window.handleCredentialResponse = (response) => {
  handleLoginCallback(response)
}

let handleLoginCallback: any

// 动态加载Google登录相关元素和脚本
function initGoogleSignIn(client_id: string, triggerGoogleBtnId: string, callback: any, attrs?: {
  type: string,
  size: string,
  text: string,
  shape: string,
  theme: string,
  logo_alignment: string,
  width: number,
  locale: string,
  hidden: boolean
}) {
  let _attrs = {
    type: 'standard',
    size: 'large',
    text: 'continue_with',
    shape: 'pill',
    theme: 'filled_blue',
    logo_alignment: 'center',
    width: 300,
    locale: 'zh-CN',
    hidden: true
  }
  if (attrs) {
    _attrs = {
      ..._attrs,
      ...attrs
    }
  }
  handleLoginCallback = callback.loginCallback
  // 创建并添加g_id_onload div
  const onloadDiv = document.createElement('div')
  onloadDiv.id = 'g_id_onload'
  onloadDiv.setAttribute('data-client_id', client_id)
  onloadDiv.setAttribute('data-callback', 'handleCredentialResponse')
  onloadDiv.setAttribute('data-auto_prompt', 'false')
  document.body.appendChild(onloadDiv)

  // 创建并添加g_id_signin div
  const triggerGoogleBtn: any = document.getElementById(triggerGoogleBtnId)
  triggerGoogleBtn.style.position = 'relative'

  const signinDiv: any = document.createElement('div')
  signinDiv.className = 'g_id_signin'
  console.log(_attrs)
  if (_attrs.hidden) {
    signinDiv.style.opacity = '0'
    signinDiv.style.overflow = 'hidden'
  }
  signinDiv.setAttribute('data-width', _attrs.width)
  signinDiv.setAttribute('data-size', _attrs.size)
  signinDiv.setAttribute('data-theme', _attrs.theme)
  signinDiv.setAttribute('data-text', _attrs.text)
  signinDiv.setAttribute('data-shape', _attrs.shape)
  signinDiv.setAttribute('data-logo_alignment', _attrs.logo_alignment)
  signinDiv.setAttribute('data-locale', _attrs.locale)
  // @ts-ignore
  document.getElementById(triggerGoogleBtnId).appendChild(signinDiv)
  // 动态加载Google客户端脚本
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = function() {
    console.log('Google Sign-In script loaded')
    callback.initCallback()
  }
  document.head.appendChild(script)
}

export const googleInit = (params: {
  client_id: string,
  triggerGoogleBtnId: string,
  callback: {
    loginCallback: any,
    initCallback: any
  },
  attrs?: any
}) => {
  initGoogleSignIn(params.client_id, params.triggerGoogleBtnId, params.callback, params.attrs)
}
