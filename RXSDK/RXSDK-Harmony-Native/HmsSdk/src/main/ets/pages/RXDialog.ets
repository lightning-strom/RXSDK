@Preview
@CustomDialog
export struct RXDialog {
  @State okText: string = "ok"
  @State cancelText: string = "cancel"
  @State title: string = "提示"
  private controller: CustomDialogController
  // 若尝试在CustomDialog中传入多个其他的Controller，以实现在CustomDialog中打开另一个或另一些CustomDialog，那么此处需要将指向自己的controller放在最后
  // cancel: () => void
  // confirm: () => void
    cancel: () => void = () => {}

  open() {
    if (this.controller) {
      this.controller.open();
    }
  }
  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close() {
    if (this.controller) {
      this.controller.close()
    }
  }

  build() {
    Column() {
      // HeaderComponent({ title: $title, image: false, close: () => {
      //   this.close()
      //   if (this.cancel) {
      //     this.cancel()
      //   }
      // } })
      Row() {

      }.height('55%')

      Blank()
      Row({ space: '20vp' }) {
        Button(this.okText)
          .width('30%')
          .onClick(() => {
            this.close()
            // if (this.confirm) {
            //   this.confirm()
            // }
          })
        Button(this.cancelText)
          .width('30%')
          .onClick(() => {
            this.close()
            // if (this.cancel) {
            //   this.cancel()
            // }
          })
      }

      Blank()
    }.backgroundColor($r("app.color.col_f0f0f0")).width('334vp').height('265vp')
  }
}