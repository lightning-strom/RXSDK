import { HeaderComponent } from './HeaderComponent';
import { LengthMetrics } from '@kit.ArkUI';


// @Entry
@Preview
@Component
@CustomDialog
export struct TipsComponent {
  @State title: ResourceStr = '提示';
  @State confirmText: ResourceStr = '确定';
  @State content: ResourceStr  = '提示';
  @State linkContent: string[] = [];
  @State cancelText: ResourceStr = '取消';
  @State cancelVisible: boolean = true;
  @State isPrivacyAgreed: boolean = false;
  contentFontSize: number = 14;
  onConfirm?: (event: ClickEvent) => void;
  onCancel?: (event: ClickEvent) => void;
  onLinkClick?: (index: number) => void;
  private controller: CustomDialogController

  aboutToAppear() {

  }

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event: ClickEvent) {
    this?.onCancel?.(event);
    this?.controller?.close()
  }

  confirm(event: ClickEvent) {
    this?.onConfirm?.(event);
    this?.controller?.close()
  }

  build() {
    Column() {
      HeaderComponent({
        title: this.title,
        closeVisible: false,
        onClose: (e) => {
          this.close(e)
        }
      })
      Flex({ wrap: FlexWrap.Wrap, space: { main: LengthMetrics.px(5), cross: LengthMetrics.px(5) } }) {
        // Text(this.content).fontSize(this.contentFontSize).lineSpacing(LengthMetrics.lpx(10))
        // RichText(this.content)
        Text() {
          Span(this.content )
          ForEach(this.linkContent, (item: string, index: number) => {
            if (item) {
              if (item && item != '' && index > 0) {
                Span("、")
              }
              Span(item)
                .fontColor($r('app.color.col_20c0b3'))
                .onClick(() => {
                  this.onLinkClick?.(index)
                })
            }
          })
        }.fontSize(this.contentFontSize).lineSpacing(LengthMetrics.vp(9))
      }
      .margin({
        left: 2,
        right: 2,
        top: 10,
        bottom: 10
      })
      .padding({ left: 20, right: 20 })

      Row() {
        if (this.cancelVisible) {
          Blank().width(15)
          Button(this.cancelText, { type: ButtonType.Normal, stateEffect: true })
            .layoutWeight(0.5)
            .height($r('app.float.button_height'))
            .borderRadius(4)
            .fontSize($r('app.float.button_font_size'))
            .margin({ top: 12, bottom: 22 })
            .fontWeight(500)
            .borderColor($r('app.color.col_20c0b3'))
            .borderWidth(1)
            .fontColor($r('app.color.col_20c0b3'))
            .backgroundColor(Color.White)
            .onClick((e) => {
              this.close(e)
            })
        }
        Blank().width(20)
        Button(this.confirmText, { type: ButtonType.Normal, stateEffect: true })
          .height($r('app.float.button_height'))
          .borderRadius(4)
          .fontSize($r('app.float.button_font_size'))
          .margin({ top: 12, bottom: 22 })
          .layoutWeight(0.5)
          .constraintSize({ maxWidth: 180 })
          .fontColor(Color.White)
          .backgroundColor($r('app.color.col_20c0b3'))
          .onClick((e) => {
            this.confirm(e)
          })
        Blank().width(15)
      }.margin({ left: 10, right: 10 })

    }
    .constraintSize({ maxWidth: $r('app.float.dialog_width') })
    .margin({left: 20, right: 20, top: 20, bottom: 20 })
    .backgroundColor(Color.White)
    .borderRadius(6)
  }
}


