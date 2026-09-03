import { Reward, RXApi, LoginData, LoginMethod, RXError, RXLoginConfig, RXResult, RXConfig, RXRequest, NearbyTransferService, NearbyEventType, Logger } from 'hmssdk';
import { gameNearbyTransfer, gamePlayer } from '@kit.GameServiceKit';
// import Logger from 'hmssdk/src/main/ets/utils/Logger';
import { App, display, promptAction, PromptAction, router } from '@kit.ArkUI';
import { BusinessError, deviceInfo, pasteboard } from '@kit.BasicServicesKit';
import Passport from 'hmssdk/src/main/ets/base/Passport';
import { Util } from '../common/Util';
import { ConfigListDialog } from './ConfigListDialog';
import { BindPhoneDialog } from './BindPhoneDialog';

import 'hmssdk/src/main/ets/demo/Demo.ets'; // 引入共享包中的命名路由页面
import 'hmssdk/src/main/ets/demo/NearbyDemo.ets';
import { ConfigByCpid } from './ConfigList';
import { i18n } from '@kit.LocalizationKit';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import Devices from 'hmssdk/src/main/ets/utils/Devices';

let SDK: RXApi

interface UpdateGameVersion {
  "module_id": number;
  "clientversion": number;
  "checkversion": number;
}

interface UpdateGameVersionParm {
  "modules": UpdateGameVersion[];
  "type"?: string;
  "format"?: string;
}

@Entry
@Component
struct Main {
  uiContext: UIContext = this.getUIContext();
  promptAction: PromptAction = this.getUIContext().getPromptAction();
  @State message: string = 'Hello World';
  @State title: Resource = $r('app.media.rx_logo');
  @State userName: string = '';
  @State password: string = '';
  @State login_method?: string = undefined;
  @State login_openid?: string = undefined;
  @State text: string = 'log';
  // @State config: string = '';
  @State cdkey: string = '';
  @State knockFunc: string = 'peng-test';
  scroller: Scroller = new Scroller()
  cpuserid?: string = undefined // "17760" //"442099939"
  agreement = `<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001'>《用户协议》</a>` +
    `、<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002'>《隐私政策》</a>`;
  privacy =
    `    在您使用我们（微乐）服务前，请您务必审慎阅读、充分理解${this.agreement}的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意${this.agreement}请点击“同意”开始使用我们的服务。`;
  props?: Reward[] = [
    {
      "name": "11",
      "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
      "tag": "2",
      "num": 12,
      "num_format": "x12个",
    }, {
    "name": "11",
    "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
    "tag": "2",
    "num": 1,
    "num_format": "x1个",
  }
  ]
  mark: boolean = false
  @State config: RXConfig = ConfigByCpid("1000197")

  showText(text: string | object) {
    if (typeof text == 'object') {
      this.text = JSON.stringify(text, null, 2)
    } else {
      this.text = text
    }
    NearbyTransferService.getInstance()
    Logger.debug(text)
  }

  showDialog() {
    let dialogController: CustomDialogController
    dialogController = new CustomDialogController({
      builder: ConfigListDialog({
        confirm: (data) => {
          this.config = data
          dialogController.close();
          this.init();
        }
      }),
      autoCancel: false,
      alignment: DialogAlignment.Center,
      // offset: { dx: 0, dy: -20 },
      // gridCount: 4,

      customStyle: true,
    })
    dialogController.open()
  }

  showBindPhoneDialog() {
    let dialogController: CustomDialogController
    dialogController = new CustomDialogController({
      builder: BindPhoneDialog({
        uiContext: this.getUIContext(),
        onResult: (text: string) => {
          this.showText(text)
        }
      }),
      autoCancel: true,
      alignment: DialogAlignment.Center,
      customStyle: true,
    })
    dialogController.open()
  }

  aboutToAppear(): void {

    let displayClass: display.Display | null = null;
    displayClass = display.getDefaultDisplaySync();
    console.info('rxsdk display getDefaultDisplaySync: ' + JSON.stringify(displayClass));

    displayClass.getCutoutInfo((err: BusinessError, data: display.CutoutInfo) => {
      const errCode: number = err.code;
      if (errCode) {
        console.error(`rxsdk display Failed to get cutoutInfo. Code: ${err.code}, message: ${err.message}`);
        return;
      }
      console.info('rxsdk display getCutoutInfo: ' + JSON.stringify(data));
    });

    Logger.info("sdkApiVersion " + deviceInfo.sdkApiVersion)

    SDK = RXApi.getInstance()
    this.init();

    SDK.share().onKnockShare(() => {
      this.invokeKnockShare();
    })
    let uiAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext


  }

