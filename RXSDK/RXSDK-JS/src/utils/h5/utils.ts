import { qs } from "@/utils/utils"

export interface IH5Queries {
  [key: string]: string
  openId: string
  accessToken: string
  nonceStr: string
  apiSvr: string
  iconShow: 'false' | 'true'
  timestamp: string
  jssdkVersion: string
}

/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export const getSearchQueries = (): IH5Queries => {
  const search = window.location.search.slice(1)
  return qs.parse(search) as IH5Queries
}

/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
export const listenVisibilityChange = (callbak: (show?: boolean) => void) => {
  document.addEventListener('visibilitychange', () => {
    callbak(!document.hidden)
  }, false)
}

export const setStyles = (el: HTMLElement, styles: Partial<CSSStyleDeclaration> & Record<string, string>) => {
  let key: any
  for (key in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, key)) {
      el.style[key] = styles[key] as string
    }
  }
}

export const getLayer = () => {
  const wrapper = document.createElement('div')
  setStyles(wrapper, {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    background: 'rgba(0, 0, 0, .7)',
    color: '#fff',
    fontSize: '16px',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  })

  return wrapper
}

export const showShareGuide = (cancelFn?: () => void, showGuide = true) => {
  const wrapper = getLayer()

  function addArrow () {
    const arrowWrap = document.createElement('div')
    const arrow = document.createElement('div')
    setStyles(arrowWrap, {
      position: 'absolute',
      width: '100%',
      top: '0',
    })
    setStyles(arrow, {
      position: 'absolute',
      top: '30px',
      right: '34px',
      borderTop: '20px solid transparent',
      borderBottom: '20px solid transparent',
      borderLeft: '40px solid #fff',
      transform: 'rotate(-60deg)',
    })
    const line = document.createElement('div')
    setStyles(line, {
      position: 'absolute',
      top: '-112px',
      left: '-120px',
      border: '0 solid transparent',
      borderBottom: '14px solid #fff',
      borderRadius: '0 0 0 100px',
      width: '90px',
      height: '120px',
    })

    const tipsEl = document.createElement('div')
    setStyles(tipsEl, {
      position: 'relative',
      width: '80%',
      maxWidth: '220px',
      fontSize: '16px',
      textAlign: 'center',
      margin: 'auto',
      top: '110px',
      lineHeight: '2em',
    })
    tipsEl.innerHTML = `
      <div>点击右上角按钮</div>
      <div>发送给朋友</div>
    `

    arrowWrap.appendChild(arrow)
    arrowWrap.appendChild(tipsEl)
    arrow.appendChild(line)
    wrapper.appendChild(arrowWrap)
  }

  if (showGuide) {
    addArrow()
  }

  ;(function addCancel () {
    const cancelEl = document.createElement('div')
    setStyles(cancelEl, {
      width: '80%',
      maxWidth: '200px',
      height: '46px',
      border: '1px solid #fff',
      borderRadius: '4px',
      margin: 'auto',
      position: 'absolute',
      bottom: '15%',
      left: '0',
      right: '0',
      lineHeight: '46px',
    })
    cancelEl.innerText = '取消'
    cancelEl.addEventListener('click', (e: Event) => {
      typeof cancelFn === 'function' && cancelFn()
      document.body.removeChild(wrapper)
      e.stopPropagation()
    }, false)
    wrapper.appendChild(cancelEl)
  })()

  document.body.appendChild(wrapper)

  return () => {
    document.body.removeChild(wrapper)
  }
}

export const showConfirm = (params: {
  title: string
  message: string
  cancel?: () => void | Promise<void>
  confirm?: () => void | Promise<void>
  autoClose?: boolean
  cancelText?: string
  confirmText?: string
  dangerouslyUseHTMLString?: boolean
}) => {
  const layer = getLayer()
  const container = document.createElement('div')
  const autoClose = params.autoClose !== false

  ;(() => {
    setStyles(container, {
      width: '90%',
      height: '80%',
      background: '#fff',
      color: '#333',
      padding: '50px 20px 110px',
      position: 'relative',
    })
  })()

  ;(() => {
    const title = document.createElement('div')
    setStyles(title, {
      width: '100%',
      fontSize: '20px',
      padding: '10px 0',
      position: 'absolute',
      top: '0',
      left: '0',
    })
    title.innerText = params.title

    container.appendChild(title)
  })()

  ;(() => {
    const message = document.createElement('div')
    setStyles(message, {
      height: '100%',
      background: '#ececec',
      padding: '4px 6px',
      textAlign: 'left',
      overflowY: 'auto',
      wordBreak: 'break-all',
      '-webkit-overflow-scrolling': 'touch',
    })
    if (params.dangerouslyUseHTMLString) {
      message.innerHTML = params.message
    } else {
      message.innerText = params.message
    }

    container.appendChild(message)
  })()

  ;(() => {
    const footer = document.createElement('div')
    setStyles(footer, {
      width: '100%',
      padding: '10px 20px',
      position: 'absolute',
      bottom: '10px',
      left: '0',
    })

    const cancel = document.createElement('div')
    const confirm = document.createElement('div')
    cancel.innerText = params.cancelText || '取消'
    confirm.innerText = params.confirmText || '确定'
    cancel.addEventListener('click', async () => {
      params.cancel && await params.cancel()
      autoClose && document.body.removeChild(layer)
    })
    confirm.addEventListener('click', async () => {
      params.confirm && await params.confirm()
      autoClose && document.body.removeChild(layer)
    })

    setStyles(cancel, {
      color: '#2196F3',
      padding: '4px 0',
      marginTop: '10px',
    })

    setStyles(confirm, {
      background: '#2196F3',
      padding: '6px 0',
      color: '#fff',
    })

    footer.appendChild(confirm)
    footer.appendChild(cancel)
    container.appendChild(footer)
  })()

  layer.appendChild(container)
  document.body.appendChild(layer)
}
