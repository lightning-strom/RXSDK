import { HeaderComponent } from './HeaderComponent';
import { CountDownComponent } from './CountDownComponent';
import { Account, EmptyObject, LoginMethod, LoginParams, Obj, Purpose } from '../types/Index';
import { TipsComponent } from './TipsComponent';
import ApiPath from '../constants/ApiPath';
import { Logger } from '../utils/Logger';
import UIApiImpl from './UIApiImpl';
import { LoginConfig } from '../types/InitConfig';
import UserActionTracer from '../base/UserActionTracer';
import { UserAction, UserScene } from '../base/UserActionEnum';

/**
 * Login page component.
 */
interface CaptchaExt {
  captcha_code: string;
}


@Preview
@Component
  // @CustomDialog
export struct LoginComponent2 {
  @State isLoading: boolean = false
  @StorageProp("rx_logo") title: ResourceStr = $r('app.media.rx_logo');
  @State userName: string = '';
  @State password: string = '';
  @State captcha: string = '';
  @State loginMethods?: Array<LoginConfig> = [{ method: 'captchacode' }, { method: 'username' }, { method: 'wechat' }, { method: 'guest' }];
  @State isCaptcha: boolean = true;
  @State switchText: string = this.isCaptcha ? "密码登录" : "验证码登录";
  @State isPrivacyAgreed: boolean = false;
  @State privacyEnable: boolean = true;
  @State marginBottom: number = 8;
  @State privacyText1: string = '用户协议';
  @State privacyText2: string = '隐私政策';
  @State privacyText3: string = '';
  privacyUrl1: string = '00001';
  privacyUrl2: string = '00002';
  privacyUrl3: string = '';
  privacyFontSize: number = 13;
  account?: Account
  onLoginClick?: (loginParams: LoginParams) => void;
  onCaptchaClick?: (event: ClickEvent) => void;
  onForgotPwdClick?: (event: ClickEvent) => void;
  onCloseClick?: (event?: ClickEvent) => void;
  @State offsetY: number = -1;
  @State lastMethod?: string = undefined;
  @State showPasswordIcon: boolean = false;

  // private controller: CustomDialogController

  aboutToAppear() {

    this.isCaptcha = this.pickCaptchaMode(this.account)
    if (this.account && this.isCaptcha == isCaptchaAccount(this.account)) {
      this.userName = this.account["login_username"] || this.account.username
    }
    this.switchText = this.isCaptcha ? "密码登录" : "验证码登录"
    // this.isLoading = true
    // this.play()
    this.onAction(UserAction.Show, { method: this.lastMethod })
  }

  /**
   * loginMethods 只开放其中一种时，上次登录方式不能把表单切到未开放的那一种，
   * 否则单一方式下没有「其他登录方式」入口可切回来。
   */
  pickCaptchaMode(account?: Account): boolean {
    let methods: Array<LoginConfig> = this.loginMethods ?? []
    let hasCaptcha: boolean = methods.some((c: LoginConfig) => c.method == LoginMethod.CaptchaCode)
    let hasUserName: boolean = methods.some((c: LoginConfig) => c.method == LoginMethod.UserName)
    if (hasCaptcha != hasUserName) {
      return hasCaptcha
    }
    return account ? isCaptchaAccount(account) : this.isCaptcha
  }

  onAction(action: string, data?: Obj) {
    UserActionTracer.traceAction(UserScene.Login, action, data)
  }

