// import demoWegame from './test.js'
// import demoWegame from './channel-sdk.wegame.v2.umd'
import demoWegame from './wegame/index.wegame.umd'
// import demoLingJing from './lingjing/index.lingjing.umd'

let demo = demoWegame
// console.log('game demo: ', demo)
// // game.js
// // 向开放数据域发送消息
// let openDataContext = wx.getOpenDataContext()
// openDataContext.postMessage({
//   text: 'hello',
//   year: new Date().getFullYear(),
//   keyList: ['score'],
// })
//
// // 设置定向分享参数（这里假设1代表的是邀请新玩家场景值）
// wx.setMessageToFriendQuery({
//   shareMessageToFriendScene: 1,
// })
//
// // 用户发起定向分享之后，在基础库2.9.4以上支持通过接口wx.onShareMessageToFriend监听邀请成功事件
// wx.onShareMessageToFriend &&
//   wx.onShareMessageToFriend((res) => {
//     console.log('wx.shareMessageToFriend', res)
//     let tips = res.success ? '分享成功' : '分享失败'
//
//     wx.showToast({
//       title: tips,
//       icon: 'none',
//       duration: 2000,
//     })
//     // 这里可触发游戏逻辑
//   })

const { windowWidth, windowHeight } = wx.getSystemInfoSync()
const canvas = wx.createCanvas()
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
    wx.showToast({
      title: data.msg,
    })
    return
  }
  if (data.method !== 8) {
    wx.showToast({
      title: '普通分享',
    })
    return
  }
  const ctx = wx.getOpenDataContext()
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
  function addLogin () {
    addButton('用户信息', () => {
      demo.getUserInfo()
    })
  },
  function addLogin () {
    addButton('手机号', () => {
      demo.getPhoneNumber()
    })
  },
  function requestSubscribeMessage() {
    addButton('订阅消息', () => {
      demo.requestSubscribeMessage()
    })
  },
  function addLogin () {
    addButton('互动好友列表', () => {
      demo.getRelationFriendList()
    })
  },

  function addLogin () {
    addButton('分享', () => {
      demo.share()
    })
  },
  function addLogin() {
    addButton('分享内容', () => {
      demo.getShareData()
    })
  },
  function addLogin() {
    addButton('跳转支付', () => {
      demo.payJump()
    })
  },
  function addLogin() {
    addButton('支付卡片', () => {
      demo.payIos()
    })
  },
  function addLogin() {
    addButton('小程序码', () => {
      demo.payPreviewImage()
    })
  },
  function addLogin() {
    addButton('分享初始化', () => {
      demo.shareSchedulingInit()
    })
  },
  function addRelation() {
    addButton('获取埋点调度', () => {
      demo.getShareScheduling()
    })
  },
  function schedulingReport() {
    addButton('分享上报', () => {
      demo.schedulingReport()
    })
  },
  function addLogin() {
    addButton('支付', () => {
      demo.pay()
      // wx.requestMidasPayment({
      //   mode: 'game',
      //   offerId: '1450034734',
      //   currencyType: 'CNY',
      //   platform: 'android',
      //   buyQuantity: 29980,
      //   zoneId: '1',
      //   env: 0,
      //   outTradeNo: '2410105415838281v1',
      // })
    })
  },
  function addLogin() {
    addButton('支付直购', () => {
      demo.payV3()
    })
  },
  function addLogin() {
    addButton('主动补单', () => {
      demo.compensatePayOrder()
    })
  },
  function addRelation() {
    addButton('虚拟支付v2', () => {
      demo.payV2()
    })
  },
  function addLogin() {
    addButton('大数据', () => {
      demo.track()
    })
  },
  function addLogin() {
    addButton('激励广告', () => {
      demo.rewardedVideoAd()
    })
  },
  function getDirectAdStatusSync() {
    addButton('获取直玩广告状态', () => {
      demo.getDirectAdStatusSync()
    })
  },
  function onDirectAdStatusChange() {
    addButton('监听直玩广告状态', () => {
      demo.onDirectAdStatusChange()
    })
  },
  // function interstitialAd () {
  //   addButton('插屏广告', () => {
  //     demo.interstitialAd('adunit-354929d459facb67')
  //   })
  // },
  function addLogin() {
    addButton('发送验证码', () => {
      demo.sendCaptcha()
    })
  },
  function deregister() {
    addButton('注销账号', () => {
      demo.deregister()
    })
  },
  function deregisterCancel() {
    addButton('取消注销', () => {
      demo.deregisterCancel()
    })
  },
  function deregisterCancel() {
    addButton('同步信息', () => {
      demo.infoSync()
    })
  },
  function deregisterCancel() {
    addButton('静默同步信息', () => {
      demo.userInfoSilentSync()
    })
  },
  function startReportLoaction() {
    addButton('开上报位置', () => {
      demo.startReportLoaction()
    })
  },
  function stopReportLocation() {
    addButton('停止上报', () => {
      demo.stopReportLocation()
    })
  },
  function deleteReportLocation() {
    addButton('删除经纬度坐标', () => {
      demo.deleteReportLocation()
    })
  },
  function authorizeLocation() {
    addButton('定位授权', () => {
      demo.authorizeLocation()
    })
  },
  function getNearlyPeasonByRadius() {
    addButton('获取半径内用户', () => {
      demo.getNearlyPeasonByRadius()
    })
  },
  function decryptionDate() {
    addButton('解密数据', () => {
      demo.decryptionDate()
    })
  },
  // function setcustom(){
  //   addButton('用户管理', () => {
  //     demo.setcustom()
  //   })
  // },
  // function addRelation(){
  //   addButton('添自关系', () => {
  //     demo.addRelation()
  //   })
  // },
  // function updateremarks(){
  //   addButton('更新自定关系', () => {
  //     demo.updateremarks()
  //   })
  // },
  // function addFriend(){
  //   addButton('好友关系', () => {
  //     demo.addFriend()
  //   })
  // },
  // function getranklist(){
  //   addButton('排行榜', () => {
  //     demo.getranklist()
  //   })
  // },
  function addRelation() {
    addButton('跳转客服', () => {
      demo.test2()
    })
  },
  function addRelation() {
    addButton('内容安全', () => {
      demo.msgSecCheck()
    })
  },
  // function checkVersionAPP(){
  //   addButton('大厅版本检查Get', () => {
  //     demo.checkVersionAPP()
  //   })
  // },
  // function checkVersionGame(){
  //   addButton('游戏版本检查', () => {
  //     demo.checkVersionGame()
  //   })
  // },
  // function checkVersionActivity(){
  //   addButton('活动版本检查', () => {
  //     demo.checkVersionActivity()
  //   })
  // },
  // function getBusinessData(){
  //   addButton('商业化窗口数据', () => {
  //     demo.getBusinessData()
  //   })
  // },
  // function getAllBusinessData(){
  //   addButton('商业化全量数据', () => {
  //     demo.getAllBusinessData()
  //   })
  // },
  // function refreshBusinessData(){
  //   addButton('更新商业化窗口数据', () => {
  //     demo.refreshBusinessData()
  //   })
  // },
  // function setPublicProperties(){
  //   addButton('设置公共属性', () => {
  //     demo.setPublicProperties()
  //   })
  // },
  // function updatePublicProperties(){
  //   addButton('修改公共属性', () => {
  //     demo.updatePublicProperties()
  //   })
  // },
  // function deletePublicProperties(){
  //   addButton('删除公共属性', () => {
  //     demo.deletePublicProperties()
  //   })
  // },
  // function getPublicProperties() {
  //   addButton('查看公共属性', () => {
  //     demo.getPublicProperties()
  //   })
  // },
  // function testParallel() {
  //   addButton('test并发执行', () => {
  //     demo.testParallel()
  //   })
  // },
  function getFeedbackKindList() {
    addButton('反馈列表', () => {
      demo.getFeedbackKindList()
    })
  },
  function createFeedback() {
    addButton('创建反馈', () => {
      demo.createFeedback()
    })
  },
  function satisfactionEvaluation() {
    addButton('反馈满意度', () => {
      demo.satisfactionEvaluation()
    })
  },
  function getUserInteractiveStorage() {
    addButton('开放数据', () => {
      demo.getUserInteractiveStorage()
    })
  },
  function getGameClubData() {
    addButton('游戏圈', () => {
      demo.getGameClubData()
    })
  },
  function getHelpcenterMainLayout() {
    addButton('帮助中心', () => {
      demo.getHelpcenterMainLayout()
    })
  },
  function getUserDeviceCode() {
    addButton('获得设备码', () => {
      demo.getUserDeviceCode()
    })
  },
  function getPromoDisplayKEY() {
    addButton('获取福利码', () => {
      demo.getPromoDisplayKEY()
    })
  },
  function exchangePromoCDKEY() {
    addButton('兑换福利码', () => {
      demo.exchangePromoCDKEY()
    })
  },
  function getAnnouncement() {
    addButton('获取公告', () => {
      demo.getAnnouncement()
    })
  },
  function addRelation() {
    addButton('获取反馈列表', () => {
      demo.getFeedbackList()
    })
  },

  function addRelation() {
    addButton('获取反馈详情', () => {
      demo.getFeedbackDetail()
    })
  },

  function addRelation() {
    addButton('创建反馈', () => {
      demo.addFeedback()
    })
  },

  function addRelation() {
    addButton('领取道具', () => {
      demo.collectProps()
    })
  },
]

wx.onTouchEnd((evt) => {
  const { clientX: x, clientY: y } = evt.changedTouches[0]
  btnList.forEach((item) => {
    if (x >= item.x && x <= item.x + WIDTH && y >= item.y && y <= item.y + HEIGHT) {
      item.touchEnd()
    }
  })
})

wx.onShow(() => {
  requestAnimationFrame(drawRect)
})
