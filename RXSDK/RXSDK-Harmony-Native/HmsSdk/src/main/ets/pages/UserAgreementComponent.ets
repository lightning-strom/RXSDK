import { HeaderComponent } from './HeaderComponent';
import { LengthMetrics } from '@kit.ArkUI';
import { webview } from '@kit.ArkWeb';
import { Logger } from '../utils/Logger';
import UIApiImpl from './UIApiImpl';
import ApiPath from '../constants/ApiPath';
import TextUtil from '../utils/TextUtil';


// @Entry
  @Preview
@Component
  // @CustomDialog
export struct UserAgreementComponent {
  @State title: ResourceStr = '用户协议和隐私政策';
  @State confirmText: ResourceStr = '同意';
  @State cancelText: ResourceStr = '不同意';
  contentFontSize: number = 15;
  onConfirm?: (event: ClickEvent) => void;
  onCancel?: (event: ClickEvent) => void;
  onLinkClick?: (index: number) => void;
  // private controller: CustomDialogController
  agreement = `<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001'>《用户协议》</a >` +
    `、<a href= 'https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002'>《隐私政策》</a >`;
  @State content: string =
    `       在您使用我们服务前，请您务必审慎阅读、充分理解${this.agreement}的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意${this.agreement}请点击“同意”开始使用我们的服务。`;

  aboutToAppear(): void {
  }

  showPrivacyDetailDialog(url: string, t: string) {
    if (url) {
      UIApiImpl.showWebView(this.getUIContext(), { url: url.startsWith("http") ? url : ApiPath.getPrivacyUrl(url), title: t?.replace(/^《|》$/g, '') });
    } else {
      Logger.e("privacy url is null error")
    }
  }

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event: ClickEvent) {
    this?.onCancel?.(event);
    // this?.controller?.close()
  }

  confirm(event: ClickEvent) {
    this?.onConfirm?.(event);
    // this?.controller?.close()
  }

  build() {
    Column() {
      HeaderComponent({
        title: this.title,
        closeVisible: false,
        marginTop: 10,
        onClose: (e) => {
          this.close(e)
        }
      })

      Scroll() {
        Text() {
          ForEach(TextUtil.parseHrefHtml(this.content), (item: object, index: number) => {
            if (item["type"] == "link") {
              Span(item["content"]).fontColor($r('app.color.col_20c0b3')).onClick(() => {
                console.log(item["href"])
                this.showPrivacyDetailDialog(item["href"], item["content"])
              })
            } else {
              Span(item["content"])
            }
          })
        }
        .fontSize(this.contentFontSize)
        .lineSpacing(LengthMetrics.vp(7))
        // .backgroundColor(Color.Grey)

      }.margin({
        left: 24,
        right: 24,
        top: 4,
        bottom: 4
      })
      .layoutWeight(1)
      .align(Alignment.Top)
      .scrollBar(BarState.Off)


      Row() {
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

        Blank().width("10%")
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

    }.constraintSize({ maxWidth: 450, maxHeight: 360 })
    .margin({
      left: 30,
      right: 30,
      top: 40,
      bottom: 40
    })
    .backgroundColor(Color.White)
    .borderRadius(6)
  }
}


