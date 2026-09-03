import { HeaderComponent } from './HeaderComponent';


/**
 * Login page component.
 */
@Preview
@Component
  // @CustomDialog
export struct SuccessTipsComponent {
  @State title: ResourceStr = "实名认证";
  @State icon: ResourceStr = $r('app.media.rx_tips_ico_success');
  @State description: ResourceStr = "实名认证成功";
  @State closeVisible: boolean = false
  onCloseClick?: (event?: ClickEvent) => void;

  // private controller: CustomDialogController

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event?: ClickEvent) {
    this?.onCloseClick?.(event)
    // this?.controller?.close()
  }

  build() {
    Column() {
      HeaderComponent({
        title: this.title, onClose: (e) => {
          this.close(e)
        },
        closeVisible: this.closeVisible
      }).margin({ top: 1 })
      Column() {
        this.Body()
      }
      .padding({ left: 20, right: 20 })
    }
    .constraintSize({ maxWidth: $r('app.float.dialog_width') })
    .margin({ left: 20, right: 20 })
    .backgroundColor(Color.White)
    .borderRadius(6)

  }

  @Builder
  Body() {
    Scroll() {
      Column() {
        Image(this.icon).objectFit(ImageFit.None).width(70).margin({ bottom: 15 })
        Text(this.description).fontColor("#626262")
      }.margin({ top: 27 })
    }

    Row() {
      Button('进入游戏', { type: ButtonType.Normal, stateEffect: true })
        .height($r('app.float.button_height'))
        .borderRadius(4)
        .layoutWeight(1)
        .fontSize($r('app.float.button_font_size'))
        .margin({ top: 27, bottom: 28 })
        .fontWeight(500)
        .fontColor(Color.White)
        .backgroundColor($r('app.color.col_20c0b3'))
        .onClick((e) => {
          this.close(e)
        })
    }
  }
}


