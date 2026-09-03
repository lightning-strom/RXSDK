import { LengthMetrics } from '@kit.ArkUI';
import { MailDetail, MailPropItem } from '../types/MailInterfaces';
import { Logger } from '../utils/Logger';
import { HeaderComponent } from './HeaderComponent';
import { webview } from '@kit.ArkWeb';
import { PreviewDialog } from './PreviewDialog';

export interface WebFuncs {
  onImageClick: (urls: string[], index: number) => void
}

// @Entry
@Preview
@Component
  // @CustomDialog
export struct MailDetailComponent {
  @State mailContent: MailDetail = {
    "title": "我是一封邮件标题",
    "content": "这里是邮箱的正文，这里支持富文本，可以加粗，描红、斜体，感谢您在过去24小时诶内通过邮箱与我们练习这里是邮箱的正文，这里支持富文本，可以加粗，描红、斜体，感谢您在过去24小时诶内通过邮箱与我们练习 这里是邮箱的正文，这里支持富文本，可以加粗，描红、斜体，感谢您在过去24小时诶内通过邮箱与我们练习，相关的邮件领取详情，如果是你本人获得授权的其他人查看了你通过邮箱领取详情，则无需再进行他操作这里是邮箱的正文，",
    "sign": " 等等",
    "props": [
      {
        "name": "11",
        "describe": "111",
        "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
        "tag": "2",
        "count": 10,
        "count_format": "个",
        "is_permanent": 0,
        "time_limit": 1
      },
      {
        "name": "1122",
        "describe": "11122",
        "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
        "tag": "2",
        "count": 10,
        "count_format": "个",
        "is_permanent": 0,
        "time_limit": 1
      },

      {
        "name": "1122",
        "describe": "11122",
        "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
        "tag": "2",
        "count": 10,
        "count_format": "个",
        "is_permanent": 0,
        "time_limit": 1
      }
    ],
    "status": 1,
    rx_mail_id: 0
  }
  @State title: ResourceStr = "邮件";
  onCloseClick?: (event?: ClickEvent) => void;
  onMailClick?: (isDelete: boolean) => void;
  private controller: webview.WebviewController = new webview.WebviewController()
  @State scrollState: number = 0
  @State propIndex: number = -1
  @State webFunc: WebFuncs = {
     onImageClick: (urls: string[], index: number) => {
      PreviewDialog.getInstance(this.getUIContext()).setList(urls, index).show()
    },
  }

  // private controller: CustomDialogController


  aboutToAppear(): void {
    if (this.mailContent.content) {
      setTimeout(() => {
        try {
          this.controller.loadData(this.mailContent.content, "text/html", "UTF-8")
        } catch (e) {
          Logger.e(e)
        }
      })
    }
  }

  close(event: ClickEvent) {
    // this?.controller?.close()
    this.onCloseClick?.(event);
  }