  aboutToDisappear(): void {


  }

  private invokeKnockShare() {
    SDK.share().share(getContext(), {
      platform: 'hw_knock',
      func: this.knockFunc,
      // url: 'https://rxfile-test.ruixueyun.com/sdk?style=' + this.knockFunc,
      // protocol_android: 'huawei',
      // protocol_ios: 'huawei'
    }, (ret) => {
      this.showText(ret)

    });
  }

  private init() {

    // this.controller = this.dialogControllerTwo


    RXApi.getInstance().init(this.config, this.getUIContext())
      .then((resp: RXResult<object>) => {
        //初始化回调
        Logger.d("init result:  " + JSON.stringify(resp));
        this.showText(resp)
        this.promptAction.showToast({ message: resp.code == 0 ? `初始化${this.config.cpId}成功` : JSON.stringify(resp) });
      })
      .catch((e: BusinessError) => {
        Logger.d("init failed:" + e.message);
        Logger.e(e)
        this.showText(e)
        this.promptAction.showToast({ message: `初始化${this.config.cpId}失败` + JSON.stringify(e) });
      })


  }

  //
  // dialogControllerTwo: CustomDialogController | null = new CustomDialogController({
  //   builder: LoginComponent(),
  //   alignment: DialogAlignment.Bottom,
  //   onWillDismiss: (dismissDialogAction: DismissDialogAction) => {
  //     console.info("reason=" + JSON.stringify(dismissDialogAction.reason))
  //     console.log("dialog onWillDismiss")
  //     if (dismissDialogAction.reason == DismissReason.PRESS_BACK) {
  //       dismissDialogAction.dismiss()
  //     }
  //     if (dismissDialogAction.reason == DismissReason.TOUCH_OUTSIDE) {
  //       dismissDialogAction.dismiss()
  //     }
  //   },
  //   offset: { dx: 0, dy: -25 }
  // })

  // controller?: CustomDialogController
  // // 若尝试在CustomDialog中传入多个其他的Controller，以实现在CustomDialog中打开另一个或另一些CustomDialog，那么此处需要将指向自己的controller放在所有controller的后面
  // cancel: () => void = () => {
  // }
  // confirm: () => void = () => {
  // }

