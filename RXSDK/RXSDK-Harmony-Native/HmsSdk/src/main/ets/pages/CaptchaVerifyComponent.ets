import { display } from '@kit.ArkUI';

import { webview } from '@kit.ArkWeb';
import SDKConfig from '../sdk/SDKConfig';
import { Logger } from '../utils/Logger';

import { JSON } from '@kit.ArkTS';
import { JsHandlerType, JsObject } from '../types/Index';

import { BusinessError } from '@kit.BasicServicesKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';


export interface WebFuncs {
  sliderCaptcha: (ret: string) => void
  invokeNativeCallback: (json: string) => void
  doClose: (json: string) => void
  onPageStarted: (json: string) => void
  onPageFinished: (json: string) => void

}

/**
 * Login page component.
 */
@Preview
@Component
  // @CustomDialog
export struct CaptchaVerifyComponent {
  @Prop title: ResourceStr = $r('app.media.rx_logo');
  @State url: string = '';
  @State naviBarVisible: boolean = true;
  @State closeVisible: boolean = true;
  @State backVisible: boolean = false;
  @State divVisible: boolean = true;
  @State orientation: display.Orientation = 1;
  @State isLoading: boolean = true
  @State horizontalPadding: number = 0
  webParams: Record<string, string> = {}
  // private controller: CustomDialogController
  private webController: webview.WebviewController = new webview.WebviewController();
  onCloseClick?: (event?: ClickEvent) => void;
  onSliderCaptchaCallback?: (data: JsObject) => void;
  webFunc: WebFuncs = {
    //{"code":0,"randstr":"@iwe","ticket":"tr03guffDNDKNnwa5cAG3HBj4HydiSLhEj8LCZWBSmLdEPWfi3aZjd0yb3cAvECVYDqt1dMlyZsi5zEywbf1pqbAGI83q5kRtwfauIe7bvdYP3bfXxLpYZBZv9N_X2wmGyD49ouwini6sXw*"}
    sliderCaptcha: (ret: string) => {
      Logger.i('sliderCaptcha ' + ret);
      this.invokeHandler(ret);
    },

    invokeNativeCallback: (json: string) => {
      Logger.i('invokeNativeCallback:' + json);
      this.invokeHandler(json);
    },

    doClose: (json: string) => {
      Logger.i('doClose:' + json);
      this.close();
    },
    onPageStarted: (json: string): void => {
      Logger.i('onPageStarted:' + json);

    },
    onPageFinished: (json: string): void => {
      Logger.i('onPageFinished:' + json);
    }
  }

  invokeHandler(data: string): void {
    try {
      const obj = JSON.parse(data || "{}") as JsObject;
      if (obj.code >= 0) {
        this.onSliderCaptchaCallback?.(obj)
      } else {
        this.close()
      }
    } catch (e) {
      Logger.e(e)
      this.close()
    }
  }

  aboutToAppear() {
    // this.windowWidth = display.getDefaultDisplaySync().width;
    // this.windowHeight = display.getDefaultDisplaySync().height;
    Logger.i("setWebDebuggingAccess :" + Logger.logEnable)
    Logger.i("display :" + JSON.stringify(display.getDefaultDisplaySync()))

    webview.WebviewController.setWebDebuggingAccess(Logger.logEnable);
    this.orientation = display.getDefaultDisplaySync().orientation
  }

  close() {
    // this?.controller?.close()
    this.onCloseClick?.()
  }

  build() {
    RelativeContainer() {
      // Stack({ alignContent: Alignment.Center }) {
      this.WebView()
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
    }

  }

  @Builder
  WebView() {
    Web({ src: this.url, controller: this.webController })
      .domStorageAccess(true)
      .imageAccess(true)
      .onlineImageAccess(true)
      .javaScriptAccess(true)
      .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
        Logger.info(`Ace: on size change, oldValue is ${JSON.stringify(oldValue)} value is ${JSON.stringify(newValue)}`)
      })
      .javaScriptProxy({
        object: this.webFunc,
        name: "JsBridge",
        methodList: Object.keys(this.webFunc),
        controller: this.webController,
      })// .onInterceptRequest((event) => {
        //   let url = '';
        //   if (event) {
        //     url = event.request.getRequestUrl();
        //     let userAgent = this.webController.getUserAgent();
        //     Logger.i("ua:" + JSON.stringify(userAgent));
        //   }
        //   // Logger.i(JSON.stringify(event.request.getRequestHeader()))
        //   // if (url === this.imgRequestUrl) {
        //   //   return this.responseweb;
        //   // }
        //   return null;
        // })
      .onShowFileSelector((event) => {
        try {
          let PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
          PhotoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
          PhotoSelectOptions.maxSelectNumber = 1;
          let photoPicker = new photoAccessHelper.PhotoViewPicker();
          photoPicker.select(PhotoSelectOptions).then((photoSelectResult: photoAccessHelper.PhotoSelectResult) => {
            console.info('PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(photoSelectResult));
            let fileList: Array<string> = photoSelectResult.photoUris;
            if (event) {
              event.result.handleFileList(fileList);
            }
          }).catch((err: BusinessError) => {
            console.error(`PhotoViewPicker.select failed with err: ${err.code}, ${err.message}`);
          });
          return true;
        } catch (error) {
          let err: BusinessError = error as BusinessError;
          console.error(`PhotoViewPicker failed with err: ${err.code}, ${err.message}`);
          return false;
        }
      })
      .onPageBegin((e) => {
        Logger.i("onPageBegin:" + JSON.stringify(e));
        // this.webController.runJavaScript(new RXJavaScriptProxy().injectionCode())
        this.isLoading = true;
      })
      .onPageEnd(e => {
        this.isLoading = false;
        Logger.i("onPageEnd:" + JSON.stringify(e));
        // try {
        //   this.webController.loadUrl("javascript:" + this.removeDesc)
        // } catch (error) {
        //   Logger.i(`loadUrl removeDesc fail: ${JSON.stringify(error)}`)
        // }
      })
      .onConsole((event) => {
        console.log(event?.message.getMessage() + ':' + JSON.stringify(event?.message.getSourceId));
        return false;
      })
      .backgroundColor(Color.Transparent)
  }
}

