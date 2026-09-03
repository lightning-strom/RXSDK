import { FeedbackDetailBean, FeedbackPropBean } from '../api/Feedback';
import { HeaderComponent } from './HeaderComponent';
import { PreviewDialog } from './PreviewDialog';


@Entry
@Component
  // @CustomDialog
export struct FeedbackDetailComponent {
  @Prop content?: FeedbackDetailBean = {
    "id": 213,
    "content": "已经反馈内容说明",
    "attachments": [
      "https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png",
      "https://rxfile.fishinggamezone.com/2024/06/25/1719309658818.jpg"
    ],
    "created_at": "2024-10-12 17:10:05",
    "status": 2,
    "recover_at": "2024-10-15 11:14:58",
    "recover_content": "回复内容54",
    "recover_attachments": [
      "https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png",
      "https://rxfile.fishinggamezone.com/2024/06/25/1719309658818.jpg"
    ],
    "is_prop": 0,
    "prop": [{
      "name": "name1",
      "tag": "1111",
      "num": "65",
      "time_limit": 5,
      "icon": "",
      "count": "65",
      "describe": ""
    }, {
      "name": "name2",
      "tag": "1111",
      "num": "65",
      "time_limit": 5,
      "icon": "",
      "count": "65",
      "describe": ""
    }],
    "get_prop": 1
  };
  @State title: ResourceStr = "反馈内容";
  onCloseClick?: (event?: ClickEvent) => void;
  onReceiveClick?: (event?: ClickEvent) => void;
  @State previewUri: string = ''

  // private controller: CustomDialogController

  aboutToAppear(): void {
  }

  close(event: ClickEvent) {
    this.onCloseClick?.(event);
  }

  @Builder
  addAttachments(attachments: string[]) {
    List({ space: 10 }) {
      ForEach(attachments, (item: string, index: number) => {
        ListItem() {
          Column() {
            Image(item)
              .objectFit(ImageFit.Cover)
              .borderRadius(6)
              .onClick((e) => {
                // this.previewUri = item
                PreviewDialog.getInstance(this.getUIContext()).setList(attachments, index).show()
              })
          }
          .borderWidth(1)
          .borderColor("#E1E1E1")
          .borderRadius(6)
          .height(56)
          .width(56)
        }
      })
    }
    .width(-1)
    .friction(0.7)
    .height(56)
    .margin({ top: 8 })
    .listDirection(Axis.Horizontal)
    .scrollBar(BarState.Off)
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
        Scroll() {
          Column() {
            Text(this.content?.content).fontSize(11).fontColor("#323232").margin({ top: 10 })
            if (this.content && this.content?.attachments?.length > 0) {
              this.addAttachments(this.content.attachments)
            }
            Column() {
              Text("回复内容:").fontSize(14).margin({ bottom: 2 }).fontWeight(FontWeight.Medium).width("100%")
              Column() {
                Text(this.content?.recover_content).fontSize(11).fontColor("#323232").margin({ top: 5 })
                if (this.content && this.content?.recover_attachments?.length > 0) {
                  this.addAttachments(this.content.recover_attachments)
                }
              }.alignItems(HorizontalAlign.Start)

              if (this.content && this.content?.prop?.length > 0) {
                Text("附件:").fontSize(14).margin({ bottom: 2 }).fontWeight(FontWeight.Medium).margin({ top: 10 }) //.fontColor("#9C9C9C")
                Row() {
                  List({ space: 10 }) {
                    ForEach(this.content.prop, (item: FeedbackPropBean, index: number) => {
                      ListItem() {
                        RelativeContainer() {
                          Column() {
                            Image(item.icon)// .width(40)
                              .height(36)
                              .margin({ left: 8, right: 8, top: 4 })
                              .objectFit(ImageFit.Contain)
                              .autoResize(true)
                            Text(`${item.count}`)
                              .fontColor("#20C0B3")// .fontWeight(item.status == 3 ? FontWeight.Medium : FontWeight.Normal)
                              .fontSize(10)
                              .width("100%")
                              .margin({ top: 1, bottom: 2, right: 2 })
                              .maxLines(1)
                              .textAlign(TextAlign.End)// .backgroundColor(Color.Gray)
                              .maxLines(1)
                          }

                          if (this.content?.get_prop == 1) {
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
                    })
                  }
                  .width(-1)
                  .height(60)
                  .friction(0.7)
                  .margin({ top: 8 })
                  .borderRadius(4)
                  .listDirection(Axis.Horizontal)
                  .scrollBar(BarState.Off)
                }
              }
            }
            .alignItems(HorizontalAlign.Start)
            .backgroundColor("#F5F6F7")
            .borderRadius(6)
            .padding(10)
            .margin({ top: 8 })
          }
          .alignItems(HorizontalAlign.Start)
        }
        .layoutWeight(1)
        .align(Alignment.TopStart)
        .margin({ left: 20, right: 20 })

        Row() {
          Blank().layoutWeight(1)
          Button(this.content?.is_prop == 1 && this.content.get_prop == 0 ? "领取奖励" : '关闭', { type: ButtonType.Normal, stateEffect: true })
            .width(100)
            .height(30)
            .margin({ top: 8 })
            .borderRadius(6)
            .fontSize(14)
            .fontWeight(500)
            .fontColor(Color.White)
            .backgroundColor(this.content?.is_prop == 1 && this.content.get_prop == 0 ? $r('app.color.col_20c0b3') : "#DC6E6E")
            .onClick(() => {
              if (this.content?.is_prop == 1 && this.content.get_prop == 0) {
                this.onReceiveClick?.()
              } else {
                this.onCloseClick?.()
              }
            })
        }
        .margin({ left: 20, right: 20, bottom: 13 })

        // .backgroundColor(Color.Gray)
        // .alignItems(VerticalAlign.Center)
      }
      .backgroundColor(Color.White)
      .margin({
        left: 30,
        right: 30,
        top: 34,
        bottom: 34
      })
      .borderRadius(4)
      .constraintSize({ maxWidth: 550, maxHeight: 500 })
      .alignRules({
        center: { anchor: "__container__", align: VerticalAlign.Center },
        middle: { anchor: "__container__", align: HorizontalAlign.Center }
      })

      // .visibility(Visibility.None)
      if (this.previewUri)
      RelativeContainer() {
        if (this.previewUri.endsWith(".mp4")) {
          Video({ src: this.previewUri })
        } else {
          Image(this.previewUri).objectFit(ImageFit.Contain)
        }
        Image($r('app.media.ic_close_x_mark_bg'))
          .width(45)
          .padding(10)
          .onClick((e) => {
            this.previewUri = ''
          })
          .margin({ left: 25, top: 30, right: 20 })
          .alignRules({
            top: { anchor: "__container__", align: VerticalAlign.Top },
            right: { anchor: "__container__", align: HorizontalAlign.End }
          })
      }.backgroundColor(Color.Black)

    }

  }
}


