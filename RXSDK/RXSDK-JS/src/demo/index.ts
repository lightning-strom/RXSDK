// @ts-nocheck
import Sdk from '@/index.wegame'

const complete = (data: any) => {
  console.log('demo complete: ', data)
}
const divider = (msg: String, end?: boolean) => {
  console.log(`=== ${msg}${end ? ' end' : ''} ===`)
}
// //打开调试模式
wx.setEnableDebug({
  enableDebug: true
})

class Demo<T extends Sdk> {
  public sdk: T

  constructor(sdk: T) {
    this.sdk = new sdk({
      // 家乡 wxa27ca98aa5ed1a87
      // productId: '1002',
      // channelId: '818',
      // cpid: '1000101',
      // baseUrlList: ['https://anhvcpo.weilekuiming.com', 'https://cxhoiw.jiaxiangyx.com'],

      // 微乐爱消除
      // productId: '109',
      // channelId: '818',
      // cpid: '1000198',
      // baseUrlList: ['https://vidwfm.jiaxiangcheers.com'],

      // 光年计划  wx1aea9a8772bcb307
      // productId: 'syzwx',
      // channelId: 'syzwx',
      // cpid: '1000357',
      // baseUrlList: ['https://ap32gw.yzkdux.com'],

      // 喵星旅行  wx48da2139bf3ecdbe
      productId: '1002',
      channelId: '818',
      cpid: '114',
      baseUrlList: ['https://cn-api-test.ruixueyun.com/'],
      short_domain: 's.ruixuecloud.com',
      complete: (data) => {
        console.log('init complete: ', data)

        this.sdk.login(
          {
            method: 'minigame', //'minigame', 'mobileqq'
            version: 'base', //base normal
            migrate_args: { a: 1, b: 2 }
          },
          {
            complete: (data: any) => {
              console.log('login complete:', data)
              if (!data.code) {
              //   // 测试商业化接口队列
              //   this.getBusinessData()
                this.shareSchedulingInit()
              }
            }
          }
        )
      }
    })
    this.sdk.setErrorMsg({
      2001: '初始化失败',
      default: 'default $code$ $thirdcode$ $thirdmsg$'
    })
    if (typeof window !== 'undefined') {
      window && ((window as any).sdk = this.sdk)
    }
  }

  getFeedbackList = () => {
    this.sdk.getFeedbackList({
      page: 1,
      size: 100,
      status: 1
    })
  }

  getFeedbackDetail = () => {
    this.sdk.getFeedbackDetail({
      id: 4
    })
  }

  addFeedback = () => {
    this.sdk.addFeedback({
      content: '123',
      attachments: ['12312313'],
      phone: '13439093625',
      tags: ['11111']
    })
  }

  collectProps = () => {
    this.sdk.collectProps({
      id: 1
    }, {
      complete(res) {
        console.log(res)
      }
    })
  }

  getGameClubData = () => {
    this.sdk.getGameClubData(
      {
        dataTypeList: [
          {
            type: 1
          }
        ]
      },
      {
        complete: (res) => {
          console.log(res)
        }
      }
    )
  }
  setSubChannelId = () => {
    this.sdk.setSubChannelId('22222')
  }

  getPromoDisplayKEY = () => {
    this.sdk.getPromoDisplayKEY({
      complete: (res) => {
        console.log(res)
        console.log('getPromoDisplayKEY')
        if (res.code == 0) {
          console.log(res.data.promo_code)
        } else {
          console.log(res.msg)
        }
        // this.exchangePromoCDKEY(res.data.promo_code)
      }
    }, true)
  }

  exchangePromoCDKEY = () => {
    this.sdk.exchangePromoCDKEY('exchangePromoCDKEY', {
      complete(res) {
        console.log(res)
      }
    })
  }

  getAnnouncement = () => {
    this.sdk.getAnnouncement(20, {
      complete(res) {
        console.log(res)
      }
    })
  }

  login = () => {
    this.sdk.login(
      {
        method: 'minigame', //'minigame', 'mobileqq'
        version: 'base', //base normal
        migrate_args: { a: 1, b: 2 }
      },
      {
        complete: (data: any) => {
          console.log('login complete:', data)
          if (!data.code) {
          //   // 测试商业化接口队列
          //   this.getBusinessData()
            this.shareSchedulingInit()
          }
        }
      }
    )
  }

