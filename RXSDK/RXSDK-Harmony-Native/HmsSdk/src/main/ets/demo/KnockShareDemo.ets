import { gameNearbyTransfer, gamePlayer } from '@kit.GameServiceKit';
import { display, LengthMetrics, promptAction, router } from '@kit.ArkUI';
import { BusinessError, deviceInfo, pasteboard } from '@kit.BasicServicesKit';
import { Logger } from '../utils/Logger';

import { common } from '@kit.AbilityKit';
 import { FileUtil } from '../utils/FileUtil';


@Entry({ routeName: 'KnockShareDemo' })
@Component
struct KnockShareDemo {
  @State title: Resource = $r('app.media.rx_logo');
  @State text: string = 'log';
  scroller: Scroller = new Scroller()
  nearbyGameDevices?: Array<gameNearbyTransfer.NearbyGameDevice>;

  showText(text: string | object, args?: ESObject) {
    if (typeof text == 'object') {
      this.text = JSON.stringify(text, null, 2) + (args ? JSON.stringify(args, null, 2) : "")
    } else {
      this.text = text + (args ? JSON.stringify(args, null, 2) : "")
    }
    Logger.debug(text, args)
  }

  aboutToAppear(): void {


  }

  aboutToDisappear(): void {


  }




  build() {
    Column() {
      // this.Header()

      Scroll(this.scroller) {
        Column() {

          Flex({
            wrap: FlexWrap.Wrap,
            justifyContent: FlexAlign.SpaceBetween,
            space: { main: LengthMetrics.vp(10), cross: LengthMetrics.vp(10) }

          }) {
            Button("初始化")
              .btnStyle()
              .onClick(async () => {

              })
            Button("自动连接服务")
              .btnStyle()
              .onClick(async () => {

              })
            Button("开启服务")
              .btnStyle()
              .onClick(async () => {

              })
            Button("手动发现服务")
              .btnStyle()
              .onClick(async () => {

              })
            Button("手动连接服务")
              .btnStyle()
              .onClick(async () => {


              })

            Button("发送包信息")
              .btnStyle()
              .onClick(async () => {

              })
            Button("响应发送包 AVAILABLE")
              .btnStyle()
              .onClick(async () => {

              })
            Button("响应发送包  UNAVAILABLE")
              .btnStyle()
              .onClick(async () => {

              })
            Button("响应发送包  Error")
              .btnStyle()
              .onClick(async () => {
               })
            Button("发送文件")
              .btnStyle()
              .onClick(async () => {

              })
            Button("文件列表")
              .btnStyle()
              .onClick(async () => {
                const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let fl = FileUtil.getFileList(context.filesDir)

                this.showText(fl)
              })
            Button("文件包信息")
              .btnStyle()
              .onClick(async () => {

              })

            Button("destroy")
              .btnStyle()
              .onClick(async () => {

              })


            Button("copyRaw")
              .btnStyle()
              .onClick(async () => {

              })

            Button("copy")
              .btnStyle()
              .onClick(async () => {


              })

          } //flex end


          Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })
          // Scroll() {
          //   Column() {
          Text(this.text).onClick(() => {
            copyText(this.text)
          }).alignSelf(ItemAlign.Start)
        }
      }
      // .alignRules({ center: { anchor: "__container__", align: HorizontalAlign.Center } })
      // .width($r('app.float.dialog_width'))
      .layoutWeight(1)
      .align(Alignment.TopStart)
      .margin({ left: 20, right: 20, bottom: 10 })
      // .height('90%')
      // .backgroundColor(Color.Green)
      .scrollable(ScrollDirection.Vertical) // 滚动方向纵向
      .scrollBar(BarState.Off) // 滚动条常驻显示
      // .scrollBarColor(Color.Gray) // 滚动条颜色
      // .scrollBarWidth(2) // 滚动条宽度
      .friction(0.6)
    }
  }

  @Builder
  Header() {
    RelativeContainer() {
      // .backgroundColor("#FF3333")
      Row() {
        Image($r('app.media.rx_logo'))
          .width("143vp")
          .height("33vp")
          .objectFit(ImageFit.None)
          .align(Alignment.Center)
      }
      .alignRules({
        middle: { anchor: "__container__", align: HorizontalAlign.Center },
      })


    }

    .height(30)

    // .backgroundColor("#FF3333")
  }
}

@Extend(Button)
function btnStyle() {
  // .constraintSize({ minHeight: 40 })
  .width(140)
  .type(ButtonType.Normal)
  .labelStyle({
    maxLines: 2
  })
  .fontColor("#FF007DFF")
  .backgroundColor("#0D000000")
  // .height($r('app.float.login_btn_height'))
  // .buttonStyle(ButtonStyleMode.NORMAL)
  .fontSize(14)
  // .fontWeight(CommonConstants.BUTTON_FONT_WEIGHT)

}


function copyText(text: string) {
  const pasteboardData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
  const systemPasteboard = pasteboard.getSystemPasteboard();
  systemPasteboard.setData(pasteboardData);
  systemPasteboard.getData().then((data) => {
    if (data) {

        promptAction.showToast({ message: '复制成功' });

    } else {
      promptAction.showToast({ message: '复制失败' });
    }
  })
}

