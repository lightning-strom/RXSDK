import { HeaderComponent } from './HeaderComponent';
import { CountDownComponent } from './CountDownComponent';
import { Account, LoginMethod, LoginParams, Purpose } from '../types/Index';
import { TipsComponent } from './TipsComponent';
import ApiPath from '../constants/ApiPath';
import { Logger } from '../utils/Logger';
import UIApiImpl from './UIApiImpl';

/**
 * Login page component.
 */
interface CaptchaExt {
  captcha_code: string;
}


@Entry
@Preview
@Component
  // @CustomDialog
export struct LoginComponent {
  @State isLoading: boolean = false
  @StorageProp("rx_logo") title: ResourceStr = $r('app.media.rx_logo');
  @State userName: string = '';
  @State password: string = '';
  @State captcha: string = '';
  @State isCaptcha: boolean = true;
  @State switchText: string = this.isCaptcha ? "密码登录" : "验证码登录";
  @State isPrivacyAgreed: boolean = false;
  @State privacyEnable: boolean = true;
  @State marginBottom: number = 15;
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

  // private controller: CustomDialogController

  aboutToAppear() {
    if (this.account?.username) {
      this.userName = this.account?.["login_username"] || this.account?.username
      this.isCaptcha = this.account?.method == "phone" || this.account?.method == "captchacode"
    }

    // this.isLoading = true
    // setTimeout(() => {
    //   this.isLoading = false
    // }, 5000)
  }

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event: ClickEvent) {
    // this?.controller?.close()
    this.onCloseClick?.(event);
  }

  clickLogin() {
    let loginObj: LoginParams = {
      method: (this.isCaptcha ? LoginMethod.CaptchaCode : "username"),
      username: this.userName,
    }
    let ext: CaptchaExt | undefined;
    if (this.captcha) {
      ext = { captcha_code: this.captcha };
      loginObj.ext = ext;
    } else {
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
      Column() {
        HeaderComponent({
          title: this.title, onClose: (e) => {
            this.close(e)
          }
        }).margin({ top: 1 })

        Column() {
          this.Body()
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ top: 8 })
        .padding({ left: 20, right: 20 })
      }
      .width($r('app.float.dialog_width'))
      .constraintSize({ maxHeight: 400 })
      // .margin({ top: 20, bottom: 2 })
      .backgroundColor(Color.White)
      .borderRadius(6)

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
        .width('100%')
        .height($r('app.float.edit_height'))
        .placeholderColor($r('app.color.col_a5caca'))
        .placeholderFont({ size: $r('app.float.edit_font_size') })
        .backgroundColor('#00FFFFFF')
        .fontSize($r('app.float.edit_font_size'))
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
              .border({
                width: 1,
                color: $r('app.color.col_e2f2f1'),
                radius: 4
              })
              .layoutWeight(1)
              .onChange((value: string) => {
                this.captcha = value;
              })
            Blank()
            CountDownComponent({ purpose: Purpose.Login, target: this.userName })
              .padding({ left: 10, top: 3, bottom: 3 })

          }
        } else {
          Flex({ alignItems: ItemAlign.Center }) {
            TextInput({ placeholder: "请输入密码" })
              .height($r('app.float.edit_height'))
              .placeholderColor($r('app.color.col_a5caca'))
              .backgroundColor('#00FFFFFF')
              .placeholderFont({ size: $r('app.float.edit_font_size') })
              .fontSize($r('app.float.edit_font_size'))
              .type(InputType.Password)
              .passwordIcon({ onIconSrc: $r('app.media.rx_pwd_eye_open'), offIconSrc: $r('app.media.rx_pwd_eye_close') })
              .layoutWeight(1)
              .border({
                width: 1,
                color: $r('app.color.col_e2f2f1'),
                radius: 4
              })
              .onChange((value: string) => {
                this.password = value;
              })
            // Blank()
            Text("忘记密码")
              .flexBasis('auto')// .fontWeight(600)
              .fontColor($r('app.color.col_20c0b3'))
              .padding({ left: 10, top: 3, bottom: 3 })
              .maxLines(1)
              .onClick((e) => {
                if (this.onForgotPwdClick) {
                  this.onForgotPwdClick?.(e)
                } else {
                  UIApiImpl.showForgotPasswordUI(this.getUIContext())
                }
              })
          }
        }
      }
      .margin({ top: 10 })

      Row() {
        Blank().layoutWeight(1)
        Image($r('app.media.rx_change_login_pwd_or_captcha')).objectFit(ImageFit.None).height(19)
        Text(this.switchText) {
        }.fontColor($r('app.color.col_315e5a')).onClick(() => {
          this.isCaptcha = !this.isCaptcha;
          this.switchText = this.isCaptcha ? "密码登录" : "验证码登录";
          this.password = '';
          this.captcha = '';
        })
      }.margin({ top: 12 })

      Button('登录', { type: ButtonType.Normal, stateEffect: true })
        .width('100%')
        .height($r('app.float.button_height'))
        .borderRadius(4)
        .fontSize($r('app.float.button_font_size'))
        .margin({ top: 12, bottom: this.marginBottom })
        .fontWeight(500)
        .enabled(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password))
        .fontColor(Color.White)
        .backgroundColor(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password) ? $r('app.color.col_20c0b3') : $r('app.color.col_b3e6e2'))
        .onClick(() => {
          console.log("click login")
          this.getUIContext().getFocusController().clearFocus()
          if (this.privacyEnable && !this.isPrivacyAgreed) {
            this.showPrivacyAgreeDialog((e) => {
              this.isPrivacyAgreed = true
              this.clickLogin()
            })
          } else {
            this.clickLogin()
          }
        })

      //privacy
      if (this.privacyEnable) {
        Row() {
          if (this.privacyText1 && this.privacyUrl1) {
            // RichText("隐私政策的富文本")
            Checkbox({ name: "checkbox", group: 'checkboxGroup' })// .margin({ top: 2 })
              .width(18)
              .select(this.isPrivacyAgreed)
              .shape(CheckBoxShape.ROUNDED_SQUARE)
              .unselectedColor(0x1FC0B3)
              .selectedColor(0x1FC0B3)
            Text("我已阅读并同意 ").maxLines(1).fontSize(this.privacyFontSize)
            // .backgroundColor(Color.Green)
            Text(this.privacyText1).maxLines(1).fontSize(this.privacyFontSize).fontColor($r('app.color.col_20c0b3'))
              .onClick(() => {
                this.showPrivacyDetailDialog(this.privacyUrl1, this.privacyText1)
              })
          }
          if (this.privacyText2 && this.privacyUrl2) {
            Text("、").maxLines(1).fontSize(this.privacyFontSize)
            Text(this.privacyText2)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
              .fontSize(this.privacyFontSize)
              .fontColor($r('app.color.col_20c0b3'))
              .onClick(() => {
                this.showPrivacyDetailDialog(this.privacyUrl2, this.privacyText2)
              })
          }
          if (this.privacyText3 && this.privacyUrl3) {
            Text("、").maxLines(1).fontSize(this.privacyFontSize)
            Text(this.privacyText3)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
              .fontSize(this.privacyFontSize)
              .layoutWeight(0.5)
              .fontColor($r('app.color.col_20c0b3'))
              .onClick(() => {
                this.showPrivacyDetailDialog(this.privacyUrl3, this.privacyText3)
              })
          }
        }
        .padding({ bottom: 8 })
        .constraintSize({ maxHeight: 42 })
        .alignItems(VerticalAlign.Center)
        // .backgroundColor(Color.Gray)
        .onClick(() => {
          this.isPrivacyAgreed = !this.isPrivacyAgreed
        })
      }
    }
  }
}

function getText(...args: string[]): string {
  return args.filter(arg => arg && arg !== "").join("、")
}

/**
 * Calculate login button clickable by the input of username and password.
 * @return {boolean} isLoginButtonClickable.
 */
function isLoginButtonClickable(userName: string, password: string): boolean {
  return userName !== '' && password !== '';
}