  build() {
    Column() {
      // this.Header()

      Scroll(this.scroller) {
        Column() {
          Text(RXApi.getInstance().appName + " " + JSON.stringify(this.config)).margin({ top: 5 }).onClick(() => {
            copyText(JSON.stringify(this.config))
          }).alignSelf(ItemAlign.Start)

          Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })

          Flex({
            wrap: FlexWrap.Wrap,
            justifyContent: FlexAlign.SpaceBetween,
          }) {
            // Button("SwitchConfig")
            //   .btnStyle()
            //   .onClick(async () => {
            //     router.pushUrl({
            //       url: 'pages/CPConfigList'
            //     })
            //   })
            Button("切换配置")
              .btnStyle()
              .onClick(async () => {
                this.showDialog()
              })

            Button("APIDemo")
              .btnStyle()
              .onClick(async () => {
                try {
                  this.getUIContext().getRouter().pushNamedRoute({
                    name: 'Demo',
                    params: {
                      data1: 'message',
                      data2: {
                        data3: [123, 456, 789]
                      }
                    }
                  })
                } catch (err) {
                  let message = (err as BusinessError).message
                  let code = (err as BusinessError).code
                  console.error(`pushNamedRoute failed, code is ${code}, message is ${message}`);
                }

                // router.pushUrl({
                //   url: 'pages/AnnouncementTest',
                //   params: new routerParams('message', [123, 456, 789])
                // })
              })
            Button("快传 Demo")
              .btnStyle()
              .onClick(async () => {
                this.getUIContext().getRouter().pushNamedRoute({
                  name: 'NearbyDemo',
                }).catch(() => {
                  // TODO: Implement error handling.
                })
              })
            Button("版本检查")
              .btnStyle()
              .onClick(async () => {
                let updateParams: UpdateGameVersionParm = {
                  "modules": [
                    ({
                      "module_id": 2,
                      "clientversion": 1,
                      "checkversion": 0
                    } as UpdateGameVersion)
                  ]
                };
                RXApi.getInstance().updateGameVersion(updateParams, (res) => {
                  this.showText(res)
                }).then((resp) => {

                  this.promptAction.showToast({ message: "版本检查:" + JSON.stringify(resp) });
                })

              })
            Button("旧版本检查")
              .btnStyle()
              .onClick(async () => {

                RXApi.getInstance().checkAppUpdate("1.2.1", "150000", undefined, (res) => {

                  this.showText(res)
                }, "POST").then((resp) => {

                  this.promptAction.showToast({ message: "版本检查:" + JSON.stringify(resp) });
                })

              })

            // Button("发送快传")
            //   .btnStyle()
            //   .onClick(async () => {
            //
            //     NearbyTransferService.getInstance().autoBindNearbyGame((dat) => {
            //       Logger.d("autoBindNearbyGame result", dat)
            //
            //     })
            //   })
            // Button("接收快传")
            //   .btnStyle()
            //   .onClick(async () => {
            //
            //     NearbyTransferService.getInstance().publish((dat) => {
            //       Logger.d("publish result", dat)
            //
            //     })
            //
            //
            //   })
            Button("碰一碰大卡")
              .btnStyle()
              .onClick(async () => {
                this.knockFunc = 'peng-big'
                this.promptAction.showToast({ message: "已切换为碰一碰大卡模式" });

                // 获取系统语言
                let systemLanguage: string = i18n.System.getSystemLanguage(); // systemLanguage为当前系统语言

                // 获取系统地区
                let systemRegion: string = i18n.System.getSystemRegion(); // systemRegion为当前系统地区

                // 获取系统区域
                let systemLocale: string = i18n.System.getSimplifiedLanguage(i18n.System.getSystemLocale()); // systemLocale为当前系统区域

                console.log(systemLanguage)
                console.log(systemRegion)
                console.log(systemLocale)

              })

            Button("碰一碰小卡")
              .btnStyle()
              .onClick(async () => {
                this.knockFunc = 'peng-small'
                this.promptAction.showToast({ message: "已切换为碰一碰小卡模式" });
              })
            Button("系统信息")
              .btnStyle()
              .onClick(async () => {
                let securityPatchTagInfo: string = deviceInfo.securityPatchTag;

                let msg =
                  `displayVersion: ${deviceInfo.displayVersion} \n
distributionOSVersion: ${deviceInfo.distributionOSVersion}(${deviceInfo.sdkApiVersion}) \n
distributionOSApiVersion: ${deviceInfo.distributionOSApiVersion}`
                this.showText(msg)

              })
            Button("获取分享内容")
              .btnStyle()
              .onClick(async () => {

                RXApi.getInstance().share().getShareData({ func: "peng-big", platform: "hw_knock" }, (res) => {
                  this.showText(res)
                })
              })
            Button('公告UI')
              .btnStyle()
              .onClick(async () => {
                SDK.showAnnouncementUI(this.getUIContext(), { limit: 1 })
              })
            Button('公告列表UI')
              .btnStyle()
              .onClick(async () => {
                SDK.showAnnouncementUI(this.getUIContext(), { limit: 100 })
              })
            Button('站内信UI')
              .btnStyle()
              .onClick(async () => {
                SDK.showMailUI(this.getUIContext())
              })

            Button('意见反馈UI')
              .btnStyle()
              .onClick(async () => {
                SDK.showFeedbackUI(this.getUIContext(), ["tag1", "tag2"])
              })
            Button('微信红包')
              .btnStyle()
              .onClick(async () => {
                SDK.wechat().openBusinessView({ "wx_appid": "", "query": "" })
              })
            Button("实名认证UI")
              .btnStyle()
              .onClick(() => {
                SDK.showRealNameUI(this.getUIContext(), (r) => {
                  Logger.debug("showRealNameUI clicked" + JSON.stringify(r))

                }, this.mark ? this.props : [], true)
                this.mark = !this.mark
              })

            Button("用户中心UI")
              .btnStyle()
              .onClick(() => {
                try {
                  SDK.showUserCenterUI(this.getUIContext(), { custom_params: { game_user_id: "rx_100000" } }).catch((error: object) => {

                    this.promptAction.showToast({ message: typeof (error) + " unknown error " + JSON.stringify(error) })
                  })
                } catch (e) {
                  this.promptAction.showToast({ message: JSON.stringify(e) })
                }
              })

            Button('用户协议UI')
              .btnStyle()
              .onClick(async () => {

                RXApi.getInstance().showUserPrivacyPolicyUI(this.getUIContext(), this.privacy, "用户协议和隐私政策", (e) => {
                  Logger.d("tttshowUserPrivacyPolicyUI result :" + JSON.stringify(e))
                  if (e.code == 6000) {
                    getContext().getApplicationContext().killAllProcesses()
                  }
                })
              })
            Button('隐私政策UI')
              .btnStyle()
              .onClick(() => {
                SDK.showPrivacyUI(this.getUIContext(), { key_list: ["00001", "00002"], key: "00001" })
              })
            Button('忘记密码UI')
              .btnStyle()
              .onClick(() => {
                SDK.showForgotPasswordUI(this.getUIContext())
              })

            Button('联系客服UI')
              .btnStyle()
              .onClick(() => {
                SDK.showChatServicesUI(this.getUIContext(), {})
              })

            Button('帮助中心UI')
              .btnStyle()
              .onClick(() => {
                SDK.showHelperCenterUI(this.getUIContext())
              })
            Button('注销账号UI')
              .btnStyle()
              .onClick(() => {
                SDK.applyForDeregisterUI(this.getUIContext())
              })
            Button("客服消息未读数")
              .btnStyle()
              .onClick(() => {
                try {
                  SDK.getServiceChatUnreadCount().then((resp) => {
                    this.promptAction.showToast({ message: JSON.stringify(resp) })

                  }).catch((error: object) => {
                    this.promptAction.showToast({ message: typeof (error) + " unknown error " + JSON.stringify(error) })
                  })
                } catch (e) {
                  this.promptAction.showToast({ message: JSON.stringify(e) })
                }
              })
            Button("清除客服未读数")
              .btnStyle()
              .onClick(() => {
                try {
                  SDK.clearServiceChatUnreadCount().then((resp) => {
                    this.promptAction.showToast({ message: JSON.stringify(resp) })

                  }).catch((error: object) => {
                    this.promptAction.showToast({ message: typeof (error) + " unknown error " + JSON.stringify(error) })
                  })
                } catch (e) {
                  this.promptAction.showToast({ message: JSON.stringify(e) })
                }
              })

          } //flex end


          Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })

