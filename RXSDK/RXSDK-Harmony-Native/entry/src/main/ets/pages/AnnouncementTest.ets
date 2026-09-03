import { CommonConstants } from '../common/constants/CommonConstants';
import { RXApi } from 'hmssdk';
import { gamePlayer } from '@kit.GameServiceKit';
// import Logger from 'hmssdk/src/main/ets/utils/Logger';
import { promptAction, router } from '@kit.ArkUI';
import { BusinessError, pasteboard } from '@kit.BasicServicesKit';
import { SDKEventType, LoginData, LoginMethod, RXError, RXLoginConfig, RXResult, RXConfig ,Logger} from 'hmssdk';
import Passport from 'hmssdk/src/main/ets/base/Passport';


let rxsdk: RXApi

class routerParams {
  data1: string
  nums: number[]

  constructor(str: string, nums: number[]) {
    this.data1 = str
    this.nums = nums;
  }
}

@Entry
@Component
struct AnnouncementTest {
  @State message: string = 'Hello World';
  @State title: Resource = $r('app.media.rx_logo');
  @State userName: string = '';
  @State password: string = '';
  @State text: string = '';
  @State config: string = '';
  @State cdkey: string = '';
  scroller: Scroller = new Scroller()
  cpuserid: string = "442099939"

  setText(text: string | object) {
    Logger.debug(text)
    if (typeof text == 'object') {

      this.text = JSON.stringify(text, null, 2)
    } else {
      this.text = text
    }
  }

  // showDialog() {
  //   let dialogController: CustomDialogController
  //   dialogController = new CustomDialogController({
  //     builder: AnnouncementComponent(),
  //     autoCancel: false,
  //     alignment: DialogAlignment.Center,
  //     offset: { dx: 0, dy: -20 },
  //     gridCount: 4,
  //     customStyle: true,
  //   })
  //   dialogController.open()
  // }

  aboutToAppear(): void {
    rxsdk = RXApi.getInstance()

    // rxsdk.setLogoRes("微乐通行证")
  }

