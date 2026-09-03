import demo from './qq/index.qq.umd'

const { windowWidth, windowHeight } = qq.getSystemInfoSync()
const canvas = qq.createCanvas()
const context = canvas.getContext('2d')
context.font = '20px Arial'
context.textBaseline = 'top'
const PADDING = 10
const WIDTH = Math.floor((windowWidth - PADDING * 4) / 3)
const HEIGHT = 40
let btnList = []

function drawRect() {
  btnList = []
  context.clearRect(0, 0, windowWidth, windowHeight)
  addBtnList.forEach((func) => func())
}

function addButton(text, touchEnd) {
  const xRemainder = btnList.length % 3
  let x = xRemainder * WIDTH + (xRemainder + 1) * PADDING
  let y = 120 + Math.floor(btnList.length / 3) * (HEIGHT + PADDING)
  context.fillStyle = '#00b26a'
  context.fillRect(x, y, WIDTH, HEIGHT)
  context.fillStyle = '#fff'
  context.fillText(text, x + WIDTH / 2 - text.length * 10, y + 11, WIDTH)
  btnList.push({
    x,
    y,
    touchEnd,
  })
}

const shareComplete = ({ complete, ...data }) => {
  console.log('share callback', data)
  if (data.code !== 0) {
    qq.showToast({
      title: data.msg,
    })
    return
  }
  if (data.method !== 8) {
    qq.showToast({
      title: '普通分享',
    })
    return
  }
  const ctx = qq.getOpenDataContext()
  ctx.postMessage({
    ...data,
  })
}

const addBtnList = [
  function addLogin() {
    addButton('登录', () => {
      demo.login()
    })
  },
  function addPay() {
    addButton('支付', () => {
      demo.pay()
    })
  },
  function addShare() {
    addButton('分享', () => {
      demo.share(shareComplete)
    })
  },
  function getShareData() {
    addButton('分享数据', () => {
      demo.getShareData()
    })
  },
  function addShare2Friend() {
    addButton('分享好友', () => {
      demo.share(shareComplete, {
        forcemethod: 8,
      })
    })
  },
  function schedulingReport() {
    addButton('分享上报', () => {
      demo.schedulingReport()
    })
  },
  function addAd() {
    addButton('广告检测', () => {
      demo.checkHasAd()
    })
  },
  function addAd() {
    addButton('激励广告', () => {
      demo.rewardedVideoAd()
    })
  },
  function addBannerAd() {
    addButton('横幅广告', () => {
      demo.bannerAd()
    })
  },
  function interstitialAd() {
    addButton('插屏广告', () => {
      demo.interstitialAd('adunit-354929d459facb67')
    })
  },
  function addCheckAuth() {
    addButton('检测授权', () => {
      demo.checkAuthorization()
    })
  },
  function checkMsgSecurity() {
    addButton('脏词检测', () => {
      demo.checkMsgSecurity()
    })
  },
  function authorize() {
    addButton('授权', () => {
      demo.authorize()
    })
  },
  function cancelAuthorize() {
    addButton('取消', () => {
      demo.cancelAuthorize()
    })
  },
  function isAuthorizeUserInfo() {
    addButton('是否授权', () => {
      demo.isAuthorizeUserInfo()
    })
  },
  function infoSync() {
    addButton('同步用户信息', () => {
      demo.infoSync()
    })
  },
  function getUserInfo() {
    addButton('获取用户信息', () => {
      demo.getInfo()
    })
  },
  function startReportLoaction() {
    addButton('上报地理位置', () => {
      demo.startReportLoaction()
    })
  },
  function deleteReportLocation() {
    addButton('删除经纬度', () => {
      demo.deleteReportLocation()
    })
  },
  function authorizeLocation() {
    addButton('定位授权', () => {
      demo.authorizeLocation()
    })
  },
  function getNearlyPeasonByRadius() {
    addButton('获得半径内用户', () => {
      demo.getNearlyPeasonByRadius()
    })
  },
  function checkVersionAPP() {
    addButton('大厅版本检查Get', () => {
      demo.checkVersionAPP()
    })
  },
  function checkVersionGame() {
    addButton('游戏版本检查', () => {
      demo.checkVersionGame()
    })
  },
  function checkVersionActivity() {
    addButton('活动版本检查', () => {
      demo.checkVersionActivity()
    })
  },
  function getBusinessData() {
    addButton('商业化窗口数据', () => {
      demo.getBusinessData()
    })
  },
  function getAllBusinessData() {
    addButton('商业化全量数据', () => {
      demo.getAllBusinessData()
    })
  },
  function refreshBusinessData() {
    addButton('更新商业化窗口数据', () => {
      demo.refreshBusinessData()
    })
  },
  function setPublicProperties() {
    addButton('设置公共属性', () => {
      demo.setPublicProperties()
    })
  },
  function updatePublicProperties() {
    addButton('修改公共属性', () => {
      demo.updatePublicProperties()
    })
  },
  function deletePublicProperties() {
    addButton('删除公共属性', () => {
      demo.deletePublicProperties()
    })
  },
  function getPublicProperties() {
    addButton('查看公共属性', () => {
      demo.getPublicProperties()
    })
  },
]

qq.onTouchEnd((evt) => {
  const { clientX: x, clientY: y } = evt.changedTouches[0]
  btnList.forEach((item) => {
    if (x >= item.x && x <= item.x + WIDTH && y >= item.y && y <= item.y + HEIGHT) {
      item.touchEnd()
    }
  })
})

qq.onShow(() => {
  requestAnimationFrame(drawRect)
})
