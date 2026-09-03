import { HeaderComponent } from './HeaderComponent';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { filePreview } from '@kit.PreviewKit';
import { Logger } from '../utils/Logger';

let SIZE = 50

@Entry
@Component
  // @CustomDialog
export struct FeedbackComponent {
  @State resList: string[] = [
  // "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
  // "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
  // "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
  ];
  @State title: ResourceStr = "我要反馈";
  @State scrollState: number = 0
  @State propIndex: number = -1
  @State textLength: number = 0
  @State maxLength: number = 200
  @State inputContent: string = ""
  @State phone: string = ""
  onCloseClick?: (event?: ClickEvent) => void;
  onCommitClick?: (content: string, resList: string[], phone: string) => void;
  onAddFileClick?: (event?: ClickEvent) => void;

  // private controller: CustomDialogController

  aboutToAppear(): void {
  }

  close(event: ClickEvent) {
    this.onCloseClick?.(event);
  }

  build() {
    RelativeContainer() {
      Scroll() {
        Column() {
          Column() {
            HeaderComponent({
              title: this.title, onClose: (e) => {
                this.close(e)
              }
            , backVisible: false
            }).margin({ top: 4 })
            RelativeContainer() {
              Scroll() {
                Column() {
                  TextArea({ placeholder: "请输入您的意见反馈" })
                    .backgroundColor("#F4F4F4")
                    .borderRadius(4)
                    .layoutWeight(1)
                    .maxLength(this.maxLength)
                    .onChange((value: string) => {
                      this.textLength = value.length
                      this.inputContent = value
                    })
                }
              }
              .align(Alignment.TopStart)
              Text(`${this.textLength}/${this.maxLength}`)
                .alignRules({
                  right: { anchor: "__container__", align: HorizontalAlign.End },
                  bottom: { anchor: "__container__", align: VerticalAlign.Bottom }
                })
                .fontColor("#BCBCBC")
                .margin({ right: 8, bottom: 8 })
            }
            .borderRadius(4)
            .constraintSize({ minHeight: 50, maxHeight: 210 })
            .layoutWeight(1)
            .margin({
              left: 15,
              right: 15,
              bottom: 13
            })

            Column() {
              Text("添加附件:").fontSize(14).margin({ bottom: 2 }) //.fontColor("#9C9C9C")
              Row() {
                List({ space: 10 }) {
                  ForEach(this.getResList(), (item: string, index: number) => {
                    ListItem() {
                      if (item == "add:file") {
                        this.addFile()
                      } else {
                        if (item.endsWith(".mp4")) {
                          Video({
                            src: item,
                          })
                            .borderWidth(1)
                            .borderColor("#E1E1E1")
                            .borderRadius(6)
                            .height(SIZE)
                            .width(SIZE)
                        } else {
                          Image(item)
                            .backgroundColor("#F5F6F7")
                            .borderWidth(1)
                            .borderColor("#E1E1E1")
                            .borderRadius(6)
                            .height(SIZE)
                            .width(SIZE)
                            .onClick(() => {
                              let uiContext = getContext(this);
                              let fileInfo: filePreview.PreviewInfo = {
                                uri: item,
                                mimeType: 'image/*'
                              };
                              let displayInfo: filePreview.DisplayInfo = {
                                x: 100,
                                y: 100,
                                width: 800,
                                height: 800
                              };
                              let files: Array<filePreview.PreviewInfo> = new Array();
                              files.push(fileInfo);
                              filePreview.openPreview(uiContext, fileInfo, displayInfo)// filePreview.loadData(uiContext, files, displayInfo)
                                .then(() => { // 仅当预览窗口存在时起效
                                  console.info('Succeeded in loading data.');
                                }).catch((err: BusinessError) => {
                                console.error(`Failed to load data, err.code = ${err.code}, err.message = ${err.message}`);
                              });
                            })
                        }
                      }
                    }
                  })
                }
                .width(-1)
                // .height(-1)
                .height((SIZE) * Math.ceil(this.getResList().length / 4) + Math.ceil(this.getResList().length / 4 - 1) * 10)
                .friction(0.7)
                // .layoutWeight(1)
                .borderRadius(4)
                .listDirection(Axis.Horizontal)
                .lanes(Math.ceil(this.getResList().length / 4), 10)
                // .alignListItem(ListItemAlign.End)
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

                // .constraintSize({maxWidth:-1})
                // .layoutWeight(1)
              }
              // .height(SIZE)
              // .width("100%")
              // .layoutWeight(1)
              // .backgroundColor(Color.Blue)
              .alignItems(VerticalAlign.Center)

              // Text("支持MP4格式，不超过100M").fontSize(14)
              //   .fontColor("#9C9C9C").margin({ top: 5 })
              Row() {
                Text("联系电话:").fontSize(14)
                  .margin({ top: 5 }).margin({ right: 5 })
                TextInput({ text: $$this.phone, placeholder: "请输入手机号方便联系您" })
                  .height(32)
                  .width(200)
                  .contentType(ContentType.FULL_PHONE_NUMBER)
                  .type(InputType.PhoneNumber)
                  .maxLength(16)
                  .placeholderFont({ size: 14 })// .layoutWeight(1)
                  .backgroundColor("#F4F4F4")
                  .placeholderColor("#767676")
                  .borderRadius(4)
                  .margin({ top: 10, bottom: 10 })
                Blank()
              }.alignItems(VerticalAlign.Center)

              Row() {
                Blank().layoutWeight(1)
                Button('提交', { type: ButtonType.Normal, stateEffect: true })
                  .width(130)
                  .height(38)
                  .margin({ top: 3 })
                  .borderRadius(10)
                  .fontSize(16)
                  .fontWeight(500)
                  .fontColor(Color.White)
                  .backgroundColor($r('app.color.col_20c0b3'))
                  .onClick(() => {
                    this.onCommitClick?.(this.inputContent, this.resList, this.phone);
                  })
              }

            }
            .margin({
              left: 15,
              right: 15,
              bottom: 13
            })
            .alignItems(HorizontalAlign.Start)

            // .layoutWeight(1)
            // .backgroundColor(Color.Gray)
            // .alignItems(VerticalAlign.Center)
          }

          // .borderRadius(4)
          // .constraintSize({ maxWidth: 550, maxHeight: 500 })
        }
      }.scrollBar(BarState.Off)
    }
    .onClick(() => {
      this.propIndex = -1
    })
    .backgroundColor(Color.White)
    .margin(25)
    .borderRadius(4)
    .constraintSize({ maxWidth: 550, maxHeight: 449 })

  }