  aboutToDisappear(): void {
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
    // RelativeContainer() {
    Scroll(this.scroller) {
      Column() {
        this.Header()
        Text(this.config).margin({ top: 5 }).onClick(() => {
          copyText(this.config)
        })
        Button("Next")
          .btnStyle()
          .onClick(async () => {
            router.pushUrl({
              url: 'pages/Page',
              params: new routerParams('message', [123, 456, 789])
            })

          })
        Button('AnnouncementUI')
          .btnStyle()
          .onClick(async () => {
            rxsdk.showAnnouncementUI(this.getUIContext())
          })

        Button("RefreshToken")
          .btnStyle()
          .onClick(async () => {
            Passport.refreshAccessToken()
          })
        Button("UnionLogin")
          .btnStyle()
          .onClick(async () => {
            let parm: RXLoginConfig = {
              accountInfos: [{ accountName: "微乐游戏账号", accountIcon: "app.media.app_icon" }],
              // showLoginDialog: true,
              scopes: ['profile'],
              forceAuthorization: true,
              loginPanelType: gamePlayer.LoginPanelType.BUTTON,
              indulgeAuth: 1
            };

            rxsdk.unionLogin(parm, this.getUIContext(), (err: RXError, ret?: RXResult<LoginData | object>) => {
              if (err) {
                Logger.e(err.message);
                promptAction.showToast({ message: "登录失败：" + JSON.stringify(err.message) });
              } else {
                Logger.e(JSON.stringify(ret));
                promptAction.showToast({ message: "登录结果：" + JSON.stringify(ret) });
              }
            });
          })
        Button('GuestLogin')
          .btnStyle()
          .onClick(async () => {
            // this.showLoginDialog()
            try {
              await rxsdk.login({ method: LoginMethod.Guest }).then((resp: RXResult<object>) => {
                Logger.d(JSON.stringify(resp))
                promptAction.showToast({ message: JSON.stringify(resp) })
                this.setText(resp)
              }).catch((e: BusinessError) => {
                promptAction.showToast({ message: JSON.stringify(e) })
                this.setText(e)
              })
            } catch (e) {
              this.setText(e)
              promptAction.showToast({ message: JSON.stringify(e) })
            }
          })
        Button('Test3Login')
          .btnStyle()
          .onClick(async () => {
            // this.showLoginDialog()
            try {
              await rxsdk.login({ method: LoginMethod.UserName, username: "test3", password: "111111aA!" }).then((resp: RXResult<object>) => {
                Logger.d(JSON.stringify(resp))
                promptAction.showToast({ message: JSON.stringify(resp) })
                this.setText(resp)
              }).catch((e: BusinessError) => {
                promptAction.showToast({ message: JSON.stringify(e) })
                this.setText(e)
              })
            } catch (e) {
              this.setText(e)

              promptAction.showToast({ message: JSON.stringify(e) })
            }
          })

        Button('Login')
          .btnStyle()
          .onClick(() => {
            // this.showLoginDialog()
            this.getUIContext().getPromptAction()
            rxsdk.showLoginUI(this.getUIContext(), {
              indulgeAuth: 0,
              privacyUrl1: "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00001",
              privacyUrl2: "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00002?lang=zh",
              // privacyUrl3: "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00002?lang=zh",
            }, (err: RXError, ret?: RXResult<LoginData | object>) => {
              if (err) {
                Logger.e(err.message)

                try {
                  promptAction.showToast({ message: "登录失败：" + JSON.stringify(err.message) })
                } catch (error) {
                  // TODO: Implement error handling.
                }
              } else {
                Logger.e(JSON.stringify(ret))
                promptAction.showToast({ message: "登录结果：" + JSON.stringify(ret) })
              }
            })
          })

        Button("Logout")
          .btnStyle()
          .onClick(async () => {
            let ret = await rxsdk.logout()
            Logger.d(ret)
          })
        Button("LoginOpenid")
          .btnStyle()
          .onClick(async () => {
            try {
              let ret = await rxsdk.login({})
              promptAction.showToast({ message: JSON.stringify(ret) })
              //   .catch((e1) => {
              //   Logger.e("unknown error")
              //   Logger.e(e1)
              //
              // })
            } catch (e) {
              Logger.e(e)
              promptAction.showToast({ message: "login error" })
            }

          })
        Button("ModifyUserInfo")
          .btnStyle()
          .onClick(() => {
            rxsdk.passport().updateUserInfo<object>({
              avatarUrl: 'https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png',
              nickname: "鸿蒙昵称" + Passport.loginData?.username,
            })
          })
        Button("Pay")
          .btnStyle()
          .onClick(() => {

            console.log("dddd")
            Logger.debug("clicked")
            // hilog.debug(sss, sss, sss, sss);
          })

        Button("RealName")
          .btnStyle()
          .onClick(() => {

            rxsdk.showRealNameUI(this.getUIContext())
          })
        Button("ChangePassword")
          .btnStyle()
          .onClick(() => {
            rxsdk.showChangePasswordUI(this.getUIContext())
            // hilog.debug(sss, sss, sss, sss);
          })

        Button("UserCenter")
          .btnStyle()
          .onClick(() => {
            try {
              rxsdk.showUserCenterUI(this.getUIContext(), { custom_params: { game_user_id: "rx_100000" } }).catch((error: object) => {
                promptAction.showToast({ message: typeof (error) + " unknown error " + JSON.stringify(error) })
              })
            } catch (e) {
              promptAction.showToast({ message: JSON.stringify(e) })
            }
          })

        Button('HelperCenter')
          .btnStyle()
          .onClick(() => {
            rxsdk.showHelperCenterUI(this.getUIContext())
          })

        Button('Privacy')
          .btnStyle()
          .onClick(() => {
            rxsdk.showPrivacyUI(this.getUIContext(), { key_list: ["00001", "00002"], key: "00001" })
          })
        Button('ForgotPassword')
          .btnStyle()
          .onClick(() => {
            rxsdk.showForgotPasswordUI(this.getUIContext())
          })

        Button('ChatServices')
          .btnStyle()
          .onClick(() => {
            rxsdk.showChatServicesUI(this.getUIContext(), {})
          })
        Button('trackData')
          .btnStyle()
          .onClick(() => {
            rxsdk.hadoop().trackData("test", { now: Date.now() })
          })
        Button('TipsDialog')
          .btnStyle()
          .onClick(() => {

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
            rxsdk.passport().getPromoDisplayKEY((resp) => {

              this.cdkey = resp?.data?.promo_code || "未知"
              this.setText(resp)

            }, true)

          })
        Button('ExchangePromoCDKEY')
          .btnStyle()
          .onClick(async () => {

            rxsdk.passport().exchangePromoCDKEY(this.cdkey, (resp) => {
              this.setText(resp)
            })

          })

        Button('getAnnouncement')
          .btnStyle()
          .onClick(async () => {
            rxsdk.operation().getAnnouncement(1, (resp) => {
              this.setText(resp)

            })
          })
        Button('getEmailList')
          .btnStyle()
          .onClick(async () => {
            rxsdk.operation().getEmailList(this.cpuserid, (resp) => {
              this.setText(resp)

            })
          })
        Button('deleteEmail')
          .btnStyle()
          .onClick(async () => {
            rxsdk.operation().deleteEmail({
              cp_user_id: this.cpuserid,
              type: 0
            }, (resp) => {
              this.setText(resp)

            })
          })
        Button('getEmailDetail')
          .btnStyle()
          .onClick(async () => {
            let rxMailId = 1;
            rxsdk.operation().getEmailDetail(rxMailId, this.cpuserid, (resp) => {
              this.setText(resp)

            })
          })

        Button('getEmailAward')
          .btnStyle()
          .onClick(async () => {
            let rxMailId = 1;
            rxsdk.operation().getEmailAward({
              cp_user_id: this.cpuserid,
              type: 0
            }, (resp) => {
              this.setText(resp)

            })
          })

        Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })
        Text(this.text).margin({ top: 5 }).onClick(() => {
          copyText(this.text)
        })

      }.padding({ left: 24, right: 24 })

    }
    .alignRules({ middle: { anchor: "__container__", align: HorizontalAlign.Center } })
    // .width($r('app.float.dialog_width'))
    // .height("80%")
    // .height('90%')
    // .backgroundColor(Color.Green)
    .scrollable(ScrollDirection.Vertical) // 滚动方向纵向
    .scrollBar(BarState.On) // 滚动条常驻显示
    .scrollBarColor(Color.Gray) // 滚动条颜色
    .scrollBarWidth(10) // 滚动条宽度
    .friction(0.6)

    // }.width("100%").height("100%")

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
  .width(CommonConstants.BUTTON_WIDTH_PERCENT)
  .height($r('app.float.login_btn_height'))
  .fontSize($r('app.float.text_input_font_size'))
  .fontWeight(CommonConstants.BUTTON_FONT_WEIGHT)
  .borderRadius($r('app.float.register_btn_border_radius'))
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
  systemPasteboard.setData(pasteboardData); // 将数据放入剪切板
  systemPasteboard.getData().then((data) => {
    if (data) {
      promptAction.showToast({ message: '复制成功' });
    } else {
      promptAction.showToast({ message: '复制失败' });
    }
  })
}