  getUserInfo = () => {
    // 通过 wx.getSetting 查询用户是否已授权头像昵称信息
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
              console.log(res)

              wx.getPrivacySetting({
                success: res => {
                  console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
                },
                fail: () => {},
                complete: () => {}
              })
            }
          })
        } else {
          // 否则，先通过 wx.createUserInfoButton 接口发起授权
          let button = wx.createUserInfoButton({
            type: 'text',
            text: '获取用户信息',
            style: {
              left: 10,
              top: 76,
              width: 200,
              height: 40,
              lineHeight: 40,
              backgroundColor: '#ff0000',
              color: '#ffffff',
              textAlign: 'center',
              fontSize: 16,
              borderRadius: 4
            }
          })
          button.onTap((res) => {
            // 用户同意授权后回调，通过回调可获取用户头像昵称信息
            console.log(res)

            wx.getPrivacySetting({
              success: res => {
                console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
              },
              fail: () => {},
              complete: () => {}
            })
          })
        }
      }
    })
  }

  getPhoneNumber = () => {
    wx.getPhoneNumber({
      phoneNumberNoQuotaToast: true,
      complete: (res: any) => {
        console.log(res.code) // 动态令牌
        console.log(res.errMsg) // 回调信息（成功失败都会返回）
        console.log(res.errno)  // 错误码（失败时返回）
      }
    })
  }

  requestSubscribeMessage = () => {
    this.sdk.requestSubscribeMessage(
      {
        // 替换为微信公众平台配置的订阅消息模板 ID
        tmplIds: ['Y7BC0R_NoKFFzL7qk52koqsfrlth1S-sT2jFidq2R-g']
      },
      {
        complete: (data: any) => {
          console.log('requestSubscribeMessage complete: ', data)
        }
      }
    )
  }

  getRelationFriendList = () => {
    this.sdk.getRelationFriendList(
      {},
      {
        complete: (data: any) => {
          console.log('getRelationFriendList complete: ', data)
        }
      }
    )
  }

  shareSchedulingInit = () => {
    this.sdk.shareSchedulingInit(
      {
        funcs: []
      },
      {
        complete: (data: any) => {
          console.log('shareSchedulingInit: ', data)
        }
      }
    )
  }
  getShareData = () => {
    this.sdk.getShareData(
      {
        func: 'maidian', // 'youdao' 'sdk' 'maidian'
        transmits: 'a=1&b=2'
        // region: 'en'
      },
      {
        complete: (data: any) => {
          console.log('getShareData complete: ', data)
        }
      }
    )
  }
  share = () => {
    // this.sdk.share(
    //   {
    //     func: 'syfx', // 'youdao' 'sdk'
    //     transmits: 'a=1&b=2',
    //     readCache: false
    //   },
    //   {
    //     complete: (data: any) => {
    //       console.log('share complete: ', data)
    //     }
    //   }
    // )

    this.sdk.schedulingAction(
      {
        func: 'maidian',
      },
      {
        complete: (data: any) => {
          console.log('schedulingAction complete: ', data)
        }
      }
    )
  }
  getShareScheduling = () => {
    const data = this.sdk.getShareScheduling()
    console.log('getShareScheduling res: ', data)
  }
  schedulingReport = () => {
    this.sdk.shareSchedulingReport(
      {
        func: 'syfx',
        scheduling_type: 'share',
        scheduling_event: true
      },
      {
        complete: (data: any) => {
          console.log('schedulingReport complete: ', data)
          this.getShareScheduling()
        }
      }
    )
  }
  test2 = () => {
    this.sdk._openCustomerServiceConversation(
      {
        complete: (data) => {
          console.log('测试1', data)
        }
      },
      { sessionFrom: "{\"ruixue_openid\":\"xxx\"}" }
      
    )
  }
  pay = () => {
    this.sdk.pay(
      {
        'goods_tag': 'bytest',
        'trade_no': '2409104055334559122',
        'indulge_auth': 0,
        'pay_type': 'minigame_v2',
        // 'preview_image': true,
        // 'pay_type': 'wechath5',
        // 'pay_type': 'wxpub',
        'envVersion': 'trial',
        // 'short_url': 's.ruixuecloud.com',
        // 'miniprogram_args': {
        //   a: 1,
        //   b: 2
        // },
        // 'direct_send': true,
        // 'title': '发送给用户的支付卡片标题',
        // 'desc': '发送给用户的支付卡片描述',
        // 'image': 'https://oss.ruixuecloud.com/material/station/1722306321550_%E5%9B%BE%E5%B1%82%20583%20(1).png',
        'miniprogram_name': '喵星旅行'
      },
      {
        complete: (data: any) => {
          console.log('pay complete', data)
        }
      }
    )
  }

  payJump = () => {
    this.sdk.pay(
      {
        'goods_tag': 'bytest',
        'trade_no': '' + new Date().getTime(),
        'pay_type': 'jump_miniprogram',
        'envVersion': 'trial',
        'miniprogram_name': '喵星旅行'
      },
      {
        complete: (data: any) => {
          console.log('pay complete', data)
        }
      }
    )
  }

  payPreviewImage = () => {
    this.sdk.pay(
      {
        'goods_tag': 'bytest',
        'trade_no': '' + new Date().getTime(),
        'pay_type': 'jump_miniprogram',
        'preview_image': true,
        'miniprogram_args': {
          a: 1,
          b: 2
        },
        'miniprogram_name': '喵星旅行'
      },
      {
        complete: (data: any) => {
          console.log('pay complete', data)
        }
      }
    )
  }

  payIos = () => {
    this.sdk.pay(
      {
        'goods_tag': 'bytest',
        'trade_no': '' + new Date().getTime(),
        'pay_type': 'wxpub',
        'direct_send': true,
        'title': '发送给用户的支付卡片标题',
        'desc': '发送给用户的支付卡片描述',
        'image': 'https://oss.ruixuecloud.com/material/station/1722306321550_%E5%9B%BE%E5%B1%82%20583%20(1).png'
      },
      {
        complete: (data: any) => {
          console.log('pay complete', data)
        }
      }
    )
  }

  payV3 = () => {
    this.sdk.pay(
      {
        pay_type: 'midas_game_item',
        goods_tag: 'paytest',
        trade_no: '1000200000000asd75',
        indulge_auth: 0,
        env: 1
      },
      {
        complete: (data: any) => {
          console.log('pay complete', data)
        }
      }
    )
  }

  payV2 = () => {
    this.sdk.pay(
      {
        pay_type: 'wxpub',
        goods_tag: 'com.super.stars.ruixue.1',
        trade_no: '' + new Date().getTime(),
        transmit_args: 'a=1&b=2',
        callback_from: 0,

        indulge_auth: 0,
        notify_url: 'http://www.baidu.com'
      },
      {
        complete: (data: any) => {
          console.log('pay', data)
        },
        paySuccCallback: async () => {
          console.log('pay success')
          return Promise.resolve().then(() => console.log(11111))
        }
      }
    )
  }
  compensatePayOrder = () => {
    this.sdk.compensatePayOrder({
      notify_url: 'https://anhvcpo.weilekuiming.com/v1/ke/callback/f_channel/142/818/minigame_v2',
      wx_openid: 'oaK5n5EWeUyCv3G4MFCZ5tIjYhkc',
      order_no: '2409105106948068v1',
      amount: 10,
      env: 0,
      zone_id: '1',
      pf: 'android'
    }, {
      complete: (data: any) => {
        console.log('主动补单 complete: ', data)
      }
    })
  }
  track = () => {
    this.sdk.track(
      {
        complete: (data: any) => {
          console.log(data)
        },
        businessCallback: (data: any) => {
          console.log('track businessCallback:', data)
        }
      },
      {
        event: '#test',
        properties: {
          scenes_id: '1'
        },
        type: 'track'
      }
    )
  }
  rewardedVideoAd = () => {
    this.sdk.rewardedVideoAd(
      {
        adUnitId: '81d0635de0cabb5dc47447a2cea353f3' //,'adunit-e55c963bab89ce7e',
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  getDirectAdStatusSync = () => {
    const data = this.sdk.getDirectAdStatusSync()
    console.log('getDirectAdStatusSync:', data)
  }
  onDirectAdStatusChange = () => {
    this.sdk.onDirectAdStatusChange((data: any) => {
      console.log('onDirectAdStatusChange:', data)
    })
  }
  checkHasAd = () => {
    this.sdk.rewardedVideoAd(
      {
        adUnitId: '81d0635de0cabb5dc47447a2cea353f3', //,'adunit-e55c963bab89ce7e',
        isCheck: true
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  bannerAd = () => {
    this.sdk.bannerAd(
      {
        adUnitId: '81d0635de0cabb5dc47447a2cea353f3'
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  interstitialAd = () => {
    this.sdk.interstitialAd(
      {
        adUnitId: 'adunit-4de541945b96f1fb'
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  deregister = () => {
    this.sdk.deregister(
      {
        idcard: '220181198905050039',
        realname: '徐继超',
        cpdata: 'abc'
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  deregisterCancel = () => {
    this.sdk.deregisterCancel({
      complete: (data: any) => {
        console.log(data)
      }
    })
  }
  sendCaptcha = () => {
    this.sdk.sendCaptcha(
      {
        // email: '1296546349@qq.com',
        phone: '18626656376',
        purpose: 'bindphone'
      },
      {
        complete: (data) => {
          console.log('sendCaptcha complete: ', data)
        }
      }
    )
  }
  infoSync = () => {
    this.sdk.infoSync({
      complete: (data: any) => {
        console.log('infoSync complete: ', data)
      }
    })
    // this.updateInfo()
  }
  getInfo = () => {
    this.sdk.getInfo({
      complete: (data: any) => {
        console.log('getInfo complete: ', data)
      }
    })
  }
  userInfoSilentSync = () => {
    this.sdk.userInfoSilentSync(
      {
        desc: ''
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  updateInfo = () => {
    this.sdk.updateInfo(
      {
        nickname: '我的狼',
        avatarurl: 'xxx',
        region: 'xxx',
        sex: 0
      },
      {
        complete: (data: any) => {
          console.log('updateInfo: ', data)
        }
      }
    )
  }
  refreshToken = () => {
    this.sdk.refreshSessionFunc()
  }
  startReportLoaction = () => {
    this.sdk.startReportLoaction(
      {
        types: ['test1'],
        reportSpace: 3000
      },
      {
        complete: (data: any) => {
          console.log('startReportLoaction complete:', data)
        }
      }
    )
  }
  stopReportLocation = () => {
    this.sdk.stopReportLocation()
  }
  deleteReportLocation = () => {
    this.sdk.deleteReportLocation(
      {
        types: ['test1']
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }

  authorizeLocation = () => {
    this.sdk.authorizeLocation({
      complete: (data) => {
        console.log('authorizeLocation complete:', data)
      }
    })
  }
  getNearlyPeasonByRadius = () => {
    this.sdk.getNearlyPeasonByRadius(
      {
        type: 'test',
        lon: 14.2079746,
        lat: 14.2079746,
        radius: 1000.0,
        count: 0,
        page: 1,
        page_size: 100
      },
      {
        complete: (data) => {
          console.log('getNearlyPeasonByRadius complete:', data)
        }
      }
    )
  }
  /** 社交关系 start */
  setcustom = () => {
    this.sdk.setcustom(
      {
        custom: 'abc'
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  addRelation = () => {
    this.sdk.addRelation(
      {
        target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
        types: {
          test: true
        },
        target_remarks: '无情',
        user_remarks: '卧槽'
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
    // this.sdk.deleteRelation(
    //   {
    //     target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
    //     types: {
    //       test: true,
    //     },
    //   },
    //   {
    //     complete: (data: any) => {
    //       console.log(data)
    //     },
    //   }
    // )
    // this.sdk.hasRelation(
    //   {
    //     type: "test",
    //     target: "",
    //   },
    //   {
    //     complete: (data) => {
    //       console.log(data);
    //     },
    //   }
    // )
  }
  updateremarks = () => {
    // this.sdk.updateremarks(
    //   {
    //     target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
    //     type: 'test',
    //     // target_remarks: true,
    //   },
    //   {
    //     complete: (data: any) => {
    //       console.log(data)
    //     },
    //   }
    // )
    this.sdk.relationList(
      {
        target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
        type: 'test'
        // target_remarks: true,
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }
  addFriend = () => {
    this.sdk.addFriend(
      {
        target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
        target_remarks: 'xxxxx',
        user_remarks: ''
      },
      {
        complete: (data) => {
          console.log(data)
        }
      }
    )
    this.sdk.delfriend(
      {
        target: ''
      },
      {
        complete: (data) => {
          console.log(data)
        }
      }
    )
    this.sdk.updatefriendremarks(
      {
        target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
        target_remarks: 'xxxxx'
      },
      {
        complete: (data) => {
          console.log(data)
        }
      }
    )
    this.sdk.isfriend(
      {
        target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4'
      },
      {
        complete: (data) => {
          console.log(data)
        }
      }
    )
  }
  getranklist = () => {
    this.sdk.getranklist(
      {
        rank_id: '0_100_168_weekly',
        start_rank: 1,
        end_rank: 2
      },
      {
        complete: (data) => {
          console.log(data)
        }
      }
    )
  }
  /** 社交关系 end */
  msgSecCheck = () => {
    // this.sdk.msgSecCheck(
    //   { content: '卧槽', scene: 1, openid: 'oSy7j5azhPvHA70f99TxtXsugC0A', version: 2 },
    //   {
    //     complete: (data: any) => {
    //       console.log(data)
    //     },
    //   }
    // )
    this.sdk.mediaCheckAsync(
      {
        urls: ['https://td-assets.weile.com/local/beta/message/115029627_115029628_682.png'],
        scenes: ['porn']
      },
      {
        complete: (data: any) => {
          console.log(data)
        }
      }
    )
  }

  authorize = () => {
    this.sdk.authorize(
      {
        version: 'normal',
        method: 'mobileqq'

        // login_openid:
        //   'aFJLEmPDGg9ipyhoXiGsJqN3ZGcy2ujeM6+l1LMS6i/pIbWd7y/IZkFAh7rvNX/upXdxqVFs8Q7OAjr/6VYv28BGezUWM6lDBvipWJXVafNQShjK3ru54mQMm4lNoNvDg24CPYrGmrdmUltpapyYShWdCObxsKQdZttYozUq2HlCUyH5tTYqSnme6Zl3CJbKpYJjcoIxQ01m7os2leYKtbJxgtkzac9nvQmSkCk1PqWD/8cQ/4omc/wvcqryPWNDtAcj+FDXN/UY39AniAllxFjMlRZ11YnaipPjqr+dv3EtxkwRx97u1SVPgAevdYy+',
        // sign_fields: ['age'],
      },
      {
        complete: (data: any) => {
          console.log('authorize complete: ', data)
        }
      }
    )
  }

  isAuthorizeUserInfo = () => {
    this.sdk.isAuthorizeUserInfo({
      complete: (data: any) => {
        console.log('isAuthorizeUserInfo complete: ', data)
      }
    })
  }

  checkVersionAPP = () => {
    this.sdk.checkAppVersion(
      {
        type: 'u3d',
        format: 'json',
        devicecode: '0000',
        clientversion: '1.0.0.0',
        region: 0
      },
      {
        complete: (data: any) => {
          console.log('checkVersionAPP complete: ', data)
        }
      }
    )
    // this.sdk.checkVersion(
    //   {
    //     type: 'js',
    //     format: 'json',
    //     devicecode: 'test',
    //     clientversion: '1.0.1.0',
    //     region: 150000,
    //     games: { '5157686': 0 },
    //     activities: null,
    //   },
    //   {
    //     complete: (data: any) => {
    //       console.log('checkVersionAPP complete: ', data)
    //     },
    //   }
    // )
  }

  checkVersionGame = () => {
    this.sdk.checkGameVersion(
      {
        type: 'js',
        format: 'json',
        gameid: 1041697,
        gameversion: 0
      },
      {
        complete: (data: any) => {
          console.log('checkVersionGame complete: ', data)
        }
      }
    )
  }
  checkVersionActivity = () => {
    this.sdk.checkActivityVersion(
      {
        type: 'js',
        format: 'json',
        activityshortname: 'xxx',
        activityversion: 1
      },
      {
        complete: (data: any) => {
          console.log('checkVersionGame complete: ', data)
        }
      }
    )
  }
  getBusinessData = () => {
    this.sdk.getBusinessData(
      {
        // window_key : "0",
        // event : "谪守巴陵郡。越明年，政通人和，百废具兴，",
        // before_event : "ltv"
        window_key: 'nmlyd',
        event: '#share_get_data'
      },
      {
        complete: (data: any) => {
          console.log('getBusinessData1 complete: ', data)
        }
      }
    )
    this.sdk.getBusinessData(
      {
        // window_key: 'sfnj',
        // event: 'dwt',
        // before_event : "#share_get_data",
        window_key: 'sfnj',
        event: '#share_get_data'
      },
      {
        complete: (data: any) => {
          console.log('getBusinessData2 complete: ', data)
        }
      }
    )
    this.sdk.getBusinessData(
      {
        window_key: 'sfnj',
        event: 'dwt',
        before_event: '#share_get_data'
      },
      {
        complete: (data: any) => {
          console.log('getBusinessData3 complete: ', data)
        }
      }
    )
  }
  getAllBusinessData = () => {
    this.sdk.getAllBusinessData({
      complete: (data: any) => {
        console.log('getAllBusinessData complete: ', data)
      }
    })
  }
  refreshBusinessData = () => {
    this.sdk.refreshBusinessData(
      {
        complete: (data: any) => {
          console.log('refreshBusinessData complete: ', data)
        }
      },
      true
    )
    // 测试商业化接口队列 true
    this.getBusinessData()
  }
  setPublicProperties = () => {
    const result = this.sdk.setPublicProperties({ a: 1, b: 2, scenes_id: 'new' })
    console.log('setPublicProperties: ', result)
  }
  updatePublicProperties = () => {
    this.sdk.updatePublicProperties({ a: 'update', c: 4, b: 6, scenes_id: 'update' })
  }
  deletePublicProperties = () => {
    const result = this.sdk.deletePublicProperties('a')
    console.log('deletePublicProperties: ', result)
  }
  getPublicProperties = () => {
    const result = this.sdk.getPublicProperties()
    console.log('getPublicProperties: ', result)
  }

  getFeedbackKindList = () => {
    this.sdk.getFeedbackKindList({
      complete: (data: any) => {
        console.log('getFeedbackKindList:', data)
      }
    })
  }
  createFeedback = () => {
    this.sdk.createFeedback(
      {
        game_id: 100,
        kind_id: 1,
        kind_name: '意见反馈类型',
        priority: 1,
        content: '说明',
        picture: '图片url',
        player_gameid: '玩家游戏id',
        send_voided_mails: 1
      },
      {
        complete: (data: any) => {
          console.log('createFeedback:', data)
        }
      }
    )
  }
  satisfactionEvaluation = () => {
    this.sdk.satisfactionEvaluation(
      {
        key_number: 10,
        pleased_status: 1,
        reason: 'good'
      },
      {
        complete: (data: any) => {
          console.log('createFeedback:', data)
        }
      }
    )
  }

  getUserInteractiveStorage = () => {
    this.sdk.getUserInteractiveStorage(
      {
        keyList: ['1', '2', '3']
      },
      {
        complete: (data: any) => {
          console.log('getUserInteractiveStorage:', data)
        }
      }
    )
    // this.sdk.removeUserCloudStorage(
    //   {
    //     keyList: ['1'],
    //   },
    //   {
    //     complete: (data: any) => {
    //       console.log('removeUserCloudStorage:', data)
    //     },
    //   }
    // )
    this.setUserCloudStorage()
  }

  setUserCloudStorage = () => {
    let gameScoreData = {
      wxgame: {
        score: 16,
        update_time: new Date().getTime()
      },
      cost_ms: 36500
    }

    const userKVData = {
      key: 'score',
      value: JSON.stringify(gameScoreData)
    }

    const userKVData2 = { key: 'gold', value: '3000' }
    const KVDataListReq = [userKVData, userKVData2]
    console.log('wx.setUserCloudStorage KVDataList: ', KVDataListReq)
    this.sdk.setUserCloudStorage(
      {
        KVDataList: KVDataListReq
      },
      {
        complete: (data: any) => {
          console.log('setUserCloudStorage:', data)
        }
      }
    )
  }

  getHelpcenterMainLayout = () => {
    // this.sdk.getHelpcenterMainLayout(
    //   {
    //     complete: (data: any) => {
    //       console.log('getHelpcenterMainLayout:', data)
    //     }
    //   }
    // )

    this.sdk.getHelpcenterQuestionLayout(
      {
        id: 1
      },
      {
        complete: (data: any) => {
          console.log('getHelpcenterMainLayout:', data)
        }
      }
    )
  }
  decryptionDate = () => {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于获取昵称和头像'
    }).then((res) => {
      console.log(res)
      const { encryptedData, iv } = res
      this.sdk.decryptionDate({ encrypted_data: encryptedData, iv }, {
        complete(res) {
          console.log(res)
        }
      })
    })
  }
  getUserDeviceCode = () => {
    console.log(this.sdk.getUserDeviceCode())
  }
  testParallel = () => {
    this.refreshBusinessData()
    this.getShareData()
    this.payV2()
    this.track()
    this.checkVersionAPP()
    this.checkVersionGame()
    this.checkVersionActivity()
  }
}

export default Demo
