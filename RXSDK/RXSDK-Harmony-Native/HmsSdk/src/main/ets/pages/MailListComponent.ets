import { Mail, MailItem } from '../types/MailInterfaces';
import { Logger } from '../utils/Logger';
import { HeaderComponent } from './HeaderComponent';


@Preview
@ComponentV2
  // @CustomDialog
export struct MailListComponent {
  @Param mailObj: Mail = {
    all_count: 0,
    not_received_count: 0,
    not_read_count: 0,
    list: []
  }
  // @Param mailList: MailItem[] = []
  @Param title: ResourceStr = "邮件";
  @Local selectIndex: number = 0;
  @Event onCloseClick?: (event?: ClickEvent) => void;
  @Event onMailClick?: (mailItem: MailItem) => void;
  @Event onReceiveClick?: () => void;

  // private controller: CustomDialogController

  aboutToAppear(): void {
  }

  close(event: ClickEvent) {
    // this?.controller?.close()
    this.onCloseClick?.(event);
  }

  build() {

    Column() {
      HeaderComponent({
        title: this.title, onClose: (e) => {
          this.close(e)
        }
      , backVisible: false
      }).margin({ top: 4 })

      List() {
        ForEach(this.mailObj.list, (item: MailItem, index: number) => {
          ListItem() {
            Row() {
              Image(item.status === 3 ? $r('app.media.ic_mail_close') : $r('app.media.ic_mail_open'))
                .width(22)
                .margin({ left: 10, right: 10 })
                .objectFit(ImageFit.Contain)
                .autoResize(true)
              Text(item.title)
                .fontColor(item.status == 3 ? "#444444" : "#616161")
                .fontWeight(item.status == 3 ? FontWeight.Medium : FontWeight.Normal)
                .fontSize(14)
                .layoutWeight(1)
                .maxLines(1)
              Blank()
              Text(item.send_at)
                .fontColor(item.status == 3 ? "#444444" : "#616161")
                .fontWeight(item.status == 3 ? FontWeight.Medium : FontWeight.Normal)
                .maxLines(1)
                .fontSize(12)
                .margin({ left: 5, right: 20 })
            }.height(36)
            .alignItems(VerticalAlign.Center)
          }
          .onClick(() => {
            this.selectIndex = index
            this.onMailClick?.(item)
          })
        })
      }
      .height(-1)
      .width(-1)
      .friction(0.7)
      .padding(8)
      .margin({ left: 10, right: 10, bottom: 10 })
      .backgroundColor(" #F4F4F4")
      .borderRadius(4)
      .layoutWeight(1)
      .scrollBar(BarState.Off)

      Row() {
        Image(this.mailObj.not_received_count > 0 ? $r('app.media.ic_mail_disable_delete') : $r('app.media.ic_mail_enable_delete'))
          .width(30)
          .margin({ right: 10 })
          .objectFit(ImageFit.Contain)
          .autoResize(true)
        Text("超过一周的邮件自动删除").fontSize(12).fontColor("#797979").maxLines(1).layoutWeight(1)
        Blank() //.layoutWeight(1)
        // Button('test').onClick(() => {
        //   // if (this.mailList.length > 0) {
        //   // let arr:Array<MailItem> = new Array(this.mailList)
        //   this.mailList.shift()
        //   this.mailObj.list.shift()
        //   this.mailList[this.selectIndex] = new MailItem()
        //   this.mailObj.list[this.selectIndex] = new MailItem()
        //   this.mailObj.list[this.selectIndex].status = 3
        //   this.mailList[this.selectIndex].status = 3
        //   Logger.e(this.mailList.length + " ," + JSON.stringify(this.mailList[this.selectIndex]))
        //   Logger.e(this.mailObj.list.length + " ," + JSON.stringify(this.mailObj.list[this.selectIndex]))
        //   // this.mailList=new ObservedArray(arr);
        //   // }
        // })
        Button('一键领取', { type: ButtonType.Normal, stateEffect: true })
          .width(92)
          .height(30)
          .borderRadius(4)
          .fontSize(14)
          .fontWeight(500)
          .fontColor(Color.White)
          .enabled(this.mailObj.not_received_count > 0)
          .backgroundColor(this.mailObj.not_received_count > 0 ? $r('app.color.col_20c0b3') : "#D9D9D9")
          .onClick((e) => {
            console.log("click receive button")
            // if (this.mailObj.not_received_count > 0) {
            this.onReceiveClick?.()
            // }
          })
      }.margin({ left: 10, right: 10, bottom: 10 })
      .alignItems(VerticalAlign.Center)
    }
    .backgroundColor(Color.White)
    .margin({
      left: 30,
      right: 30,
      top: 50,
      bottom: 50
    })
    .borderRadius(4)
    .constraintSize({ maxWidth: 550, maxHeight: 500 })
  }
}