  private getResList(): ResourceStr[] {
    return this.resList?.length < 4 ? this.resList.concat("add:file") : this.resList;
  }

  @Builder
  addFile() {
    Column() {
      Text("+").fontWeight(FontWeight.Medium)// .fontColor("#20C0B3")// .fontWeight(item.status == 3 ? FontWeight.Medium : FontWeight.Normal)
        .fontSize(38)
        .fontColor(Color.White)
      // .margin({ top: 3 })
      // Text("上传视频")
      //   .fontSize(13)
      //   .fontColor("#51565D")
    }
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Center)
    .backgroundColor("#F4F4F4")
    .borderWidth(1)
    .borderColor("#E1E1E1")
    .borderRadius(6)
    .height(SIZE)
    .width(SIZE)
    .onClick((e) => {
      this.onAddFileClick?.(e)
      try {
        let PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
        PhotoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_VIDEO_TYPE;
        PhotoSelectOptions.maxSelectNumber = 5 - this.resList?.length || 0;
        let photoPicker = new photoAccessHelper.PhotoViewPicker();
        photoPicker.select(PhotoSelectOptions).then((photoSelectResult: photoAccessHelper.PhotoSelectResult) => {
          console.info('PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(photoSelectResult));
          let fileList: Array<string> = photoSelectResult.photoUris;
          // this.resList = this.resList.concat(fileList)
          this.resList = fileList
          Logger.i('resList: ' + JSON.stringify(this.resList));
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

    // .margin({ left: 10, right: 0 })
  }
}


