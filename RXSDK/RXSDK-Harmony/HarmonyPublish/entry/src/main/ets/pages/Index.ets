import { APP_KEY_SAFEAREA_RECT, APP_KEY_NAVIGATION_MARGIN, Tuanjie, SetToGlobalThis, HMSMessageBind } from 'tuanjieLib';
import { TuanjiePlayerView } from 'tuanjieLib';
import { window } from '@kit.ArkUI';

@Entry
@Component
struct TuanjiePlayer {
  @State displayIndex0: number = 0;
  @State displayIndex1: number = 0;
  @State displayIndex2: number = 2;
  @State btnText: string = "TurnOffDisplay2";
  private multiView: boolean = false;
  @StorageProp(APP_KEY_SAFEAREA_RECT) safeAreaRect: window.Rect = { top: 0, left: 0, width: 0, height: 0 };
  @StorageProp(APP_KEY_NAVIGATION_MARGIN) navigationMargin: Margin = { left: 0, top: 0, bottom: 0, right: 0 }

  aboutToAppear() {
    // 1.10 classesLib no longer SetToGlobalThis('UIContext'); login UI needs it.
    SetToGlobalThis('UIContext', this.getUIContext());
    // 1.10 WorkerProxy no longer calls SDKManager.InitMessageBind.
    HMSMessageBind.bindWithRetry();
  }

  build() {
    Column() {
      Row() {
        if (!this.multiView) {
          TuanjiePlayerView({ displayIndex: this.displayIndex0 });
        } else {
          Button(this.btnText)
            .onClick(() => {
              // switch on/off display2
              if (this.displayIndex2 == -1) {
                this.btnText = "TurnOffDisplay2";
                this.displayIndex2 = 2;
              } else {
                this.btnText = "TurnOnDisplay2";
                this.displayIndex2 = -1;
              }
              // // navigate to page 2
              // this.getUIContext().getRouter()
              //   .pushUrl({
              //     url: "pages/Index2",
              //     params: {
              //       data: "message",
              //     }
              //   })
              //   .then(() => {
              //     console.info("Page transition succeed");
              //   })
              //   .catch((error: BusinessError) => {
              //     console.error(`pushUrl failed, code is ${error.code}, message is ${error.message}`);
              //   })
            })
          TuanjiePlayerView({ displayIndex: this.displayIndex1 }).width('50%');
          Column({ space: "3" }) {
            TuanjiePlayerView({ displayIndex: this.displayIndex2 }).width('80%'); //.height('580px').width('580px');
          }.width('40%');
        }
      }
      .margin({
        left: `${this.safeAreaRect.left + Number(this.navigationMargin.left)}px`,
        top: `${this.safeAreaRect.top + Number(this.navigationMargin.top)}px`
      })
      .width(`${this.safeAreaRect.width - Number(this.navigationMargin.right)}px`)
      .height(`${this.safeAreaRect.height - Number(this.navigationMargin.bottom)}px`)
      .alignItems(VerticalAlign.Center)
    }
    .alignItems(HorizontalAlign.Start)
    .backgroundColor(Color.Black)
    .height('100%')
    .width('100%')
  }

  onBackPress() {
    Tuanjie.nativeTiggerEvent("TriggerEscapeKey");
    return !AppStorage.get("backButtonLeavesApp") as boolean;
  }
}
