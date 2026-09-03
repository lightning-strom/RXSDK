// @Entry
@Preview
@Component
  // @CustomDialog
export struct LoadingComponent {
  @State isLoading: boolean = false
  @State timeout: number = 5000
  @State text: string = ''
  @State bgColor?: ResourceColor = Color.Transparent
  onCloseClick?: () => void;

  // private controller: CustomDialogController

  aboutToAppear() {
    this.isLoading = true
    if (this.timeout > 0) {
      setTimeout(() => {
        this.isLoading = false
        this.close()
      }, this.timeout)
    }
  }

  close() {
    // this?.controller?.close()
    this.onCloseClick?.();
  }

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Column() {
        LoadingProgress()
          .color('#20c0b3')
          .enableLoading(this.isLoading)
          .visibility(this.isLoading ? Visibility.Visible : Visibility.None)
          .width(90)
        // .height(90)
        // .alignRules({
        //   center: { anchor: "__container__", align: VerticalAlign.Center },
        //   middle: { anchor: "__container__", align: HorizontalAlign.Center }
        // })
        if (this.text) {
          Text(this.text).maxLines(3).constraintSize({ maxWidth: 200 }).fontColor(Color.White).margin({ bottom: 15, left: 20, right: 20 })
        }
      }.backgroundColor(this.bgColor).borderRadius(10)
    }.height("100%").width("100%").backgroundColor(0x22000000)
  }
}


