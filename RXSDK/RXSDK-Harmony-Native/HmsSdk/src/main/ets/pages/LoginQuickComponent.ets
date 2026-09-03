import { HeaderComponent } from './HeaderComponent';
import { Account } from '../types/Index';

import { LoginAccountListDialog } from './LoginAccountListDialog';

import AccountManager from '../base/AccountManager';
import Devices from '../utils/Devices';

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
export struct LoginQuickComponent {
  @State isLoading: boolean = false
  @StorageProp("rx_logo") title: ResourceStr = $r('app.media.rx_logo');
  @State account: Account = {
    openid: '',
    method: '',
    login_method: ''
  };
  @State marginBottom: number = 17;
  onCloseClick?: (event?: ClickEvent) => void;
  onMoreMethodClick?: (tag: number) => void;
  onStartClick?: (account: Account) => void;

  // private controller: CustomDialogController

  aboutToAppear() {
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

  clickMoreLogin() {
    this.onMoreMethodClick?.(0);
  }

  clickLogin() {
    this.onStartClick?.(this.account)

    // let loginObj: LoginParams = {
    //   method: (this.isCaptcha ? LoginMethod.CaptchaCode : "username"),
    //   username: this.userName,
    // }
    // let ext: CaptchaExt | undefined;
    // if (this.captcha) {
    //   ext = { captcha_code: this.captcha };
    //   loginObj.ext = ext;
    // } else {
    //   loginObj.password = this.password
    // }
    // this.onLoginClick?.(loginObj)

    // this.isLoading = true
    // setTimeout(() => {
    //   this.isLoading = false
    // }, 10000)
  }

  build() {
    // RelativeContainer() {
    Stack({ alignContent: Alignment.Center }) {
      Column() {
        HeaderComponent({
          title: this.title, onClose: (e) => {
            this.close(e)
          }
        }).margin({ top: 4 })

        Column() {
          this.Body()
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ top: 10 })
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
      Row() {
        if (this.account) {
          Image(this.getIcon(this.account)).objectFit(ImageFit.Contain).height(22).margin({ left: 10, right: 8 })
          Text(Devices.getPhone(this.account?.username)).fontColor($r('app.color.col_315e5a')).layoutWeight(1)
          Image($r('app.media.rx_account_switch')).objectFit(ImageFit.None).width(36).margin({ right: 2 }).onClick((e) => {
            LoginAccountListDialog.getInstance(this.getUIContext()).setConfig({
              onSwitchAccount: async (account) => {
                this.account = account
              }
            , onAccountListEmpty: () => {
                this.onMoreMethodClick?.(1)
              }
            , onAccountDeleted: (item, index) => {
                if (this.account.openid == item.openid) {
                  this.account = AccountManager.getFirstAccount()
                }
              }
            }).show()

          })
        }
      }
      .margin({ top: 12 })
      .borderWidth(1)
      .borderColor("#E2F2F1")
      .borderRadius(4)
      .height(36)

      Button('开始游戏', { type: ButtonType.Normal, stateEffect: true })
        .width('100%')
        .height($r('app.float.button_height'))
        .borderRadius(4)
        .fontSize($r('app.float.button_font_size'))
        .margin({ top: 12 })
        .fontWeight(500)
        .fontColor(Color.White)
        .backgroundColor($r('app.color.col_20c0b3'))
        .onClick(() => {
          console.log("click login")
          this.clickLogin()
        })

      Button({ type: ButtonType.Normal, stateEffect: true }) {
        Row() {
          Image($r('app.media.rx_ico_more_2')).width(20).margin({ left: 2 })
          Text('更多登录方式').fontSize(13).margin({ left: 5, right: 2 })
        }.padding(6).alignItems(VerticalAlign.Center)
      }
      .borderRadius(4)
      .margin({ top: 16, bottom: this.marginBottom })
      .backgroundColor("#F1F3F7")
      .onClick(() => {
        console.log("click more login")

        this.clickMoreLogin()
      })

    }

    //.backgroundColor(Color.Gray)
  }

  private getIcon(item: Account) {
    if (Devices.isValidEmail(item?.username)) {
      return $r('app.media.rx_ico_captchacode3')
    } else if (Devices.isValidPhoneNumber(item?.username)) {
      return $r('app.media.rx_ico_captchacode')
    } else {
      return $r('app.media.rx_ico_username')
    }
  }
}