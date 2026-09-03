import { HeaderComponent } from './HeaderComponent';
import { promptAction } from '@kit.ArkUI';


/**
 * Login page component.
 */
@Entry
@Component
  // @CustomDialog
export struct RegisterComponent {
  @State title: ResourceStr = '';
  @State userName: string = '';
  @State password: string = '';
  @State confirmPassword?: string = '';
  @State needConfirm: boolean = false;
  onCommitClick?: (userName: string, password?: string) => void;
  onCloseClick?: (event?: ClickEvent) => void;

  // private controller: CustomDialogController

  // open() {
  //   if (this.controller) {
  //     this.controller.open();
  //   }
  // }

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event?: ClickEvent) {
    this?.onCloseClick?.(event)
    // this?.controller?.close()
  }

  build() {
    // RelativeContainer() {
    // Stack({ alignContent: Alignment.Top }) {
    Column() {
      HeaderComponent({
        title: this.title || "注册账号", onClose: () => {
          this.close()
        }
      })
      Column() {
        this.Body()
      }
      .alignItems(HorizontalAlign.Start)
      .padding({ left: 20, right: 20 })
    }.constraintSize({ maxWidth: $r('app.float.dialog_width') })
    .margin({ left: 20, right: 20 })
    .backgroundColor(Color.White)
    .borderRadius(6)

  }

  @Builder
  Body() {
    Scroll() {
      Column() {

        TextInput({ placeholder: "请输入账号" })

          .height($r('app.float.edit_height'))
          .placeholderColor($r('app.color.col_a5caca'))
          .placeholderFont({ size: $r('app.float.edit_font_size') })
          .backgroundColor('#00FFFFFF')
          .fontSize($r('app.float.edit_font_size'))
          .type(InputType.USER_NAME)
          .showPasswordIcon(!!this.userName)
          .passwordIcon({ onIconSrc: $r('app.media.rx_pwd_eye_open'), offIconSrc: $r('app.media.rx_pwd_eye_close') })
          .border({
            width: 1,
            color: $r('app.color.col_e2f2f1'),
            radius: 4
          })
          .onChange((value: string) => {
            this.userName = value;
          })

        TextInput({ placeholder: "请输入密码" })

          .height($r('app.float.edit_height'))
          .placeholderColor($r('app.color.col_a5caca'))
          .backgroundColor('#00FFFFFF')
          .placeholderFont({ size: $r('app.float.edit_font_size') })
          .fontSize($r('app.float.edit_font_size'))
          .type(InputType.NEW_PASSWORD)
          .showPasswordIcon(!!this.password)
          .passwordIcon({ onIconSrc: $r('app.media.rx_pwd_eye_open'), offIconSrc: $r('app.media.rx_pwd_eye_close') })
          .margin({ top: 12 })
          .border({
            width: 1,
            color: $r('app.color.col_e2f2f1'),
            radius: 4
          })
          .onChange((value: string) => {
            this.password = value;
          })
        if (this.needConfirm) {
          TextInput({ placeholder: "请再次输入您的密码" })
            .height($r('app.float.edit_height'))
            .placeholderColor($r('app.color.col_a5caca'))
            .backgroundColor('#00FFFFFF')
            .placeholderFont({ size: $r('app.float.edit_font_size') })
            .fontSize($r('app.float.edit_font_size'))
            .type(InputType.NEW_PASSWORD)
            .showPasswordIcon(!!this.confirmPassword)
            .passwordIcon({ onIconSrc: $r('app.media.rx_pwd_eye_open'), offIconSrc: $r('app.media.rx_pwd_eye_close') })
            .margin({ top: 12 })
            .border({
              width: 1,
              color: $r('app.color.col_e2f2f1'),
              radius: 4
            })
            .onChange((value: string) => {
              this.confirmPassword = value;
            })
        }
      }
    }

    Row() {
      Button('确认', { type: ButtonType.Normal, stateEffect: true })
        .layoutWeight(1)
        .height($r('app.float.button_height'))
        .borderRadius(4)
        .fontSize($r('app.float.button_font_size'))
        .margin({ top: 22, bottom: 22 })
        .fontWeight(500)
        .enabled(this.isButtonClickable())
        .fontColor(Color.White)
        .backgroundColor(this.isButtonClickable() ? $r('app.color.col_20c0b3') : $r('app.color.col_b3e6e2'))
        .onClick(() => {
          if (this.needConfirm && this.password !== this.confirmPassword) {
            promptAction.showToast({ message: "两次密码不一致，请重新输入" })
          } else {
            this.onCommitClick?.(this.userName, this.password)
          }
        })
    }
  }

  isButtonClickable(): boolean {
    return (this.userName !== '') && this.password !== ''
  }
}