  build() {
    RelativeContainer() {
      Column() {
        HeaderComponent({
          title: this.title, onClose: (e) => {
            this.close(e)
          }
        , backVisible: true
        }).margin({ top: 4 })
        Column() {
          Row() {
            Text(this.mailContent.title)
              .fontSize(15)
              .fontColor("#323232")
              .fontWeight(FontWeight.Medium)
              .maxLines(1)
              .align(Alignment.Start)
            // .backgroundColor(Color.Brown)
            Blank().layoutWeight(1)
          }.margin({
            top: 11
          })

          Scroll() {
            // RichText(this.mailContent.content).width("100%")
            this.Webview()
            // Text(this.mailContent.content).fontSize(12).fontColor("#767676").width("100%")
          }
          .layoutWeight(1)
          .align(Alignment.TopStart)
          .margin({
            left: 0,
            right: 0,
            top: 10,
            bottom: 10
          })

          // .backgroundColor(Color.Gray)

          Blank()

        }
        .backgroundColor("#F4F4F4")
        .borderRadius(10)
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)
        .padding(10)
        .margin({
          left: 15,
          right: 15,
          bottom: 13
        })

        Flex({
          wrap: FlexWrap.Wrap,
          space: { cross: LengthMetrics.vp(10) },
          alignItems: ItemAlign.Center,
          justifyContent: FlexAlign.Center
        }) {
          if (this.mailContent.props?.length > 0) {
            Row() {
              Image($r('app.media.ic_left_arrow')).width(8).margin({ right: 10 }).objectFit(ImageFit.Contain).visibility((this.scrollState & 2) > 0 ? Visibility.Visible : Visibility.Hidden)
              List({ space: 15 }) {
                ForEach(this.mailContent.props, (item: MailPropItem, index: number) => {
                  ListItem() {
                    RelativeContainer() {
                      Column() {
                        Image(item.icon)// .width(40)
                          .height(36)
                          .margin({ left: 8, right: 8, top: 4 })
                          .objectFit(ImageFit.Contain)
                          .autoResize(true)
                        Text(`${item.count}${item.count_format}`)
                          .fontColor("#20C0B3")// .fontWeight(item.status == 3 ? FontWeight.Medium : FontWeight.Normal)
                          .fontSize(10)
                          .width("100%")
                          .margin({ top: 1, bottom: 2, right: 2 })
                          .maxLines(1)
                          .textAlign(TextAlign.End)// .backgroundColor(Color.Gray)
                          .maxLines(1)
                      }

                      if (this.mailContent.status == 2) {
                        Text('已领')
                          .fontSize(9)
                          .padding(3)
                          .alignRules({
                            right: { anchor: '__container__', align: HorizontalAlign.End },
                            top: { anchor: '__container__', align: VerticalAlign.Top }
                          })
                          .backgroundColor("#FFD95A")
                          .borderRadius({ bottomLeft: 4, topRight: 4 })
                      }
                    }
                    .borderWidth(1)
                    .borderColor("#E1E1E1")
                    .borderRadius(6)
                    .height(56)
                    .width(56)
                  }
                  .onClick(() => {
                    // this.onLinkClick?.(item.link_url)
                    this.propIndex = index
                  })
                }, (item: string) => item)

              }
              .width(-1)
              .constraintSize({ maxWidth: 330 })
              .height(60)
              .friction(0.7)
              .layoutWeight(1)
              .borderRadius(4)
              .id('prop_list')
              .listDirection(Axis.Horizontal)
              .scrollBar(BarState.Off)
              .onScrollIndex((start: number, end: number, center: number) => {
                this.scrollState = 3
              })
              .onReachStart(() => {
                this.scrollState = 2
              })
              .onReachEnd(() => {
                this.scrollState = 1
              })

              // .backgroundColor(Color.Yellow)

              Image($r('app.media.ic_right_arrow'))
                .width(8)
                .margin({ left: 10 })
                .visibility((this.mailContent.props?.length > 4 && (this.scrollState & 1) > 0) ? Visibility.Visible : Visibility.Hidden)
                .objectFit(ImageFit.Contain)
            }

            Blank()
            // .backgroundColor(Color.Yellow)
          }

          if (this.mailContent.props?.length > 0 && this.mailContent.status != 2) {
            Blank().layoutWeight(1)
            Button('领取道具', { type: ButtonType.Normal, stateEffect: true })
              .width(130)
              .height(38)
              .margin({ left: 5, right: 5 })
              .borderRadius(4)
              .fontSize(14)
              .fontWeight(500)
              .fontColor(Color.White)
              .backgroundColor($r('app.color.col_20c0b3'))
              .onClick(() => {
                this.onMailClick?.(false);
              })
          } else {
            Button('删除邮件', { type: ButtonType.Normal, stateEffect: true })
              .width(this.mailContent.props?.length > 0 ? 130 : 200)
              .height(38)
              .margin({ left: 5, right: 5 })
              .borderRadius(10)
              .fontSize(14)
              .fontWeight(500)
              .fontColor(Color.White)
              .backgroundColor("#DC6E6E")
              .onClick(() => {
                console.log("click login")
                this.onMailClick?.( true);
              })
          }
        }
        .margin({
          left: 15,
          right: 15,
          bottom: 13
        })

        // .backgroundColor(Color.Gray)
        // .alignItems(VerticalAlign.Center)
      }

      this.showDetail()
      // .borderRadius(4)
      // .constraintSize({ maxWidth: 550, maxHeight: 500 })

    }
    .backgroundColor(Color.White)
    .onClick(() => {
      this.propIndex = -1
    })
    .margin({
      left: 30,
      right: 30,
      top: 34,
      bottom: 34
    })
    .borderRadius(4)
    .constraintSize({ maxWidth: 550, maxHeight: 500 })
  }

  @Builder
  Webview() {
    // RichText(this.mailContent.content).width("100%")
    Web({
      src: '',
      controller: this.controller
    })
      .zoomAccess(false)
      .horizontalScrollBarAccess(false)
      .height("100%")
      .layoutWeight(1)
      .backgroundColor("#F4F4F4")
      .javaScriptProxy({
        object: this.webFunc,
        name: "JsBridge",
        methodList: Object.keys(this.webFunc),
        controller: this.controller,
      })
      .onPageBegin((e) => {
        Logger.i("onPageBegin:" + JSON.stringify(e));

      })
      .onPageEnd(e => {
        Logger.i("onPageEnd:" + JSON.stringify(e));
        let script = `
          const metaTag = document.createElement('meta');
          metaTag.name = 'viewport';
          metaTag.content = 'width=device-width, initial-scale=1.0';
          document.head.appendChild(metaTag);
          document.documentElement.style.fontSize = '14px';
          document.querySelectorAll('img').forEach((img, index) => {
            img.style.width = '20vw';
            img.style.height = 'auto';
            img.style.maxWidth = '100vw';
            img.addEventListener('click', function() {
              let urls = Array.from(document.querySelectorAll('img')).map(img => img.src);
              JsBridge.onImageClick(urls, index);
            });
          });
        `;
        this.controller.runJavaScript(script);
      })
      .onConsole((event) => {
        console.log(event?.message.getMessage() + ':' + JSON.stringify(event?.message.getSourceId));
        return false;
      })
  }

  @Builder
  showDetail() {
    if (this.propIndex >= 0) {
      Column() {
        Row() {
          RelativeContainer() {
            Image(this.mailContent.props[this.propIndex]?.icon)// .width(40)
              .height(36)
              .margin({ left: 8, right: 8, top: 4 })
              .objectFit(ImageFit.Contain)
              .autoResize(true)
          }
          .borderWidth(1)
          .borderColor("#E1E1E1")
          .borderRadius(6)
          .height(46)
          .width(46)

          Column() {
            Text(this.mailContent.props[this.propIndex]?.name).maxLines(1).fontWeight(FontWeight.Medium).fontSize(14)
            Text(`还有${this.mailContent.props[this.propIndex].time_limit}天到期`).maxLines(1).fontSize(13)
            Text(`x${this.mailContent.props[this.propIndex].count}${this.mailContent.props[this.propIndex].count_format}`).maxLines(1).fontSize(13)
          }.margin({ left: 8, top: 8 }).layoutWeight(1).alignItems(HorizontalAlign.Start)
        }.margin({ left: 8, top: 4 })

        Scroll() {
          Text(this.mailContent.props[this.propIndex]?.describe)
            .fontColor("#767676")
            .fontSize(11)
        }
        .layoutWeight(1)
        .align(Alignment.TopStart)
        // .backgroundColor(Color.Blue)
        .margin({
          left: 8,
          top: 8,
          bottom: 8,
          right: 8
        })
      }
      .alignItems(HorizontalAlign.Start)
      .height(148)
      .width(148)
      .borderRadius(8)
      // .grayscale(0.3)
      .shadow({
        radius: 10,
        color: Color.Gray
      })
      .alignRules({
        left: { anchor: '__container__', align: HorizontalAlign.Center },
        center: { anchor: '__container__', align: VerticalAlign.Center }
      })
      // .markAnchor({ x: 0.5, y: 0.5 })
      .onClick(() => {

      })
      // .margin(20)
      .backgroundColor(Color.White)

    }
  }
}


