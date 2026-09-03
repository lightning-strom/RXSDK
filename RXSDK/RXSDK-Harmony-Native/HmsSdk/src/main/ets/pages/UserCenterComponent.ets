import { display } from '@kit.ArkUI';

import { HeaderComponent } from './HeaderComponent';

import { Logger } from '../utils/Logger';

import { WebViewComponent } from './WebViewComponent';
import { JsObject } from '../types/Index';

/**
 * Login page component.
 */
@Preview
@Component
  // @CustomDialog
export struct UserCenterComponent {
  @StorageProp("rx_logo") title: ResourceStr = $r('app.media.rx_logo');
  @State avatar: ResourceStr = $r('app.media.rx_user_default_head');
  @State nickName: string = '';
  @State url: string = '';
  @State orientation: display.Orientation = 0;
  webParams: Record<string, string> = {}
  onCloseClick?: (event?: ClickEvent) => void;
  onJavaScriptCallback?: (data: JsObject) => string | boolean | undefined;
  onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;

  // private controller: CustomDialogController


  aboutToAppear() {
    this.orientation = display.getDefaultDisplaySync().orientation
  }

  close() {
    // this?.controller?.close()
    this.onCloseClick?.()
  }

  build() {
    Column() {
      HeaderComponent({
        title: this.title,
        backVisible: true,
        closeVisible: true,
        onBack: () => {
          this.close()
        },
        onClose: () => {
          this.close()
        }
      }).margin({ top: 2 })
      // .backgroundColor(Color.White)
      Row() {
        Image(this.avatar || $r('app.media.rx_user_default_head')).width(30).borderRadius(15)
        Text(this.nickName).textOverflow({ overflow: TextOverflow.Ellipsis }).maxLines(1).margin({ left: 10, right: 10 }).layoutWeight(1)
        // Blank().layoutWeight(1)
        Button('切换账号', { type: ButtonType.Normal, stateEffect: true })
          .fontColor($r('app.color.col_20c0b3'))
          .borderWidth(1)
          .backgroundColor(Color.Transparent)
          .borderColor($r('app.color.col_20c0b3'))
          .borderRadius(6)
          .onClick((e) => {
            this.close()
            this.onSwitchAccount?.(e)
          })
      }.height(60)
      .margin({ left: 25, right: 25 })

      Column() {
        WebViewComponent({
          url: this.url,
          webParams: this.webParams,
          naviBarVisible: false,
          backVisible: false,
          closeVisible: false,
          onJavaScriptCallback: this.onJavaScriptCallback
        })
          .margin({
            left: 17,
            right: 17,
            top: 10,
            bottom: 10
          })
          .backgroundColor(Color.White)
      }
      .layoutWeight(1)
    }
    .margin({
      left: 30,
      right: 30,
      top: 40,
      bottom: 40
    })
    .width((this.orientation % 2 > 0) ? "518" : "-1")
    .height(310)
    .constraintSize({ maxWidth: 518 })
    .borderRadius(6)
    // .backgroundColor('#EDFFEA')
    .linearGradient({
      direction: GradientDirection.Bottom, // 渐变方向
      repeating: true, // 渐变颜色是否重复
      colors: [[0xEDFFEA, 0.0], [0xEBFFF5, 0.5], [0xF6FAF9, 1.0]] // 数组末尾元素占比小于1时满足重复着色效果
    })
  }
}