          Flex({
            wrap: FlexWrap.Wrap,
            justifyContent: FlexAlign.SpaceBetween,
          }) {

            Button("Init")
              .btnStyle()
              .onClick(async () => {
                this.init()

              })

            Button("UnionLogin")
              .btnStyle()
              .onClick(async () => {
                this.unionLogin(false);
              })
            Button("SwitchLogin")
              .btnStyle()
              .onClick(async () => {
                this.unionLogin(true);
              })
            Button('GuestLogin')
              .btnStyle()
              .onClick(async () => {
                // this.showLoginDialog()
                try {
                  await SDK.login({ method: LoginMethod.Guest }).then((resp: RXResult<LoginData>) => {
                    this.promptAction.showToast({ message: JSON.stringify(resp) })

                    this.login_method = resp.data?.login_method
                    this.login_openid = resp.data?.login_openid
                    Logger.d("登录结果：" + JSON.stringify(resp))

                    this.showText(resp)
                  }).catch((e: BusinessError) => {
                    this.promptAction.showToast({ message: JSON.stringify(e) })
                    this.showText(e)
                  })
                } catch (e) {
                  this.showText(e)
                  this.promptAction.showToast({ message: JSON.stringify(e) })
                }
              })
            Button('Test3Login')
              .btnStyle()
              .onClick(async () => {
                // this.showLoginDialog()
                try {
                  await SDK.login({ method: LoginMethod.UserName, username: "test3", password: "111111aA!" }).then((resp: RXResult<object>) => {
                    Logger.d(JSON.stringify(resp))
                    this.promptAction.showToast({ message: JSON.stringify(resp) })
                    this.showText(resp)
                  }).catch((e: BusinessError) => {
                    this.promptAction.showToast({ message: JSON.stringify(e) })
                    this.showText(e)
                  })
                } catch (e) {
                  this.showText(e)
                  this.promptAction.showToast({ message: JSON.stringify(e) })
                }
              })

            Button('Login')
              .btnStyle()
              .onClick(() => {
                // this.showLoginDialog()

                SDK.showLoginUI(this.getUIContext(), {
                  canCloseRealAuth: true,
                  privacyUrl1: "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00001",
                  privacyUrl2: "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00002?lang=zh",
                  privacyUrl3: "https://umusblhbv.wjhmqn.com/static/landing/#/v1/legal/terms/142/100/00005",
                  privacyText3: "儿童隐私",
                  logoResource: "app.media.logo_2",
                  // loginMethods: [{ method: 'captchacode' }, { method: 'username' }, { method: 'wechat' }, { method: 'guest' }]
                }, (err: RXError, ret?: RXResult<LoginData | object>) => {
                  if (err) {
                    Logger.e(err.message)
                    this.promptAction.showToast({ message: "登录失败：" + JSON.stringify(err.message) })
                  } else {
                    this.showText(JSON.stringify(ret))
                    this.promptAction.showToast({ message: "登录结果：" + JSON.stringify(ret) })
                  }
                })

              })
            Button("UnBind")
              .btnStyle()
              .onClick(async () => {
                let ret = await SDK.unbindPlayer()
                Logger.d(ret)
              })

            Button("Logout")
              .btnStyle()
              .onClick(async () => {
                let ret = await SDK.logout()
                Logger.d(ret)
              })

            Button("LoginOpenid")
              .btnStyle()
              .onClick(async () => {
                try {
                  let ret = await SDK.login({ method: this.login_method, login_openid: this.login_openid }).then((ret1) => {

                    Logger.d("登录结果：" + JSON.stringify(ret1))
                    return ret1
                  })
                  this.login_method = ret.data?.login_method
                  this.login_openid = ret.data?.login_openid
                  this.promptAction.showToast({ message: JSON.stringify(ret) })
                  //   .catch((e1) => {
                  //   Logger.e("unknown error")
                  //   Logger.e(e1)
                  //
                  // })
                } catch (e) {
                  Logger.e(e)
                  this.promptAction.showToast({ message: "login error" })
                }

              })
            Button("ChangePassword")
              .btnStyle()
              .onClick(() => {
                SDK.showChangePasswordUI(this.getUIContext())
                // hilog.debug(sss, sss, sss, sss);
              })

            Button("ModifyUserInfo")
              .btnStyle()
              .onClick(() => {
                SDK.passport().updateUserInfo<object>({
                  avatarUrl: 'https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png',
                  nickname: "鸿蒙昵称" + Passport.loginData?.username,
                })
              })

            Button("BindPhone")
              .btnStyle()
              .onClick(() => {
                this.showBindPhoneDialog()
              })
            Button("HWPay")
              .btnStyle()
              .onClick(async () => {

                try {
                  let ret = await SDK.pay({
                    pay_type: "harmony",
                    goods_tag: 'goods_diamond_first_3',

                    // goods_tag: 'goods_diamond_normal_3',
                    // goods_tag: 'bytest',
                    trade_no: String(new Date().getTime())
                  })
                  this.showText(ret)
                } catch (e) {
                  Logger.e(e)
                }

                // hilog.debug(sss, sss, sss, sss);
              })
            Button("WXPay")
              .btnStyle()
              .onClick(() => {

                SDK.pay({
                  pay_type: "wechat",
                  goods_tag: 'goods_diamond_normal_3',
                  // goods_tag: 'bytest',
                  trade_no: String(new Date().getTime())
                })
              })


            Button('trackData')
              .btnStyle()
              .onClick(() => {
                let p: ESObject = { "now": Date.now() }
                RXApi.getInstance().trackData({ event_name: "test", properties: p })
              })

            Button("OssTest")
              .btnStyle()
              .onClick(async () => {
                let filesDir = getContext().filesDir;
                let content = "Try to write str."
                let path = filesDir + '/test.txt'

                // let ret = await rxsdk.uploadFile("test.txt", path, ( resp) => {
                //   Logger.d("uploadFile result:" + JSON.stringify(resp))
                // })
                // Logger.d("uploadFile result1:" + JSON.stringify(ret))

              })
            Button('md5test')
              .btnStyle()
              .onClick(async () => {
                let s = generateRandomString(40)
                Logger.d("原数据：" + s + "  加密数据： " + Passport.md5Password(s))
              })
            Button('GetPromoDisplayKey')
              .btnStyle()
              .onClick(async () => {
                SDK.passport().getPromoDisplayKEY((resp) => {

                  this.cdkey = resp?.data?.promo_code || "未知"
                  this.showText(resp)

                }, true)

              })
            Button('ExchangePromoCDKEY')
              .btnStyle()
              .onClick(async () => {

                SDK.passport().exchangePromoCDKEY(this.cdkey, (resp) => {
                  this.showText(resp)
                })

              })

            Button('getAnnouncement')
              .btnStyle()
              .onClick(async () => {
                SDK.operation().getAnnouncement(100, (resp) => {
                  this.showText(resp)

                })
              })
            Button('getEmailList')
              .btnStyle()
              .onClick(async () => {
                SDK.operation().getEmailList(SDK.loginData()?.cp_user_id || this.cpuserid, (resp) => {
                  this.showText(resp)

                })
              })
            Button('deleteEmail')
              .btnStyle()
              .onClick(async () => {
                SDK.operation().deleteEmail({
                  cp_user_id: SDK.loginData()?.cp_user_id || this.cpuserid,
                  type: 0
                }, (resp) => {
                  this.showText(resp)

                })
              })
            Button('getEmailDetail')
              .btnStyle()
              .onClick(async () => {
                let rxMailId = 564;
                SDK.operation().getEmailDetail(rxMailId, undefined, (resp) => {
                  this.showText(resp)

                })
              })

            Button('getEmailAward')
              .btnStyle()
              .onClick(async () => {
                let rxMailId = 1;
                SDK.operation().getEmailAward({
                  cp_user_id: SDK.loginData()?.cp_user_id || this.cpuserid,
                  type: 0
                }, (resp) => {
                  this.showText(resp)

                })
              })


            //   }
            // }.width("100%").layoutWeight(1)
          }

          Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })
          // Scroll() {
          //   Column() {
          Text(this.text).fontSize(11).onClick(() => {
            copyText(this.text)
          }).alignSelf(ItemAlign.Start)
        }
      }
      // .alignRules({ center: { anchor: "__container__", align: HorizontalAlign.Center } })
      // .width($r('app.float.dialog_width'))
      .layoutWeight(1)
      .align(Alignment.TopStart)
      .margin({ left: 20, right: 20, bottom: 10 })
      // .height('90%')
      // .backgroundColor(Color.Green)
      .scrollable(ScrollDirection.Vertical) // 滚动方向纵向
      .scrollBar(BarState.Off) // 滚动条常驻显示
      // .scrollBarColor(Color.Gray) // 滚动条颜色
      // .scrollBarWidth(2) // 滚动条宽度
      .friction(0.6)
    }
  }

  private unionLogin(showLoginDialog: boolean) {
    let parm: RXLoginConfig = {
      accountInfos: [{ accountName: "微乐游戏账号", accountIcon: "app.media.app_icon" }],
      showLoginDialog: showLoginDialog,
      scopes: ['profile'],
      forceAuthorization: true,
      privacyUrl3: "https://umusblhbv.wjhmqn.com/static/landing/#/v1/legal/terms/142/100/00005",
      privacyText3: "儿童隐私",
      loginPanelType: gamePlayer.LoginPanelType.BUTTON,
      indulgeAuth: 1,
      ext: {
        a: 1,
        b: "t",
        // login_openid: "qnFOihqGdBHFB8MOQ6h2bzoalQi8IgZyg5Tn1bfaLxu39p6X2eKrrUnRasebisBe6UGZ/nbX7oL1ldbJBnddMxk913DABb/4U2KpkfgHrlh+4h6Us6Fbyu1BHP9QsniuIc1sgfQVUEsYRhaoDjjv/gR8Vf7VorGqGf62ZjaJeNIrrUNTGyhTQLoQx+gsTy4Bvz4H7Ro8onYmWI2lfXWzO0iRHAXFq6VCK2oVbSEOlhgN6RlMQ9bwAbmtG0YIgz5m9A1gy+P7z9iE9VVo1X4gOZuGvoj46pN2G9AOmo+iCInKyhgqme/Sna7S7n5r/9nbGKHK4WeqmuIBO/+8z1mYZ0+M5SzDmdoaouKLYmAX4Re4EempqpIWgTfDpt9tNBIMeuOtAKQ9ZyZf3qKeGWV0AUxE+vRGkTM2qRi3ketaD+du/9bOvVwo9Y5VnPcuBztYxnwkXvg9JhqeQ2xL/EaPcfll3PIh0RfJrcmJQa9IZhmE7Ibug/WP4/OSK+UWEey2UmU7BSm4wGge5yeXTzj6dLt+8WKS7CfvF3HqjfuY1EhCeDurUrBd6J32xcPzwASCD+ZsPgp4r0UIIDwXqAG+d5FeM0dHznrg6+biuDcEr45ZFwAo6LBANHrifYAh3GUNsipLIMuVB5AET9T7JdA+cVN3OvxC8MU46dntfe8PZnqHwQarIpdKDvRln2cyiblHb20lJozL76FzQOGuwe14wpkChreCYOinMYz536g0fq0HIpp4ilrPc95gfqjJxafZGWGaX/Q1vOKFWApkIed/i15Z0vWBM3wFINUHMEUV+I6M+ESV9BB3ns0JVf6dX2peYjz2HWC7dHQrZvYmCkF+TA7bnus4epuw5IvOpKvL+scVOPkWTbJNJg7dnDiyS5JbXt0ASotQtamEItQEbDo6yfomrGOlp/+WBBcFNz9OwQ6rZ6lxIwM+i2QBVrFH/ONV",
        // method: "username"
      },
      // loginMethods: [{ method: 'captchacode' }, { method: 'guest' }, { method: 'username' }],
      logoResource: "app.media.logo_2",
      // ext: {
      //   method: "harmony",
      //   login_openid: "H0Z6B/BtXiAgworc+pzS7beYPFUoKuZyKk/dnW7dkl+pH5sUoAEuq6rNXJHhTv2ZMo1qZzQjBjXJshw0mXgPX62I2xDDPFEdBD8SKc8MOsFW3V8RykaYjKbQxBr3JkBOzC6HKsG/6BcMfiWkHAL+gpvvxrqNTnmXI+xLhMonU/wZdboVonK4AbgSABHACqQs09NwJcQ5wte9+LK700ubBGqf/a5xfqn3nTi1DVABB/VdhRCD/TN+cMrP//el7X2xzZn43JgR65ZqJbDnhjCRYh8UTaCyhrHOCn/o0k5e/U6O8alWbicjghx4odYqkTvPRGH6hxrdsjKWwaG0XI2CPSctRRIuYfQws9E66gyQugD0urMcVWNTRBRALjtHMhFUtd4CIjH0LDSF6B4Ctu+oa83JGFLMvkRLSuCkdrikGmWxkpvyflgyr6lK7kS4D38Gwf4LpEaRLC3WQWCjw6+EJVLsLyuo2vyQOnioxbymM0FjZhuMbnDd3L+U3ZpyNVgrzIfihyE7Sd4t3tsuxNqAhkPOiBz4bglZAFNH6QkwXddbDexi9+na44UWbsApul1t5uGKvLHzXhADOKGDwxzUVcj+CH77NkEzbGrKlC0JMpAuQ2H2NJ/uRRUxBMgNH2diwZkxj8SRmLArz43DUfbv3nxsCoEJkLVt8LACB2ZHcnIrvjlT+FQDhtjujap78TKWUIZVK2vgcoOza/lws70Lopg9uAW3eslbM8trdh12avq85mrXn6MBcoZabGYVhxQxEgEd5wbWqHNpyBethbDn5AOGnuKMfAW2blwIai6IatRPzMeAkF0Y0DLiKcgEUoHNTB+K663/afHqqJHhYp79Mi43PMTrEl13eZGzeE3+UmJE6clOTog6KdsJv3ipdTZ8/5gCpB8aPi+vRiMJREXnwgKliVgepKpg9yuuUQ14yZ8="
      // }
    };
    // RXApi.getInstance().passport().deregisterCancel()

    SDK.unionLogin(parm, this.getUIContext(), (err: RXError, ret?: RXResult<LoginData | object>) => {
      if (err) {
        Logger.e(err.message);
        this.promptAction.showToast({ message: "登录失败：" + JSON.stringify(err.message) });
      } else {
        Logger.e("登录结果：" + JSON.stringify(ret));
        this.promptAction.showToast({ message: "登录结果：" + JSON.stringify(ret) });
      }
    });
  }

  private async HMacTest() {
    let secret = "APy1zPf8qdS7R1M8PtSaRPVw9zEMEE9XZG4etZ4qsX2U";
    let stringToSign = `PUT

application/octet-stream
Fri, 22 Nov 2024 10:11:05 GMT
x-oss-security-token:CAISxQJ1q6Ft5B2yfSjIr5f9fcrZp7ZD2Kq8WmLEr3oRedde3IDf2zz2IHhMf3VsCeAWt/s1nm1X7f4YlqZJTJtIfkHfdsp36LJe9A75lmNvTxHvv9I+k5SANTW5KXyShb3/AYjQSNfaZY3eCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ8PGD6F00kYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gX6wo9y9zmm5LDtUSO0AWhlLBE+t6gGPX+MZkwZqUYesyuwel7epDG1CNt8BVQ/M909vccoWyb4oHNUwAOuU/bbLGMqMcMNhJ4drU3XrJJt+TsVGfASE1edO4dojc63oE9O0y3LOjISzsXlF5t8/gTQRfq6VUMI+F+JxjPyXcAS1g1+n0ElbTv1FHeR9LiZF80xOHFnHKOVmOJL84huOYQnhMopz2AGoABJyDpC1mXz9EC17TcnfJAQfzfwIpmsowBBgTWc64ioup/XjR6Lj7XPQ5Pb9gAD5J7yMVThtWNiyQZJwXjbOwcXWq99D3ub5SsYewaC3hXVXgdjgQRfc10GTZKjs3EcrCPeqxtc0xgxntC7Qes2W/Q7HrtJg6YwY5n8ZDSoQn8uZggAA==/haiqi-ruixue-test/test`; //6B 73 17 20 20 10 10 BE 74 71 E4 ED B1 D0 79 EC 2B 77 16 C2  a3MXICAQEL50ceTtsdB57Ct3FsI=

    Logger.d("test HMAC 原文:" + stringToSign);
    Logger.d("test HMAC 密钥:" + secret);

    const signaturetest = await Util.buildSignatureTest(secret, stringToSign);
    Logger.d("test HMAC signature ttt :" + signaturetest);
  }

  @Builder
  Header() {
    RelativeContainer() {
      // .backgroundColor("#FF3333")
      Row() {
        Image($r('app.media.rx_logo'))
          .width("143vp")
          .height("33vp")
          .objectFit(ImageFit.None)
          .align(Alignment.Center)
      }
      .alignRules({
        middle: { anchor: "__container__", align: HorizontalAlign.Center },
      })

      // Row() {
      //   Image($r("app.media.rx_close"))
      //     .width(30)
      //     .height(30)
      //     .onClick(() => {
      //       hilog.debug(0x0001, "rxsdk", "close click")
      //     })
      // }.alignRules({
      //   top: { anchor: "__container__", align: VerticalAlign.Top },
      //   right: { anchor: "__container__", align: HorizontalAlign.End }
      // }).margin({ right: 10 })
    }
    // .width(CommonConstants.FULL_WIDTH_PERCENT)
    // .margin({ top: 10 })
    .height(30)

    // .backgroundColor("#FF3333")
  }
}

