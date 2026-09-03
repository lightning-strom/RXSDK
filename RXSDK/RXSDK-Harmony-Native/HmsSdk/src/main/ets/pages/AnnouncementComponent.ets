// @Entry
import { Announcement, AnnouncementImage } from '../types/Index';
import { display } from '@kit.ArkUI';
import { Logger } from '../utils/Logger';
import { webview } from '@kit.ArkWeb';

const regex = /font-size:\s*(\d+(\.\d+)?)(?:(px|em|rem|%)?)\s*(?=;|$)/gi;
let meta = `<meta name="viewport" content="width=device-width">  <style>
body, html {
  font-size: 40px;
}
</style>`

@Preview
@Component
  // @CustomDialog
export struct AnnouncementComponent {
  private controller: webview.WebviewController = new webview.WebviewController()
  useWeb: boolean = false
  @State isControllerAttached: boolean = false
  @State announcementList: Announcement[] = [{
    title: "公告标题1122222222",
    id: 0,
    type: 0,
    timezone: 0,
    start: '',
    end: '',
    content_type: 2,
    is_popup: 0,
    images: [
      { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" },
      {
        image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545450485.jpeg"
      },
      {
        image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545176191.png"
      },
      {
        image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545185609.jpeg"
      },
      { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" },
      { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" }]
  },
    {
      title: "标题222",
      id: 0,
      type: 0,
      timezone: 0,
      start: '',
      end: '',
      content_type: 1,
      is_popup: 0,
      content: '<p><br></p><p style="text-align: start;"><span style="font-size: 36em;">尊敬的玩家朋友们：</span></p><p style="text-align: start;"><span style="font-size: 24;">您好！</span></p>'
    }]
  // @State contentType: number = this.announcementList[0].content_type || 1;
  // @State images?: AnnouncementImage[] = // this.announcementList[0].images
  //   [
  //     { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" },
  //     {
  //       image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545450485.jpeg"
  //     },
  //     {
  //       image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545176191.png"
  //     },
  //     {
  //       image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545185609.jpeg"
  //     },
  //     { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" },
  //     { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" }
  //   ]
  @State content?: string = ''
  // `<meta name="viewport" content="width=device-width"> <p style="text-align: start;"><span style="font-size: 18pt;">尊敬的玩家朋友们：这里，width=device-width 确保视口的宽度与设备的屏幕宽度相匹配，而 initial-scale=1.0 确保页面在加载时以 1:1 的比例显示，即不进行任何额外的缩放。
  // </span></p>
  // <p style="text-align: start;"><span style="font-size: 24pt;">您好！</span></p>`;
  @State selectIndex: number = 0;
  onCloseClick?: (event?: ClickEvent) => void;
  onLinkClick?: (link?: string) => void;

  // private controller: CustomDialogController

  aboutToAppear(): void {
    //   let den = display.getDefaultDisplaySync().densityDPI
    //
    //   Logger.d("display.getDefaultDisplaySync()")
    //   Logger.d(display.getDefaultDisplaySync())
    // try {
    //   this.controller.loadData(this.getRichText(), "text/html", "UTF-8", " ", " ")
    // } catch (error) {
    //   console.error(`ErrorCode: ${(error as BusinessError).code},  Message: ${(error as BusinessError).message}`);
    // }

    // if (this.announcementList[this.selectIndex]?.content_type == 1 && this.useWeb) {
    //   setTimeout(() => {
    //
    //   })
    // }
  }

  build() {
    Column() {
      Row() {
        Text("公告板")
          .fontSize(18)
          .margin({ left: 22 })
          .fontWeight(FontWeight.Bold)
          .alignRules({
            center: { anchor: '__container__', align: VerticalAlign.Center },
            middle: { anchor: '__container__', align: HorizontalAlign.Center }
          })
        Blank().layoutWeight(1)
        Image($r('app.media.ic_notice_header')).objectFit(ImageFit.None).width(94).margin({ right: 32 })
        Image($r('app.media.rx_close')).objectFit(ImageFit.Contain).width(22).margin({ right: 22 }).onClick((e) => {
          this.onCloseClick?.(e)
        })
      }.backgroundColor("#CCFFFB").height(62).borderRadius({ topLeft: 4, topRight: 4 })

      Row() {
        if (this.announcementList.length > 1) {
          List({ space: 10 }) {
            ForEach(this.announcementList, (item: Announcement, index: number) => {
              ListItem() {
                Text('' + item.title)// .width('100%')
                  .height(50)
                  .fontSize(14)
                  .fontWeight(FontWeight.Medium)
                  .textAlign(TextAlign.Center)
                  .padding({ left: 6, right: 6 })
                  .fontColor(this.selectIndex == index ? "#20C0B3" : "#8B8B8B")
                  .maxLines(2)
              }
              .borderRadius(4)
              .onClick(() => {
                console.info('onClick  ' + index);
                this.selectIndex = index;
                let a = this.announcementList[index]
                let contentType = a?.content_type
                if (contentType == 1 && a.content) {
                  try {
                    if (this.isControllerAttached) {
                      this.controller.loadData(this.content || a?.content, "text/html", "UTF-8")
                    }
                  } catch (e) {
                    Logger.e(e)
                  }
                }
              })
              .backgroundColor(this.selectIndex == index ? "#EDFDFC" : "#F8F8F8")
              .width("100%")
              .height(46)
              .selectable(true)
            })
          }
          .margin({ left: 10, top: 10, bottom: 10 })
          .width('25%')
          .height(-1)
          .constraintSize({ maxWidth: 112 })
          // .scrollBarWidth(0)
          .scrollBar(BarState.Off)
          // .backgroundColor(Color.Gray)
          .friction(0.7)
        }
        Scroll() {
          Column() {
            Text(this.announcementList[this.selectIndex]?.title)
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .margin({ bottom: 8 })

            if (this.announcementList[this.selectIndex]?.content_type == 1) {
              if (this.useWeb) {
                Web({
                  src: '',
                  controller: this.controller
                })
                  .onControllerAttached(() => {
                    this.isControllerAttached = true
                    try {
                      let id = this.controller.getWebId();
                      console.log("id: " + id);
                      if (this.announcementList[this.selectIndex]?.content_type == 1 && this.useWeb) {
                        this.controller.loadData(this.content || this.announcementList[this.selectIndex]?.content, "text/html", "UTF-8")
                      }
                    } catch (e) {
                      Logger.e(e)
                    }
                  })
                  .zoomAccess(false)
                  .horizontalScrollBarAccess(false)
                  .height("100%")// .scale({})
                  .layoutWeight(1)
                // .backgroundColor(Color.Gray)
              } else {
                RichText(this.getRichText())
                  .height("100%")
                  .layoutWeight(1)
              }
            } else {
              List({ space: 10 }) {
                // 图片模式列表
                ForEach(this.announcementList[this.selectIndex]?.images, (item: AnnouncementImage, index: number) => {
                  ListItem() {
                    Image(item.image_url).objectFit(ImageFit.Contain).autoResize(true)
                  }
                  .onClick(() => {
                    this.onLinkClick?.(item.link_url)
                  })

                  // .margin({ bottom: 10 })
                })
              }
              .height(-1)
              .width(-1)
              .friction(0.7)
              .layoutWeight(1)
              .scrollBar(BarState.Off)
            }
          }
          .justifyContent(FlexAlign.Start)
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)

        }
        // .backgroundColor(Color.Blue)
        .layoutWeight(1)
        .margin(10)
        .scrollBar(BarState.Off)

        // .scrollable(ScrollDirection.Vertical) // 滚动方向纵向
      }
      .layoutWeight(1)
      .borderRadius({ bottomLeft: 4, bottomRight: 4 })
      .alignItems(VerticalAlign.Top)

      // .backgroundColor(Color.Gray)

    }
    .backgroundColor(Color.White)
    .margin({
      left: 30,
      right: 30,
      top: 50,
      bottom: 50
    })
    .borderRadius(4)
    .constraintSize({ maxWidth: 500, maxHeight: 360 })
  }

  private getRichText(): string {
    return meta + (this.content || this.announcementList[this.selectIndex]?.content)?.replace(regex, (_match, numberPart: number, unit: string) => {
      const unitToUse: string = unit || 'px';
      let newSize = Number(numberPart) * display.getDefaultDisplaySync().densityPixels;
      // let newSize =numberPart
      return `font-size: ${newSize}${unitToUse}`;
    });
  }
}

