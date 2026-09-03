import { webview } from '@kit.ArkWeb';

@Entry
@Component
struct Page {
  @State message: string = 'Hello World';
  @State data: string = '<h1 style="text-align: center;">h1标题</h1>' +
    '<h1 style="text-align: center;"><i>h1斜体</i></h1>' +
    '<h1 style="text-align: center;"><u>h1下划线</u></h1>' +
    '<h2 style="text-align: center;">h2标题</h2>' +
    '<h3 style="text-align: center;">h3标题</h3>' +
    '<p style="text-align: center;">p常规</p><hr/>' +
    '<a href="https://baidu.com" style="display: block; text-align: center; padding: 20px 0; margin: 20px 0; background-color: #f0f0f0;">访问示例网站</a>' + // 添加链接

    '<img src="https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" alt="示例图片" style="width: 100%; height: auto; display: block; margin: 0 auto; padding-top: 20px;">' +

    '<div style="width: 500px;height: 500px;border: 1px solid;margin: 0 auto;">' +
    '<p style="font-size: 35px;text-align: center;font-weight: bold; color: rgb(24,78,228)">字体大小35px,行高45px</p>' +
    '<p style="background-color: #e5e5e5;line-height: 45px;font-size: 35px;text-indent: 2em;">' +
    '<p>这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字</p>';
   controller: webview.WebviewController = new webview.WebviewController();

  build() {
    RelativeContainer() {
      Column() {
        Text(this.message)
          .id('PageHelloWorld')
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
          .alignRules({
            center: { anchor: '__container__', align: VerticalAlign.Center },
            middle: { anchor: '__container__', align: HorizontalAlign.Center }
          })

        // RichEditor({})// 绑定自定义键盘
        //   // .customKeyboard(this.CustomKeyboardBuilder())
        //   .margin(10)
        //   .border({ width: 1 })
        //   .height(100)
        //   .borderWidth(1)
        //   .borderColor(Color.Red)
        //   .width("100%")
        // 通过$rawfile加载本地资源文件。
        // Web({ src:this.data, controller: this.controller })
        RichText(this.data)
          .onStart(() => {
            console.info('RichText onStart');
          })
          .onComplete(() => {
            console.info('RichText onComplete');
          })
          .width(500)
          .height(500)
          .backgroundColor(0XBDDB69)
      }
    }
    .height('100%')
    .width('100%')
  }
}