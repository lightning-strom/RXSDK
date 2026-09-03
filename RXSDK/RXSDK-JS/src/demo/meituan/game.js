import demoMeituan from './channel-sdk.meituan.v2.umd.js'
require('./mgcAdSDK.js')

let demo = demoMeituan

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
  addBtnList.forEach(func => func())
}

function addButton (text, touchEnd) {
  const xRemainder = btnList.length % 3
  let x = xRemainder * WIDTH + (xRemainder + 1) * PADDING
  let y = 120 + Math.floor(btnList.length / 3) * (HEIGHT + PADDING)
  context.fillStyle = '#00b26a'
  context.fillRect(x, y, WIDTH, HEIGHT)
  context.fillStyle = '#fff'
  context.fillText(text, x + (WIDTH / 2) - text.length * 10, y + 11, WIDTH)
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
  function start () {
    addButton('初始化', () => {
      demo = new demo({
        productId: '1002',
        channelId: 'minigame_meituan',
        cpid: '114',
        baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
        complete: (data) => {
          console.log('init complete: ', data.code, data.msg)
        }
      })
    })
  },

  function addLogin () {
    addButton('登录', async () => {
      demo.login(
        {
          // method: 'minigame_meituan',
          // version: 'normal',
          // migrate_args: { a: 1, b: 2 }
        },
        {
          complete: (data) => {
            console.log('login complete:', data.code, data.data, data.msg)
          }
        }
      )
    })
  },
  function addPay () {
    addButton('支付', () => {
      demo.pay(
        {
           'pay_type': 'minigame_meituan',
           'goods_tag': '1017',
           'trade_no': '' + new Date().getTime(),
           'transmit_args': 'a=1&b=2',
           'indulge_auth': 1,
           'age':18,
        },
        {
           complete: (data) => {
              console.log('支付结果' + JSON.stringify(data))
           },
        }
      )
    })
  },
  function addShare () {
    addButton('分享', () => {
      demo.share(
        {
          func: "testzx",
          transmits: "a=1&b=2",
        },
        {
          complete: (data) => {
            console.log('分享结果' + JSON.stringify(data));
          },
        }
      );
    })
  },
  function addShare2Friend () {
    addButton('分享好友', () => {
      demo.share(shareComplete, {
        forcemethod: 8,
      })
    })
  },
  function addAd () {
    addButton('分享限制', () => {
      demo.getShareLimit()
    })
  },
  function addAd () {
    addButton('广告检测', () => {
      demo.ad({
        adUnitId: 'adunit-14a4788a39149b85',
      }, true)
    })
  },
  function addAd () {
    addButton('激励广告', () => {

      wx.openPage({'url': 'imeituan://www.meituan.com/web?wkwebview=1&notitlebar=1&url=https%3A%2F%2Fawp.meituan.com%2Fgame%2Ffeed%2Findex.html%3Fpage%3D102731004'})
      wx.onShow(
        ({query})=>{
          console.log('激励广告' + JSON.stringify(query))
        }
      )
      // demo.rewardedVideoAd(
      //   {
      //     adUnitId: "adunit-4de541945b96fxxx",
      //   },
      //   {
      //     complete: (data) => {
      //       console.log(data);
      //     },
      //   }
      // );
    })
  },
  function addBannerAd () {
    addButton('横幅广告', () => {
      demo.bannerAd('adunit-d2232644e9674a4b')
    })
  },
  function interstitialAd () {
    addButton('插屏广告', () => {
      demo.interstitialAd('adunit-354929d459facb67')
    })
  },
  function addCheckAuth () {
    addButton('检测授权', () => {
      demo.checkAuthorization()
    })
  },
  function addShortcut () {
    addButton('添加桌面', () => {      
      demo.addShortcut(
        {
          shortcutType: 2,
          id: 'rx',
          label: '瑞雪',
        },
        {
          complete: (data) => {
            console.log('添加桌面结果' + JSON.stringify(data));
          },
        }
      )

    })
  },
  function checkMsgSecurity () {
    addButton('脏词检测', () => {
      demo.checkMsgSecurity()
    })
  },
  function authorize () {
    addButton('授权', () => {
      demo.authorize()
    })
  },
  function friendPayment () {
    addButton('代付', () => {
      demo.friendPayment()
    })
  },
  function cancelAuthorize () {
    addButton('取消', () => {
      demo.cancelAuthorize()
    })
  },
  function isAuthorize () {
    addButton('是否授权', () => {
      demo.isAuthorize()
    })
  },
  function actionReport () {
    addButton('行为上报', () => {
      // 生成 yyyy-MM-dd HH:mm:ss 格式时间
      const now = new Date()
      const pad = (n) => n.toString().padStart(2, '0')
      const action_finish_time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      // 生成 uuid
      const game_sn = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
      demo.actionReport(
        {
          action_code: 'WLJXMJ_DJ1_mgclr4652m1lhdqb',
          action_finish_time: action_finish_time,
          inner_source: '1',
          game_sn: game_sn,
        },
        {
          complete: (data) => {
            console.log('行为上报结果' + JSON.stringify(data))
          },
        }
      )
    })
  },
]

wx.onTouchEnd((evt) => {
  const { clientX: x, clientY: y } = evt.changedTouches[0]
  btnList.forEach(item => {
    if (x >= item.x && x <= item.x + WIDTH && y >= item.y && y <= item.y + HEIGHT) {
      item.touchEnd()
    }
  })
})

wx.onShow(() => {
  requestAnimationFrame(drawRect)
})
