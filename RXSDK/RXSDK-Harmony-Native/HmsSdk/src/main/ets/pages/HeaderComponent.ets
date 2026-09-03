@Preview
@Component
export struct HeaderComponent {
  @Prop title: ResourceStr = ""
  @Prop backVisible: boolean = false
  @Prop closeVisible: boolean = true
  @State isImage: boolean = false
  @State marginTop: number = 5
  fontSize: number = 18
  onClose?: (event: ClickEvent) => void
  onBack?: (event: ClickEvent) => void

  build() {
    RelativeContainer() {
      if (this.backVisible) {
        Image($r("app.media.rx_back"))
          .objectFit(ImageFit.Contain)
          .width('24vp')
          .padding(2)
          .margin({ left: '18vp' })
          .alignRules({
            left: { anchor: '__container__', align: HorizontalAlign.Start },
            center: { anchor: '__container__', align: VerticalAlign.Center }
          })
          .onClick(this.onBack || this.onClose)
          .id("back")
      }
      if (this.closeVisible) {
        Image($r("app.media.rx_close"))
          .objectFit(ImageFit.Contain)
          .padding(2)
          .width('24vp')
          .margin({ right: '18vp' })
          .alignRules({
            right: { anchor: '__container__', align: HorizontalAlign.End },
            center: { anchor: '__container__', align: VerticalAlign.Center }
          })// .backgroundColor(Color.Green)
          .onClick(this.onClose)
          .id("close")
      }
      //Resource image {"id":33554589,"type":20000,"params":[],"bundleName":"com.ruixue.sdk","moduleName":"entry"}
      // tsxt {"id":33554545,"type":10003,"params":[],"bundleName":"com.ruixue.sdk","moduleName":"entry"}
      Stack() {
        if (this.isImage || (("object" == typeof this.title) && this.title?.["type"] == 20000)) {
          Image(this.title).height('24vp').margin({top:this.marginTop})
        } else {
          Text(this.title).fontSize(this.fontSize).margin({top:this.marginTop}).fontColor(Color.Black)
        }

      }.alignRules({
        middle: { anchor: '__container__', align: HorizontalAlign.Center },
        center: { anchor: '__container__', align: VerticalAlign.Center }
      })
      .id("content")
    }.height('46vp')

  }
}