let facebook_inited = false

export const facebookInit = (params: {
  appId: string,
  cookie: boolean,
  xfbml: boolean, // 禁用 XFBML 解析
  version: string
}) => {
  return new Promise((resolve, reject) => {
    if(facebook_inited) {
      resolve(true)
    } else {
      // @ts-ignore
      FB.init(params)
      facebook_inited = true
      resolve(true)
    }
  })
}


export const facebookLogin = (params: {
  app_associated_business: boolean,
  scope: string
}) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    FB.login(
      (response: any) => {
        console.log('FB login response', response)
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken

          resolve({
            access_token: accessToken,
            app_associated_business: params.app_associated_business
          })
        } else {
          reject({
            code: 3001,
            msg: '取消登录'
          })
        }
      },
      { scope: params.scope }
    )
  })
}

export const facebookShare = (shareData: {
  title: string,
  description: string,
  image: string,
  href: string
}) => {
  return new Promise((resolve, reject) => {
    // 动态创建并添加 meta 标签到 head
    const head = document.head
    const metaTags = [
      { property: 'og:title', content: shareData.title || '' },
      { property: 'og:description', content: shareData.description || '' },
      { property: 'og:image', content: shareData.image || '' },
      { property: 'og:url', content: shareData.href || '' },
      { property: 'og:type', content: 'website' }
    ]

    metaTags.forEach((metaTag) => {
      const meta = document.querySelector(`meta[property="${metaTag.property}"]`)
      if (meta) {
        meta.setAttribute('content', metaTag.content)
      } else {
        const _meta = document.createElement('meta')
        _meta.setAttribute('property', metaTag.property)
        _meta.setAttribute('content', metaTag.content)
        head.appendChild(_meta)
      }
    })

    // const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.href)}`;
    // window.open(shareUrl, '_blank')
    // @ts-ignore
    FB.ui({
      method: 'share',
      href: shareData.href
    }, (response: any) => {
      console.log('FB share:', response)
      if (response && !response.error_message) {
        resolve({
          code: 0
        })
      } else {
        resolve({
          code: 5002,
          msg: response.error_message
        })
      }
    })
  })
}