  play() {
    // this.offsetY = this.offsetY == 0 ? -3 : 0;
    this.offsetY = -3
  }

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event: ClickEvent) {
    // this?.controller?.close()
    this.onCloseClick?.(event);
    this.onAction(UserAction.Close, { method: this.lastMethod })
  }

  clickLogin(loginObj?: LoginParams) {
    loginObj ??= {}
    loginObj.method ??= (this.isCaptcha ? LoginMethod.CaptchaCode : LoginMethod.UserName)

    this.lastMethod = loginObj.method
    this.play()
    let ext: CaptchaExt | undefined;
    if (loginObj.method == LoginMethod.CaptchaCode) {
      loginObj.username = this.userName
      ext = { captcha_code: this.captcha };
      loginObj.ext = ext;
    } else if (loginObj.method == LoginMethod.UserName) {
      loginObj.username = this.userName
      loginObj.password = this.password
    }
    this.onLoginClick?.(loginObj)

    // this.isLoading = true
    // setTimeout(() => {
    //   this.isLoading = false
    // }, 10000)
  }

  showPrivacyDetailDialog(url: string, t: string) {
    if (url) {
      UIApiImpl.showWebView(this.getUIContext(), { url: url.startsWith("http") ? url : ApiPath.getPrivacyUrl(url), title: t?.replace(/^《|》$/g, '') });
      this.onAction(UserAction.Privacy, { url: url })
    } else {
      Logger.e("privacy url is null error")
    }
  }

  showPrivacyAgreeDialog(confirm: (event: ClickEvent) => void) {
    let dialogController: CustomDialogController
    dialogController = new CustomDialogController({
      builder: TipsComponent({
        title: "用户协议和隐私政策",
        content: `请确认已阅读并同意 `, // ${getText(this.privacyText1, this.privacyText2, this.privacyText3)}`,
        linkContent: [this.privacyText1, this.privacyText2, this.privacyText3],
        onLinkClick: (index) => {
          switch (index) {
            case 0:
              this.showPrivacyDetailDialog(this.privacyUrl1, this.privacyText1)
              break;
            case 1:
              this.showPrivacyDetailDialog(this.privacyUrl2, this.privacyText2)
              break;
            case 2:
              this.showPrivacyDetailDialog(this.privacyUrl3, this.privacyText3)
              break;
          }
        },
        confirmText: "同意",
        cancelText: "不同意",
        onConfirm: confirm
      }),
      autoCancel: false,
      alignment: DialogAlignment.Center,
      offset: { dx: 0, dy: -20 },
      gridCount: 4,
      customStyle: true,
    })
    dialogController.open()
  }

  build() {
    // RelativeContainer() {

    Stack({ alignContent: Alignment.Center }) {
      Scroll() {
        Column() {
          HeaderComponent({
            marginTop: 0,
            title: this.title, onClose: (e) => {
              this.close(e)
            }
          }).margin({ top: 0 })

          Column() {
            this.Body()
          }
          .alignItems(HorizontalAlign.Start)
          .margin({ top: 1 })
          .padding({ left: 20, right: 20 })
        }
        // .width($r('app.float.dialog_width'))
        .constraintSize({ maxHeight: 410, maxWidth: $r('app.float.dialog_width') })
        .margin({ left: 20, right: 20 })
        .backgroundColor(Color.White)
        // .backgroundColor(Color.Blue)
        .borderRadius(6)
      }.scrollBar(BarState.Off)

      if (this.isLoading) {
        this.Loading()
      }
    }

  }

  @Builder
  Loading() {
    Stack({ alignContent: Alignment.Center }) {
      LoadingProgress()
        .color('#20c0b3')
        .enableLoading(this.isLoading)
        .visibility(this.isLoading ? Visibility.Visible : Visibility.None)// .offset({ top: LengthMetrics.vp(this.naviBarVisible ? -60 : 0) })
        .width(90)
        .height(90)
        .alignRules({
          center: { anchor: "__container__", align: VerticalAlign.Center },
          middle: { anchor: "__container__", align: HorizontalAlign.Center }
        })
    }.height("100%").width("100%").backgroundColor(0x33000000)
  }

  @Builder
  Body() {
    Column() {
      TextInput({ text: $$this.userName, placeholder: this.isCaptcha ? "请输入您的手机号" : "请输入您的账号" })
        .height($r('app.float.edit_height'))
        .placeholderColor($r('app.color.col_a5caca'))
        .placeholderFont({ size: $r('app.float.edit_font_size') })
        .backgroundColor('#00FFFFFF')
        .fontSize($r('app.float.edit_font_size'))
        .onFocus(() => {
          this.onAction(this.isCaptcha ? UserAction.CaptchaCodeTF : UserAction.AccountTF)
        })
        .type(this.isCaptcha ? InputType.PhoneNumber : InputType.USER_NAME)
        .border({
          width: 1,
          color: $r('app.color.col_e2f2f1'),
          radius: 4
        })

      Stack() {
        if (this.isCaptcha) {
          Flex({ alignItems: ItemAlign.Center }) {

            TextInput({ placeholder: "请输入验证码" })
              .flexBasis('auto')
              .height($r('app.float.edit_height'))
              .placeholderColor($r('app.color.col_a5caca'))
              .placeholderFont({ size: $r('app.float.edit_font_size') })
              .backgroundColor('#00FFFFFF')
              .fontSize($r('app.float.edit_font_size'))
              .type(InputType.Number)
              .layoutWeight(1)
              .onFocus(() => {
                this.onAction(UserAction.CaptchaCodeTF)
              })
              .onChange((value: string) => {
                this.captcha = value;
              })
            Blank()
            Divider().vertical(true).height(20).color("#e2f2f1")
            CountDownComponent({ purpose: Purpose.Login, target: this.userName })
              .padding({
                left: 8,
                top: 3,
                bottom: 3,
                right: 8
              }).onClick((e) => {
              this.onAction(UserAction.CaptchaCodeSend)
            })

          }.border({
            width: 1,
            color: $r('app.color.col_e2f2f1'),
            radius: 4
          })

        } else {

          Flex({ alignItems: ItemAlign.Center }) {
            TextInput({ placeholder: "请输入密码" })
              .height($r('app.float.edit_height'))
              .placeholderColor($r('app.color.col_a5caca'))
              .backgroundColor('#00FFFFFF')
              .placeholderFont({ size: $r('app.float.edit_font_size') })
              .fontSize($r('app.float.edit_font_size'))
              .type(InputType.Password)
              .onFocus(() => {
                this.onAction(UserAction.PasswordTF)
              })
              .showPasswordIcon(this.showPasswordIcon)
              .passwordIcon({ onIconSrc: $r('app.media.rx_pwd_eye_open'), offIconSrc: $r('app.media.rx_pwd_eye_close') })
              .layoutWeight(1)
              .onChange((value: string) => {
                this.showPasswordIcon = !!value
                this.password = value;
              })
            Blank()
            Divider().vertical(true).height(20).color("#e2f2f1")
            Text("忘记密码")
              .flexBasis('auto')// .fontWeight(600)
              .fontColor($r('app.color.col_20c0b3'))
              .padding({
                left: 8,
                top: 3,
                bottom: 3,
                right: 8
              })
              .maxLines(1)
              .onClick((e) => {
                if (this.onForgotPwdClick) {
                  this.onForgotPwdClick?.(e)
                } else {
                  UIApiImpl.showForgotPasswordUI(this.getUIContext())
                }
                this.onAction(UserAction.ForgotPassword)
              })

          }.border({
            width: 1,
            color: $r('app.color.col_e2f2f1'),
            radius: 4
          })

        }
      }
      .margin({ top: 7 })

      // Row() {
      //   Blank().layoutWeight(1)
      //   Image($r('app.media.rx_change_login_pwd_or_captcha')).objectFit(ImageFit.None).height(19)
      //   Text(this.switchText) {
      //   }.fontColor($r('app.color.col_315e5a')).onClick(() => {
      //     this.isCaptcha = !this.isCaptcha;
      //     this.switchText = this.isCaptcha ? "密码登录" : "验证码登录";
      //     this.password = '';
      //     this.captcha = '';
      //   })
      // }.margin({ top: 12 })
      Row() {
        Button('登录', { type: ButtonType.Normal, stateEffect: true })
          .height($r('app.float.button_height'))
          .borderRadius(4)
          .layoutWeight(1)
          .fontSize($r('app.float.button_font_size'))
          .margin({ top: 7, bottom: this.marginBottom })
          .fontWeight(500)
          .enabled(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password))
          .fontColor(Color.White)
          .backgroundColor(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password) ? $r('app.color.col_20c0b3') : $r('app.color.col_b3e6e2'))
          .onClick(() => {
            console.log("click login")
            this.onAction(UserAction.Click, { method: this.isCaptcha ? LoginMethod.CaptchaCode : LoginMethod.UserName })
            this.getUIContext().getFocusController().clearFocus()
            if (this.privacyEnable && !this.isPrivacyAgreed) {
              this.showPrivacyAgreeDialog((e) => {
                this.isPrivacyAgreed = true
                this.clickLogin({})
              })
            } else {
              this.clickLogin({})
            }
          })
      }

      //v2 login button
      // Row() {
      //   Row() {
      //     Image(this.isCaptcha ? $r('app.media.rx_ico_username') : $r('app.media.rx_ico_captchacode'))
      //       .width(23)
      //       .height(23)
      //     Text(this.isCaptcha ? "账号" : "验证码").fontSize(14).margin({ left: 4 })
      //   }
      //   .borderRadius(4)
      //   .backgroundColor("#F1F3F7")
      //   .padding({
      //     left: 8,
      //     top: 8,
      //     bottom: 8,
      //     right: 10
      //   })
      //   .onClick(() => {
      //     this.isCaptcha = !this.isCaptcha;
      //     this.switchText = this.isCaptcha ? "密码登录" : "验证码登录";
      //     this.password = '';
      //     this.captcha = '';
      //   })
      // }.margin({ bottom: 8 })

      //privacy
      if (this.privacyEnable) {
        Row() {
          Checkbox({ name: "checkbox", group: 'checkboxGroup' })// .margin({ top: 2 })
            .width(18)
            .select($$this.isPrivacyAgreed)
            .shape(CheckBoxShape.ROUNDED_SQUARE)
            .unselectedColor(0x1FC0B3)
            .selectedColor(0x1FC0B3)

          Text() {
            if (this.privacyText1 && this.privacyUrl1) {
              Span("我已阅读并同意")
              Span(this.privacyText1).fontColor($r('app.color.col_20c0b3'))
                .onClick(() => {
                  this.showPrivacyDetailDialog(this.privacyUrl1, this.privacyText1)
                })
            }
            if (this.privacyText2 && this.privacyUrl2) {
              Span("、")
              Span(this.privacyText2)// .textOverflow({ overflow: TextOverflow.Ellipsis })
                .fontColor($r('app.color.col_20c0b3'))
                .onClick(() => {
                  this.showPrivacyDetailDialog(this.privacyUrl2, this.privacyText2)
                })
            }
            if (this.privacyText3 && this.privacyUrl3) {
              Span("、")
              Span(this.privacyText3)// .textOverflow({ overflow: TextOverflow.Ellipsis })
                .layoutWeight(0.5)
                .fontColor($r('app.color.col_20c0b3'))
                .onClick(() => {
                  this.showPrivacyDetailDialog(this.privacyUrl3, this.privacyText3)
                })
            }
          }.maxLines(2)
          .margin({ right: 25 })
          .fontSize(this.privacyFontSize)
        }
        .padding({ bottom: 4 })
        .constraintSize({ maxHeight: 42 })
        .alignItems(VerticalAlign.Center)
        .onClick(() => {
          this.isPrivacyAgreed = !this.isPrivacyAgreed
        })
      }

      //v3 login button // 其他登录方式
      Column() {
        if (this.isShowOtherLogin(this.loginMethods)) {
          Row() {
            Divider().color("#D8D8D8").layoutWeight(1)
            Text("其他登录方式").fontColor("#A3A3A3").fontSize(11).margin({ left: 14, right: 14 })
            Divider().color("#D8D8D8").layoutWeight(1)
          }

          Row({ space: 10 }) {
            ForEach(this.loginMethods, (item: LoginConfig, index: number) => {
              if (canShowMethod(item.method, this.isCaptcha) && index < 5) {
                Stack({ alignContent: Alignment.Top }) {
                  Column({ space: 5 }) {
                    Image($r(`app.media.rx_ico_${item.method}`))
                      .width(34)
                      .height(34)
                    Text($r(`app.string.method_${item.method}`)).fontSize(14)
                  }.id("other_btn").onClick((e) => {
                    this.onAction(UserAction.Click, { method: item.method });
                    if (item.method == LoginMethod.UserName || item.method == LoginMethod.CaptchaCode) {
                      this.isCaptcha = !this.isCaptcha;
                      this.switchText = this.isCaptcha ? "密码登录" : "验证码登录";
                      this.password = '';
                      this.captcha = '';
                      this.showPasswordIcon = false
                      this.play()
                    } else {
                      if (this.privacyEnable && !this.isPrivacyAgreed) {
                        this.showPrivacyAgreeDialog((e) => {
                          this.isPrivacyAgreed = true
                          this.clickLogin(item)
                        })
                      } else {
                        this.clickLogin(item)
                      }
                    }

                  }).margin({ top: 10 })

                  // .backgroundColor(Color.Green)
                  if (this.lastMethod == item.method) {
                    Stack() {
                      Image($r('app.media.rx_login_last')).width(45)
                      Text("最近使用").fontSize(9).fontColor("#C18C00").margin({ bottom: 1 })
                    }.margin({ top: 0 })
                    .translate({ y: this.offsetY })

                    .onAppear(() => {
                      animateTo({
                        duration: 400,
                        iterations: -1,
                        playMode: PlayMode.Alternate,
                      }, () => {
                        this.play()
                      })
                    })
                    .onDisAppear(() => {
                      this.offsetY = 0
                    })
                  }
                }.width(70)
              }
            })
          }
        } else {
          Blank().margin({ bottom: 5 })
        }
      }.margin({ bottom: 12 })

    }
  }

  isShowOtherLogin(loginMethods?: Array<LoginConfig>): boolean {
    if (!loginMethods || loginMethods.length === 0) {
      return false;
    }
    if (loginMethods.length !== 1) {
      return true;
    }
    return !['username', 'captchacode'].includes(loginMethods[0].method);
  }
}

function isCaptchaAccount(account: Account): boolean {
  return account.method == "phone" || account.method == LoginMethod.CaptchaCode
}

function canShowMethod(method: string, isCaptcha: boolean): boolean {
  switch (method) {
    case LoginMethod.CaptchaCode:
      return !isCaptcha
    case LoginMethod.UserName:
      return isCaptcha
    default:
      return true
  }
}

/**
 * Calculate login button clickable by the input of username and password.
 * @return {boolean} isLoginButtonClickable.
 */
function isLoginButtonClickable(userName: string, password: string): boolean {
  return userName !== '' && password !== '';
}