@Extend(Button)
function btnStyle() {
  // .constraintSize({ minHeight: 40 })
  .width(150)
  .type(ButtonType.Normal)
  .labelStyle({
    maxLines: 2
  })
  // .height($r('app.float.login_btn_height'))
  // .buttonStyle(ButtonStyleMode.NORMAL)
  .fontSize(14)
  // .fontWeight(CommonConstants.BUTTON_FONT_WEIGHT)
  .margin({ top: $r('app.float.register_btn_margin_top') })
  .fontColor($r('app.color.register_font_clickable'))
  .backgroundColor($r('app.color.register_btn_clickable'))
}

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function copyText(text: string) {
  const pasteboardData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
  const systemPasteboard = pasteboard.getSystemPasteboard();
  systemPasteboard.setData(pasteboardData);
  systemPasteboard.getData().then((data) => {
    if (data) {
      promptAction.showToast({ message: '复制成功' });
    } else {
      promptAction.showToast({ message: '复制失败' });
    }
  })
}
function connectNotifyCallBack(callback: gameNearbyTransfer.ConnectNotification) {
  // 连接状态回调，接收端收到建链成功回调后，在此处调用sendPackageInfo接口发送自身文件信息，如版本信息、包信息
}

function receivePackageInfoCallBack(callback: gameNearbyTransfer.PackageInfo) {
  // 接收包信息回调，发送端收到接收端发送的版本信息后进行对比，根据对比结果决定是否需要传输资源包数据。
}

function transferNotifyCallBack(callback: gameNearbyTransfer.TransferNotification) {
  // 传输回调，处理传输进度信息
}

function errorCallBack(callback: gameNearbyTransfer.ReturnResult) {
  // 异常信息回调，处理相关异常信息
}
