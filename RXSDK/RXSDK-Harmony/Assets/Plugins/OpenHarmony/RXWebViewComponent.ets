import web_webview from '@ohos.web.webview';
import display from '@ohos.display';
import picker from '@ohos.file.picker';
import { TuanjieLog, GetFromGlobalThis, SetToGlobalThis } from 'classesLib';
import RXWebViewJsBridge from './RXWebViewJsBridge';
import RXWebViewLayout from './RXWebViewLayout'

@Component
export struct RXWebViewComponent {
  @StorageLink("RXWebViewVisible") webViewVisible: boolean = false;
  @StorageLink("RXWebViewLayout") webViewLayout: RXWebViewLayout = new RXWebViewLayout();
  @StorageLink("RXWebViewURL") webViewURL: string = "";
  @StorageLink("RXWebViewController") controller: web_webview.WebviewController = new web_webview.WebviewController();
  @State isLoading: boolean = false;

  aboutToAppear() {
    web_webview.WebviewController.setWebDebuggingAccess(true);
    SetToGlobalThis("RXWebViewLayout", this.webViewLayout);
  }

  build() {
    Stack() {
      if (this.webViewVisible) {
        Column() {
          if (this.webViewLayout.naviVisible) {
            Row() {
              if (this.webViewLayout.naviBackVisible) {
                Button({ type: ButtonType.Normal, stateEffect: true }) {
                  Image($r('app.media.rx_back'))
                    .width(this.webViewLayout.naviBackIconWidth)
                    .height(this.webViewLayout.naviBackIconHeight)
                    .align(Alignment.Center)
                }
                .backgroundColor(this.webViewLayout.getNaviBgColor())
                .width(this.webViewLayout.naviBackWidth)
                .height(this.webViewLayout.naviBackHeight)
                .position({ x: this.webViewLayout.naviBackPosX, y: this.webViewLayout.naviBackPosY })
                .onClick((e) => {
                  if (this.controller.accessBackward())
                    this.controller.backward()
                  else {
                    AppStorage.set("RXWebViewVisible", false);
                  }
                })
              }

              Text(this.webViewLayout.naviTitle)
                .backgroundColor(this.webViewLayout.getNaviBgColor())
                .fontColor(this.webViewLayout.getTitleColor())
                .fontSize(16)
                .width(this.webViewLayout.naviTitleWidth)
                .height(this.webViewLayout.naviTitleHeight)
                .textAlign(TextAlign.Center)
                .position({ x: this.webViewLayout.naviTitlePosX, y: this.webViewLayout.naviTitlePosY })

              if (this.webViewLayout.naviCloseVisible) {
                Button({ type: ButtonType.Normal, stateEffect: true }) {
                  Image($r('app.media.rx_close'))
                    .width(this.webViewLayout.naviCloseIconWidth)
                    .height(this.webViewLayout.naviCloseIconHeight)
                    .align(Alignment.Center);
                }
                .backgroundColor(this.webViewLayout.getNaviBgColor())
                .width(this.webViewLayout.naviCloseWidth)
                .height(this.webViewLayout.naviCloseHeight)
                .position({ x: this.webViewLayout.naviClosePosX, y: this.webViewLayout.naviClosePosY })
                .onClick((e) => {
                  AppStorage.set("RXWebViewVisible", false);
                })
              }
            }
            .position({ x: 0, y: 0 })
            .backgroundColor(this.webViewLayout.getNaviBgColor())
            .width(this.webViewLayout.naviBarWidth)
            .height(this.webViewLayout.naviBarHeight);

            Divider()
              .position({ x: this.webViewLayout.naviLinePosX, y: this.webViewLayout.naviLinePosY })
              .width(this.webViewLayout.naviLineWidth)
              .height(this.webViewLayout.naviLineHeight)
              .backgroundColor(0xECECEC)
          }

          Web({ src: this.webViewURL, controller: this.controller })
            .position({ x: this.webViewLayout.webViewPosX, y: this.webViewLayout.webViewPosY })
            .width(this.webViewLayout.webViewWidth)
            .height(this.webViewLayout.webViewHeight)
            .domStorageAccess(true)
            .databaseAccess(true)
            .imageAccess(true)
            .javaScriptAccess(true)
            .visibility(this.webViewVisible ? Visibility.Visible : Visibility.Hidden)
            .backgroundColor(this.webViewLayout.getViewBgColor())
            .javaScriptProxy(RXWebViewJsBridge.getInstance().getJavaScriptProxy(this.controller))
            .onShowFileSelector((event) => {
              let photoSelectOptions = new picker.PhotoSelectOptions();
              photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
              photoSelectOptions.maxSelectNumber = 1;
              let photoPicker = new picker.PhotoViewPicker();
              photoPicker.select(photoSelectOptions).then((photoSelectResult: picker.PhotoSelectResult) => {
                let fileList: Array<string> = photoSelectResult.photoUris
                if (event) {
                  event.result.handleFileList(fileList)
                }
              }).catch((err: Error) => {
                console.log(`选择图片错误: ${JSON.stringify(err)}`);
              });
              return true;
            })
            .onPageBegin((e) => {
              SetToGlobalThis("RXWebViewLayout", this.webViewLayout);
              RXWebViewJsBridge.getInstance().initJsBridge();
              this.isLoading = true;
            })
            .onPageEnd((e) => {
              this.isLoading = false;
            })
            .onConsole((event) => {
              console.log('getMessage:' + event?.message.getMessage())
              console.log('getSourceId:' + event?.message.getSourceId())
              console.log('getLineNumber:' + event?.message.getLineNumber())
              console.log('getMessageLevel:' + event?.message.getMessageLevel())
              return false
            })

        }.position({ x: 0, y: 0 }).width(this.webViewLayout.screenWidth).height(this.webViewLayout.screenHeight)

        if (this.webViewLayout.closeBtnVisible) {
          Button({ type: ButtonType.Normal, stateEffect: true }) {
            Text('返回游戏').fontColor(Color.Black).fontSize(14).offset({ x: 0, y: 20 })
          }
          .borderRadius(16)
          .backgroundColor(Color.White)
          .backgroundImage($r('app.media.rx_service_back'))
          .backgroundImageSize({ width: 50, height: 50 })
          .backgroundImagePosition(Alignment.Top)
          .width(75)
          .height(75)
          .position({ x: this.webViewLayout.screenWidth - 100, y: this.webViewLayout.screenHeight - 100 })
          .onClick(() => {
            AppStorage.set("RXWebViewVisible", false);
          })
        }

        /*
        Button({ type: ButtonType.Normal, stateEffect: true }) {
          Text('测试js').fontColor(Color.Black).fontSize(14).offset({ x: 0, y: 20 })
        }
        .borderRadius(16)
        .backgroundColor(Color.White)
        .backgroundImage($r('app.media.rx_service_back'))
        .backgroundImageSize({ width: 50, height: 50 })
        .backgroundImagePosition(Alignment.Top)
        .width(75)
        .height(75)
        .position({
          x: px2vp(display.getDefaultDisplaySync().width) - 200,
          y: px2vp(display.getDefaultDisplaySync().height) - 200
        })
        .onClick(() => {
          this.controller.runJavaScript(`JSBridgeHandle.call('minimized')`)
          this.controller.runJavaScript(`JSBridgeHandle.call('showTip')`)
          //this.controller.runJavaScript(`JSBridgeHandle.call('syncInfo')`)
        })
        */

        LoadingProgress()
          .color('#20c0b3')
          .enableLoading(this.isLoading)
          .width(60).height(60)
      }

      if (this.webViewLayout.chatFloatVisible) {
        Image($r('app.media.rx_services_btn_float'))
          .width(this.webViewLayout.chatFloatBtnSize)
          .height(this.webViewLayout.chatFloatBtnSize)
          .position({ x: this.webViewLayout.chatFloatPosX, y: this.webViewLayout.chatFloatPosY })
          .onTouch((event: TouchEvent) => {
            if (event.type === TouchType.Move) {
              this.webViewLayout.chatFloatPosX = Number(event.touches[0].windowX) - this.webViewLayout.chatFloatBtnSize / 2
              this.webViewLayout.chatFloatPosY = Number(event.touches[0].windowY) - this.webViewLayout.chatFloatBtnSize / 2
            } else if (event.type === TouchType.Up) {

              if (this.webViewLayout.chatFloatPosX < this.webViewLayout.chatFloatBtnSize) {
                this.webViewLayout.chatFloatPosX = this.webViewLayout.chatFloatBtnSize
              }
              if (this.webViewLayout.chatFloatPosY < this.webViewLayout.chatFloatBtnSize) {
                this.webViewLayout.chatFloatPosY = this.webViewLayout.chatFloatBtnSize
              }

              if (this.webViewLayout.chatFloatPosX > this.webViewLayout.screenWidth - this.webViewLayout.chatFloatBtnSize * 2) {
                this.webViewLayout.chatFloatPosX = this.webViewLayout.screenWidth - this.webViewLayout.chatFloatBtnSize * 2
              }
              if (this.webViewLayout.chatFloatPosY > this.webViewLayout.screenHeight - this.webViewLayout.chatFloatBtnSize * 2) {
                this.webViewLayout.chatFloatPosY = this.webViewLayout.screenHeight - this.webViewLayout.chatFloatBtnSize * 2
              }
            }
          })
          .onClick((e) => {
            AppStorage.set("RXWebViewController", new web_webview.WebviewController());
            AppStorage.set("RXWebViewVisible", true);
            this.webViewLayout.chatFloatVisible = false;
            this.webViewLayout.chatFloatTipVisible = false;
          })

        if (this.webViewLayout.chatFloatTipVisible) {
          Image($r('app.media.rx_services_msg_flag'))
            .width(this.webViewLayout.chatTipSize)
            .height(this.webViewLayout.chatTipSize)
            .position({
              x: this.webViewLayout.chatFloatPosX + this.webViewLayout.chatFloatBtnSize - this.webViewLayout.chatTipSize / 2,
              y: this.webViewLayout.chatFloatPosY
            })
        }
      }

    }.position({ x: 0, y: 0 });
  }
}