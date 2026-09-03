import demoSdk from './douyin/index.douyin.umd.js'
// import demoLingJing from './lingjing/index.lingjing.umd'

let demo = demoSdk

const { windowWidth, windowHeight } = tt.getSystemInfoSync()
const canvas = tt.createCanvas()
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
    tt.showToast({
      title: data.msg,
    })
    return
  }
  if (data.method !== 8) {
    tt.showToast({
      title: '普通分享',
    })
    return
  }
  const ctx = tt.getOpenDataContext()
  ctx.postMessage({
    ...data,
  })
}

const addBtnList = [
  function addLogin () {
    addButton('登录', () => {
      demo.login()
    })
  },
  function addLogin () {
    addButton('支付', () => {
      demo.pay()
    })
  },
  function addLogin () {
    addButton('客服', () => {
      demo.createContactButton()
    })
  },
  function addLogin () {
    addButton('上报', () => {
      demo.track()
    })
  },
  function addLogin () {
    addButton('好友分享', () => {
      demo.share()
    })
  },
  function addStartScreenRecord () {
    addButton('开始录屏', () => {
      demo.startScreenRecord()
    })
  },
  function addStopScreenRecord () {
    addButton('停止录屏', () => {
      demo.stopScreenRecord()
    })
  },
  function addShareScreenRecord () {
    addButton('分享录屏', () => {
      demo.shareScreenRecord()
    })
  },
  function addLogin () {
    addButton('设置token', () => {
      let tokens = tt.getStorageSync('rxToken')
      tokens.access = 'eyJhbGcaOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDUElEIjoxMDAwMDQ5LCJBY2NvdW50SUQiOjUzMTExMywiVXNlcklEIjo5NjYzNzksIkFwcElEIjoiMSIsIlN0YW5kYXJkQ2xhaW1zIjp7ImV4cCI6MTY2MTE1MjA3MX0sIlRva2VuSUQiOiJmMWY4YjI5NC03NTEwLTQwMGItODFhOS1jMTAxMmZlZmViYTEifQ.uVW5T26dNcDE8Gfh10ClhL5lOvEyYdSBJTr59vsb-Q4'
      tt.setStorageSync('rxToken',tokens)
    })
  },
  function addLogin () {
    addButton('拉起实名', () => {
      demo.authenticateRealName({
        complete:()=>{
          console.log('点击拉起实名')
        }
      })
    })
  },
  function addLogin () {
    addButton('奖励广告', () => {
      demo.rewardedVideoAd()
    })
  },
  function getDeviceInfo () {
    addButton('获取设备信息', () => {
      demo.rewardedVideoAd()
    })
  },
]

tt.onTouchEnd((evt) => {
  const { clientX: x, clientY: y } = evt.changedTouches[0]
  btnList.forEach(item => {
    if (x >= item.x && x <= item.x + WIDTH && y >= item.y && y <= item.y + HEIGHT) {
      item.touchEnd()
    }
  })
})

// tt.onShow(() => {
//   requestAnimationFrame(drawRect)
// })

setTimeout(()=>{
  requestAnimationFrame(drawRect)
},3000)
