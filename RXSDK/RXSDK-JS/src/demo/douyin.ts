// @ts-nocheck
import SdkWegame from '@/index.wegame'

const complete = (data: any) => {
  console.log('demo complete: ', data)
}
const divider = (msg: String, end?: boolean) => {
  console.log(`=== ${msg}${end ? ' end' : ''} ===`)
}

let serviceBtn: any = null
let recorder: any = null
let recordVideoPath = ''

// //打开调试模式
// wx.setEnableDebug({
//   enableDebug: true,
// })
class Demo<T extends SdkWegame> {
  public sdk: T
  constructor(sdk: any) {
    this.sdk = new sdk({
      productId: 'syzdx',
      channelId: 'syzdx',
      cpid: '1000357',
      baseUrlList: ['https://ap32gw.yzkdux.com'],
      // 回调函数
      complete: (data: any) => {
        console.log('测试参数',data)
      },
    })
    if (typeof window !== 'undefined') {
      window && ((window as any).sdk = this.sdk)
    }
  }
  login = () => {
    this.sdk.login(
      {
        force: true,
        method: 'douyinh5',
        //login_openid:
        //"2ycKc3sYQP9AxLcRWI7dov/Q9o+P85Dhy//jvm7QCXt6OqSApJjDqHhi5c6pcN771nS494Oi7wg/64a9iPMfv89uxPeuWc3prXHK9a7qmUlvQgafdl+/HO2ZajyKJd5Q7uqMd4FBz27VCdDg0GpYQ+MzalwTmgpcQEvhaZjUWcplBUMZ2wbB5iAaWrAXuRnqIpsa5rBUYbNMxoeEOwHYFtnAho8AeAieR2xyu8yryrwFY23AzXozDtEFhSqkefH/dSOTw77rIOurHp5/L+wZDglQjd5XFqSBkMcwmEx7FjzXEuvTZNvpwE7ORNEirZ7F",
      },
      {
        complete: (data: any) => {
          console.log(data)
        },
      }
    )
  }
  pay = () => {
    this.sdk.pay(
      {
        pay_type: 'douyinh5',
        goods_tag: '19986',
        platform: 'ios',
        trade_no: '' + new Date().getTime(),
        indulge_auth: 0,
        transmit_args: 'a=1&b=2',
        notify_url: 'http://www.baidu.com',
        currency: 'CNY',
      },
      {
        complete: (data: any) => {
          console.log(data)
        },
      }
    )
  }
  createContactButton = () => {
    this.sdk.createContactButton(
      {
        type: 'text', // image | text
        // image: "./test.jpg",
        text: '我是一个按钮',
        style: {
          left: 20,
          top: 200,
          width: 200,
          height: 150,
          lineHeight: 40,
          backgroundColor: 'red',
          textAlign: 'center',
          fontSize: 16,
          borderRadius: 4,
          borderColor: '#ffffff',
          borderWidth: 1,
          textColor: '#ffffff',
        },
      },
      {
        complete: (data: any) => {
          console.log(data)
          serviceBtn = data
          serviceBtn.onTap(() => {
            console.log('点击客服按钮')
            this.sdk.openCustomServiceForOs({
              currencyType: "CNY", // 币种：目前仅为 "CNY"
              buyQuantity: 600, // 购买数量，必须满足：金币数量*金币单价 = 限定价格等级（详见金币限定等级）
              zoneId: "1",
              customId: "QWERTYUIDFxxxxx111", //开发者自定义唯一订单号。如不填，支付结果回调将不包含此字段，将导致游戏开发者无法发放游戏道具, 基础库版本低于1.55.0没有此字段
              extraInfo: "",
            }, { complete: (data: any) => {
              console.log('我是一个测试log',data)
            } })
          })
        },
      }
    )
  }
  track = () => {
    this.sdk.track(
      {
        complete: (data: any) => {
          console.log(data)
        },
      },      {
        event: 'test',
        properties: {
          test1: '1',
          test2: '2',
        },
      },
    )
  }
  share = () => {
    this.sdk.share({
      title: '卧槽无情',
      channel: 'video',
      func:'haoyou',
      imageUrl:'https://oss.ruixuecloud.com/service/help_center_default_icon_230630_5.png',
      extra: {
        videoTopics: ['test1 videoTopics', 'test2 videoTopics'], // 抖音或头条小视频话题列表
        videoPath: recordVideoPath,
        withVideoId: true,
      },
    })
  }
  startScreenRecord = () => {
    this.sdk.getGameRecorderManager({
      complete: (res: any) => {
        console.log('getGameRecorderManager', res)
        if (res?.code !== 0 || !res?.data) {
          return
        }
        recorder = res.data
        tt.getSystemInfo({
          success(res: any) {
            const screenWidth = res.screenWidth
            const screenHeight = res.screenHeight
            var maskInfo = recorder.getMark()
            var x = (screenWidth - maskInfo.markWidth) / 2
            var y = (screenHeight - maskInfo.markHeight) / 2
            recorder.onStart((res: any) => {
              recordVideoPath = ''
              console.log('录屏开始', res)
            })
            recorder.onStop((res: any) => {
              recordVideoPath = res?.videoPath || ''
              console.log('屏幕录制结束', res)
            })
            recorder.onError((err: any) => {
              console.log('屏幕录制失败', err)
            })
            recorder.start({
              duration: 30,
              isMarkOpen: true,
              locLeft: x,
              locTop: y,
            })
          },
        })
      },
    })
  }
  stopScreenRecord = () => {
    if (!recorder) {
      console.log('请先调用 startScreenRecord')
      return
    }
    recorder.stop()
  }
  shareScreenRecord = () => {
    if (!recordVideoPath) {
      console.log('暂无录屏视频，请先调用 startScreenRecord/stopScreenRecord')
      return
    }
    this.share()
  }
  authenticateRealName = (complete) =>{
    this.sdk.authenticateRealName(complete)
  }
  rewardedVideoAd = ()=>{
    this.sdk.rewardedVideoAd({adUnitId:'21a3ftqaosr548eba2'},{complete:(res)=>{
      console.log(res)
    }})
  }
}

export default Demo
