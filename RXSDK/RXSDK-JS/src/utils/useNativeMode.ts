export let isAndroid =
  navigator?.userAgent?.indexOf('Android') > -1 || navigator?.userAgent?.indexOf('Adr') > -1 || navigator.userAgent.toLocaleLowerCase().indexOf('harmony') > -1
export let isIos = !!navigator?.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
export let isiPad =
  navigator?.userAgent.match(/(iPad)/) ||
  (navigator?.platform === 'MacIntel' && navigator?.maxTouchPoints > 1)
export const isHarmony = navigator.userAgent.toLocaleLowerCase().indexOf('harmony') > -1

// 当前是否允许注入Js 只有不允许注入js时才可以使用urlscheme的方式交互
const jsdisable = window.localStorage.getItem('jsdisable')


declare global {
  var JsBridgeH5: any
  var JSBridgeHandle: any
  var webkit: any
}

export function useNativeMode() {
  const handleScheme = (eventName: string, eventParams: string) => {
    let url = `rx://${eventName}`
    if (eventParams) {
      url += `?data=${encodeURIComponent(eventParams)}`
    }
    console.log(url, 'url')
    window.location.href = url
  }
  const handleJsBridge = (eventName: string, eventParams: string) => {
    console.log('handleJsBridge')

    try {
       if (isAndroid) {
        console.log('进来了把')
        if (window.JsBridgeH5) {
          console.log('有bridge', eventName, eventParams)
          window.JsBridgeH5[eventName](eventParams)
        } else {
          console.log('没有bridge')
        }
      } else if (isHarmony && window.JSBridgeHandle) {
        console.log('isHarmony')
         // @ts-ignore
        window.JSBridgeHandle.call(eventName, ...args)
      }

      if (isIos || isiPad) {
        if (window.webkit) {
          window.webkit.messageHandlers[eventName].postMessage(eventParams)
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleCallback = ({ eventName, eventParams } : any) =>
    new Promise((resolve, reject) => {
      console.log('进入啊')
      try {
        // 如果是安卓并且禁用js 注入  使用url scheme方式
        if (jsdisable === 'true' && isAndroid) {
          console.log(eventName, 123444)
          handleScheme(eventName, eventParams)
          // @ts-ignore
          window[`${eventName}Callback`] = function (params: any) {
            console.log(params, '客户端安卓传递的参数', typeof params)
            resolve(decodeURIComponent(params))
          }
        } else {
          handleJsBridge(eventName, eventParams)
          console.log(eventName, 'eventName')
          // @ts-ignore
          window[eventName] = function (params: any) {
            console.log(123213)
            console.log(params, 'ios的参数')
            resolve(params)
          }
        }
      } catch (error) {
        reject(error)
      }
    })

  const handleInteractive = ({ eventName, eventParams }: any) => {
    console.log(jsdisable)
    console.log(isAndroid)
    jsdisable === 'true' && isAndroid
      ? handleScheme(eventName, eventParams)
      : handleJsBridge(eventName, eventParams)
  }
  return {
    handleCallback,
    handleInteractive,
  }
}
