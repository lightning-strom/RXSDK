import { webview } from '@kit.ArkWeb';

@Entry
@Component
struct InputPage {
  @State message: string = 'Hello World';

   // controller: webview.WebviewController = new webview.WebviewController();

 build() {
    Column() {
      Row() {
        TextInput({ text: this.message })
          .backgroundColor('#ffffff')
          .layoutWeight(1)
          .onChange((value) => {
            // if (this.onTextChange) {
            //   this.onTextChange(value);
            // }
            // this.inputMessage = value;
          })
          .onTextSelectionChange((start, end) => {
            // if (this.onTextSelectionChange) {
            //   this.onTextSelectionChange(start, end);
            // }
          })
          .onSubmit((value) => {
            // if (this.accept) {
            //   this.accept(this.inputMessage);
            // }
            // this.controller!.close();
          })
          .defaultFocus(true)
        Blank(8).width(16)
        Button('完成').onClick(() => {
          // if (this.accept) {
          //   this.accept(this.inputMessage);
          // }
          // this.controller!.close();
        })
      }.padding({ left: 8, right: 8, top: 8, bottom: 8 })
      .backgroundColor(Color.Gray)

    }
    .width('100%')

    .justifyContent(FlexAlign.End)
  }
}